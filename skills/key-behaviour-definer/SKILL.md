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
  - type: evidence_scan_brief
    description: >-
      Optional prior evidence scan for this goal/population/context, if
      evidence-base-scoper has already run on the same input. When present,
      use it to ground candidate generation and the Effectiveness/Impact
      scoring columns in what's already known to work or not, rather than
      scoring from intuition alone.
    source: skill-output
    required: false
outputs:
  - type: target_behaviour_brief
    description: >-
      One measurable, observable target behaviour specified as who + what +
      when, plus a prioritized list of runner-up candidate behaviours with
      the reasoning for why the top choice won.
authors:
  - Nikhil Ravichandar
version: 0.2.0
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

Candidate generation must not stop at whatever channels or products the
input happens to name. The input's mentioned infrastructure (an existing
product, an existing course, a named delivery channel) describes what's
already built, not the boundary of what counts as a candidate behaviour —
at least one candidate must come from outside that named infrastructure, or
the shortlist is just ranking variants of the same idea.

If an `evidence_scan_brief` is available (from
[evidence-base-scoper](../evidence-base-scoper)), its "what's already been
tried" and "findings that don't support the goal" sections should visibly
change the Effectiveness and Impact scores in the table below — a
candidate the evidence base already shows underperforms shouldn't score the
same as one with no prior evidence either way.

## Output template

The scoring table is mandatory for every candidate, including the one
selected — a rationale paragraph is not a substitute for it. Score each
cell `+` (favors this candidate), `-` (counts against it), or `0`
(neutral/no clear effect), each with a one-clause reason; a column of bare
symbols with no reasons doesn't count as scored. At least one candidate row
must fall outside the infrastructure named in the input.

```markdown
# Target Behaviour Brief

**Program goal (as given):** <verbatim or lightly cleaned goal statement>

## Candidate scoring

| Candidate behaviour | A | P | E | A | S | E | Impact | Spillover |
|---|---|---|---|---|---|---|---|---|
| <candidate 1> | <+/-/0: reason> | <+/-/0: reason> | <+/-/0: reason> | <+/-/0: reason> | <+/-/0: reason> | <+/-/0: reason> | <+/-/0: reason> | <+/-/0: reason> |
| <candidate 2> | ... | | | | | | | |
| <candidate 3, from outside the named infrastructure> | ... | | | | | | | |

(Columns, in APEASE order: Affordability, Practicability, Effectiveness,
Acceptability, Side-effects/safety, Equity.)

## Selected target behaviour
- **Who:** <actor — e.g. "first-time mothers in program clinics">
- **What:** <single observable action — e.g. "attend the 6-week postnatal check">
- **When:** <window — e.g. "within 6-8 weeks of delivery">
- **One-sentence behaviour statement:** <Who does What, by When — no "and">

## Why this one
<2-4 sentences pointing at the specific table cells that decided it — not a
restatement of the table, the tie-breaker reasoning where candidates were
close>

## Candidate shortlist (ranked, not discarded)
1. <candidate behaviour> — <why it ranked below the selected one, tied to its row above>
2. <candidate behaviour> — <why it ranked below the selected one, tied to its row above>
3. <candidate behaviour> — <why it ranked below the selected one, tied to its row above>

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
  picked first. A scoring table filled in *after* the choice is already made
  looks identical to one that drove the choice — if every row conveniently
  favors the same candidate across all eight columns, that's a signal the
  scoring was reverse-engineered, not applied.
- **Anchoring on named infrastructure.** Restating the input's existing
  products/channels as the only candidates (e.g. "deposit into the savings
  product" vs. "open the app") isn't real alternative generation even if it
  produces three distinct rows — see "What it draws on" above.
- **Context collapse.** Run on a goal statement with no population or
  setting context, the output's "who" will be generic and the downstream
  diagnosis will inherit that vagueness. Push back to the user for at least
  a rough population and setting before finalizing.
