---
name: prior-intervention-post-mortem-reader
title: Prior Intervention Post-Mortem Reader
description: >-
  Use when a team has a documented account of an intervention they already
  tried and is about to decide whether to retry, adapt, or abandon the
  underlying idea based on that account, without having checked whether
  the outcome actually reflects the idea failing or the implementation
  failing. Invoke before evidence-base-scoper or key-behaviour-definer
  re-run on the same program goal, so the team's own history informs those
  rather than being silently repeated or silently ignored. Do not invoke
  without an actual documented record of what happened — a team's
  undocumented memory that "it didn't really work" is not enough raw
  material for this skill's structural checks.
category: risk-review
stage: prepare
evidence_base:
  - framework: Process evaluation of complex interventions (fidelity, dose, reach, context)
    citation: >-
      Moore, G. F., Audrey, S., Barker, M., et al. (2015). Process
      evaluation of complex interventions: Medical Research Council
      guidance. BMJ, 350, h1258.
  - framework: Implementation fidelity's effect on program outcomes
    citation: >-
      Durlak, J. A., & DuPre, E. P. (2008). Implementation matters: A
      review of research on the influence of implementation on program
      outcomes. American Journal of Community Psychology, 41(3-4),
      327-350.
weird_context:
  status: mixed-evidence
  note: >-
    The implementation-vs-idea-failure distinction is a general
    evaluation-methodology point, not a claim about any specific
    population — it applies to judging any program, anywhere. What is
    WEIRD-skewed is the MRC framework's own worked examples and evidence
    base, drawn overwhelmingly from UK health-service interventions;
    treat the four-dimension structure (fidelity/dose/reach/context) as
    portable and the specific thresholds or worked cases in the source
    literature as needing local judgment.
inputs:
  - type: prior_intervention_record
    description: >-
      The team's own raw account of what was planned, what they believe
      happened, and why they believe it succeeded or failed — given before
      this skill checks that belief against whatever data was actually
      collected.
    source: user
    required: true
outputs:
  - type: intervention_post_mortem_brief
    description: >-
      A structured retrospective distinguishing what was planned from what
      was actually implemented, classifying the outcome as an
      implementation failure or an idea failure (or stating that the data
      available cannot yet tell), and checking the team's causal story
      against what data was actually collected.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Turns a team's raw account of a prior intervention attempt into a
structured retrospective that separates what was planned from what was
actually implemented, classifies the outcome as an implementation failure
or an idea failure, and checks the team's own causal story against what
data was actually collected.

## When to invoke it

- A team has a documented account of a prior attempt and is about to
  decide to retry, adapt, or abandon the underlying idea based on that
  account alone.
- Before [evidence-base-scoper](../evidence-base-scoper) or
  [key-behaviour-definer](../key-behaviour-definer) re-run on the same
  program goal, so the team's own history is checked rather than silently
  repeated (retrying an approach that already failed for implementation
  reasons) or silently ignored (abandoning an idea that was never actually
  tested).
- Someone says "we tried this before and it didn't work" as if that
  settles whether the idea itself is bad.
- Do **not** invoke without an actual record of what happened — vague
  recollection with no documented fidelity, dose, reach, or outcome data
  gives this skill nothing to structure. Ask the team to write down what
  they actually remember first, even informally.

## What it draws on

The MRC's process evaluation framework treats fidelity (was it delivered
as designed), dose (how much of it actually reached people), reach (what
share of the intended population was exposed), and context (what changed
in the delivery environment) as the dimensions that separate "did we
actually do the thing" from "did the thing work" — a program can fail on
any of the first three while the underlying idea remains untested. Durlak
& DuPre's finding that implementation quality substantially moderates
outcomes is why "the idea failed" is never a conclusion this skill lets
stand without first checking those four dimensions; a null result with
thin fidelity/dose/reach data supports "cannot yet tell," not "the idea
doesn't work." The causal-claim check applies the same falsifiability
discipline [researcher-bias-self-audit](../researcher-bias-self-audit)
applies to fresh assumption statements — here, to a team's story about why
a past attempt succeeded or failed.

## Output template

The Planned-vs-Implemented section and the Implementation failure vs. idea
failure classification are both mandatory. "Cannot yet tell" is a
legitimate answer for the classification when fidelity/dose/reach data is
too thin to distinguish the two — forcing a firm classification onto weak
data is worse than naming the gap.

