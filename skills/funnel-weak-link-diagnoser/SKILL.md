---
name: funnel-weak-link-diagnoser
title: Funnel Weak-Link Diagnoser
description: >-
  Use when a user funnel exists, its metrics show where users drop off,
  and the team is about to jump from "the number is bad" straight to a
  redesign without ever stating why users fall out there. Invoke it when
  a funnel readout shows a stage transition far below target and the
  proposed fixes are solutions in search of a diagnosis. Do not invoke
  without observed funnel numbers — build the funnel first with
  user-funnel-builder — and do not invoke to diagnose barriers to an
  offline behaviour outside a product journey; that is
  comb-barrier-decomposer.
category: diagnosis
stage: diagnose
evidence_base:
  - framework: >-
      The Agency Fund AI Evaluation Playbook — Repeatable Motion 03,
      diagnosing weak links via targeted hypotheses
    citation: >-
      Wu, Z., On, R., Walsh, J., Korley, E., Madon, T., & Wong, L. (2025).
      AI Evaluation in the Social Sector: A Living Playbook — Repeatable
      Motions. The Agency Fund.
    url: https://eval.playbook.org.ai/motions
  - framework: COM-B model of behaviour
    citation: >-
      Michie, S., van Stralen, M. M., & West, R. (2011). The behaviour
      change wheel: A new method for characterising and designing
      behaviour change interventions. Implementation Science, 6, 42.
    url: https://doi.org/10.1186/1748-5908-6-42
weird_context:
  status: likely-generalizes
  note: >-
    The diagnostic move — competing mechanism hypotheses with
    discriminating tests, instead of a redesign reflex — is
    method, not culture, and the source playbook's cases are LMIC
    deployments. The hypothesis space is where WEIRD defaults creep in:
    explanations drawn from app-market intuitions (notification fatigue,
    UX friction) crowd out explanations that dominate in other contexts —
    airtime and data cost, shared handsets, channel trust, literacy and
    language mismatch. The output template's requirement that at least one
    hypothesis be non-psychological exists for this reason.
inputs:
  - type: user_funnel_map
    description: >-
      The staged funnel this diagnosis runs against — normally
      user-funnel-builder's output. Stage names, entry actions, and
      targets are what make a drop-off identifiable at all.
    source: skill-output
    required: true
  - type: funnel_metric_readout
    description: >-
      The team's actual observed numbers for this funnel: measured value
      or transition rate per stage over a stated window, plus known
      data-quality caveats. The diagnosis targets the largest
      target-vs-observed gap, not the stage the team already wants to
      redesign.
    source: user
    required: true
outputs:
  - type: funnel_weak_link_hypotheses
    description: >-
      For the funnel's weakest link: competing, testable mechanism
      hypotheses for why users fall out at that stage, each paired with
      the measurement or experiment that would discriminate it from the
      others — not a redesign proposal.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Locates the weakest stage transition in an observed user funnel, then
turns "users drop off there" into competing, testable mechanism
hypotheses — each paired with the measurement or experiment that would
discriminate it from the others.

## When to invoke it

- A funnel readout shows a stage far below target and the next team
  meeting's agenda is a redesign, a new feature, or "more onboarding
  messages" — a fix chosen before any mechanism was named.
- The team can say *where* users leave (the numbers say so) but answers
  *why* differently depending on who's asked.
- An engagement experiment is being planned and needs a hypothesis worth
  the sample — this skill's output is
  [evidential-experiment-designer](../evidential-experiment-designer)'s
  natural input.
- Do **not** invoke without observed numbers. A funnel with only targets
  has no weak link yet — run the product, collect a
  `funnel_metric_readout`, or build the funnel first with
  [user-funnel-builder](../user-funnel-builder).
- Do **not** invoke for behaviours outside a product journey (clinic
  attendance, savings deposits in cash). That diagnosis belongs to
  [comb-barrier-decomposer](../comb-barrier-decomposer); this skill's
  stage-transition framing assumes telemetry-visible steps.

## What it draws on

Repeatable Motion 03 of The Agency Fund's AI Evaluation Playbook (Wu et
al., 2025): use funnel drop-off data to generate "specific, testable
hypotheses" about mechanism — the playbook's own examples are "Is the
value proposition unclear? Are users overwhelmed? Do they mistrust the
AI?" — each becoming "a lens for a focused measurement or experiment."
The motion sits, in the playbook's words, at the intersection of product
management and behavioural science, and its discipline is the same one a
clinician applies: no treatment before a differential diagnosis, and a
differential means *more than one* candidate mechanism held open at once.

