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
const marked = require("marked");

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

function loadSkillDirs() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function loadSkills() {
  return loadSkillDirs().map((dir) => {
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

function escapeHtml(str) {
  return String(str).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

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

// Duplicated from site/app.js (browser code can't require this module).
function lookupLabel(list, id) {
  const match = list.find((item) => item.id === id);
  return match ? match.label : id;
}

function renderIoList(items) {
  return (items || [])
    .map(
      (io) =>
        `<li><code>${escapeHtml(io.type)}</code>${io.required === false ? " (optional)" : ""}<br>${escapeHtml(io.description)}</li>`
    )
    .join("");
}

function renderEvidenceList(evidenceBase) {
  return (evidenceBase || [])
    .map(
      (e) =>
        `<li><strong>${escapeHtml(e.framework)}</strong><br>${escapeHtml(e.citation)}${e.url ? ` — <a href="${escapeHtml(e.url)}" target="_blank" rel="noopener">source</a>` : ""}</li>`
    )
    .join("");
}

// Same shape as app.js's renderChangelog — duplicated for the same reason as
// lookupLabel above.
function renderChangelogList(changelog) {
  if (!changelog || changelog.length === 0) return `<p class="empty-state">No version history yet.</p>`;
  const items = changelog
    .slice()
    .reverse()
    .map(
      (c) =>
        `<li><span class="changelog-version">v${escapeHtml(c.version)}</span><span class="changelog-date">${escapeHtml(c.date)}</span><p>${escapeHtml(c.summary)}</p></li>`
    )
    .join("");
  return `<ul class="changelog-list">${items}</ul>`;
}

// skill.html is a single client-rendered template driven by a ?slug= query
// param, so a crawler that doesn't run JS (search engines, link-unfurl bots)
// sees no content there at all. This writes one static, fully-rendered page
// per skill instead — the real canonical page for search and sharing.
// skill?slug= remains the interactive alias (install panel, workflow chain
// links); skill.js points its own canonical tag back here once it loads.
function writeSharePages(index, dir = SHARE_DIR) {
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });

  // marked passes raw HTML tokens through verbatim; dropped here for the
  // same content-spoofing reason as site/skill.js — these pages ship with no
  // CSP script-src exception, but a contributed SKILL.md could still forge a
  // fake link or button in an HTML block otherwise.
  marked.use({ renderer: { html: () => "" } });

  for (const skill of index.skills) {
    const title = `${skill.title} — Behavioural Skills`;
    const description = shortDescription(skill);
    // Slugs are validated kebab-case, but this lands in HTML attributes on
    // every share page — encode and escape anyway so the invariant doesn't
    // rest on a validator this script never runs.
    const canonical = escapeHtml(`${SITE_BASE_URL}/s/${encodeURIComponent(skill.slug)}`);
    const appUrl = escapeHtml(`${SITE_BASE_URL}/skill?slug=${encodeURIComponent(skill.slug)}`);
    const category = lookupLabel(index.taxonomy.categories, skill.category);
    const stage = lookupLabel(index.taxonomy.stages, skill.stage);
    const sectionsHtml = (skill.sections || [])
      .map((s) => `<h2>${escapeHtml(s.heading)}</h2>${marked.parse(s.markdown)}`)
      .join("");

    const html = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'self'; img-src 'self'; base-uri 'none'; form-action 'none'" />
  <title>${escapeHtml(title)}</title>
  <link rel="canonical" href="${canonical}" />
  <meta name="description" content="${escapeHtml(description)}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Behavioural Skills" />
  <meta property="og:title" content="${escapeHtml(title)}" />
  <meta property="og:description" content="${escapeHtml(description)}" />
  <meta property="og:url" content="${canonical}" />
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content="${escapeHtml(title)}" />
  <meta name="twitter:description" content="${escapeHtml(description)}" />
  <link rel="icon" href="../favicon.svg" type="image/svg+xml" />
  <link rel="stylesheet" href="../styles.css" />
</head>
<body>
  <header class="site-header">
    <div class="wrap"><a class="brand" href="../">Behavioural <span>Skills</span></a></div>
  </header>
  <main>
    <div class="skill-header">
      <h1>${escapeHtml(skill.title)}</h1>
      <p class="description">${escapeHtml(skill.description)}</p>
      <div class="skill-header-actions"><a class="share-link-button" href="${appUrl}">Open interactive page &amp; install &rarr;</a></div>
    </div>

    <dl class="meta-grid">
      <div><dt>Category</dt><dd>${escapeHtml(category)}</dd></div>
      <div><dt>Research stage</dt><dd>${escapeHtml(stage)}</dd></div>
      <div><dt>WEIRD context</dt><dd>${escapeHtml(skill.weird_context.status)}</dd></div>
      <div><dt>Version</dt><dd>${escapeHtml(skill.version)}</dd></div>
      <div><dt>Authors</dt><dd>${escapeHtml((skill.authors || []).join(", "))}</dd></div>
    </dl>

    ${skill.weird_context.note ? `<p class="notice">${escapeHtml(skill.weird_context.note)}</p>` : ""}

    <h2>Evidence base</h2>
    <ul class="io-list">${renderEvidenceList(skill.evidence_base)}</ul>

    <h2>Inputs</h2>
    <ul class="io-list">${renderIoList(skill.inputs)}</ul>

    <h2>Outputs</h2>
    <ul class="io-list">${renderIoList(skill.outputs)}</ul>

    <div class="skill-body">${sectionsHtml}</div>

    <h2>Version history</h2>
    ${renderChangelogList(skill.changelog)}
  </main>
</body>
</html>
`;
    fs.writeFileSync(path.join(dir, `${skill.slug}.html`), html);
  }
}

// Search engines never see skill?slug= pages (client-rendered) — the sitemap
// points them at the static share pages instead, which carry real metadata.
function writeSitemap(index) {
  const urls = [
    `${SITE_BASE_URL}/`,
    `${SITE_BASE_URL}/workflow`,
    `${SITE_BASE_URL}/whats-new`,
    `${SITE_BASE_URL}/propose`,
    ...index.skills.map((skill) => `${SITE_BASE_URL}/s/${encodeURIComponent(skill.slug)}`),
  ];
  const xml = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls.map((url) => `  <url><loc>${url}</loc></url>`),
    `</urlset>`,
    ``,
  ].join("\n");
  fs.writeFileSync(path.join(ROOT, "site", "sitemap.xml"), xml);
}

// The audience installs these skills into AI agents — llms.txt gives an
// agent (or a person with one) the whole catalogue as fetchable markdown
// without cloning the repo. https://llmstxt.org/
function writeLlmsTxt(index) {
  const rawBase = "https://raw.githubusercontent.com/Joe-Speed/behavioural-skills/main";
  const lines = [
    `# Behavioural Skills`,
    ``,
    `> A catalogue of behavioural-science skills — markdown instruction files with`,
    `> declared inputs, outputs, and evidence bases — designed to be installed into`,
    `> AI coding agents. Install: \`curl -sSL ${rawBase}/scripts/install.sh | bash -s -- --target . --name <skill>\``,
    ``,
    `## Skills`,
    ``,
    ...index.skills.map(
      (skill) => `- [${skill.title}](${rawBase}/skills/${skill.slug}/SKILL.md): ${skill.description.replace(/\s+/g, " ").trim()}`
    ),
    ``,
    `## Optional`,
    ``,
    `- [Full catalogue data (JSON)](${SITE_BASE_URL}/data/index.json): every skill's metadata, sections, changelog, and the inter-skill dependency graph`,
    ``,
  ];
  fs.writeFileSync(path.join(ROOT, "site", "llms.txt"), lines.join("\n"));
}

// Flattens every skill's changelog into one feed, newest first — same
// tie-break as site/whats-new.js (that file can't be required from Node),
// so a same-day version bump doesn't invert order.
function writeFeed(index) {
  const entries = index.skills
    .flatMap((skill) => (skill.changelog || []).map((entry, entryIndex) => ({ ...entry, entryIndex, skill })))
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.entryIndex - a.entryIndex));

  const items = entries
    .map((e) => {
      const link = `${SITE_BASE_URL}/s/${encodeURIComponent(e.skill.slug)}`;
      return [
        `  <item>`,
        `    <title>${escapeHtml(e.skill.title)} v${escapeHtml(e.version)}</title>`,
        `    <link>${escapeHtml(link)}</link>`,
        `    <guid isPermaLink="false">${escapeHtml(e.skill.slug)}-v${escapeHtml(e.version)}</guid>`,
        `    <pubDate>${new Date(e.date).toUTCString()}</pubDate>`,
        `    <description>${escapeHtml(e.summary)}</description>`,
        `  </item>`,
      ].join("\n");
    })
    .join("\n");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
<channel>
  <title>Behavioural Skills — What's New</title>
  <link>${SITE_BASE_URL}/whats-new</link>
  <description>Version history across every skill in the Behavioural Skills catalogue.</description>
${items}
</channel>
</rss>
`;
  fs.writeFileSync(path.join(ROOT, "site", "feed.xml"), xml);
}

function main() {
  const index = computeIndex();
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + "\n");
  writeSharePages(index);
  writeSitemap(index);
  writeLlmsTxt(index);
  writeFeed(index);
  console.log(
    `Wrote ${path.relative(ROOT, OUT_PATH)}: ${index.skills.length} skill(s), ${index.graph.edges.length} edge(s), ${index.graph.terminalOutputs.length} terminal output(s).`
  );
  console.log(`Wrote ${index.skills.length} shareable page(s) to ${path.relative(ROOT, SHARE_DIR)}/, plus sitemap.xml, llms.txt, and feed.xml.`);
}

module.exports = { computeIndex, loadSkillDirs, OUT_PATH, SHARE_DIR, writeSharePages };

if (require.main === module) {
  main();
}
