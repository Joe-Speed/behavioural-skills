---
name: evaluation-design-scoper
title: Evaluation Design Scoper
description: >-
  Use when a target behaviour has been defined and a plan to measure it is
  about to be assumed rather than actually specified — no named primary
  outcome, no comparison condition, no minimum detectable effect agreed
  before rollout. Invoke once key-behaviour-definer has produced a target
  behaviour brief, and again whenever comb-barrier-decomposer's hypotheses
  change what a mediating measure needs to capture. Do not invoke before a
  target behaviour is defined — there is nothing concrete yet to plan
  measurement for.
category: measurement
stage: test
evidence_base:
  - framework: Pre-analysis plans for field experiments
    citation: >-
      Olken, B. A. (2015). Promises and Perils of Pre-analysis Plans.
      Journal of Economic Perspectives, 29(3), 61-80.
  - framework: Statistical power and minimum detectable effect in impact evaluation
    citation: >-
      Duflo, E., Glennerster, R., & Kremer, M. (2007). Using Randomization
      in Development Economics Research: A Toolkit. In T. P. Schultz &
      J. Strauss (Eds.), Handbook of Development Economics, Vol. 4, Ch. 61.
weird_context:
  status: likely-generalizes
  note: >-
    The statistical methodology (power calculations, pre-registration
    against HARKing/p-hacking) is general-purpose and not culturally
    bound. What is not uniform is the data infrastructure the "Data source
    feasibility" section depends on — administrative records, mobile-money
    transaction logs, or survey infrastructure that would make a chosen
    primary outcome actually collectible vary enormously by setting, and
    this skill's output is only as good as that check is honest.
inputs:
  - type: target_behaviour_brief
    description: >-
      The single defined target behaviour (who + what + when) to design
      measurement for. Normally the output of key-behaviour-definer, but
      any equivalently specific behaviour statement works.
    source: skill-output
    required: true
  - type: comb_barrier_hypotheses
    description: >-
      Optional barrier diagnosis for this target behaviour, if
      comb-barrier-decomposer has already run. When present, use its
      hypotheses to name mediating measures that would let a specific
      diagnostic question actually be evaluated post-hoc, not just the
      headline outcome.
    source: skill-output
    required: false
  - type: intervention_lever_brief
    description: >-
      Optional candidate intervention levers for this target behaviour, if
      intervention-lever-selector has already run. When present, use its
      described rollout shape (e.g. phased vs. simultaneous, which group if
      any is held back) to determine the Comparison condition instead of
      assuming one; when absent, the Comparison condition section must
      state its assumption explicitly rather than treating an invented
      rollout design as given.
    source: skill-output
    required: false
outputs:
  - type: evaluation_design_brief
    description: >-
      A pre-registration-style plan for measuring one target behaviour:
      primary outcome metric, comparison condition, minimum detectable
      effect, data-source feasibility, and any mediating measures needed
      to evaluate a specific barrier hypothesis, locked in before data
      collection starts.
authors:
  - Joe Speed
version: 0.2.0
---

## What it does

Turns one defined target behaviour into a locked-in measurement plan —
primary outcome, comparison condition, minimum detectable effect, and a
data-feasibility check — before an intervention launches and before anyone
can quietly redefine "success" after seeing which number moved.

## When to invoke it

- A target behaviour brief exists and someone is about to design or launch
  an intervention with no named primary outcome, no comparison condition,
  and no agreement on what effect size would actually matter.
- [comb-barrier-decomposer](../comb-barrier-decomposer) has produced
  barrier hypotheses and the team needs to know what mediating measure
  would let those specific hypotheses be evaluated, not just whether the
  headline outcome moved.
- Someone asks "how will we actually know if this worked?" or "what
  counts as success here?"
- Do **not** invoke on a vague program goal — route it through
  [key-behaviour-definer](../key-behaviour-definer) first. There is no
  single behaviour yet to measure.

## What it draws on

Olken's account of pre-analysis plans: an evaluation's credibility depends
on locking in the primary outcome and the effect size that matters *before*
data collection, specifically so it can't be redefined afterward to match
whichever measure happened to move (HARKing). The output template's
mandatory pre-registration statement operationalizes this directly — it
exists to be checked against later, not just written once and forgotten.

Duflo, Glennerster & Kremer's toolkit is the basis for treating the
program's minimum effect worth detecting as a designed choice tied to what
it actually needs to see to be worth continuing, not a statistical-
convention default. Note what this section is *not*: "minimum detectable
effect" is also a term of art in power analysis (the smallest effect a
study is statistically powered to find, given sample size and baseline
variance) — that is a different, narrower calculation this skill does not
perform. This section is the program-value input such a power calculation
would need, not a substitute for one. If no sponsor-stated threshold is
available, say so explicitly and mark the number provisional in Open
Questions — inventing a plausible-sounding programmatic rationale to fill
the gap is exactly the failure mode this discipline exists to prevent.

Comparison condition depends on knowing the intervention's rollout shape
(phased vs. simultaneous, is anything held back) at least as much as the
mediating-measures section depends on `comb_barrier_hypotheses` — but only
the latter dependency was originally declared as an input. If an
`intervention_lever_brief` is available, use its described rollout to
ground the comparison condition; if not, state the assumed rollout
explicitly as unconfirmed rather than presenting an invented design as
given.

Data-source feasibility is checked explicitly because a plan that assumes a
measure exists — because similar programs report it — without confirming
it's actually collectible here, at the needed frequency, isn't a
measurement plan yet. A measure that is directly observing the right
construct can still be gamed or degraded in how it's *recorded* — e.g. an
incentive tied to a metric distorting how that metric gets reported — and
that risk belongs in this section too, distinct from having picked the
wrong construct in the first place.

