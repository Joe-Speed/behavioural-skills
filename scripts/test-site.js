#!/usr/bin/env node
// Checks the generated site is internally consistent and not stale, without
// a browser or a test framework — the invariants here would otherwise only
// surface as a blank page or a broken link once the site is deployed.

const fs = require("fs");
const os = require("os");
const path = require("path");
const { computeIndex, OUT_PATH, SHARE_DIR, writeSharePages } = require("./build-index.js");

const ROOT = path.resolve(__dirname, "..");
const SITE_DIR = path.join(ROOT, "site");

function findHtmlFiles(dir) {
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...findHtmlFiles(full));
    else if (entry.name.endsWith(".html")) out.push(full);
  }
  return out;
}

// generatedAt and each skill's changelog are both derived at build time from
// live state (a timestamp, and git log) rather than from skills/ content —
// stripped before comparing so a skill's changelog gaining a real entry
// on the next commit doesn't itself count as "stale relative to skills/".
function stripVolatile(index) {
  const { generatedAt, ...rest } = index;
  return {
    ...rest,
    skills: rest.skills.map(({ changelog, ...skill }) => skill),
  };
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

// GitHub Pages resolves an extensionless path (e.g. "workflow") to the
// matching ".html" file transparently — internal nav links rely on this so
// URLs don't show ".html". A link "exists" here if the literal path does,
// or (for an extensionless path with no trailing slash) its ".html" file
// does, mirroring what Pages will actually do.
function localLinkExists(baseDir, link) {
  const resolved = path.join(baseDir, link);
  if (fs.existsSync(resolved)) return true;
  if (!link.endsWith("/") && !path.extname(link)) return fs.existsSync(`${resolved}.html`);
  return false;
}

function checkLocalLinks() {
  const errors = [];
  const linkPattern = /(?:href|src)="([^"]+)"/g;

  for (const file of findHtmlFiles(SITE_DIR)) {
    const content = fs.readFileSync(file, "utf8");
    const relFile = path.relative(SITE_DIR, file);
    let match;
    while ((match = linkPattern.exec(content))) {
      const link = match[1];
      if (/^https?:\/\//.test(link) || link.startsWith("#") || link.includes("?")) continue;
      if (!localLinkExists(path.dirname(file), link)) {
        errors.push(`${relFile} references missing local file "${link}"`);
      }
    }
  }
  return errors;
}

// Same "forgot to run npm run build" check as checkIndexFreshness, for the
// generated per-skill share pages under site/s/. Renders a fresh copy into
// a scratch directory rather than touching site/s/ itself.
function checkSharePagesFreshness(index) {
  if (!fs.existsSync(SHARE_DIR)) {
    return [`site/s/ does not exist — run "npm run build"`];
  }

  const readDir = (dir) =>
    new Map(
      fs
        .readdirSync(dir)
        .filter((f) => f.endsWith(".html"))
        .map((f) => [f, fs.readFileSync(path.join(dir, f), "utf8")])
    );

  const committed = readDir(SHARE_DIR);

  const scratchDir = fs.mkdtempSync(path.join(os.tmpdir(), "share-pages-"));
  writeSharePages(index, scratchDir);
  const fresh = readDir(scratchDir);
  fs.rmSync(scratchDir, { recursive: true, force: true });

  const errors = [];
  for (const [file, freshContent] of fresh) {
    if (!committed.has(file)) errors.push(`site/s/${file} is missing — run "npm run build"`);
    else if (committed.get(file) !== freshContent)
      errors.push(`site/s/${file} is stale relative to skills/ — run "npm run build" and commit the result`);
  }
  for (const file of committed.keys()) {
    if (!fresh.has(file)) errors.push(`site/s/${file} has no matching skill — run "npm run build"`);
  }
  return errors;
}

function main() {
  const index = computeIndex();
  const checks = [
    ["site/data/index.json is up to date with skills/", checkIndexFreshness()],
    ["site/s/ share pages are up to date with skills/", checkSharePagesFreshness(index)],
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
