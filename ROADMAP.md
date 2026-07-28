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

## Also worth considering (not yet scoped)

- **Measurement feasibility scoper** — before `measurement`-stage skills
  run, checks whether the data needed to detect the target behaviour at all
  is realistically collectible in this context.
- **Prior intervention post-mortem reader** — structures what a team
  already tried and why it did or didn't work, distinct from
  `evidence-base-scoper`'s external-literature focus (this one is about
  the team's own history, not the published record).
- **Intervention-design skill** — the catalogue jumps from diagnosis
  (`comb-barrier-decomposer`) straight to nothing; there's no skill yet in
  the `intervention-design` category turning a barrier hypothesis into
  candidate levers or messages once it's confirmed in the field.

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