## Output template

The primary outcome, comparison condition, and pre-registration statement
are mandatory — an evaluation brief that only lists metrics without a
comparison condition or a locked-in commitment is a wishlist, not a design.
If a `comb_barrier_hypotheses` input is available, at least one mediating
measure tied to one of its hypotheses is also mandatory; if it is not
available, say so explicitly in that section rather than omitting it —
an absent section and a checked absence look identical to a downstream
reader unless the latter is written out.

```markdown
# Evaluation Design Brief

**Target behaviour:** <who + what + when, carried over verbatim>

## Primary outcome metric
<the one measure that would make the team say "this worked" — must
observe the target behaviour itself, not a proxy adopted for convenience;
if a proxy is genuinely necessary, name the substitution explicitly and
say what gap it leaves. Separately, name any risk that the *recording* of
this measure (not the construct itself) could be gamed or degraded — e.g.
an incentive tied to the same number distorting how it gets reported.>

## Comparison condition
<what "no effect" looks like — a control group, a randomized waitlist, or
a named historical baseline; "pre/post on the same group only" is not a
comparison condition, state plainly if that's the fallback and why. If an
`intervention_lever_brief` names the rollout shape, ground this in that;
if not, state the assumed rollout explicitly as unconfirmed rather than
presenting an invented design as settled.>

## Minimum effect worth detecting
<the smallest effect size worth caring about, tied to what the program
needs to see to justify continuing — not a statistical power calculation,
and not a default pulled from convention. If no sponsor-stated threshold is
available, say so explicitly here and mark the number provisional in Open
Questions, rather than manufacturing a programmatic rationale to fill the
gap.>

## Data source feasibility
<where the primary outcome's data will actually come from, whether it
exists today at the frequency needed, and who would need to grant access —
"assumed available" is not a feasibility check>

## Mediating measures
<mandatory if `comb_barrier_hypotheses` is available — one row per
hypothesis, each with a measure distinct from the primary outcome that
would let that specific hypothesis be evaluated post-hoc. If no barrier
diagnosis is available for this target behaviour, write that explicitly
("Not applicable — no comb_barrier_hypotheses input for this run") rather
than leaving the section out.>

## Pre-registration statement
<one locked-in sentence naming the primary outcome and the minimum effect
worth detecting, dated, so neither can be quietly redefined after seeing
results>

## Open questions
<anything this brief had to assume about data access, rollout design, or
the decision threshold that needs confirming before the plan is final>
```

## Worked example

**Target behaviour (from key-behaviour-definer):** "Female stall vendors
in Nairobi's Gikomba and Toi markets deposit that day's net cash surplus
into an M-Pesa savings wallet before leaving the market, each trading
day." *(Illustrative — continues the running example from
context-and-audience-mapper and key-behaviour-definer; not a real
program.)*

```markdown
# Evaluation Design Brief

**Target behaviour:** Female stall vendors in Gikomba/Toi markets deposit
that day's net cash surplus into an M-Pesa savings wallet before leaving
the market, each trading day.

## Primary outcome metric
Share of enrolled vendors' trading days with at least one same-day M-Pesa
savings-wallet deposit, measured via transaction logs — not self-reported
saving, which the evidence base flags as unreliable for this population.

## Comparison condition
Randomized waitlist: vendors enrolled in month 2 serve as the comparison
group for vendors enrolled in month 1, rather than pre/post on one group
alone (market-wide seasonal income shocks would otherwise be
indistinguishable from a program effect).

## Minimum detectable effect
A 10-percentage-point increase in the share of trading days with a
deposit, the threshold the program sponsor has said would justify scaling
past the pilot markets.

## Data source feasibility
M-Pesa transaction logs are technically available via the mobile money
provider's API with vendor consent, at daily frequency — confirmed
feasible. Household-level savings totals are not independently
verifiable and are explicitly out of scope for the primary outcome.

## Mediating measures
- Motivation/reflective hypothesis ("doesn't trust mobile savings vs.
  cash") — a 3-item trust-in-mobile-savings survey scale, administered
  pre-enrollment and at 8 weeks.
- Opportunity/social hypothesis ("visible saving invites borrowing
  requests") — self-reported frequency of borrowing requests at the
  stall, weekly, for the enrolled group only.

## Pre-registration statement
As of 2026-07-30, the primary outcome is locked as share of trading days
with an M-Pesa savings deposit, with a minimum detectable effect of 10
percentage points; this will not be substituted for a different metric
after results are observed.

## Open questions
Whether the mobile money provider's consent process can realistically be
completed within the market's normal working hours — not yet confirmed
with the provider.
```

## Known failure modes

- **Proxy substitution.** Swapping the primary outcome for whatever's
  easiest to measure (app opens instead of an actual deposit) without
  naming the substitution and the gap it leaves is the single most common
  way an evaluation brief looks rigorous but measures the wrong thing.
- **No named comparison condition.** "We'll check before and after" is not
  a comparison condition — anything else that changed over the same period
  (season, prices, a different program) becomes indistinguishable from the
  intervention's effect.
- **Default minimum detectable effect.** Powering a study for whatever
  effect size a stats template defaults to, rather than the effect size
  the program actually needs to see to be worth continuing, produces a
  technically valid but practically meaningless power calculation.
- **Assumed data feasibility.** Naming a measure because comparable
  programs report it, without confirming it's actually collectible for
  this program, at this frequency, with this population's consent — the
  "Data source feasibility" section exists specifically to force this
  check before it becomes a mid-study surprise.
- **Retroactive outcome redefinition.** Changing which metric counts as
  "the" primary outcome after seeing which one moved is the exact failure
  the mandatory, dated pre-registration statement exists to make visible
  when it happens.
