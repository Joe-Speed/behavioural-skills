#!/usr/bin/env node
// Walks skills/, reads every SKILL.md, and emits site/data/index.json: the
// full catalogue plus a dependency graph derived by matching each skill's
// declared outputs to every skill's declared inputs. Run `npm run validate`
// first — this script assumes the frontmatter is already well-formed and
// does not re-check it.

const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const yaml = require("js-yaml");
const matter = require("gray-matter");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const TAXONOMY_PATH = path.join(ROOT, "schema", "taxonomy.yaml");
const OUT_PATH = path.join(ROOT, "site", "data", "index.json");
const SHARE_DIR = path.join(ROOT, "site", "s");
// Duplicated in site/app.js (browser code can't require this module) — a
// change here must be mirrored there or share links silently break.
const SITE_BASE_URL = "https://joe-speed.github.io/behavioural-skills";

// Derives a skill's version history straight from git log instead of a
// hand-maintained changelog field — one entry per commit where the
// frontmatter's `version` first changes to a new value, dated and worded
// with the real commit. Needs full git history (CI checkouts must use
// fetch-depth: 0); returns [] harmlessly otherwise, or for a skill staged
// but not yet committed — it picks up its first entry on the next build.
function getChangelog(skillPath) {
  const relPath = path.relative(ROOT, skillPath).split(path.sep).join("/");
  let raw;
  try {
    // %x1f (unit separator) between fields rather than a tab — commit
    // subjects can legally contain tabs, but not control characters.
    raw = execFileSync(
      "git",
      ["log", "--follow", "--format=%x00%H%x1f%ad%x1f%s", "--date=short", "--name-only", "--", relPath],
      { cwd: ROOT, encoding: "utf8" }
    );
  } catch {
    return [];
  }
  if (!raw.trim()) return [];

  // --name-only reports the file's path *as of that commit*, which is what
  // --follow needs across a rename (this repo's own American->British
  // spelling rename among them) — using the current path against an old
  // hash would 404 on `git show`.
  const commits = raw
    .split("\0")
    .filter(Boolean)
    .map((block) => {
      const [header, ...rest] = block.trim().split("\n");
      const [hash, date, subject] = header.split("\x1f");
      const file = rest.find((line) => line.trim().length > 0);
      return { hash, date, subject, file };
    })
    .filter((c) => c.file)
    .reverse(); // oldest first

  const seenVersions = new Set();
  const entries = [];
  for (const { hash, date, subject, file } of commits) {
    let content;
    try {
      content = execFileSync("git", ["show", `${hash}:${file}`], { cwd: ROOT, encoding: "utf8" });
    } catch {
      continue; // shouldn't happen given --name-only just reported this path at this commit
    }
    const { data } = matter(content);
    const version = data && data.version;
    if (!version || seenVersions.has(version)) continue;
    seenVersions.add(version);
    entries.push({ version, date, summary: subject });
  }
  return entries;
}

