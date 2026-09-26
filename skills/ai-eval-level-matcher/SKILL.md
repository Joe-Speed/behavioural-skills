---
name: ai-eval-level-matcher
title: Choose Which AI Evaluations to Run Next
description: >-
  Use when a team with an AI product for a social cause must decide which
  evaluation to run next, especially when a funder wants proof of impact. It
  recommends which of four stages the product is ready for (the AI model,
  the product, user behaviour, real-world impact) and says whether a
  randomized controlled trial is still too early. To design the chosen
  evaluation, use "Design an Experiment in Evidential" or "Plan How You Will
  Measure Success".
category: measurement
stage: test
evidence_base:
  - framework: The Agency Fund AI Evaluation Playbook (four-level framework)
    citation: >-
      Wu, Z., On, R., Walsh, J., Korley, E., Madon, T., & Wong, L. (2025).
      AI Evaluation in the Social Sector: A Living Playbook. The Agency
      Fund. Living document, Apache-2.0.
    url: https://eval.playbook.org.ai/
  - framework: Four-level AI evaluation framework for the development sector
    citation: >-
      Chia, H. S., Carter, S., Abrol, F., Madon, T., On, R., Walsh, J., &
      Wu, Z. (2025). An AI Evaluation Framework for the Development
      Sector. The Agency Fund, Center for Global Development, and J-PAL.
    url: https://www.cgdev.org/blog/ai-evaluation-framework-for-the-development-sector
weird_context:
  status: likely-generalizes
  note: >-
    The framework was built for the development sector — its worked cases
    are education, health, and agriculture deployments in low- and
    middle-income countries, so its evidence base is unusually non-WEIRD
    for this catalogue. The caveats run the other way: the playbook is a
    2025 draft/living document, not a validated instrument, and IDinsight's
    2026 practitioner review found implementers treat the levels as an
    initial lens rather than a procedure — expect to exercise judgment at
    the boundaries, not to read decisions off a chart.
