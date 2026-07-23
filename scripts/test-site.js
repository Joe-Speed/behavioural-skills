#!/usr/bin/env node
// Checks the generated site is internally consistent and not stale, without
// a browser or a test framework — the invariants here would otherwise only
// surface as a blank page or a broken link once the site is deployed.

const fs = require("fs");
const path = require("path");
const { computeIndex, OUT_PATH } = require("./build-index.js");

const ROOT = path.resolve(__dirname, "..");
const SITE_DIR = path.join(ROOT, "site");

function stripVolatile(index) {
  const { generatedAt, ...rest } = index;
  return rest;
}

// Catches "forgot to run npm run build before committing" — the committed
// index.json must match what skills/ would produce right now.
function checkIndexFreshness() {
  if (!fs.existsSync(OUT_PATH)) {
    return [`site/data/index.json does not exist — run "npm run build"`];
  }
  const committed = JSON.stringify(stripVolatile(JSON.parse(fs.readFileSync(OUT_PATH, "utf8"))));
  const fresh = JSON.stringify(stripVolatile(computeIndex()));
  return committed === fresh
    ? []
    : [`site/data/index.json is stale relative to skills/ — run "npm run build" and commit the result`];
}

function checkGraphIntegrity(index) {
  const errors = [];
  const nodeIds = new Set(index.graph.nodes.map((n) => n.id));
  for (const edge of index.graph.edges) {
    if (!nodeIds.has(edge.from)) errors.push(`graph edge references missing node "${edge.from}"`);
    if (!nodeIds.has(edge.to)) errors.push(`graph edge references missing node "${edge.to}"`);
  }

  const ioTypeIds = new Set(index.taxonomy.io_types.map((t) => t.id));
  const categoryIds = new Set(index.taxonomy.categories.map((c) => c.id));
  const stageIds = new Set(index.taxonomy.stages.map((s) => s.id));
  for (const skill of index.skills) {
    if (!categoryIds.has(skill.category)) errors.push(`skill "${skill.slug}" has unknown category "${skill.category}"`);
    if (!stageIds.has(skill.stage)) errors.push(`skill "${skill.slug}" has unknown stage "${skill.stage}"`);
    for (const io of [...(skill.inputs || []), ...(skill.outputs || [])]) {
      if (!ioTypeIds.has(io.type)) errors.push(`skill "${skill.slug}" references unknown io type "${io.type}"`);
    }
  }
  return errors;
}

function checkLocalLinks() {
  const errors = [];
  const linkPattern = /(?:href|src)="([^"]+)"/g;
  const htmlFiles = fs.readdirSync(SITE_DIR).filter((f) => f.endsWith(".html"));

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(SITE_DIR, file), "utf8");
    let match;
    while ((match = linkPattern.exec(content))) {
      const link = match[1];
      if (/^https?:\/\//.test(link) || link.startsWith("#") || link.includes("?")) continue;
      if (!fs.existsSync(path.join(SITE_DIR, link))) {
        errors.push(`${file} references missing local file "${link}"`);
      }
    }
  }
  return errors;
}

function main() {
  const index = computeIndex();
  const checks = [
    ["site/data/index.json is up to date with skills/", checkIndexFreshness()],
    ["dependency graph is internally consistent", checkGraphIntegrity(index)],
    ["all local asset references resolve", checkLocalLinks()],
  ];

  let failureCount = 0;
  for (const [label, errors] of checks) {
    if (errors.length === 0) {
      console.log(`ok    ${label}`);
    } else {
      for (const e of errors) console.log(`FAIL  ${e}`);
      failureCount += errors.length;
    }
  }

  console.log(`\n${failureCount} failure(s).`);
  if (failureCount > 0) process.exit(1);
}

main();
