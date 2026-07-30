---
name: intervention-lever-selector
title: Intervention Lever Selector
description: >-
  Use when comb-barrier-decomposer has produced barrier hypotheses AND
  fieldwork has since confirmed which specific hypothesis is actually
  holding the behaviour back — invoke on that one confirmed barrier, not on
  the full unconfirmed hypothesis set. Invoke when someone asks "given that
  this is the barrier, what could we actually do about it?" Do not invoke
  on hypotheses that haven't been field-tested yet — route back to
  comb-barrier-decomposer's diagnostic questions first, or this skill will
  design levers for a barrier that turns out not to be the real one.
category: intervention-design
stage: design
evidence_base:
  - framework: Behaviour Change Wheel intervention functions and COM-B linkage matrix
    citation: >-
      Michie, S., van Stralen, M. M., & West, R. (2011). The behaviour
      change wheel: A new method for characterising and designing
      behaviour change interventions. Implementation Science, 6, 42
      (see Table 2).
  - framework: Behaviour Change Technique Taxonomy (v1)
    citation: >-
      Michie, S., Richardson, M., Johnston, M., et al. (2013). The
      Behavior Change Technique Taxonomy (v1) of 93 hierarchically
      clustered techniques. Annals of Behavioral Medicine, 46(1), 81-95.
  - framework: APEASE criteria for intervention selection
    citation: >-
      Michie, S., Atkins, L., & West, R. (2014). The Behaviour Change Wheel:
      A Guide to Designing Interventions. Silverback Publishing, pp. 46-48.
weird_context:
  status: mixed-evidence
  note: >-
    The COM-B-to-function linkage matrix is presented as a mechanistic,
    theory-driven mapping rather than a cultural claim — which function
    could plausibly work follows from which COM-B component the barrier
    sits in, not from a population's cultural background. What is WEIRD-
    skewed is the Behaviour Change Technique Taxonomy's validation base and
    worked examples, which are drawn overwhelmingly from UK/US health-
    behaviour interventions — treat a selected function as portable and a
    specific BCT's assumed delivery mechanism (a clinic visit, a printed
    leaflet) as needing local adaptation.
inputs:
  - type: comb_barrier_hypotheses
    description: >-
      The barrier hypothesis set from comb-barrier-decomposer, with one
      specific hypothesis identified as confirmed by field diagnostic
      answers — state which one in the invocation. Running this on the
      full unconfirmed set produces levers for a barrier that may not be
      the real one.
    source: skill-output
    required: true
outputs:
  - type: intervention_lever_brief
    description: >-
      Candidate intervention functions for one confirmed COM-B barrier,
      derived from the Behaviour Change Wheel's published function-to-
      component linkage matrix rather than free-generated, each scored for
      feasibility and — for the top candidate — broken down into concrete
      behaviour change techniques.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Turns one confirmed COM-B barrier into candidate intervention functions
read off the Behaviour Change Wheel's published linkage matrix — not
free-brainstormed — scored for feasibility, with the winning function
broken down into concrete, implementable behaviour change techniques.

## When to invoke it

- Field diagnostic questions from [comb-barrier-decomposer](../comb-barrier-decomposer)
  have been answered and one hypothesis is confirmed as the actual barrier.
- Someone asks "given that this is the barrier, what could we actually do
  about it?" or is about to jump straight to an intervention idea ("let's
  send a text") without grounding it in the barrier's COM-B component.
- Do **not** invoke on the unconfirmed hypothesis list — a lever selected
  for the wrong barrier is a wasted pilot. Confirm the barrier in the
  field first.

## What it draws on

The Behaviour Change Wheel names nine intervention functions — Education,
Persuasion, Incentivisation, Coercion, Training, Restriction, Environmental
restructuring, Modelling, Enablement — and publishes a matrix (Michie, van
Stralen & West, 2011, Table 2) linking each COM-B sub-component to the
functions theoretically capable of changing it. That matrix must be
consulted directly for the confirmed barrier's specific sub-component —
reconstructing it from general impression or memory is exactly the kind of
plausible-but-wrong shortcut this skill exists to prevent; a barrier's
sub-component (e.g. Opportunity/Social) determines which functions are
even eligible before feasibility is considered at all. APEASE scoring
(reused from key-behaviour-definer, same criteria) narrows the eligible
functions to one selection. The Behaviour Change Technique Taxonomy exists
because a selected function ("Environmental restructuring") is not yet
implementable — it names a category of mechanism, not an action; the
output must name a specific BCT, or it hasn't actually specified a lever
yet.

## Output template

The confirmed barrier's COM-B sub-component and the applicable-functions
list are mandatory and must be traceable to the published matrix, not
invented. The selected lever must name a concrete BCT, not just a function
name.

