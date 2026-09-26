---
name: user-funnel-builder
title: Map the User Journey from First Contact to Outcome
description: >-
  Use when an AI or digital product aims at a real-world outcome, but nobody
  has written down the steps from a user's first contact to that outcome. It
  works backward from the outcome to set out each step, from reaching users
  to the final result, with the action that marks it, a metric, a target,
  and an owner. To explain drop-off at a step, use "Find Out Why Users Drop
  Out of Your Product".
category: measurement
stage: define
evidence_base:
  - framework: >-
      The Agency Fund AI Evaluation Playbook — Repeatable Motion 01,
      constructing a user funnel across evaluation levels
    citation: >-
      Wu, Z., On, R., Walsh, J., Korley, E., Madon, T., & Wong, L. (2025).
      AI Evaluation in the Social Sector: A Living Playbook — Repeatable
      Motions. The Agency Fund.
    url: https://eval.playbook.org.ai/motions
  - framework: AI4GD User Funnel and Metrics Playbook
    citation: >-
      On, R., & Madon, T. (2025). AI4GD User Funnel and Metrics Playbook.
      The Agency Fund, AI for Global Development accelerator. Companion
      playbook referenced from the AI Evaluation Playbook's Level 2
      chapter.
weird_context:
  status: likely-generalizes
  note: >-
    The funnel structure is accounting, not psychology — it carries no
    claims about behaviour, and the source playbooks were written for
    low- and middle-income-country deployments. What does not travel
    automatically is the instrumentation assumption: stage metrics
    presume telemetry (message logs, session events) that shared-phone
    use, intermittent connectivity, and channel switching (a user moving
    from WhatsApp to calling a hotline) all quietly break. Confirm each
    stage's confirming metric is observable for this population before
    trusting funnel numbers.
inputs:
  - type: ai_product_account
    description: >-
      The team's plain-language account of the product: what it does, for
      whom, the development outcome it targets, and how users currently
      find and use it. The funnel is worked backward from this account's
      stated outcome.
    source: user
    required: true
  - type: audience_context_brief
    description: >-
      Optional context brief, if context-and-audience-mapper has already
      run. When present, use its decision moment and existing-channels
      findings to ground the recruitment and onboarding stages in
      channels this population actually uses, rather than inventing them.
    source: skill-output
    required: false
outputs:
  - type: user_funnel_map
    description: >-
      A staged funnel worked backward from one development outcome —
      recruitment, onboarding, engagement, retention, proximal outcome,
      development outcome — with, per stage: the user action that counts
      as entering it, the confirming metric, a target value or transition
      rate, and a named owner.
authors:
  - Joe Speed
version: 0.1.1
---

## What it does

Works backward from one real-world outcome to a series of user steps:
reaching users, onboarding, regular use, retention, early results, and the
final outcome. For each step it defines the action that counts as reaching
it, the metric that confirms it, a target, and an owner.

## When to invoke it

- A team reports "engagement" as one aggregate number (total messages,
  DAU) with no account of where users are in the journey from first
  contact to outcome.
- A product's theory of change exists only as grant-proposal prose and
  needs to become, in the playbook's words, "a measurable, cost-aware
  program design tool" before metrics or experiments are built on it.
- [ai-eval-level-matcher](/behavioural-skills/skill?slug=ai-eval-level-matcher) needs to judge Level 2
  evidence and there are no named stages to judge it against.
- Metrics pipelines are about to be built (the playbook's Motion 02) and
  need to know which indicators matter per stage.
- Do **not** invoke to define one offline target behaviour for a non-digital
  program — that is [key-behaviour-definer](/behavioural-skills/skill?slug=key-behaviour-definer)'s
  job, and the funnel's proximal-outcome stage may in fact consume its
  output.
- Do **not** invoke to explain why an existing funnel leaks at a
  particular stage — hand the built funnel plus observed numbers to
  [funnel-weak-link-diagnoser](/behavioural-skills/skill?slug=funnel-weak-link-diagnoser).

## What it draws on

Repeatable Motion 01 of The Agency Fund's AI Evaluation Playbook (Wu et
al., 2025): construct a user funnel across evaluation levels by starting
from the targeted development outcome (Level 4) and working backward
through the proximal user outcome (Level 3) to retention, engagement,
onboarding, and recruitment (all Level 2), with model-quality monitoring
(Level 1) running underneath every stage. The motion's stated purpose is
carried directly into the output: it "transforms a generic theory of
change into a measurable, cost-aware program design tool." The per-stage
fields — what the program does, what the user must do to count as
entering the stage, the confirming metric, target values and transition
rates, and a directly responsible individual — follow the companion
AI4GD User Funnel and Metrics Playbook (On & Madon, 2025).

Two constraints this skill enforces that the source states but teams
skip. First, *entry is a user action, not a program action*: "we sent
10,000 SMS invitations" is program activity; "farmer sends a first
message" is a stage entry. Every stage's entry condition must be
something the user does. Second, *the proximal outcome is a real outcome,
not more engagement*: the stage before the development outcome must name
a change in the user's knowledge, decision, or behaviour that plausibly
mediates the outcome — if it's phrased as more usage, the funnel has no
Level 3 rung and cannot support user evaluation later.

