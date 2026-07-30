# Roadmap: candidate skills

This is a working list of skills we want in the catalogue but haven't built
yet. It's not a queue — anyone can pick one up, and CONTRIBUTING.md's
atomicity rule still applies to whatever gets built from an entry here.

## The pre-intervention gap — built

The first version of this doc flagged a gap: both skills that existed at
the time assumed a target behaviour already existed or was being actively
defined, with nothing covering the evidence-gathering and self-checking
that happens before that framing is trusted. That gap is now closed:

- **[evidence-base-scoper](skills/evidence-base-scoper)** — surveys
  existing evidence for a behaviour/population/context before diagnosis or
  design begins. Category `evidence-scoping`, stage `prepare`.
- **[researcher-bias-self-audit](skills/researcher-bias-self-audit)** —
  the "test the researcher" skill: surfaces a research team's own
  unexamined priors before they silently become barrier hypotheses.
  Category `researcher-calibration`, stage `prepare`.

Both now chain optionally into `key-behaviour-definer` and
`comb-barrier-decomposer` respectively — see the README's catalogue table
for the current dependency graph.

## Context and measurement gaps — built

Two more gaps in the pre-intervention chain, closed:

- **[context-and-audience-mapper](skills/context-and-audience-mapper)** —
  operationalizes a funder's abstract population label into a specific
  decision moment, real existing channels, and a WEIRD-default assumption
  check, before `key-behaviour-definer` writes a "who" that's still just
  the funder's label restated. Category `context-mapping`, stage
  `prepare`.
- **[evaluation-design-scoper](skills/evaluation-design-scoper)** — the
  "measurement feasibility scoper" entry below, built: turns a target
  behaviour into a locked-in primary outcome, comparison condition,
  minimum detectable effect, and data-feasibility check, before an
  intervention launches. Category `measurement`, stage `test`.

Both are visible on the site's [Workflow Builder](site/workflow.html) —
drag skills into a sequence and it flags any step whose required input
isn't yet produced earlier in that sequence.

## The design and post-mortem gaps — built

The three entries this doc used to list here are now built:

- **[intervention-lever-selector](skills/intervention-lever-selector)** —
  the intervention-design skill: turns one field-confirmed COM-B barrier
  into candidate levers read off the Behaviour Change Wheel's published
  linkage matrix, not free-generated, scored and broken into a concrete
  technique. Category `intervention-design`, stage `design`. Closes the
  gap between diagnosis (`comb-barrier-decomposer`) and design that this
  catalogue previously jumped straight over.
- **[values-affirmation-drafter](skills/values-affirmation-drafter)** —
  README's own intro named this as a canonical example of what belongs in
  this library; it's now actually built. Category `intervention-design`,
  stage `design`.
- **[prior-intervention-post-mortem-reader](skills/prior-intervention-post-mortem-reader)**
  — structures what a team already tried and why it did or didn't work,
  separating implementation failure from idea failure, distinct from
  `evidence-base-scoper`'s external-literature focus. Category
  `risk-review`, stage `prepare`. Optionally feeds
  `researcher-bias-self-audit`.

All three are visible on the site's [Workflow Builder](site/workflow.html).

## Also worth considering (not yet scoped)

- **Message/content drafter for a selected lever** — `intervention-lever-selector`
  names a concrete behaviour change technique; nothing yet turns that
  technique into the actual message, script, or interface copy a field
  team would deliver.
- **Measurement feasibility check specific to a chosen data source** —
  `evaluation-design-scoper` checks whether a primary outcome is
  collectible in principle; a deeper skill could pilot-test an actual data
  pipeline (e.g. a specific administrative dataset's completeness) before
  a full evaluation commits to it.

## How to turn one of these into a real skill

1. Add any new category/stage/io_type entries to `schema/taxonomy.yaml`
   first — `scripts/validate.js` enforces that every skill references ids
   that already exist there.
2. Copy `templates/skill-template/SKILL.md` into `skills/<name>/`.
3. Follow CONTRIBUTING.md's atomicity rule and dangling-input check —
   an input type only validates if it's `user_suppliable: true` or another
   skill in the repo already produces it.
4. If the new skill's output is something an existing skill could use,
   consider wiring it in as an optional (`required: false`) input on that
   skill, the way `evidence-base-scoper` and `researcher-bias-self-audit`
   feed into the original two — the dependency graph on each skill's page
   is derived automatically from these declarations, not hand-wired.
