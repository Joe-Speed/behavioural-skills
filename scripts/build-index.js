#!/usr/bin/env node
// Walks skills/, reads every SKILL.md, and emits site/data/index.json: the
// full catalogue plus a dependency graph derived by matching each skill's
// declared outputs to every skill's declared inputs. Run `npm run validate`
// first — this script assumes the frontmatter is already well-formed and
// does not re-check it.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const matter = require("gray-matter");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const TAXONOMY_PATH = path.join(ROOT, "schema", "taxonomy.yaml");
const OUT_PATH = path.join(ROOT, "site", "data", "index.json");

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
    })),
    graph,
  };
}

function main() {
  const index = computeIndex();
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(index, null, 2) + "\n");
  console.log(
    `Wrote ${path.relative(ROOT, OUT_PATH)}: ${index.skills.length} skill(s), ${index.graph.edges.length} edge(s), ${index.graph.terminalOutputs.length} terminal output(s).`
  );
}

module.exports = { computeIndex, OUT_PATH };

if (require.main === module) {
  main();
}
