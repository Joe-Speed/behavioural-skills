---
name: evidential-experiment-designer
title: Evidential Experiment Designer
description: >-
  Use when a team has a specific change worth testing — a message
  variant, an onboarding tweak, a nudge cadence — and intends to run it
  as a rigorous rapid experiment in Evidential, the open-source
  experiment engine for nonprofits, but has not yet made the design
  decisions the tool will demand: experiment type, arms, randomization
  unit, metrics, power. Invoke it when a weak-link hypothesis or
  experiment idea is about to be "just shipped and eyeballed" instead of
  randomized. Do not invoke for a full-scale RCT with enumerator-managed
  arms — Evidential's own docs rule that out; scope it with
  evaluation-design-scoper and an independent evaluator — and do not
  invoke to generate the hypothesis itself; that is
  funnel-weak-link-diagnoser's job.
category: measurement
stage: test
evidence_base:
  - framework: Evidential experiment engine (documentation and design spec)
    citation: >-
      IDinsight & The Agency Fund (2025). Evidential: a free, open-source
      experiment engine built by and for nonprofits. Documentation and
      API design specification. Apache-2.0 (backend).
    url: https://docs.evidential.dev/
  - framework: >-
      The Agency Fund AI Evaluation Playbook — Repeatable Motion 04,
      running experiments with rigor and speed
    citation: >-
      Wu, Z., On, R., Walsh, J., Korley, E., Madon, T., & Wong, L. (2025).
      AI Evaluation in the Social Sector: A Living Playbook — Repeatable
      Motions. The Agency Fund.
    url: https://eval.playbook.org.ai/motions
weird_context:
  status: likely-generalizes
  note: >-
    Evidential was built for social-sector deployments — its early
    partners run programs in India and across Africa — so the tooling
    assumptions are already non-WEIRD-aware (WhatsApp delivery
    integration, preassigned designs for offline-ish populations). What
    it does assume is data infrastructure: a BigQuery/Postgres/Redshift
    warehouse with a clean participant table, and client-side capacity to
    deliver each arm's treatment. Where those are missing, the design
    brief this skill produces is a plan for later, not a launch config.
inputs:
  - type: experiment_intent_statement
    description: >-
      The team's plain-language statement of what they want to test: the
      change or variant, who it applies to, what they expect it to move,
      and the decision the result will inform.
    source: user
    required: true
  - type: funnel_weak_link_hypotheses
    description: >-
      Optional diagnosis from funnel-weak-link-diagnoser. When present,
      the experiment must test a named hypothesis from it — the primary
      metric is then the funnel transition that hypothesis predicts will
      move, not a metric chosen fresh.
    source: skill-output
    required: false
  - type: evaluation_design_brief
    description: >-
      Optional measurement plan from evaluation-design-scoper. When
      present, carry its locked primary outcome and minimum effect worth
      detecting into the metric section instead of inventing new ones —
      a rapid experiment that quietly redefines the program's locked
      outcome is the drift that skill exists to prevent.
    source: skill-output
    required: false
outputs:
  - type: experiment_configuration_brief
    description: >-
      A launch-ready experiment configuration: hypothesis, Evidential
      experiment type, randomization unit and arms, primary and guardrail
      metrics with detectable effect, power inputs, stopping rule,
      delivery integration plan, and analysis plan — plus the decision
      rule the result feeds.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Turns one testable hypothesis into a launch-ready Evidential experiment
configuration — experiment type, arms, randomization unit, eligibility
filters, metrics with a detectable effect, power inputs, stopping rule,
delivery integration — specified concretely enough to enter into the tool
without further design decisions.

## When to invoke it

- A change is about to be shipped to everyone at once "to see if it
  helps" when the population, delivery channel, and data warehouse would
  support randomizing it.
- [funnel-weak-link-diagnoser](../funnel-weak-link-diagnoser) has
  produced a surviving hypothesis whose cheapest honest test is an
  experiment.
- [ai-eval-level-matcher](../ai-eval-level-matcher) has recommended
  Level 2 or Level 3 evaluation and the team's experimentation stack is
  Evidential.
- A team is staring at Evidential's create-experiment form unsure what
  half the fields (strata, MDE, balance threshold) should contain — the
  decisions belong upstream of the form, which is where this skill sits.
- Do **not** invoke for a full-scale impact RCT. Evidential's docs are
  explicit: it is "not built for full-scale Randomized Control Trials"
  with enumerator-managed arms and full counterfactuals — that is Level 4
  territory for [evaluation-design-scoper](../evaluation-design-scoper)
  plus an independent evaluator.
