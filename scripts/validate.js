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

function main() {
  const taxonomy = loadTaxonomy();
  const schema = JSON.parse(fs.readFileSync(SCHEMA_PATH, "utf8"));
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const validateSchema = ajv.compile(schema);

  const skillDirs = loadSkillDirs();
  const skills = [];
  const results = []; // { dir, errors: [], warnings: [] }

  for (const dir of skillDirs) {
    const errors = [];
    const warnings = [];
    const skillPath = path.join(SKILLS_DIR, dir, "SKILL.md");

    if (!fs.existsSync(skillPath)) {
      results.push({ dir, errors: [`missing SKILL.md`], warnings });
      continue;
    }

    const raw = fs.readFileSync(skillPath, "utf8");
    const { data: fm, content } = matter(raw);

    // 1. Structural validation against the JSON schema.
    const valid = validateSchema(fm);
    if (!valid) {
      for (const err of validateSchema.errors) {
        errors.push(`schema: ${err.instancePath || "(root)"} ${err.message}`);
      }
    }

    // Everything below assumes the frontmatter at least parsed as an object;
    // guard so one malformed skill doesn't crash the whole run.
    if (fm && typeof fm === "object") {
      // 2. Folder name must match declared name.
      if (fm.name && fm.name !== dir) {
        errors.push(
          `name mismatch: frontmatter name "${fm.name}" does not match folder "${dir}"`
        );
      }

      // 3. Category / stage must be in the controlled vocabulary.
      if (fm.category && !taxonomy.categoryIds.has(fm.category)) {
        errors.push(
          `unknown category "${fm.category}" — add it to schema/taxonomy.yaml#categories or fix the typo`
        );
      }
      if (fm.stage && !taxonomy.stageIds.has(fm.stage)) {
        errors.push(
          `unknown stage "${fm.stage}" — add it to schema/taxonomy.yaml#stages or fix the typo`
        );
      }

      // 4. Evidence base must be non-empty (schema minItems already enforces
      // this structurally; this re-check gives a clearer message).
      if (!Array.isArray(fm.evidence_base) || fm.evidence_base.length === 0) {
        errors.push(
          `evidence_base is missing or empty — every skill must cite at least one framework or paper it draws on`
        );
      }

      // 5. Description must read as a trigger condition, not a summary.
      if (typeof fm.description === "string" && !TRIGGER_PATTERN.test(fm.description)) {
        errors.push(
          `description does not read as a trigger condition — expected phrasing like "Use when ..." / "Invoke when ...", got: "${fm.description.slice(0, 80)}..."`
        );
      }

      // 6. Every declared input/output type must exist in the taxonomy.
      for (const io of fm.inputs || []) {
        if (io.type && !taxonomy.ioTypes.has(io.type)) {
          errors.push(
            `input type "${io.type}" is not declared in schema/taxonomy.yaml#io_types`
          );
        }
      }
      for (const io of fm.outputs || []) {
        if (io.type && !taxonomy.ioTypes.has(io.type)) {
          errors.push(
            `output type "${io.type}" is not declared in schema/taxonomy.yaml#io_types`
          );
        }
      }

      // Soft check: atomicity. A skill described with "and" joining two
      // actions in its opening line is usually two skills wearing one
      // SKILL.md. This is a heuristic nudge, not a hard failure — flagged
      // as a warning for a human to read, not blocked in CI.
      const whatItDoesMatch = content.match(/##\s*What it does\s*\n+([^\n#]+)/i);
      if (whatItDoesMatch && / and /i.test(whatItDoesMatch[1])) {
        warnings.push(
          `"What it does" contains "and" — check this skill still describes one operation (atomicity rule in CONTRIBUTING.md)`
        );
      }
    }

    skills.push({ dir, frontmatter: fm });
    results.push({ dir, errors, warnings });
  }

  // 7. Dangling-input check, run across the whole set: any input type that
  // isn't produced by some skill's output AND isn't marked user_suppliable
  // in the taxonomy is a dead end in the graph — either a typo, a missing
  // producer skill, or a type that should be marked user_suppliable.
  const producedTypes = new Set();
  for (const { frontmatter } of skills) {
    for (const out of frontmatter?.outputs || []) {
      if (out.type) producedTypes.add(out.type);
    }
  }
  for (const { dir, frontmatter } of skills) {
    const result = results.find((r) => r.dir === dir);
    for (const input of frontmatter?.inputs || []) {
      const typeDef = taxonomy.ioTypes.get(input.type);
      const userSuppliable = typeDef?.user_suppliable === true;
      if (!producedTypes.has(input.type) && !userSuppliable) {
        result.errors.push(
          `input type "${input.type}" has no producer among current skill outputs and is not marked user_suppliable in schema/taxonomy.yaml — either add a producing skill, or mark it user_suppliable if a human is meant to supply it directly`
        );
      }
    }
  }

  // --- report ---
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

  console.log(
    `\n${skills.length} skill(s) checked, ${errorCount} error(s), ${warningCount} warning(s).`
  );
  if (errorCount > 0) process.exit(1);
}

main();
