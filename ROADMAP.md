# Roadmap: candidate skills

This is a working list of skills we want in the catalogue but haven't built
yet. It's not a queue — anyone can pick one up, and CONTRIBUTING.md's
atomicity rule still applies to whatever gets built from an entry here.

## The gap: everything starts after framing is already done

Both current skills assume a target behaviour already exists or is being
actively defined. Nothing in the catalogue runs *before* that — the
evidence-gathering and self-checking a behavioural scientist does before
they trust their own framing of the problem. That's the gap this section
targets: skills for the groundwork stage, upstream of `key-behaviour-definer`.

Building these means adding to `schema/taxonomy.yaml`:

- **New stage: `prepare`** — groundwork before defining a target behaviour:
  gathering evidence and checking the research team's own priors. Sits
  before `define` in a project timeline.
- **New category: `evidence-scoping`** — surveying existing evidence for a
  behaviour or context before diagnosis or design begins.
- **New category: `researcher-calibration`** — checking the research
  team's own priors, assumptions, or evidence gaps before they shape
  downstream diagnosis or design. Distinct from `cultural-context` (which
  is about the target population) — this is about the researcher.

### 1. Evidence-base scoper

**Category:** `evidence-scoping` (proposed) · **Stage:** `prepare` (proposed)

Use when a program goal or target behaviour has been named but no one has
checked what evidence already exists for it — before `key-behaviour-definer`
or `comb-barrier-decomposer` run, so their framing is informed by prior work
rather than starting cold.

- **Input:** `program_goal_statement` (the existing user-suppliable type —
  this skill can run on the same raw input `key-behaviour-definer` does, in
  parallel or just before it).
- **Output (new type, e.g. `evidence_scan_brief`):** what's already been
  tried for this behaviour/population/context, what the effect sizes looked
  like, where the evidence base is thin or contradictory, and which findings
  are WEIRD-skewed (ties into the existing `weird_context` field every
  skill already declares — this output should flag it explicitly per
  finding, not just once for the whole brief).
- **Chains into:** `key-behaviour-definer` and `comb-barrier-decomposer`
  could both declare this as an optional input, so a defined behaviour or a
  barrier hypothesis can cite what it's built on.
- **Known failure mode to design against:** confirmation-biased search
  (only surfacing evidence that confirms the goal as stated) — the output
  template should force a "contradicting or null findings" section, not
  just supporting ones.

### 2. Researcher bias self-audit

**Category:** `researcher-calibration` (proposed) · **Stage:** `prepare`
(proposed)

This is the "test the researcher" skill: before diagnosis starts, surface
the research team's own unexamined priors about *why* the target population
behaves the way it does, so those priors are visible and checkable rather
than silently steering `comb-barrier-decomposer`'s output.

- **Input (new type, e.g. `researcher_assumption_statement`,
  user-suppliable):** the researcher's own short, honest answer to a fixed
  set of prompts — e.g. "what do you already believe is causing this
  behaviour gap, before looking at any data?", "what population have you
  personally worked with most, and how similar is it to this one?", "what
  would change your mind?"
- **Output (new type, e.g. `bias_audit_report`):** not a pass/fail score —
  a structured flag list: which stated assumptions are unfalsifiable as
  written, which ones default to a WEIRD population as the implicit norm,
  which ones the researcher couldn't name a disconfirming observation for.
  Designed to be re-run periodically on the same project, not just once.
- **Chains into:** could feed `comb-barrier-decomposer` as an optional
  input ("known researcher priors to actively check against, not assume"),
  the same way `evidence_scan_brief` would.
- **Evidence base to draw on:** this is the one skill in the catalogue
  that's about the researcher instead of the program — ground it in
  debiasing/metacognition literature (e.g. Lilienfeld et al. on
  self-correction training, Klayman on confirmation bias in hypothesis
  testing) rather than the Behaviour Change Wheel material the other two
  skills use, since the object of study is different.
- **Atomicity check:** resist folding in "and suggests how to fix your
  biases" — that's a second skill (a debiasing intervention *for the
  researcher*, mirroring the whole point of this repo). This one only
  surfaces and structures what's already there.

### Also worth considering (not yet scoped)

- **Measurement feasibility scoper** — before `measurement`-stage skills
  run, checks whether the data needed to detect the target behaviour at all
  is realistically collectible in this context.
- **Prior intervention post-mortem reader** — structures what a team
  already tried and why it did or didn't work, distinct from the
  evidence-base scoper's external literature focus.

## How to turn one of these into a real skill

1. Add the new category/stage/io_type entries to `schema/taxonomy.yaml`
   first — `scripts/validate.js` enforces that every skill references ids
   that already exist there.
2. Copy `templates/skill-template/SKILL.md` into `skills/<name>/`.
3. Follow CONTRIBUTING.md's atomicity rule and dangling-input check —
   an input type only validates if it's `user_suppliable: true` or another
   skill in the repo already produces it.
