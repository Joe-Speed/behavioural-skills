---
name: comb-barrier-decomposer
title: COM-B Barrier Decomposer
description: >-
  Use when one specific, already-defined target behaviour exists (a clear who
  + what + when, not a goal or outcome) and the question on the table is
  "why isn't this happening yet?" Invoke immediately after
  key-behaviour-definer, or any time a defined behaviour is handed over
  without an accompanying barrier diagnosis. Do not invoke on a vague program
  goal — that has to become one defined behaviour first, or the barriers
  produced here will be diagnosing the wrong thing.
category: diagnosis
stage: diagnose
evidence_base:
  - framework: COM-B model of behaviour
    citation: >-
      Michie, S., van Stralen, M. M., & West, R. (2011). The behaviour
      change wheel: A new method for characterising and designing behaviour
      change interventions. Implementation Science, 6(42).
  - framework: COM-B diagnostic questions
    citation: >-
      Michie, S., Atkins, L., & West, R. (2014). The Behaviour Change Wheel:
      A Guide to Designing Interventions. Silverback Publishing, Ch. 2.
weird_context:
  status: mixed-evidence
  note: >-
    COM-B is presented as a universal model of behaviour (its three
    components are meant to be exhaustive by construction, not culturally
    contingent), but the diagnostic question bank and worked examples in the
    source literature skew toward UK health-behaviour contexts. The
    Opportunity (social) sub-component in particular tends to need the most
    local adaptation — what counts as socially sanctioned or normal varies
    more than the framework's examples suggest.
inputs:
  - type: target_behaviour_brief
    description: >-
      The single defined target behaviour (who + what + when) to diagnose.
      Normally the output of key-behaviour-definer, but any equivalently
      specific behaviour statement works.
    source: skill-output
    required: true
  - type: bias_audit_report
    description: >-
      Optional researcher bias audit for this project, if
      researcher-bias-self-audit has already run. When present, treat its
      flagged assumptions as barrier hypotheses to actively test via their
      diagnostic questions, not as barriers to assume true — a flagged
      prior becoming a hypothesis without independent field evidence just
      relocates the bias rather than checking it.
    source: skill-output
    required: false
outputs:
  - type: comb_barrier_hypotheses
    description: >-
      Competing Capability / Opportunity / Motivation barrier hypotheses for
      the target behaviour, each paired with the diagnostic question(s) that
      would discriminate it from the others.
authors:
  - Nikhil Ravichandar
version: 0.2.0
---

## What it does

Decomposes one defined target behaviour into competing Capability,
Opportunity, and Motivation barrier hypotheses, each attached to the
diagnostic question that would tell you whether that specific hypothesis is
the one actually holding the behaviour back.

## When to invoke it

- A target behaviour brief exists (who + what + when) and the next question
  is "why isn't this happening already?"