- Do **not** invoke to find something to test. An experiment without a
  mechanism hypothesis produces a significant-or-not answer to a question
  nobody asked; run the diagnosis first.

## What it draws on

Evidential (IDinsight & The Agency Fund, 2025) — the experiment engine
named by the AI Evaluation Playbook's Motion 04 as the tooling that
"help[s] teams automate randomization, track real-time results, and
reduce analysis bottlenecks." The design brief mirrors the tool's actual
design spec, so every section lands on a real field rather than a vague
intention:

- **Experiment type** is Evidential's first fork: `freq_preassigned`
  (participants sampled from the warehouse and assigned up front, with
  stratified randomization and a pre-launch balance check),
  `freq_online` (arms assigned in real time as new participants appear —
  no stratification, no balance check), and the adaptive family
  (`mab_online`, `mab_online_dwh`, `cmab_online` — Thompson-sampling
  bandits that *optimize* allocation rather than estimate effects
  precisely). The skill's rule of thumb, from the tool's own structure:
  known finite population → preassigned; open enrollment → online;
  "find the best arm cheaply, precise effect size not needed" → bandit.
- **Arms** (2–20, optional weights summing to 100), the first arm being
  control; **eligibility filters** (`includes`/`excludes`/`between` on
  flagged participant fields); **randomization unit** — individual
  (`primary_key`) or cluster (`cluster_key` + desired cluster count,
  for treatments that spill over within groups); **strata** for
  preassigned designs.
- **Metrics**: each a flagged numeric/boolean warehouse field with
  either a relative `metric_pct_change` or absolute `metric_target` to
  detect; Evidential defaults power to 0.8, alpha to 0.05, and — if the
  team declines to choose — target effect to baseline × 0.1. This skill
  treats that last default as a red flag, not a convenience: the
  detectable effect must come from the program's decision threshold
  (the `evaluation_design_brief`'s minimum effect worth detecting, when
  one exists), echoing the same discipline evaluation-design-scoper
  enforces.
- **Analysis** is intent-to-treat OLS with strata and pre-treatment
  outcome values as controls; **delivery is the client's job** —
  Evidential has no feature flags, it returns assignments (CSV, REST, or
  webhook) and the program must map each `arm_name` to an actual
  treatment path (e.g. a WhatsApp journey). An experiment with no
  delivery mapping randomizes nobody into anything.
- **Close-out**: Evidential records a `decision` and an `impact` rating
  per experiment, doubling as the org's experiment registry — so the
  brief must state the decision rule *before* launch.

Judgment call the sources don't fully specify: guardrail metrics.
Evidential permits up to 150 metrics; this skill mandates exactly one
primary metric plus a small named set of guardrails (metrics that must
*not* degrade), because a many-primary experiment re-imports the
which-number-moved problem that pre-specification exists to kill.

## Output template

```markdown
# Experiment Configuration Brief

**Hypothesis under test:** <mechanism being tested, carried verbatim from
the weak-link hypothesis or intent — not "variant B is better">
**Decision rule:** <what the team will do on a positive, null, or
negative result — written before launch>

## Design
| Field | Value | Why |
|---|---|---|
| Experiment type | freq_preassigned / freq_online / mab_* | <population + goal rationale> |
| Randomization unit | individual (primary_key) / cluster (cluster_key) | <spillover reasoning> |
| Arms | <name + one-line description each; control first; weights if unequal> | |
| Eligibility filters | <field, relation, value — who is in> | |
| Strata | <fields, preassigned only> or n/a | |
| Start / end | <dates> | |

## Metrics
**Primary:** <one warehouse field — for a funnel-sourced hypothesis, the
transition it predicts will move> — detectable effect <pct_change or
target>, sourced from <program threshold / evaluation_design_brief>, not
the tool's baseline×0.1 default.
**Guardrails:** <named metrics that must not degrade, with direction>

## Power & stopping
<power (default 0.8), alpha (default 0.05), required n from the power
check vs available n; stopping rule: end_date / target_n / manual — and
the commitment not to peek-and-stop early on a p-value>

## Delivery integration
<how each arm becomes a real treatment: the arm_name → delivery-path
mapping, who builds it, and how assignment is fetched (CSV / REST
assignment endpoint / webhook). If this section is empty the experiment
does not exist.>

## Analysis plan
<ITT via Evidential's OLS with strata + pre-treatment controls; balance
check expectation for preassigned (or its absence for online, and the
small-sample imbalance risk that implies); who reads results and when>

## Data & ethics notes
<participant table + unique id; no PII in ids; consent/notification
posture for being experimented on, per org policy>
```

## Worked example

