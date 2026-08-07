#!/usr/bin/env node
// Validates every skills/*/SKILL.md against schema/skill.schema.json plus the
// controlled vocabularies and cross-skill rules that a JSON schema alone
// can't express (taxonomy membership, dangling inputs, trigger-phrased
// descriptions). Exits non-zero if any skill has an error.

const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");
const matter = require("gray-matter");
const Ajv2020 = require("ajv/dist/2020");
const addFormats = require("ajv-formats");

const ROOT = path.resolve(__dirname, "..");
const SKILLS_DIR = path.join(ROOT, "skills");
const SCHEMA_PATH = path.join(ROOT, "schema", "skill.schema.json");
const TAXONOMY_PATH = path.join(ROOT, "schema", "taxonomy.yaml");

const TRIGGER_PATTERN =
  /\b(use when|use this (?:skill )?when|invoke(?:d)? when|invoke this (?:skill )?when|invoke it when|call this (?:skill )?when|trigger(?:ed)? when)\b/i;

function loadTaxonomy() {
  const raw = yaml.load(fs.readFileSync(TAXONOMY_PATH, "utf8"));
  return {
    categoryIds: new Set(raw.categories.map((c) => c.id)),
    stageIds: new Set(raw.stages.map((s) => s.id)),
    ioTypes: new Map(raw.io_types.map((t) => [t.id, t])),
  };
}

function loadSkillDirs() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .sort();
}

function checkFrontmatterShape(fm, dir, validateSchema) {
  const errors = [];
  const valid = validateSchema(fm);
  if (!valid) {
    for (const err of validateSchema.errors) {
      errors.push(`schema: ${err.instancePath || "(root)"} ${err.message}`);
    }
  }
  if (fm.name && fm.name !== dir) {
    errors.push(`name mismatch: frontmatter name "${fm.name}" does not match folder "${dir}"`);
  }
  return errors;
}

function checkTaxonomyMembership(fm, taxonomy) {
  const errors = [];
  if (fm.category && !taxonomy.categoryIds.has(fm.category)) {
    errors.push(`unknown category "${fm.category}" — add it to schema/taxonomy.yaml#categories or fix the typo`);
  }
  if (fm.stage && !taxonomy.stageIds.has(fm.stage)) {
    errors.push(`unknown stage "${fm.stage}" — add it to schema/taxonomy.yaml#stages or fix the typo`);
  }
  for (const io of [...(fm.inputs || []), ...(fm.outputs || [])]) {
    if (io.type && !taxonomy.ioTypes.has(io.type)) {
      errors.push(`io type "${io.type}" is not declared in schema/taxonomy.yaml#io_types`);
    }
  }
  return errors;
}

function checkEvidenceBase(fm) {
  // Redundant with the schema's minItems on evidence_base — kept separate so
  // a missing evidence base gets a message pointing at the actual rule
  // instead of a generic ajv "must NOT have fewer than 1 items".
  if (!Array.isArray(fm.evidence_base) || fm.evidence_base.length === 0) {
    return [`evidence_base is missing or empty — every skill must cite at least one framework or paper it draws on`];
  }
  return [];
}

function checkDescriptionIsTrigger(fm) {
  if (typeof fm.description === "string" && !TRIGGER_PATTERN.test(fm.description)) {
    return [
      `description does not read as a trigger condition — expected phrasing like "Use when ..." / "Invoke when ...", got: "${fm.description.slice(0, 80)}..."`,
    ];
  }
  return [];
}

function checkAtomicityHint(content) {
  // Heuristic nudge, not a hard failure: "and" in the opening line of "What
  // it does" usually means two skills are sharing one SKILL.md.
  const whatItDoesMatch = content.match(/##\s*What it does\s*\n+([^\n#]+)/i);
  if (whatItDoesMatch && / and /i.test(whatItDoesMatch[1])) {
    return [`"What it does" contains "and" — check this skill still describes one operation (atomicity rule in CONTRIBUTING.md)`];
  }
  return [];
}

function checkOneSkill(dir, taxonomy, validateSchema) {
  const skillPath = path.join(SKILLS_DIR, dir, "SKILL.md");
  if (!fs.existsSync(skillPath)) {
    return { dir, frontmatter: null, errors: ["missing SKILL.md"], warnings: [] };
  }

  const { data: fm, content } = matter(fs.readFileSync(skillPath, "utf8"));
  const errors = checkFrontmatterShape(fm, dir, validateSchema);
  const warnings = [];

  if (fm && typeof fm === "object") {
    errors.push(...checkTaxonomyMembership(fm, taxonomy));
    errors.push(...checkEvidenceBase(fm));
    errors.push(...checkDescriptionIsTrigger(fm));
    warnings.push(...checkAtomicityHint(content));
  }

  return { dir, frontmatter: fm, errors, warnings };
}

// Any input type that isn't produced by some skill's output and isn't
// marked user_suppliable in the taxonomy is a dead end in the graph —
// either a typo, a missing producer skill, or a type that should be marked
// user_suppliable. Only catchable once every skill's outputs are known, so
// this runs as a second pass over the full set.
function checkDanglingInputs(results, taxonomy) {
  const producedTypes = new Set();
  for (const { frontmatter } of results) {
    for (const out of frontmatter?.outputs || []) {
      if (out.type) producedTypes.add(out.type);
    }
  }

  for (const result of results) {
    for (const input of result.frontmatter?.inputs || []) {
      const userSuppliable = taxonomy.ioTypes.get(input.type)?.user_suppliable === true;
      if (!producedTypes.has(input.type) && !userSuppliable) {
        result.errors.push(
          `input type "${input.type}" has no producer among current skill outputs and is not marked user_suppliable in schema/taxonomy.yaml — either add a producing skill, or mark it user_suppliable if a human is meant to supply it directly`
        );
      }
    }
  }
}

function printReport(results) {
  let errorCount = 0;
  let warningCount = 0;
  for (const { dir, errors, warnings } of results) {
    if (errors.length === 0 && warnings.length === 0) {
      console.log(`ok    ${dir}`);
      continue;
    }
    for (const e of errors) {
      console.log(`ERROR ${dir}: ${e}`);
      errorCount++;
    }
    for (const w of warnings) {
      console.log(`warn  ${dir}: ${w}`);
      warningCount++;
    }
  }
  console.log(`\n${results.length} skill(s) checked, ${errorCount} error(s), ${warningCount} warning(s).`);
  return errorCount;
}

function main() {
  const taxonomy = loadTaxonomy();
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);

  const results = loadSkillDirs().map((dir) => checkOneSkill(dir, taxonomy, validateSchema));
  checkDanglingInputs(results, taxonomy);
  const errorCount = printReport(results);
  if (errorCount > 0) process.exit(1);
}

if (require.main === module) {
  main();
}