```markdown
# Intervention Post-Mortem Brief

**Prior intervention (as given):** <verbatim or lightly cleaned account>

## What was planned
<the intervention as originally designed — target behaviour, mechanism,
intended delivery>

## What was actually implemented
- **Fidelity:** <was it delivered as designed, or did the actual delivery
  diverge — and how>
- **Dose:** <how much of it actually reached people — frequency/intensity
  actually delivered vs. what was planned>
- **Reach:** <what share of the intended population was actually exposed
  to it>
- **Context:** <what changed in the delivery environment relative to what
  was assumed when it was designed>

## Outcome as observed
<what data was actually collected, with a confidence qualifier — a single
informal observation and a systematically tracked metric are not equally
strong evidence, state which this is>

## Causal claim check
- **Team's stated reason for the outcome:** <verbatim or closely
  paraphrased>
- **Does the collected data actually support this claim?** <yes / no /
  partially — name the specific data point that does or doesn't support it>
- **Alternative explanation the data doesn't rule out:** <...>

## Implementation failure vs. idea failure (mandatory classification)
<state which this looks like, given the fidelity/dose/reach/context
findings above, or state "cannot yet tell" explicitly if that data is too
thin to distinguish them>

## Factors to address before any retry
<descriptive, not a redesign — what this post-mortem surfaced as
unaddressed, for whoever designs the next attempt to work from>
```

## Worked example

**Prior intervention (as given):** "We ran a 3-month SMS reminder program
to improve adherence to a daily medication for enrolled patients. We sent
one reminder text per day at 8am. Adherence, measured by pharmacy refill
records, barely moved. Our take is that patients just don't care enough
about their health to act on a reminder." *(Illustrative — not a real
program or dataset.)*

```markdown
# Intervention Post-Mortem Brief

**Prior intervention (as given):** A 3-month SMS reminder program sending
one daily 8am text to improve medication adherence, measured via pharmacy
refill records; adherence barely moved, and the team's take is that
patients don't care enough to act on a reminder.

## What was planned
Daily 8am SMS reminder to each enrolled patient, intended to prompt the
same-day medication-taking behaviour, for 3 months.

## What was actually implemented
- **Fidelity:** Not fully as designed — the SMS gateway's delivery logs
  (once checked) show roughly 30% of messages failed silently on a subset
  of carriers, with no fallback or resend.
- **Dose:** For patients on affected carriers, effective dose was closer
  to 2 reminders/week than the planned 7 — a large gap between planned and
  actual exposure.
- **Reach:** All enrolled patients were nominally in scope, but the
  carrier issue meant reach to a *working* reminder was uneven and was not
  segmented or reported at the time.
- **Context:** No change reported in the delivery environment itself
  (clinic operations, patient population) during the 3 months.

## Outcome as observed
Pharmacy refill records (a systematically tracked administrative measure,
not a self-report) show adherence essentially flat — moderate-confidence
evidence on the outcome measure itself, but confounded by the fidelity gap
above, since the actual intervention delivered was substantially weaker
than the one being evaluated.

## Causal claim check
- **Team's stated reason for the outcome:** Patients don't care enough
  about their health to act on a reminder.
- **Does the collected data actually support this claim?** No direct
  support — no patient-level data on message receipt, engagement, or
  attitude was collected; the claim is an inference from the flat outcome
  alone, not from any data about patient motivation.
- **Alternative explanation the data doesn't rule out:** A substantial
  share of patients may never have reliably received the reminder at all,
  given the ~30% carrier-level delivery failure — motivation was never
  actually tested against a fully-delivered intervention.

## Implementation failure vs. idea failure
Cannot yet tell whether the reminder *idea* fails, but there is a
confirmed implementation failure (the carrier delivery gap) substantial
enough that the idea has not actually been fairly tested yet. The team's
causal claim about patient motivation is not supported by the data
collected.

## Factors to address before any retry
Confirm SMS delivery success at the individual-message level (not just
enrollment), across all patient carriers, before attributing any future
flat result to the reminder concept itself rather than to delivery
failure.
```

## Known failure modes

- **Implementation/idea conflation.** Concluding "the idea doesn't work"
  from an outcome that a fidelity/dose/reach check would show was never
  actually delivered as designed — the central failure mode this skill
  exists to prevent, and the worked example above is a direct illustration
  of it.
- **Unchecked causal story.** Accepting the team's stated reason for the
  outcome without checking it against what data was actually collected —
  a plausible-sounding story is not evidence, even when the team believes
  it sincerely.
- **One post-mortem, treated as universal.** Applying a single
  retrospective's conclusions to a future attempt in a materially
  different context (different population, delivery channel, timeframe)
  without re-checking whether the same factors apply.
- **Prescribing a redesign.** This skill surfaces what happened and why
  it's ambiguous or not; it does not design the next intervention. A
  post-mortem that jumps to "here's what we should build instead" has
  drifted into intervention design, a different skill's job.
- **Forced classification on thin data.** Picking "implementation failure"
  or "idea failure" when fidelity/dose/reach/context data is too sparse to
  actually distinguish them is less honest than stating "cannot yet tell"
  — a firm-sounding wrong classification is worse than an admitted gap.