- A team is about to jump straight to intervention ideas ("let's send a
  reminder text") without having named a barrier the intervention is meant
  to address.
- Multiple plausible explanations for non-behaviour are being asserted
  informally ("maybe they forgot", "maybe it's too expensive", "maybe
  they don't think it matters") and need to be organized into testable,
  mutually exclusive hypotheses.
- Do **not** invoke on a goal or outcome statement — route it through
  [key-behaviour-definer](../key-behaviour-definer) first. A barrier
  decomposition of "improve maternal health" has nothing concrete to
  attach to.

## What it draws on

The COM-B model: behaviour (B) occurs when a person has sufficient
**C**apability (psychological — knowledge, skills, ability to self-regulate;
physical — strength, stamina, dexterity), **O**pportunity (physical — time,
resources, location; social — norms, sanction, support from others), and
**M**otivation (reflective — beliefs, intentions, evaluations; automatic —
habit, emotion, impulse) at the moment the behaviour needs to occur. Because
the three components are constructed to be jointly exhaustive, a rigorous
decomposition should be able to state at least one hypothesis per
sub-component even if some are quickly ruled out — the discipline is in
naming what would distinguish a real barrier from a plausible-sounding one,
not in generating the longest list. One hypothesis per sub-component is a
floor, not a ceiling — if two genuinely distinct, non-trivial hypotheses
compete for the same sub-component, list both rather than merging or
dropping one to fit a one-bullet shape.

Every candidate Capability hypothesis must pass the persistence test before
it's placed: **would this barrier persist even if the environment fully
supported the person (full information, full access, no social cost)?** If
yes, it's Capability. If no — if the person would be fine once the
environment changed — it's Opportunity, not Capability, no matter how much
it resembles "doesn't know how" or "doesn't understand." This is the single
most common mislabel in COM-B application and the template below makes
showing this check mandatory, not optional.

If a `bias_audit_report` is available (from
[researcher-bias-self-audit](../researcher-bias-self-audit)), cross-check
its flagged assumptions against the hypothesis list below: a flagged prior
that quietly reappears as a hypothesis needs its own diagnostic question
like any other, not a pass on the strength of already having been named.

## Output template

Every Capability hypothesis requires its persistence-test line — a
hypothesis placed under Capability without one is incomplete, not just
under-documented. Every diagnostic question requires its discrimination
line: state the different answer each hypothesis under it predicts; a
question that would get the same answer either way isn't diagnostic and
belongs back in the hypothesis stage, not in this section. List more than
one hypothesis per sub-component whenever more than one is genuinely
distinct and non-trivial — do not compress two competing ideas into one
bullet.

```markdown
# COM-B Barrier Hypotheses

**Target behaviour:** <who + what + when, carried over verbatim>

## Capability
### Physical
- **Hypothesis:** <specific barrier — e.g. "lacks the physical skill to complete the form unassisted">
  **Persistence test:** <would this persist with full information/access/social support? state the answer and why>
  **Diagnostic question:** <question whose answer would confirm/rule this out>
  **Discriminates because:** <the different answer this hypothesis predicts vs. the other hypotheses in this document>
### Psychological
- **Hypothesis:** <e.g. "can't translate general awareness into a plan that fits their specific, variable schedule">
  **Persistence test:** <...>
  **Diagnostic question:** <...>
  **Discriminates because:** <...>

## Opportunity
### Physical
- **Hypothesis:** <e.g. "the clinic is only open during work hours">
  **Diagnostic question:** <...>
  **Discriminates because:** <...>
### Social
- **Hypothesis:** <e.g. "attending would signal something the person wants to avoid signaling">
  **Diagnostic question:** <...>
  **Discriminates because:** <...>

## Motivation
### Reflective
- **Hypothesis:** <e.g. "doesn't believe the behaviour will produce the promised benefit">
  **Diagnostic question:** <...>
  **Discriminates because:** <...>
### Automatic
- **Hypothesis:** <e.g. "competing habitual behaviour crowds out the window to act">
  **Diagnostic question:** <...>
  **Discriminates because:** <...>

## Most likely barrier(s), pending diagnostic answers

Score every hypothesis above on two criteria before ranking — a ranking
with no visible scoring is indistinguishable from an unexamined first
guess:

| Hypothesis | Context support (does existing context make this more/less likely, and why) | Field cost (how cheap/fast is its diagnostic question to actually run) |
|---|---|---|
| <hypothesis 1> | <...> | <...> |
| <hypothesis 2> | <...> | <...> |

<1-3 sentences naming the top 1-2 hypotheses by that table, flagged clearly
as provisional until the diagnostic questions are actually answered in the
field — not a restatement of intuition the table wasn't used to reach>
```

## Worked example

**Target behaviour (from key-behaviour-definer):** "Female stall vendors
in Gikomba/Toi markets deposit that day's net cash surplus into an M-Pesa
savings wallet before leaving the market, each trading day." *(Continues
the running example from context-and-audience-mapper and
key-behaviour-definer; illustrative, not a real diagnosis.)*

```markdown
# COM-B Barrier Hypotheses

**Target behaviour:** Female stall vendors in Gikomba/Toi markets deposit
that day's net cash surplus into an M-Pesa savings wallet before leaving
the market, each trading day.

## Capability
### Physical
- **Hypothesis:** Lacks fluency with the specific M-Pesa savings-lock menu
  sequence (distinct from ordinary send-money use, which vendors already
  do daily).
  **Persistence test:** Would persist even with full information/access —
  this is a specific-skill gap, not an access gap. Capability confirmed.
  **Diagnostic question:** Can the vendor complete a savings-lock deposit
  unassisted when asked to demonstrate it?
  **Discriminates because:** An Opportunity-only barrier would predict
  success once handed a working phone/agent; this predicts failure even
  then.
### Psychological
- **Hypothesis:** Can't reliably estimate "net cash surplus" without
  formal bookkeeping, so has nothing confident to deposit.
  **Persistence test:** Would persist even with full market access and
  no social cost — this is a calculation-capability gap. Capability
  confirmed.
  **Diagnostic question:** Given a day's sales and costs verbally, can the
  vendor state a surplus figure within a plausible range?
  **Discriminates because:** A Motivation barrier would predict the
  vendor *could* state a figure but chooses not to act on it; this
  predicts she can't state one confidently at all.

## Opportunity
### Physical
- **Hypothesis:** M-Pesa agent queue at closing time is long enough that
  depositing costs stall-minding time vendors won't spend.
  **Diagnostic question:** What is the average agent wait time at closing
  hour vs. mid-day?
  **Discriminates because:** If wait time is short, this barrier is ruled
  out regardless of what vendors say about "not having time."
### Social
- **Hypothesis:** Visible cash-counting/depositing at closing invites
  informal borrowing requests from neighbouring vendors (named in the
  audience_context_brief).
  **Diagnostic question:** Do vendors report changing behaviour (timing,
  location) specifically to avoid being seen with cash?
  **Discriminates because:** A purely physical-Opportunity barrier
  wouldn't predict vendors actively concealing the act itself.

## Motivation
### Reflective
- **Hypothesis:** Doesn't trust mobile-money savings products to hold
  value as reliably as cash-in-hand or a *chama*.
  **Diagnostic question:** Asked directly, does the vendor rank M-Pesa
  savings below *chama* or cash-at-home for trustworthiness?
  **Discriminates because:** A Capability or Opportunity barrier wouldn't
  produce a stated trust ranking; only a Motivation barrier would.
### Automatic
- **Hypothesis:** Habitual full hand-over of the day's cash to a spouse/
  household member at home crowds out any deposit step beforehand.
  **Diagnostic question:** Does the vendor report the hand-over happening
  "automatically," without a decision point, on most days?
  **Discriminates because:** A reflective-Motivation barrier would involve
  a considered choice each day; this predicts no decision point at all.

## Most likely barrier(s), pending diagnostic answers

| Hypothesis | Context support | Field cost |
|---|---|---|
| Opportunity/Social: visible cash invites borrowing requests | High — directly named in the audience_context_brief's environmental constraints | Low — one round of vendor interviews |
| Motivation/Automatic: habitual full hand-over at home | Medium — plausible given context, not yet directly observed | Low — same interview round |
| Capability/Psychological: can't estimate surplus | Medium — informal bookkeeping is common in this sector generally | Medium — needs a short verbal-estimation exercise, not just a question |

The Opportunity/Social hypothesis is the top provisional candidate — it is
both the most directly supported by existing context data and the
cheapest to confirm — but this remains provisional until the diagnostic
questions above are actually run in the field.
```

## Known failure modes

- **Motivation as a dumping ground.** It's easy to label every unexplained
  non-behaviour "lack of motivation" because it requires no further
  evidence. If a hypothesis can't be stated specifically enough to produce
  a diagnostic question that could rule it *out*, it isn't a real
  hypothesis yet.
- **Capability/Opportunity confusion.** "Doesn't know how" (capability) and
  "was never told" (opportunity, if the information was never made
  available to them) get mislabeled constantly — including by careful
  attempts, which is exactly why the persistence-test line in the template
  is mandatory rather than left as background judgment. A Capability
  hypothesis whose persistence-test answer is actually "no, they'd be fine
  if the environment changed" is a mislabeled Opportunity hypothesis, full
  stop, regardless of how the sentence is worded.
- **Non-discriminating questions.** A diagnostic question that would get
  the same answer regardless of which hypothesis is true isn't
  discriminating — it's just a survey item. If the "Discriminates because"
  line can't name a different predicted answer per hypothesis, the
  question needs to change, not just the write-up.
- **Running on a compound or vague behaviour.** If the input behaviour still
  contains "and" or lacks a clear who/what/when, the barriers produced will
  quietly diagnose whichever half of the behaviour was easiest to picture,
  not the behaviour as actually specified.
- **Treating the ranked barriers as confirmed.** This skill produces
  hypotheses and the questions to test them, not a diagnosis. Passing the
  "most likely barrier" straight to intervention design without answering
  the diagnostic questions in the field skips the step the questions exist
  for.