**Inputs (condensed):** MaizeMate's weak-link diagnosis (see
[funnel-weak-link-diagnoser](../funnel-weak-link-diagnoser)) — log
analysis supported H1: onboarded farmers type nothing; they don't know
what to ask. Intent: test a first-question example menu against the
open-ended prompt. *(Illustrative — continues the catalogue's running
example; not a real program.)*

```markdown
# Experiment Configuration Brief

**Hypothesis under test:** H1 — onboarded farmers don't engage because
the open "ask me anything" prompt gives no model of a good first
question; a localized example-question menu will raise
onboarding→engagement.
**Decision rule:** ≥8pp lift in week-1 engagement → menu becomes default
for all new farmers; null → H1 is weakened, escalate H3 (data cost) to a
delivery-model review; negative → keep open prompt, log in registry.

## Design
| Field | Value | Why |
|---|---|---|
| Experiment type | freq_online | open enrollment — new farmers appear daily; no fixed roster to preassign |
| Randomization unit | individual (farmer_wa_id) | menu is per-chat; no within-coop spillover expected for a UI prompt |
| Arms | control: open prompt / treatment: 4-item example menu (county-localized) | 50/50 |
| Eligibility filters | onboarding_complete includes true; enrollment_date between 2026-08-17 and 2026-10-12 | new onboarders only — existing users have already seen the open prompt |
| Strata | n/a (online experiments assign without stratification) | |
| Start / end | 2026-08-17 → 2026-10-12 | |

## Metrics
**Primary:** engaged_week1 (boolean: ≥1 substantive question within 7
days of onboarding) — detectable effect: +8pp on a 31% baseline, from
the decision rule above, not the default baseline×0.1 (which would be a
meaninglessly small 3.1pp for this decision).
**Guardrails:** setup_completion_rate (must not fall — a menu shown
mid-onboarding could add friction); guardrail_refusal_rate (must not
rise — menu items must not bait out-of-scope queries).

## Power & stopping
Power 0.8, alpha 0.05; power check against the participants table says
~1,100 farmers needed, ~8 weeks of enrollment at current recruitment
rates — hence the end date. Stopping: end_date; no early stopping on
interim p-values (online design has no balance check, so mid-stream
peeks are doubly untrustworthy at small n).

## Delivery integration
Product lead maps arm_name → WhatsApp flow: assignment fetched per
farmer at onboarding-complete via the per-participant assignment
endpoint; "menu" routes to the menu journey, "control" to the current
prompt. Webhook on commit notifies the backend to activate the mapping.

## Analysis plan
ITT on engaged_week1 via Evidential's OLS; no strata controls (online);
research lead reads the dashboard at end date, records decision + impact
in the registry. Small-sample caution: check arm sizes for drift weekly
since online assignment carries imbalance risk.

## Data & ethics notes
Participants table: farmers view, unique id farmer_wa_id (hashed —
raw phone numbers must not be the id). Message variants fall under the
program's existing service-improvement consent; no additional data
collected beyond standard logs.
```

## Known failure modes

- **Shipping the tool's default effect size.** Accepting baseline × 0.1
  because the field auto-filled. A detectable effect that no decision
  hangs on produces a study that is powered, significant, and useless —
  the same failure evaluation-design-scoper polices, re-imported through
  a form field.
- **Bandit envy.** Choosing a bandit because "adaptive sounds efficient"
  when the team needs a defensible effect estimate for a scale decision.
  Bandits allocate toward winners; they answer "which arm" cheaply, not
  "how much better, with what confidence."
- **The unmapped arm.** A committed experiment whose treatment arm no
  system actually delivers — Evidential returns assignments, nothing
  more, and a missing arm→journey mapping means both arms silently get
  control. The delivery section's "if empty, the experiment does not
  exist" line is load-bearing.
- **Individual randomization under spillover.** Randomizing farmers
  within cooperatives when the treatment travels by word of mouth —
  contamination shrinks the measured effect toward null. If the
  treatment is discussable, the unit is the cluster.
- **Metric sprawl.** Fifteen "primary-ish" metrics, one of which will
  clear p<0.05 by luck. One primary, named guardrails, everything else
  exploratory-and-labeled — or the registry entry is HARKing bait.
- **Peeking at online experiments.** Stopping a freq_online experiment
  the first week the dashboard shows a star — with no balance check and
  small interim n, that star is noise more often than signal.
- **Out of scope: no warehouse, no delivery capacity, or Level 4
  questions.** Without a queryable participant table (or for pure
  in-person delivery), and for cost-effectiveness-of-the-program
  questions, this brief can only document aspiration — route
  infrastructure gaps to the data team and impact questions to
  evaluation-design-scoper.
