---
name: researcher-bias-self-audit
title: Researcher Bias Self-Audit
description: >-
  Use when a research team is about to diagnose barriers or design an
  intervention and no one has surfaced the team's own prior beliefs about
  why the target population behaves the way it does. Invoke before
  comb-barrier-decomposer, ideally alongside evidence-base-scoper, at the
  start of a project and again before any major diagnosis or design phase
  — this is a periodic check, not a one-time gate. Do not invoke expecting
  it to resolve or correct the biases it finds; it only surfaces and
  structures them for a human to act on.
category: researcher-calibration
stage: prepare
evidence_base:
  - framework: Confirmation bias in hypothesis testing
    citation: >-
      Klayman, J. (1995). Varieties of confirmation bias. Psychology of
      Learning and Motivation, 32, 385-418.
  - framework: Debiasing training and self-correction
    citation: >-
      Lilienfeld, S. O., Ammirati, R., & Landfield, K. (2009). Giving
      debiasing away: Can psychological research on correcting cognitive
      errors promote human welfare? Perspectives on Psychological Science,
      4(4), 390-398.
weird_context:
  status: untested-outside-weird
  note: >-
    The debiasing and metacognition literature this skill draws on is
    itself drawn overwhelmingly from WEIRD research populations and
    settings (Henrich, Heine, & Norenzayan, 2010, "The weirdest people in
    the world?", Behavioral and Brain Sciences, 33(2-3), 61-83) — a
    pointed irony for a skill about checking researchers' own priors. The
    *technique* (forcing falsifiability and a named disconfirming
    observation) is general-purpose, but treat its effectiveness as
    unvalidated outside the populations the source studies were run on,
    same as any other skill in this library would be required to.
inputs:
  - type: researcher_assumption_statement
    description: >-
      The researcher's own short, honest answers to the fixed prompts
      named in this io type's taxonomy entry, given before looking at any
      diagnostic data on the actual target population.
    source: user
    required: true
outputs:
  - type: bias_audit_report
    description: >-
      A structured flag list surfacing which stated assumptions are
      unfalsifiable as written, default to a WEIRD population as the
      implicit norm, or lack a named disconfirming observation.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Takes a researcher's own stated assumptions about why a target population
behaves as it does and flags which of those assumptions are unfalsifiable,
implicitly assume a WEIRD-default population, or have no named observation
that would change the researcher's mind — before those assumptions quietly
become the barrier hypotheses in a later diagnosis.

## When to invoke it

- A project is starting and the research team hasn't yet written down what
  they already believe about why the target population behaves as it does,
  before looking at any data.
- Before [comb-barrier-decomposer](../comb-barrier-decomposer) runs, so its
  barrier hypotheses can be checked against what the researchers already
  believed going in, rather than silently reproducing it.
- Periodically during a long project — priors drift and harden over time,
  so this is meant to be re-run at each major diagnosis or design phase,
  not just once at kickoff.
- Do **not** invoke expecting a fixed intervention or training plan out the
  other end. A skill that both surfaces a researcher's biases and prescribes
  how to fix their thinking is two skills — this one only does the former.

## What it draws on

Klayman's account of confirmation bias: people don't just fail to seek
disconfirming evidence, they often can't specify what disconfirming
evidence would even look like, because the belief was never stated in
falsifiable form. The self-audit's fixed prompts are built to force that
specification — asking not just "what do you believe?" but "what would
change your mind?" and "what's the most similar population you've actually
worked with?" surfaces both the belief and its evidentiary basis (or lack
of one) in the same pass. Lilienfeld et al.'s review of debiasing training
is the basis for treating this as a structuring/surfacing exercise rather
than a correction exercise — their finding is that durable debiasing needs
deliberate practice against specific, named errors, not a one-off warning;
a single audit report doesn't produce that practice, it just gives the
team something concrete to practice against.

## Output template

Every flagged assumption needs a concrete rewrite or a concrete follow-up
question — a flag with no actionable next step is just a criticism, not an
audit. The "no flags raised" case is legitimate but should be rare; if nothing
in the statement is flaggable, that itself is worth a one-line sanity check
in the report.

```markdown
# Researcher Bias Self-Audit

**Assumption statement (as given):** <verbatim>

## Unfalsifiable assumptions
- <assumption, quoted or closely paraphrased> — **Why unfalsifiable:**
  <what observation could never contradict it as currently worded> —
  **Rewrite as falsifiable:** <a version of the same belief that some
  specific, obtainable observation could actually contradict>

## Default-to-WEIRD priors
- <assumption> — **Implicit norm assumed:** <e.g. assumes salaried income,
  nuclear-household decision-making, individual rather than collective
  financial choices> — **What to check locally:** <the specific local fact
  that would confirm or override this norm for the actual target population>

## No named disconfirming observation
- <assumption> — **"What would change your mind?" answer given:**
  <verbatim, or "none given" if the prompt wasn't answered concretely> —
  **Risk:** <what happens downstream if this belief is never actually
  tested because no one specified how it could be wrong>

## Population-transfer risk
- <assumption> — **Most similar population researcher has personally
  worked with:** <as stated> — **Stated similarity to target population:**
  <as stated> — **Gap risk:** <what's different enough between the two
  that experience with one may not transfer>

## Re-audit trigger
<when this should be re-run for this project — e.g. before diagnosis
begins, before design begins, or after a stated number of weeks/major
findings>
```