COM-B (Michie et al., 2011) supplies the completeness check on the
hypothesis space, a judgment call the playbook itself doesn't specify.
Each candidate mechanism is tagged by whether it locates the failure in
**capability** (the user can't — literacy, language, digital skill),
**opportunity** (the context won't let them — cost, connectivity, device
access, social permission), or **motivation** (they don't want to —
unclear value, mistrust, effort not worth it). The tags exist to expose
lopsidedness: a hypothesis list that is all motivation is usually a team
projecting its own product anxieties, and the template requires at least
one opportunity-side (structural, non-psychological) hypothesis for this
reason.

Second judgment call: this skill diagnoses the *largest unexplained gap*,
not the stage the team is most excited to fix. If the readout's
data-quality caveats can explain the gap (an instrumentation change
mid-window), the honest output says so and diagnoses the next-largest
real gap instead.

## Output template

Two to four hypotheses. One is not a differential; five means nothing
gets tested. Each must be falsifiable by the test in its own row.

```markdown
# Funnel Weak-Link Hypotheses

**Funnel:** <product + funnel name>
**Readout window:** <dates the numbers cover>
**Weakest link:** <stage N → N+1: observed X% vs target Y%>
**Gaps set aside:** <other below-target transitions and why they wait —
including any gap plausibly explained by a data-quality caveat rather
than by users>

## Competing hypotheses
| # | Mechanism (why users fall out here) | COM-B locus | What would discriminate it | Cheapest honest test |
|---|---|---|---|---|
| H1 | <one mechanism, stated so it can be wrong> | capability / opportunity / motivation | <the observation that separates this from H2/H3> | <measurement or experiment, with the discriminating signal named> |
| H2 | <...> | <...> | <...> | <...> |

<at least one hypothesis must locate the failure outside users' heads —
cost, access, device, timing — before any motivational story is accepted>

## What this diagnosis is not
One sentence: no redesign is proposed here; fixes come after a hypothesis
survives its test — via the experiment path
(evidential-experiment-designer) or intervention design
(intervention-lever-selector) as appropriate.
```

## Worked example

**Inputs (condensed):** MaizeMate's funnel map (see
[user-funnel-builder](../user-funnel-builder)) and a readout for 6 weeks
of pilot: recruitment 138/wk (target 120), onboarding 74% (target 70%),
engagement 31% (target 60%), 4-week retention 22% of the engaged (target
40%). Caveat noted: the onboarding flow was shortened in week 3.
*(Illustrative — continues the catalogue's running example; not a real
program.)*

```markdown
# Funnel Weak-Link Hypotheses

**Funnel:** MaizeMate WhatsApp assistant — yield funnel
**Readout window:** 2026-06-22 to 2026-08-02
**Weakest link:** onboarding → engagement: 31% observed vs 60% target
(retention is also below target but is downstream of this break)
**Gaps set aside:** retention (22% vs 40%) — deferred until the
engagement break is understood, since the retained base is currently the
31% who engaged at all. The week-3 onboarding change does not explain the
engagement gap: the rate is flat across cohorts before and after.

## Competing hypotheses
| # | Mechanism | COM-B locus | What would discriminate it | Cheapest honest test |
|---|---|---|---|---|
| H1 | Farmers complete setup, then don't know what to ask — the open "ask me anything" prompt gives no model of a good first question | capability | H1 predicts drop-off concentrates on farmers who never send any draft text; H2 predicts sent-but-unanswered attempts | Log analysis: do non-engagers type nothing, or type and abandon? Then A/B a first-question example menu vs the open prompt |
| H2 | Answers to first questions arrive too slowly or read as generic, so the second question never comes | motivation | Response latency and first-answer length/specificity for engagers vs one-question leavers | Compare first-session transcripts; if separated, A/B a personalized first answer (uses the setup's county + crop stage) vs current |
| H3 | Data cost: farmers onboard on free cooperative Wi-Fi at enrollment events, then face airtime costs for substantive chat from home | opportunity | H3 predicts drop-off concentrates among farmers onboarded at events vs self-onboarded; engagement clusters near market-day Wi-Fi | Cross-tab engagement by enrollment source; 10 farmer calls asking about data spend |

## What this diagnosis is not
No redesign is proposed here. H1/H2 winners go to
evidential-experiment-designer as experiment intents; an H3 win is a
delivery-model problem no message experiment fixes.
```

## Known failure modes

- **The single-hypothesis diagnosis.** One mechanism, stated
  confidently, with a test designed to confirm it. The differential is
  the method; if only one story was ever on the table, this skill ran as
  decoration for a decision already made.
- **All-motivation hypothesis lists.** Every mechanism about desire and
  trust, none about cost, access, or capability — the classic WEIRD
  default, and why the template forces one structural hypothesis. Wrong
  locus means the winning "fix" gets A/B-tested against a barrier no
  message can move.
- **Diagnosing the pet stage.** The team wants to rebuild onboarding, so
  onboarding gets diagnosed — while the numbers say the break is
  elsewhere. The weakest-link line must cite the readout's largest
  target-vs-observed gap or explicitly justify departing from it.
- **Mechanism-shaped restatements.** "Users drop off because they don't
  engage" — a tautology wearing a hypothesis costume. The test: does the
  mechanism column say something the metric didn't already say?
- **Ignoring the readout's caveats.** Diagnosing a gap manufactured by an
  instrumentation change. The gaps-set-aside line exists to force this
  check before farmers get theorized about.
- **Out of scope: no numbers, or no journey.** Without a readout there is
  no weak link to find (build and instrument the funnel first); without a
  product journey the stage framing itself is wrong — use
  comb-barrier-decomposer.
