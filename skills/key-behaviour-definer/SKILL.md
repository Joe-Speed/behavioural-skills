---
name: key-behaviour-definer
title: Key Behaviour Definer
description: >-
  Use when a program goal, campaign objective, or "theory of change" is stated
  in vague, aspirational, or attitudinal terms (e.g. "increase savings",
  "improve maternal health", "reduce dropout", "build trust in the vaccine")
  and no single measurable, observable behaviour has been named yet. Invoke
  before any diagnosis, intervention-design, or measurement skill in this
  library, since all of them require one defined target behaviour as input.
  Do not invoke once a specific who + what + when behaviour is already agreed
  — that's a sign this step is done.
category: behaviour-definition
stage: define
evidence_base:
  - framework: Behaviour Change Wheel — specifying and selecting target behaviours
    citation: >-
      Michie, S., Atkins, L., & West, R. (2014). The Behaviour Change Wheel:
      A Guide to Designing Interventions. Silverback Publishing, Ch. 3.
  - framework: APEASE criteria for behaviour prioritization
    citation: >-
      Michie, S., Atkins, L., & West, R. (2014). The Behaviour Change Wheel:
      A Guide to Designing Interventions. Silverback Publishing, pp. 46-48.
weird_context:
  status: mixed-evidence
  note: >-
    The BCW's target-behaviour-selection logic itself is context-agnostic
    (it's a prioritization procedure, not a claim about what motivates
    people), but the worked examples and APEASE weighting in the source
    literature are drawn overwhelmingly from UK/US public health programs.
    Treat the *procedure* as portable and the *illustrative priors* (e.g.
    which behaviours are usually "high impact") as needing local validation.
inputs:
  - type: program_goal_statement
    description: >-
      The program or campaign goal as originally stated, plus whatever
      context is available on the target population, setting, and known
      constraints (budget, delivery channel, timeline).
    source: user
    required: true
outputs:
  - type: target_behaviour_brief
    description: >-
      One measurable, observable target behaviour specified as who + what +
      when, plus a prioritized list of runner-up candidate behaviours with
      the reasoning for why the top choice won.
authors:
  - Nikhil Ravichandar
version: 0.1.0
---

## What it does

Turns one vague program goal into a single measurable, observable target
behaviour — specified as who does what, by when — backed by a prioritized
list of the other candidate behaviours that were considered and set aside.

## When to invoke it

- A program document, funder brief, or stakeholder states a goal as an
  outcome, attitude, or aspiration rather than a behaviour ("increase
  financial resilience", "improve engagement", "reduce stigma").
- Someone asks "what should we actually be trying to change here?" or "what
  behaviour are we targeting?"
- Multiple candidate behaviours are floating around informally and the team
  needs one to commit to before diagnosis or design work starts.
- Do **not** invoke if a specific, already-observable behaviour with a named
  actor and timeframe is on the table — hand that directly to a diagnosis
  skill (e.g. [comb-barrier-decomposer](../comb-barrier-decomposer)) instead.

## What it draws on

The Behaviour Change Wheel's "select target behaviour" step: generate a
reasonably exhaustive list of candidate behaviours that could plausibly
achieve the stated goal, then score each against the APEASE criteria —
**A**ffordability, **P**racticability, **E**ffectiveness (and cost-
effectiveness), **A**cceptability, **S**ide-effects/safety, **E**quity —
plus impact (how much changing this behaviour would move the goal) and
spillover (whether changing it makes other useful behaviours more or less
likely). The highest-scoring candidate becomes the target; the rest are
kept as a ranked shortlist rather than discarded, since diagnosis on the
top choice sometimes fails and a team needs a documented next option.

## Output template

```markdown
# Target Behaviour Brief

**Program goal (as given):** <verbatim or lightly cleaned goal statement>

## Selected target behaviour
- **Who:** <actor — e.g. "first-time mothers in program clinics">
- **What:** <single observable action — e.g. "attend the 6-week postnatal check">
- **When:** <window — e.g. "within 6-8 weeks of delivery">
- **One-sentence behaviour statement:** <Who does What, by When — no "and">

## Why this one (APEASE + impact rationale)
<2-4 sentences on the scoring logic that put this above the alternatives>

## Candidate shortlist (ranked, not discarded)
1. <candidate behaviour> — <why it ranked below the selected one>
2. <candidate behaviour> — <why it ranked below the selected one>
3. <candidate behaviour> — <why it ranked below the selected one>

## Open questions / assumptions to check
<anything the definer had to guess at from limited program context>
```

## Known failure modes

- **Compound behaviours slip through.** "Attend antenatal care and adhere to
  iron supplementation" is two behaviours wearing a trench coat. If the
  output statement needs "and" to describe the action, split it before
  passing it downstream — this skill's job is exactly one behaviour per run.
- **Outcome dressed up as behaviour.** "Reduce anemia" is a health outcome,
  not something anyone *does*. If the selected behaviour isn't something a
  specific person could be observed doing at a specific moment, it hasn't
  actually been defined yet.
- **Selecting for measurability over impact.** The easiest behaviour to
  observe (e.g. app logins) is sometimes prioritized over the behaviour that
  actually drives the goal (e.g. offline saving). APEASE scoring should
  catch this, but only if impact is scored honestly rather than deferred to
  "whatever we can already measure."
- **No real alternatives generated.** If the candidate list is padded with
  strawmen so the preferred behaviour wins, the shortlist stops being useful
  as a fallback. Push for candidates that a reasonable person could have
  picked first.
- **Context collapse.** Run on a goal statement with no population or
  setting context, the output's "who" will be generic and the downstream
  diagnosis will inherit that vagueness. Push back to the user for at least
  a rough population and setting before finalizing.
