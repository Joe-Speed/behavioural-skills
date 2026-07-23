---
name: code-standards
description: Code standards for all JavaScript (Node scripts and the static site), Bash, PowerShell, and JSON Schema/YAML in this repo. Load before writing or reviewing anything under scripts/, site/, or schema/.
---

# Code standards for atomic-skills tooling

Overriding rule: **the least code that solves the problem.** Every
function, file, and script earns its place. No speculative abstraction —
no config system, no plugin layer, no helper built for a future skill
category that doesn't exist yet.

## Naming

- Descriptive full words: `producingSkills`, not `ps` or `arr`.
- Files match what they do, not how they're invoked: `build-index.js`
  builds the index; `validate.js` validates. No `utils.js`, no `helpers.js`.
- Booleans read as predicates: `isValid`, `hasProducer` — not `valid`,
  `producer`.
- Node scripts: `camelCase` functions, `UPPER_SNAKE_CASE` for module-level
  constants (`ROOT`, `SKILLS_DIR`). Site scripts: same, plus DOM element
  variables named for what they hold (`grid`, `status`), not what tag they
  are (`div1`).

## Comments

- Comments explain **why**, never what. `// dedup vs seen, not confirmed —
  else rejected findings reappear every round` earns its place; `// loop
  over skills` does not — delete it, the code already says that.
- No banner comments (`// --- helpers ---`, `// ===== MAIN =====`).
  Structure comes from function boundaries and file layout.
- No AI-tell comments: no restating the function signature in prose above
  it, no "This script does X" doc-comment blocks, no numbered step
  comments walking through code that's already linear and readable.
- A function gets a comment only when it encodes a non-obvious constraint
  (a schema quirk, a CI ordering dependency, a rule a reviewer would
  otherwise have to reverse-engineer from a bug report).

## Node scripts (`scripts/`)

- CommonJS, `require` at the top of the file only — no requires inside
  functions.
- One clear responsibility per script: `validate.js` checks, `build-index.js`
  derives, `test-site.js` asserts. If a script needs "and" to describe what
  it does, split it.
- Shared logic is exported and required, never copy-pasted between
  scripts — `test-site.js` requires `computeIndex` from `build-index.js`
  rather than reimplementing the walk.
- Every script that's meant to run standalone guards its `main()` with
  `if (require.main === module)` so it stays importable for tests without
  side effects.
- Fail loud: a malformed skill or missing file is a thrown error or a
  reported validation failure, never a silently skipped entry.
- No defensive code for states the CLI already rules out. Validate inputs
  once, at the boundary (arg parsing, frontmatter parsing) — not again at
  every call site downstream.

## Static site JS (`site/`, vanilla, no framework)

- One IIFE per page script, matching the page it powers (`catalogue.js` ↔
  `index.html`). No global state leaking between pages.
- Query the DOM once per element at the top of the IIFE; don't re-query
  the same node in a loop or on every render.
- A render function takes data and produces markup — it doesn't also fetch
  data or mutate filter state. Fetching, state, and rendering stay in
  separate functions even inside one small file.
- Build HTML with template literals and explicit escaping of user-facing
  text where it matters (this data is our own generated JSON, not
  untrusted input, so the bar is consistency, not paranoia).
- No inline `onclick=` in HTML — wire listeners from JS, next to the
  render call that created the element.

## Bash & PowerShell (`scripts/install.sh`, `scripts/install.ps1`)

- Bash: `set -euo pipefail`, every variable expansion quoted, long-form
  flags in `usage()` text.
- The two scripts are one spec in two languages: a flag added to one is
  added to the other in the same change, with matching behaviour for
  `--all` / `--name` / `--category` / `--list`.
- No parsing YAML by hand beyond the single `category:` / `title:` scalar
  line grep already in use — if a script ever needs to read a nested
  frontmatter field, that's a sign it should shell out to `node` instead of
  growing its own YAML parser.

## Schema & taxonomy (`schema/`)

- `taxonomy.yaml` is the only source of truth for categories, stages, and
  io types. Never hardcode one of these lists a second time in a script,
  the site, or a comment that could drift from it.
- `skill.schema.json` keeps `additionalProperties: false` on every object
  so a typo'd field fails loudly instead of being silently ignored.
- Every schema property carries a `description` — it's the only inline
  documentation a contributor sees while filling in frontmatter.

## Idiom

- Array methods (`map`, `filter`, `flatMap`, `reduce`) over manual `for`
  loops when building a derived list.
- Early return over nested `if`/`else`.
- Destructure at the top of a function, not line-by-line through the body.
- Remove code before adding a flag to keep it — a dead branch or an unused
  export is deleted, not commented out "in case."

## Architecture

- Flat until it hurts: `schema/`, `skills/`, `scripts/`, `site/`,
  `templates/`. Don't add a subfolder for one file.
- A script or page module does data loading, transformation, or rendering
  — not more than one of those without a clear internal boundary between
  them (see `build-index.js`: load → derive graph → shape output, each its
  own function).
- Dependencies are a cost. This repo runs on `ajv`, `ajv-formats`,
  `gray-matter`, `js-yaml`, plus `cytoscape` and `marked` loaded from a CDN
  in the two pages that need them. Reach for what's already here before
  adding another one.

## Gates

Code isn't done until all pass clean:

```
npm run validate
npm run build
npm run test:site
```

CI runs the same three gates on every pull request — a red run here is
fixed before review, not argued with.
