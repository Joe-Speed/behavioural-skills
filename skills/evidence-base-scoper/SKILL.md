---
name: evidence-base-scoper
title: Evidence Base Scoper
description: >-
  Use when a program goal has been named but no one has checked what
  evidence already exists for similar behaviours, populations, or
  interventions — before key-behaviour-definer or comb-barrier-decomposer
  run, so their framing is informed by prior work instead of starting cold.
  Invoke as early as possible, ideally alongside or just before
  key-behaviour-definer, on the same raw program goal statement. Do not
  invoke once a target behaviour is already defined and a diagnosis is
  underway — feed this skill's output into that process instead of
  re-running it mid-diagnosis.
category: evidence-scoping
stage: prepare
evidence_base:
  - framework: Rapid Evidence Assessment (REA) methodology
    citation: >-
      Grant, M. J., & Booth, A. (2009). A typology of reviews: an analysis
      of 14 review types and associated methodologies. Health Information
      & Libraries Journal, 26(2), 91-108.
  - framework: GRADE approach to rating evidence quality
    citation: >-
      Guyatt, G. H., Oxman, A. D., Vist, G. E., et al. (2008). GRADE: an
      emerging consensus on rating quality of evidence and strength of
      recommendations. BMJ, 336(7650), 924-926.
  - framework: Publication bias in evidence synthesis
    citation: >-
      Rothstein, H. R., Sutton, A. J., & Borenstein, M. (Eds.). (2005).
      Publication Bias in Meta-Analysis: Prevention, Assessment and
      Adjustments. John Wiley & Sons, Ch. 1.
weird_context:
  status: weird-only
  note: >-
    This skill's entire purpose is surfacing what's in the indexed,
    published literature — and that literature is itself overwhelmingly
    WEIRD (Western, Educated, Industrialized, Rich, Democratic) in its
    samples (Henrich, Heine, & Norenzayan, 2010, "The weirdest people in
    the world?", Behavioral and Brain Sciences, 33(2-3), 61-83). A "no
    evidence found" result from this skill means "no *published* evidence
    was found," not "this doesn't work here" — the output template forces
    this distinction into its own field rather than letting it stay
    implicit.
inputs:
  - type: program_goal_statement
    description: >-
      The program or campaign goal as originally stated, plus whatever
      context is available on the target population, setting, and known
      constraints. The same raw input key-behaviour-definer takes — this
      skill can run in parallel with it, not necessarily after it.
    source: user
    required: true
outputs:
  - type: evidence_scan_brief
    description: >-
      What's already been tried for this behaviour/population/context,
      what the effect sizes looked like where reported, where the evidence
      base is thin or contradictory, and which specific findings are
      WEIRD-skewed.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Surveys existing evidence for the behaviour, population, or context named
in a program goal, and produces a structured brief of what's already known
to work, not work, or remain untested — before anyone downstream defines a
target behaviour or diagnoses barriers from intuition alone.

## When to invoke it

- A program goal has just been stated and no one has checked whether
  similar interventions have already been tried, anywhere, for this
  behaviour or population.
- A team is about to define a target behaviour or generate barrier
  hypotheses based purely on internal assumptions, with no reference to
  external evidence.
- Someone asks "has this been done before?" or "what does the evidence
  actually say works here?"
- Do **not** invoke as a substitute for [key-behaviour-definer](../key-behaviour-definer)
  — this skill surveys what's known, it doesn't select a target behaviour.
  Run them on the same input, not one instead of the other.

## What it draws on

A Rapid Evidence Assessment (REA): a time-bounded, structured literature
scan rather than a full systematic review — the goal is a usable brief in
hours or days, not exhaustive coverage over months. GRADE-style thinking
governs how each finding is reported: name the effect (if any), the
population and setting it was measured in, and how confident that estimate
should be treated (a single small pilot and a multi-site RCT are not
equally trustworthy evidence, even if both point the same direction).
Publication-bias literature is why the output template has a mandatory
section for null and contradicting findings — a scan that only surfaces
supporting evidence is not reporting the evidence base, it's building a
case for a conclusion already reached.

## Output template

The "Findings that don't support the goal" and "WEIRD-skew flags" sections
are mandatory, not optional appendices — a brief with an empty first
section on a well-studied behaviour is more likely an incomplete search
than a genuinely one-sided evidence base.

```markdown
# Evidence Scan Brief

**Program goal (as given):** <verbatim or lightly cleaned goal statement>

## What's already been tried
- <intervention/approach 1> — <population/setting it was tried in> —
  <effect reported, with size/direction if available> — <confidence: e.g.
  single pilot / multiple studies / RCT / meta-analysis>
- <intervention/approach 2> — <...>

## Findings that don't support the goal (mandatory — state "none found in
the time available" explicitly if genuinely none, do not omit the section)
- <null result, contradicting result, or backfire effect> — <population/
  setting> — <what this implies for the current program>

## WEIRD-skew flags (mandatory — per finding above, not once for the whole brief)
- <finding> — <population/setting it was actually measured in, vs. the
  target population/setting named in the program goal> — <what specifically
  should be validated locally before trusting it as-is>

## Evidence gaps
<what's asked by the program goal that the available literature simply
doesn't address — a real gap, stated plainly, is more useful than a
stretched analogy to a loosely related study>

## Confidence in this scan
<how much time/how many sources this scan covered, and what a fuller
review would need to check that this one couldn't>
```

## Known failure modes

- **One-sided search.** Searching only for evidence that the named
  intervention or approach works, rather than for evidence on the
  behaviour/population generally, produces a brief that confirms rather
  than informs. If every finding points the same direction, check whether
  the search terms themselves were leading.
- **Analogy laundering.** Citing a study on a loosely related behaviour or
  a very different population as if it directly answers the program goal,
  without naming the gap in the "WEIRD-skew flags" or "Evidence gaps"
  section. A study on urban US college students' savings behaviour is not
  silently transferable to rural smallholder farmers — say so if that's
  the best evidence available.
- **Confidence collapse.** Treating a single small pilot and a replicated
  RCT as equally strong evidence because both get reported as "a study
  found..." The confidence/GRADE-style qualifier in each bullet exists
  specifically to prevent this.
- **Padding to look thorough.** Listing many superficially similar studies
  that all report the same underlying finding inflates the appearance of
  a rich evidence base without adding information. Fewer, more clearly
  characterized findings beat a long list of redundant ones.
- **Treating "no evidence found" as "doesn't work."** An REA is
  time-bounded and WEIRD-skewed by construction (see `weird_context`
  above) — absence of published evidence for this exact population is
  not evidence of absence. The "Evidence gaps" section exists to make that
  distinction explicit rather than letting a thin scan read as a null
  result.