## Worked example

**Assumption statement (as given):** "They just don't prioritize saving
the way we'd expect. I've mostly worked with urban Nairobi tech-sector
employees before, and I'd guess this group is fairly similar — people
generally know saving is good for them, so if they're not doing it, it's
probably a discipline issue more than anything structural. I'd change my
mind if I saw hard evidence they're actively trying to save and failing
for reasons outside their control." *(Illustrative — continues the
running example used across this library's other skills; not a real
audit.)*

```markdown
# Researcher Bias Self-Audit

**Assumption statement (as given):** They just don't prioritize saving
the way we'd expect. I've mostly worked with urban Nairobi tech-sector
employees before, and I'd guess this group is fairly similar — people
generally know saving is good for them, so if they're not doing it, it's
probably a discipline issue more than anything structural. I'd change my
mind if I saw hard evidence they're actively trying to save and failing
for reasons outside their control.

## Unfalsifiable assumptions
- "It's probably a discipline issue more than anything structural." —
  **Why unfalsifiable:** Almost any observed structural barrier (agent
  distance, cash-handling risk) can be redescribed after the fact as "poor
  discipline in the face of that barrier," so no observation clearly
  contradicts it as worded. — **Rewrite as falsifiable:** "If vendors
  report actively wanting to save and naming a specific structural
  obstacle (not just 'I forget' or 'I don't feel like it'), that counts
  against a pure-discipline explanation."

## Default-to-WEIRD priors
- "People generally know saving is good for them, so if they're not doing
  it, it's probably discipline." — **Implicit norm assumed:** Individual,
  formal-sector, salaried saving behaviour (the researcher's own tech-
  sector reference point) as the default rational baseline. —
  **What to check locally:** Whether group-based *chama* saving is already
  functioning as this population's rational savings strategy, just not in
  the individual-account form the assumption implicitly expects.

## No named disconfirming observation
- "It's probably a discipline issue" — **"What would change your mind?"
  answer given:** "Hard evidence they're actively trying to save and
  failing for reasons outside their control." — **Risk:** As worded, this
  requires proof of *intent* that's hard to observe directly — without a
  concrete, observable version of this (e.g. a named barrier report), the
  belief could survive contact with almost any data.

## Population-transfer risk
- "I'd guess this group is fairly similar [to urban tech-sector
  employees]" — **Most similar population researcher has personally
  worked with:** Urban Nairobi tech-sector employees. — **Stated
  similarity to target population:** Both urban and Nairobi-based, per the
  researcher. — **Gap risk:** Salaried, banked, formal-sector employment
  vs. informal daily cash-based vending are different enough in income
  timing and access to financial infrastructure that "urban" alone
  understates the gap.

## Re-audit trigger
Before comb-barrier-decomposer runs, and again after the first round of
vendor field interviews, since this statement's priors were given before
any of the audience-context or field data existed.
```

## Known failure modes

- **Performative self-awareness.** Answering the prompts with what sounds
  appropriately humble ("I could be wrong about anything") rather than a
  specific, checkable belief produces a statement with nothing real to
  flag. The audit can only work on what's actually stated — vague
  humility isn't more auditable than vague certainty.
- **Treating a completed audit as a resolved bias.** This skill's output is
  a flag list, not evidence the flagged assumption was corrected. Passing
  "audited" straight to intervention design as if the flagged priors are
  now neutralized skips the actual field-testing the diagnostic skill and
  the disconfirming observations are meant to prompt.
- **One-time use on a multi-month project.** Priors harden and new ones
  form as a project proceeds. An audit run once at kickoff and never
  again will miss the assumptions that calcified during diagnosis itself
  — the "Re-audit trigger" field exists so this isn't left to memory.
- **Auditor and subject as the same unchecked person.** If the person
  running this skill is also the sole author of the assumption statement,
  with no one else reviewing the flags, self-serving under-flagging is
  possible and won't be visible in the report itself. Where feasible, have
  a second team member read the flagged report against the original
  statement.
- **Confusing this with the target-population evidence base.** This skill
  audits the *researcher's* priors; it does not survey external evidence
  on the population — that's [evidence-base-scoper](../evidence-base-scoper).
  Running only this one and treating it as if the population itself has now
  been evidenced leaves the actual evidence gap unaddressed.
