#!/usr/bin/env node
// Lightweight checks on the generated site: no browser, no test framework —
// just the invariants that would otherwise only surface as a blank page or
// a broken link once the site is deployed.
//
// 1. site/data/index.json is up to date with skills/ (catches "forgot to
//    run npm run build before committing").
// 2. The index has no structurally broken references: every graph edge
//    points at a node that exists, every category/stage/io type used by a
//    skill is declared in the taxonomy.
// 3. Every local (non-http) href/src in site/*.html points at a file that
//    actually exists.

const fs = require("fs");
const path = require("path");
const { computeIndex, OUT_PATH } = require("./build-index.js");

const ROOT = path.resolve(__dirname, "..");
const SITE_DIR = path.join(ROOT, "site");

let failures = 0;
function fail(msg) {
  console.log(`FAIL  ${msg}`);
  failures++;
}
function pass(msg) {
  console.log(`ok    ${msg}`);
}

function stripVolatile(index) {
  const { generatedAt, ...rest } = index;
  return rest;
}

function checkIndexFreshness() {
  if (!fs.existsSync(OUT_PATH)) {
    fail(`site/data/index.json does not exist — run "npm run build"`);
    return;
  }
  const committed = JSON.parse(fs.readFileSync(OUT_PATH, "utf8"));
  const fresh = computeIndex();
  const committedStable = JSON.stringify(stripVolatile(committed));
  const freshStable = JSON.stringify(stripVolatile(fresh));
  if (committedStable !== freshStable) {
    fail(
      `site/data/index.json is stale relative to skills/ — run "npm run build" and commit the result`
    );
  } else {
    pass("site/data/index.json is up to date with skills/");
  }
}

function checkGraphIntegrity(index) {
  const nodeIds = new Set(index.graph.nodes.map((n) => n.id));
  for (const edge of index.graph.edges) {
    if (!nodeIds.has(edge.from)) fail(`graph edge references missing node "${edge.from}"`);
    if (!nodeIds.has(edge.to)) fail(`graph edge references missing node "${edge.to}"`);
  }
  const ioTypeIds = new Set(index.taxonomy.io_types.map((t) => t.id));
  const categoryIds = new Set(index.taxonomy.categories.map((c) => c.id));
  const stageIds = new Set(index.taxonomy.stages.map((s) => s.id));

  for (const skill of index.skills) {
    if (!categoryIds.has(skill.category)) fail(`skill "${skill.slug}" has unknown category "${skill.category}"`);
    if (!stageIds.has(skill.stage)) fail(`skill "${skill.slug}" has unknown stage "${skill.stage}"`);
    for (const io of [...(skill.inputs || []), ...(skill.outputs || [])]) {
      if (!ioTypeIds.has(io.type)) fail(`skill "${skill.slug}" references unknown io type "${io.type}"`);
    }
  }

  if (failures === 0) pass("dependency graph is internally consistent");
}

function checkLocalLinks() {
  const htmlFiles = fs.readdirSync(SITE_DIR).filter((f) => f.endsWith(".html"));
  const linkPattern = /(?:href|src)="([^"]+)"/g;
  let checked = 0;

  for (const file of htmlFiles) {
    const content = fs.readFileSync(path.join(SITE_DIR, file), "utf8");
    let match;
    while ((match = linkPattern.exec(content))) {
      const link = match[1];
      if (/^https?:\/\//.test(link) || link.startsWith("#") || link.includes("?")) continue;
      const target = path.join(SITE_DIR, link);
      checked++;
      if (!fs.existsSync(target)) {
        fail(`${file} references missing local file "${link}"`);
      }
    }
  }
  if (failures === 0) pass(`all ${checked} local asset reference(s) across ${htmlFiles.length} HTML file(s) resolve`);
}

function main() {
  checkIndexFreshness();
  const index = computeIndex();
  checkGraphIntegrity(index);
  checkLocalLinks();

  console.log(`\n${failures} failure(s).`);
  if (failures > 0) process.exit(1);
}

main();
