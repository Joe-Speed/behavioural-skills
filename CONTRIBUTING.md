# Contributing a skill

This library is only useful if a skill written by one person chains
cleanly into a skill written by someone else, months later, who never
talked to them. That only works if every contributor holds the same line
on what counts as one skill. This document is that line.

## The atomicity rule

> A skill is one thing a behavioral scientist does — narrow enough that you
> can describe it in a single sentence without using the word "and."

If your one-sentence description needs "and" to cover what the skill does,
you have two skills. Split them. The second one can (and often should)
declare the first one's output as its input — that's not a workaround, it's
the point of the whole repository.

**Good — genuinely atomic:**

- Decompose a defined behavior into COM-B sub-components.
- Draft a values-affirmation prompt for a named target population.
- Adjust a published effect size for publication bias.
- Turn a vague program goal into one measurable, observable target
  behavior.

**Too broad — this is a workflow, not a skill:**

- Design a behavior change program. *(This is the whole project, made of
  a dozen atomic skills.)*
- Apply behavioral science to a chatbot. *(Apply which operation? Message
  drafting? Barrier diagnosis? Persona segmentation? Pick one.)*
- Analyze this program and tell me what's wrong with it. *(Diagnosis of
  what — the behavior definition, the barriers, the message, the
  measurement? Each is a different skill.)*

A useful test: if you can't finish the sentence "This skill takes
`<one input>` and produces `<one output>`" without an "and" showing up on
either side, it isn't atomic yet.

## Before you start

1. Check the [catalogue](https://github.com/Joe-Speed/behavioral-skills)
   (or `skills/`) for something that already covers this. A near-duplicate
   skill with slightly different wording fragments the graph — if
   something close already exists, extend it or propose a change to it
   instead of adding a parallel one.
2. Copy `templates/skill-template/` to `skills/<your-skill-name>/` and
   rename the file's frontmatter to match.
3. Skim `schema/skill.schema.json` and `schema/taxonomy.yaml` — the
   taxonomy file is the actual source of truth for which categories,
   stages, and input/output types currently exist.

## Filling in the frontmatter

The frontmatter isn't paperwork — it's what makes the dependency graph and
the validator work. A few fields need more care than they look like they
do:

**`description` is a trigger condition, not a summary.** It determines
whether a downstream reader (human or model) fires this skill at all, so
it has to answer "when do I reach for this" — phrased as "Use when ..." /
"Invoke when ...", ideally including the nearest situation this skill
should *not* handle. `validate.js` rejects descriptions that read like a
summary of what the skill does instead of a trigger for when to use it.

**`inputs` / `outputs` use a controlled vocabulary, not free text.** Each
`type` must be an id already listed in `schema/taxonomy.yaml#io_types`. This
is what lets the build script derive the dependency graph automatically —
two skills chain only because they reference the exact same type id, not
because their descriptions sound similar.

- If your skill's input is something a human types in directly (a goal
  statement, a document, field notes), mark the corresponding `io_types`
  entry `user_suppliable: true`.
- If your skill's input is supposed to come from another skill's output,
  either that producing skill needs to already exist, or you need to add it
  in the same PR. `validate.js` fails any input type that has no producer
  among current skill outputs and isn't marked `user_suppliable` — a
  dangling edge in the graph is treated as a bug, not a TODO.
- Reuse an existing `io_types` id whenever the concept genuinely matches,
  even if you'd have phrased it slightly differently. A type that exists
  twice under different names is invisible to the graph.
- After running `npm run build`, open `site/graph.html` locally and check
  your skill actually connects where you meant it to.

**`evidence_base` cannot be empty.** Every skill draws on something —
name the framework, model, or paper, with a real citation. "Common sense"
or "general best practice" is not an evidence base.

**`weird_context` is not optional self-flagellation — it's information a
user needs.** Most behavioral science evidence is disproportionately
Western, Educated, Industrialized, Rich, and Democratic. Say plainly
whether this skill's evidence base and worked examples hold up outside
that context, and if you're not sure, say that too (`mixed-evidence` or
`untested-outside-weird` are both honest answers).

**`category` and `stage` are separate axes.** Category is *what kind of
operation* this is (diagnosis, measurement, intervention design, ...).
Stage is *where in a project timeline* it's normally invoked (define,
diagnose, design, test, measure). If neither existing value fits, propose
adding one to `schema/taxonomy.yaml` in your PR description — don't
silently pick the closest match.

## Writing the body sections

- **What it does** — one sentence, no "and." This is the sentence CI and
  reviewers will hold you to.
- **When to invoke it** — the concrete triggers, plus the nearest adjacent
  case this skill should hand off elsewhere instead of handling itself.
- **What it draws on** — how the skill's logic actually maps onto the
  framework named in `evidence_base`, including any judgment call you made
  that the source material doesn't fully specify.
- **Output template** — the literal structure a downstream skill or human
  needs to parse or read reliably. Write it as if someone will paste it
  straight into the next tool in the chain, because they will.
- **Known failure modes** — real ones. "Produces a plausible-looking but
  wrong result when X" is useful; "may occasionally be inaccurate" is not.
  Include at least one input condition this skill is explicitly out of
  scope for.

## Validating and building

```bash
npm install
npm run validate   # schema + taxonomy membership + trigger-phrasing + dangling-input checks
npm run build       # regenerates site/data/index.json from skills/
```

Commit the regenerated `site/data/index.json` — CI checks that it's not
stale relative to `skills/`.

## Opening the PR

- One skill per PR, unless you're adding a small chain of skills that only
  make sense together (say so explicitly if you do).
- If you introduced a new `io_types`, `category`, or `stage` entry, call
  that out in the PR description — these are the fields hardest to walk
  back once other skills start depending on them.
- CI runs `npm run validate` and the site checks automatically. A red CI
  run on schema or taxonomy errors is expected to be fixed before review,
  not argued with — those checks encode the rules above mechanically so
  reviewers can focus on whether the behavioral science is actually right.