inputs:
  - type: ai_product_account
    description: >-
      The team's plain-language account of the product: what it does and
      for whom, the development outcome it targets, its maturity, what
      evaluation evidence already exists at each level, and the decision
      the team is trying to inform next. Honest gaps in — useful
      recommendation out; a flattering account produces a premature one.
    source: user
    required: true
  - type: user_funnel_map
    description: >-
      Optional staged funnel for this product, if user-funnel-builder has
      already run. When present, use its stages and metrics to judge
      whether Level 2 evidence actually exists ("engaging users as
      intended" becomes checkable against named stages instead of taken
      on the team's word).
    source: skill-output
    required: false
outputs:
  - type: ai_eval_level_recommendation
    description: >-
      Per level of the four-level framework: whether this product has
      earned that evaluation now, what evidence it would produce, why any
      premature level is premature, and the evaluability-early steps to
      take immediately regardless of which levels run.
authors:
  - Joe Speed
version: 0.1.1
---

## What it does

Recommends which evaluations an AI product is ready for, based on what it
has already shown. It uses The Agency Fund's four stages: the AI model, the
product, user behaviour, and real-world impact. For each stage it says
whether to run it now or why it is too early, and it lists what to set up
now so later evaluation is possible.

## When to invoke it

- A team is deciding where the next unit of evaluation effort goes and the
  candidates span very different costs — another benchmark run, an A/B
  test, a psychometric survey, a full RCT.
- A funder or board is requesting impact evidence and the team needs a
  defensible, framework-grounded account of what evidence the product's
  stage can support — the playbook's own recommendation is that funders
  "match evaluation requirements to the product's development stage,
  avoiding premature requests for impact evaluations."
- An AI product has strong engagement numbers and someone proposes jumping
  straight to an RCT with no Level 3 evidence that usage shifts what users
  think, feel, or do.
- Do **not** invoke to design the recommended evaluation — hand a Level
  2/3 recommendation to
  [evidential-experiment-designer](/behavioural-skills/skill?slug=evidential-experiment-designer) and
  a Level 3/4 measurement plan to
  [evaluation-design-scoper](/behavioural-skills/skill?slug=evaluation-design-scoper).
- Do **not** invoke for non-AI programs. The four levels assume there is a
  model whose behaviour needs evaluating separately from the product
  around it; for a non-AI intervention, start at
  [evaluation-design-scoper](/behavioural-skills/skill?slug=evaluation-design-scoper).

## What it draws on

The Agency Fund's playbook (Wu et al., 2025; announced jointly with CGD
and J-PAL in Chia et al., 2025) defines four incremental evaluation
levels, each with broadening scope: **Level 1 — model evaluation** ("Does
the AI model produce the desired responses?"), **Level 2 — product
evaluation** ("Does the product facilitate meaningful interactions?"),
**Level 3 — user evaluation** ("Does the product positively support
users' thoughts, feelings, and actions?"), and **Level 4 — impact
evaluation** ("Does the product improve development outcomes?"). The
framework's central discipline, which this skill operationalizes, is
stage-matching: Level 1 is cheap and continuous from day one; Level 2
requires a deployed product with real users; Level 3 requires Levels 1–2
to be working; Level 4 is warranted only when Levels 1–3 are strong, the
team is preparing to scale, and priors about the treatment effect are
confident. The playbook is explicit that a product still in early design,
with inconsistent usage or untested mechanism hypotheses, should run
Level 3 evaluations instead of an RCT.

Two further playbook commitments are carried into the output. First,
*evaluability early*: holdout groups, staged rollouts, version tagging,
and embedded randomization belong in the product's architecture before a
Level 4 evaluation is justified, so the option isn't foreclosed. Second,
*the social-sector bar*: in the tech sector evaluation typically stops at
Levels 1–2; here Levels 1–3 are necessary but not sufficient, so "no
level recommended" is never a valid output — the recommendation names
what to run now at whatever level fits.

Judgment call the source doesn't fully specify: the playbook gives gates
in qualitative terms ("Levels 1–3 are strong"). This skill requires each
gate judgment to cite the specific evidence in the `ai_product_account`
(or `user_funnel_map`) it rests on, so a disagreement about readiness is
a disagreement about named evidence, not adjectives.

## Output template

Every level gets a verdict — including levels already satisfied and
levels far out of reach — because a skipped row reads as an oversight
downstream. Verdicts are one of: **run now**, **continue/monitor**,
**premature**, **satisfied for this stage**.

```markdown
# AI Evaluation Level Recommendation

**Product:** <name + one-line description, carried from the account>
**Development outcome targeted:** <the Level 4 outcome>
**Decision this recommendation informs:** <what the team will do
differently depending on the answer>

## Level verdicts
| Level | Question | Verdict | Evidence the verdict rests on |
|---|---|---|---|
| 1 — Model | Does the model produce the desired responses? | <verdict> | <named evidence from the account, or "none supplied"> |
| 2 — Product | Does the product facilitate meaningful interactions? | <verdict> | <...> |
| 3 — User | Does it positively support users' thoughts, feelings, actions? | <verdict> | <...> |
| 4 — Impact | Does it improve the development outcome? | <verdict> | <...> |

## What to run now
<for each "run now" level: the concrete evaluation, the method family the
playbook prescribes at that level, and the evidence it will produce.
Point Level 2/3 experiments at evidential-experiment-designer and
outcome-measurement planning at evaluation-design-scoper.>

## Why the premature levels are premature
<per premature level: which gate fails, citing the account. This section
is what the team hands a funder asking for the skipped level.>

## Evaluability-early steps
<holdouts, staged rollout, version tagging, embedded randomization — the
steps to take now so higher levels stay possible later. Mandatory even
when Level 4 is far off.>

## What would change this recommendation
<the specific evidence that would move each "premature" to "run now">
```

## Worked example

**AI product account (user-supplied, condensed):** "MaizeMate is our
WhatsApp AI assistant answering agronomy questions for smallholder maize
farmers in western Kenya; the goal is better yields through timely
top-dressing. Piloted with ~1,400 farmers via two cooperatives. We
benchmarked answers against an agronomist-written test set last quarter
(88% rated acceptable); usage is spiky — many farmers ask one question
and never return. Our funder wants to discuss an RCT at the October
board meeting." *(Illustrative — not a real program.)*

```markdown
# AI Evaluation Level Recommendation

**Product:** MaizeMate — WhatsApp AI agronomy assistant for smallholder
maize farmers, western Kenya
**Development outcome targeted:** improved maize yields via timely
top-dressing fertilizer application
**Decision this recommendation informs:** whether to propose an RCT at
the October board meeting or a staged alternative

## Level verdicts
| Level | Question | Verdict | Evidence the verdict rests on |
|---|---|---|---|
| 1 — Model | Desired responses? | continue/monitor | 88% acceptable on an agronomist-written test set last quarter; no stress-test bucket reported, so safety behaviour unknown |
| 2 — Product | Meaningful interactions? | run now | account's own description: "many farmers ask one question and never return" — engagement is the weak link |
| 3 — User | Thoughts, feelings, actions? | premature | no evidence usage shifts fertilizer knowledge or intent; but cannot be read until Level 2 stabilizes |
| 4 — Impact | Yield improvement? | premature | fails all three of the playbook's gates: Levels 2–3 not strong, not preparing to scale, no confident effect priors |

## What to run now
Level 2: an engagement experiment on the one-question-drop-off (e.g.
proactive check-in variants) — design via evidential-experiment-designer.
Level 1, continuing: extend the test set with a stress-test bucket
(pesticide misuse, out-of-scope medical questions) before any scale-up.

## Why the premature levels are premature
Level 4: an RCT on yields now would measure the impact of a product most
enrolled farmers use once — a null would be uninterpretable (product
failure vs. idea failure), which is exactly the premature-RCT case the
framework warns funders against. Level 3: user-outcome measures are worth
building (see below) but can't carry weight while retention is this weak.

## Evaluability-early steps
Hold out one cooperative's next enrollment cohort from proactive-messaging
features; tag model + knowledge-base versions in every logged
conversation; randomize enrollment timing across the waitlist now so a
future Level 4 comparison group exists by design.

## What would change this recommendation
Level 3 → run now: 4-week retention stabilizing after the engagement
experiments. Level 4 → run now: strong Level 3 evidence that usage shifts
top-dressing knowledge and intent, plus a scale decision actually on the
table.
```

## Known failure modes

- **Rubber-stamping the pressure.** The account says the funder wants an
  RCT, and the recommendation obligingly finds Level 4 "earned." The gate
  evidence column is the tell: if the Level 4 row cites the funder's
  interest rather than Level 1–3 evidence, the matcher has answered the
  politics, not the framework.
- **Reading Level 2 off the team's adjectives.** "Engagement is strong"
  is a claim, not evidence. Without a `user_funnel_map` or named metrics
  in the account, the verdict must say what it's resting on — and
  "founder's impression" is a legitimate, flag-raising thing to write.
- **Treating levels as a ladder to climb once.** The playbook's levels
  are iterative — Level 1 monitoring continues at every later stage, and
  a product change resets Level 2 questions. A recommendation that reads
  "Level 1: done" has misread the framework.
- **Skipping evaluability-early because Level 4 is far off.** That
  section exists precisely for products far from an RCT; omitting it
  forecloses the option this framework is designed to keep open.
- **Out of scope: non-AI products.** For a program with no model in the
  loop, the level distinctions collapse and this skill's output is noise —
  use evaluation-design-scoper. Also out of scope: ruling on whether the
  product *should* scale; this skill sequences evidence, it does not make
  the scale decision.