```markdown
# Intervention Lever Brief

**Confirmed barrier:** <the one hypothesis from comb_barrier_hypotheses
that fieldwork confirmed, carried over verbatim, including which COM-B
sub-component it belongs to>

## Applicable intervention functions
<per the BCW's COM-B-to-function linkage matrix (Michie, van Stralen &
West, 2011, Table 2) for this specific sub-component — consult the source
directly rather than reconstructing it from memory>
- <function 1> — <why this function's mechanism matches this sub-component,
  per the matrix>
- <function 2> — <...>

## Feasibility scoring (APEASE)
| Function | A | P | E | A | S | E |
|---|---|---|---|---|---|---|
| <function 1> | <+/-/0: reason> | | | | | |
| <function 2> | ... | | | | | |

(Columns: Affordability, Practicability, Effectiveness, Acceptability,
Side-effects/safety, Equity.)

## Selected lever
**Function:** <top-scoring function> — <tie-breaker reasoning, pointing at
specific table cells>
**Concrete technique (BCTTv1):** <a specific, named technique, not a
restated function> — <how it would concretely apply to this barrier and
population>

## Rejected functions
<functions the matrix linked to this sub-component but that scored poorly
on feasibility, with why — kept as the next lever to try if the selected
one fails a pilot, not discarded>

## Open questions
<what needs field or pilot confirmation before the selected technique is
finalized>
```

## Worked example

**Confirmed barrier (from comb-barrier-decomposer):** "Opportunity/Social:
visible cash-counting/depositing at closing invites informal borrowing
requests from neighbouring vendors" — confirmed in the field as the
top-ranked hypothesis from the earlier diagnosis. *(Illustrative —
continues the running example from context-and-audience-mapper through
comb-barrier-decomposer; not a real design.)*

```markdown
# Intervention Lever Brief

**Confirmed barrier:** Opportunity/Social — visible cash-counting/
depositing at closing invites informal borrowing requests from
neighbouring vendors.

## Applicable intervention functions
Per the BCW's Opportunity/Social linkage (Michie, van Stralen & West,
2011, Table 2): Environmental restructuring, Modelling, and Enablement.
- Environmental restructuring — changing the physical/social environment
  so the deposit act itself isn't visible to neighbouring vendors.
- Modelling — a respected peer vendor visibly normalizing discreet deposit
  as routine, reducing the social salience of any one vendor doing it.
- Enablement — reducing the practical friction of depositing before others
  notice (e.g. a faster transaction path).

## Feasibility scoring (APEASE)
| Function | A | P | E | A | S | E |
|---|---|---|---|---|---|---|
| Environmental restructuring | +: low-cost, a screen/partition at the existing agent kiosk | +: no new behaviour to teach, works within current routine | +: directly removes the visibility mechanism named in the barrier | +: no reason vendors would object | 0 | 0 |
| Modelling | 0: no direct cost | -: requires sustained peer-influencer engagement to stand up | 0: plausible but slower and less directly tied to the mechanism | +: socially low-risk | 0 | 0 |
| Enablement (faster transaction path) | -: would require the mobile money provider to change queue/process | -: outside the program's control in the pilot window | 0 | 0 | 0 | 0 |

## Selected lever
**Function:** Environmental restructuring — wins on Practicability and
Effectiveness; it's the only function that acts on the visibility
mechanism directly rather than around it, and needs no external party's
cooperation to pilot.
**Concrete technique (BCTTv1):** 12.1 Restructuring the physical
environment — install a small privacy partition or a marked "quick
deposit" position at the existing M-Pesa agent kiosk inside each market,
so the deposit transaction is not directly visible to neighbouring stalls.

## Rejected functions
- Modelling — kept as the next lever to try if the partition pilot doesn't
  move the primary outcome; slower to stand up but doesn't require agent
  cooperation either.
- Enablement via a faster transaction path — rejected for this pilot since
  it requires a change from the mobile money provider outside the
  program's control; worth revisiting if a provider partnership develops.

## Open questions
Whether market management will permit a physical partition at the agent
kiosk — not yet confirmed with either market's vendor association.
```

## Known failure modes

- **Free-brainstormed levers.** Generating candidate levers from intuition
  instead of the published COM-B-to-function matrix defeats the entire
  point — the matrix exists because not every function is theoretically
  capable of changing every kind of barrier, and skipping it risks
  selecting one that can't work by construction.
- **Function without technique.** Stopping at a function name
  ("Environmental restructuring") without naming a specific BCT is not yet
  a lever — it's a category. Someone still has to decide what changes.
- **Feasibility blind spots.** Selecting a function that requires
  infrastructure, authority, or a partner's cooperation the implementer
  doesn't actually have, without that showing up as a negative
  Practicability score, produces a lever that looks selected but can't be
  piloted.
- **Running on an unconfirmed hypothesis.** Selecting levers for a barrier
  that diagnostic questions haven't actually confirmed risks designing
  for the wrong problem — the "confirmed barrier" input exists specifically
  to prevent this.
- **Function/technique conflation.** Treating "Environmental restructuring"
  and "install a partition" as interchangeable labels for the same thing
  loses the distinction the BCTTv1 exists to enforce — one is a category
  covering many possible techniques, the other is one specific instance.