function splitSections(body) {
  const lines = body.split("\n");
  const sections = [];
  let current = null;
  for (const line of lines) {
    const heading = line.match(/^##\s+(.*)$/);
    if (heading) {
      current = { heading: heading[1].trim(), markdown: "" };
      sections.push(current);
    } else if (current) {
      current.markdown += line + "\n";
    }
  }
  return sections.map((s) => ({ heading: s.heading, markdown: s.markdown.trim() }));
}

function loadTaxonomy() {
  return yaml.load(fs.readFileSync(TAXONOMY_PATH, "utf8"));
}

function loadSkills() {
  const dirs = fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();

  return dirs.map((dir) => {
    const skillPath = path.join(SKILLS_DIR, dir, "SKILL.md");
    const raw = fs.readFileSync(skillPath, "utf8");
    const { data: frontmatter, content } = matter(raw);
    return {
      slug: dir,
      frontmatter,
      sections: splitSections(content),
      changelog: getChangelog(skillPath),
    };
  });
}

function buildDependencyGraph(skills, taxonomy) {
  const userSuppliableTypes = new Set(
    taxonomy.io_types.filter((t) => t.user_suppliable).map((t) => t.id)
  );

  const producers = new Map(); // io type id -> [skill slug]
  for (const skill of skills) {
    for (const out of skill.frontmatter.outputs || []) {
      if (!producers.has(out.type)) producers.set(out.type, []);
      producers.get(out.type).push(skill.slug);
    }
  }

  const nodes = skills.map((s) => ({
    id: s.slug,
    kind: "skill",
    label: s.frontmatter.title,
    category: s.frontmatter.category,
    stage: s.frontmatter.stage,
  }));

  const externalInputIds = new Set();
  const edges = [];

  for (const skill of skills) {
    for (const input of skill.frontmatter.inputs || []) {
      const producingSkills = producers.get(input.type) || [];
      if (producingSkills.length > 0) {
        for (const producer of producingSkills) {
          edges.push({ from: producer, to: skill.slug, via: input.type });
        }
      } else if (userSuppliableTypes.has(input.type)) {
        const externalId = `external:${input.type}`;
        externalInputIds.add(input.type);
        edges.push({ from: externalId, to: skill.slug, via: input.type });
      }
      // Anything reaching neither branch is a dangling input and would have
      // already failed `npm run validate` — build-index does not re-check it.
    }
  }

  for (const typeId of externalInputIds) {
    const typeDef = taxonomy.io_types.find((t) => t.id === typeId);
    nodes.push({
      id: `external:${typeId}`,
      kind: "external-input",
      label: typeDef ? typeDef.label : typeId,
    });
  }

  // Terminal outputs: io types produced but never consumed by any skill in
  // the current catalogue. Useful for the site to show "this is a hand-off
  // point with no skill wired up to it yet."
  const consumedTypes = new Set(
    skills.flatMap((s) => (s.frontmatter.inputs || []).map((i) => i.type))
  );
  const terminalOutputs = [];
  for (const [typeId, producingSkills] of producers.entries()) {
    if (!consumedTypes.has(typeId)) {
      terminalOutputs.push({ type: typeId, producedBy: producingSkills });
    }
  }

  return { nodes, edges, terminalOutputs };
}

function computeIndex() {
  const taxonomy = loadTaxonomy();
  const skills = loadSkills();
  const graph = buildDependencyGraph(skills, taxonomy);

  return {
    generatedAt: new Date().toISOString(),
    taxonomy,
    skills: skills.map((s) => ({
      slug: s.slug,
      ...s.frontmatter,
      sections: s.sections,
      changelog: s.changelog,
    })),
    graph,
  };
}

function escapeHtmlAttr(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// skill.html is a single client-rendered template driven by a ?slug= query
// param, so a crawler that doesn't run JS (link-unfurl bots on Slack,
// Twitter, etc.) sees no per-skill title or description there. This writes
// one static, real-metadata redirect page per skill instead — the
// shareable link a "Copy shareable link" button on the skill page hands
// out, distinct from the skill?slug= URL used for in-site browsing.
function shortDescription(skill) {
  const whatItDoes = (skill.sections || []).find((s) => s.heading === "What it does");
  const text = (whatItDoes ? whatItDoes.markdown : skill.description || "")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= 200) return text;
  const truncated = text.slice(0, 200);
  const lastSpace = truncated.lastIndexOf(" ");
  return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
}

function writeSharePages(index, dir = SHARE_DIR) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  for (const skill of index.skills) {
    const title = `${skill.title} — Behavioural Skills`;
    const description = shortDescription(skill);
    const canonical = `${SITE_BASE_URL}/skill?slug=${skill.slug}`;

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtmlAttr(title)}</title>
  <link rel="canonical" href="${canonical}" />
  <meta name="description" content="${escapeHtmlAttr(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:title" content="${escapeHtmlAttr(title)}" />
  <meta property="og:description" content="${escapeHtmlAttr(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtmlAttr(title)}" />
  <meta name="twitter:description" content="${escapeHtmlAttr(description)}" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <meta http-equiv="refresh" content="0; url=${canonical}" />
  <script>location.replace(${JSON.stringify(canonical)});</script>
</head>
<body>
  <p>Redirecting to <a href="${canonical}">${escapeHtmlAttr(skill.title)}</a>…</p>
</body>
</html>
`;
    fs.writeFileSync(path.join(dir, `${skill.slug}.html`), html);
  }
}

function main() {
  const index = computeIndex();
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + "\n");
  writeSharePages(index);
  console.log(
    `Wrote ${path.relative(ROOT, OUT_PATH)}: ${index.skills.length} skill(s), ${index.graph.edges.length} edge(s), ${index.graph.terminalOutputs.length} terminal output(s).`
  );
  console.log(`Wrote ${index.skills.length} shareable page(s) to ${path.relative(ROOT, SHARE_DIR)}/.`);
}

module.exports = { computeIndex, OUT_PATH, SHARE_DIR, writeSharePages };

if (require.main === module) {
  main();
}