Judgment call the sources don't fully specify: target transition rates at
first build are usually guesses. This skill requires them anyway — marked
`provisional` — because a funnel with no targets can't identify a weak
link (every stage looks fine when nothing is expected of it), and an
explicit guess invites correction where a blank invites nothing.

## Output template

All six stages are mandatory. If a stage genuinely doesn't apply (e.g. a
pre-enrolled population with no recruitment), write the stage row with
"not applicable" and the reason — a missing row and a checked non-stage
must look different downstream.

```markdown
# User Funnel Map

**Product:** <name + one line>
**Development outcome (Level 4):** <the outcome the funnel works backward
from — one outcome; a second outcome is a second funnel>
**Instrumentation reality check:** <where these metrics will come from,
and any stage whose metric is not currently observable>

## Stages
| # | Stage | User action that counts as entry | Confirming metric | Target (transition from previous stage) | Owner |
|---|---|---|---|---|---|
| 1 | Recruitment | <...> | <...> | <n or % — mark provisional if guessed> | <name/role> |
| 2 | Onboarding | <...> | <...> | <...> | <...> |
| 3 | Engagement | <...> | <...> | <...> | <...> |
| 4 | Retention | <...> | <...> | <...> | <...> |
| 5 | Proximal outcome (Level 3) | <a knowledge/decision/behaviour change, not more usage> | <...> | <...> | <...> |
| 6 | Development outcome (Level 4) | <...> | <...> | <...> | <...> |

## Level 1 monitoring underneath the funnel
<the model-quality indicators tracked continuously across all stages —
response quality, safety/guardrail hits — and where they're logged>

## Assumptions this funnel makes
<channel, telemetry, and population assumptions that, if wrong, break a
stage's metric — each phrased so it can be checked>
```

## Worked example

**AI product account (user-supplied, condensed):** "MaizeMate, our
WhatsApp AI agronomy assistant for smallholder maize farmers in western
Kenya — the goal is better yields through timely top-dressing. Farmers
hear about it from cooperative SMS blasts and local radio; they message
it questions and it answers from our agronomy knowledge base."
*(Illustrative — continues the catalogue's running example; not a real
program.)*

```markdown
# User Funnel Map

**Product:** MaizeMate — WhatsApp AI agronomy assistant
**Development outcome (Level 4):** improved maize yield via top-dressing
applied at the correct growth stage
**Instrumentation reality check:** stages 1–4 from WhatsApp message logs;
stage 5 requires an in-chat micro-survey that does not exist yet; stage 6
requires cooperative harvest records (access unconfirmed).

## Stages
| # | Stage | User action that counts as entry | Confirming metric | Target | Owner |
|---|---|---|---|---|---|
| 1 | Recruitment | Farmer sends any first message | new unique senders / week | 120/wk (provisional) | Outreach lead |
| 2 | Onboarding | Farmer completes the 3-question setup (county, crop stage, plot size) | setup completion rate | 70% of new senders | Product lead |
| 3 | Engagement | Farmer asks a substantive agronomy question | ≥1 substantive question / week | 60% of onboarded (provisional) | Product lead |
| 4 | Retention | Farmer returns in a later calendar week | 4-week return rate | 40% (provisional) | Product lead |
| 5 | Proximal outcome | Farmer correctly identifies their plot's top-dressing window | in-chat 2-item check, correct both | 50% of retained (provisional) | Research lead |
| 6 | Development outcome | Season yield on registered plot | coop harvest records, kg/acre vs county baseline | +10% (provisional, sponsor threshold unconfirmed) | Research lead |

## Level 1 monitoring underneath the funnel
Weekly golden-set pass rate on the current model + knowledge-base
version; guardrail-refusal log reviewed for pesticide-safety and
out-of-scope medical queries. Version tags on every conversation.

## Assumptions this funnel makes
- One WhatsApp number ≈ one farmer (shared handsets would inflate stage 1
  and corrupt stage 4) — check against cooperative rosters.
- Farmers will answer an in-chat quiz (stage 5 metric) at meaningful
  rates — unvalidated.
- Cooperatives will share plot-level harvest records — unconfirmed with
  either cooperative.
```

## Known failure modes

- **Program actions as stage entries.** "We broadcast on radio" in the
  recruitment row. Nothing about the user has happened yet; the funnel
  then measures the org's activity and reads healthy while no farmer
  moves. Every entry cell must contain a user's verb.
- **The engagement-shaped proximal outcome.** Stage 5 written as "farmer
  asks 3+ questions" — that's stage 3 again wearing a hat. If the
  proximal row names usage, the funnel cannot support Level 3 evaluation,
  which is most of why it's being built.
- **Metrics nobody can observe.** A tidy funnel whose stage 5–6 metrics
  require surveys or records that don't exist. The instrumentation
  reality-check line is mandatory precisely so an unobservable stage is a
  named gap, not a discovery during the first readout.
- **Two outcomes, one funnel.** "Yield and financial resilience" at stage
  6 forks every upstream target. One funnel per outcome; build the second
  separately if it's real.
- **Targets omitted as unknowable.** A funnel with blank targets can't
  flag a weak link. Guess, mark provisional, and let the first
  funnel_metric_readout correct it.
- **Out of scope: non-digital single behaviours.** A vaccination-uptake
  program with no product journey doesn't need six stages — it needs
  key-behaviour-definer and comb-barrier-decomposer. Forcing funnel
  structure onto it manufactures stages with no observable metrics.
