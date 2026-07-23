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
outputs:
  - type: comb_barrier_hypotheses
    description: >-
      Competing Capability / Opportunity / Motivation barrier hypotheses for
      the target behaviour, each paired with the diagnostic question(s) that
      would discriminate it from the others.
authors:
  - Nikhil Ravichandar
version: 0.1.0
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
not in generating the longest list.

## Output template

```markdown
# COM-B Barrier Hypotheses

**Target behaviour:** <who + what + when, carried over verbatim>

## Capability
### Physical
- **Hypothesis:** <specific barrier — e.g. "lacks the physical skill to complete the form unassisted">
  **Diagnostic question:** <question whose answer would confirm/rule this out>
### Psychological
- **Hypothesis:** <e.g. "doesn't know the deadline exists">
  **Diagnostic question:** <...>

## Opportunity
### Physical
- **Hypothesis:** <e.g. "the clinic is only open during work hours">
  **Diagnostic question:** <...>
### Social
- **Hypothesis:** <e.g. "attending would signal something the person wants to avoid signaling">
  **Diagnostic question:** <...>

## Motivation
### Reflective
- **Hypothesis:** <e.g. "doesn't believe the behaviour will produce the promised benefit">
  **Diagnostic question:** <...>
### Automatic
- **Hypothesis:** <e.g. "competing habitual behaviour crowds out the window to act">
  **Diagnostic question:** <...>

## Most likely barrier(s), pending diagnostic answers
<1-3 sentences ranking which hypotheses seem most probable given whatever
context is available, flagged clearly as provisional until the diagnostic
questions are actually answered in the field>
```

## Known failure modes

- **Motivation as a dumping ground.** It's easy to label every unexplained
  non-behaviour "lack of motivation" because it requires no further
  evidence. If a hypothesis can't be stated specifically enough to produce
  a diagnostic question that could rule it *out*, it isn't a real
  hypothesis yet.
- **Capability/Opportunity confusion.** "Doesn't know how" (capability) and
  "was never told" (opportunity, if the information was never made
  available to them) get mislabeled constantly. The distinguishing test is
  whether the barrier would persist even if the environment fully
  supported the person — if yes, it's capability; if the environment is
  actually the blocker, it's opportunity.
- **Non-discriminating questions.** A diagnostic question that would get
  the same answer regardless of which hypothesis is true isn't
  discriminating — it's just a survey item. Each question should be
  chosen because a different hypothesis predicts a different answer.
- **Running on a compound or vague behaviour.** If the input behaviour still
  contains "and" or lacks a clear who/what/when, the barriers produced will
  quietly diagnose whichever half of the behaviour was easiest to picture,
  not the behaviour as actually specified.
- **Treating the ranked barriers as confirmed.** This skill produces
  hypotheses and the questions to test them, not a diagnosis. Passing the
  "most likely barrier" straight to intervention design without answering
  the diagnostic questions in the field skips the step the questions exist
  for.
