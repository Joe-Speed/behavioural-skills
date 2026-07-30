---
name: context-and-audience-mapper
title: Context & Audience Mapper
description: >-
  Use when a program goal names its target population only in the abstract
  identity terms a funder or stakeholder would use (e.g. "smallholder
  farmers", "gig workers", "first-time mothers") with no detail on the
  actual setting, decision moment, or channels already reaching them.
  Invoke alongside or just before key-behaviour-definer, on the same raw
  program goal statement, so the "who" in a target behaviour brief is a
  specific observed context rather than a restated label. Do not invoke
  once the population's decision moment and existing channels are already
  documented at that level of detail — re-running this on an
  already-mapped context just restates what's known.
category: context-mapping
stage: prepare
evidence_base:
  - framework: EAST framework — Easy, Attractive, Social, Timely
    citation: >-
      Service, O., Hallsworth, M., Halpern, D., Algate, F., Gallagher, R.,
      Nguyen, S., Ruda, S., & Sanders, M. (2014). EAST: Four Simple Ways to
      Apply Behavioural Insights. The Behavioural Insights Team.
  - framework: Contextual inquiry
    citation: >-
      Beyer, H., & Holtzblatt, K. (1997). Contextual Design: Defining
      Customer-Centered Systems. Morgan Kaufmann Publishers, Ch. 3.
  - framework: Context-specificity in behavioural design for development programs
    citation: >-
      Datta, S., & Mullainathan, S. (2014). Behavioral design: A new
      approach to development policy. Review of Income and Wealth, 60(1),
      7-35.
weird_context:
  status: mixed-evidence
  note: >-
    EAST was developed and validated primarily in UK public-sector
    contexts, and contextual inquiry as a method originated in Western
    commercial product design — but the technique this skill
    operationalizes (describe the actual decision moment and existing
    channels rather than working from a funder's abstract label) exists
    specifically as a check against assuming a WEIRD-default context.
    Treat the *discipline* as portable and the source literature's worked
    examples as needing local replacement, not extension.
inputs:
  - type: program_goal_statement
    description: >-
      The program or campaign goal as originally stated, plus whatever
      context is available on the target population and setting. The same
      raw input key-behaviour-definer and evidence-base-scoper take — this
      skill can run in parallel with either, not necessarily after them.
    source: user
    required: true
outputs:
  - type: audience_context_brief
    description: >-
      The target population operationalized as a specific, observable
      subgroup; the decision moment where the behaviour choice actually
      gets made; the channels already reaching this population today; and
      which of the input's assumptions default to WEIRD infrastructure
      without having been confirmed locally.
authors:
  - Joe Speed
version: 0.2.0
---

## What it does

Turns a program goal's abstract population label into a specific, observed
decision moment, an existing-channel list, and a named check for which of
the input's assumptions default to WEIRD infrastructure — before that
context gets assumed rather than checked.

## When to invoke it

- A program goal names its population only the way a funder or stakeholder
  would ("smallholder farmers", "gig workers", "first-time mothers") with
  no detail on where, when, or how the target behaviour choice actually
  gets made.
- Before [key-behaviour-definer](../key-behaviour-definer)'s "who" is
  written, or when an existing target behaviour brief's "who" still just
  restates the funder's language.
- Someone asks "who exactly are we talking about, and where does this
  decision actually happen for them?"
- Do **not** invoke once the decision moment and existing channels are
  already documented at this level of detail — this skill's job is done;
  hand the output straight to key-behaviour-definer instead of re-running
  it.

## What it draws on

EAST's "Timely" and "Easy" dimensions only mean something once the actual
physical and social moment the behaviour choice occurs in is known — not a
generic description of the audience's demographics. Contextual inquiry's
discipline of describing an environment as actually observed, rather than
as reported secondhand by a stakeholder who doesn't live in it, applies to
every section below, not just channels — the output template requires a
source (directly observed, reported by someone who lives it, or general
literature about the country/sector rather than this specific population)
for the decision moment and constraints, same as it already does for
channels. Datta & Mullainathan's account of behavioural design in
development programs is the basis for the mandatory WEIRD-default check —
and that check is not limited to infrastructure. The WEIRD framing's
"individualism" component means *who has decision authority* is itself a
common default: treating the named population as the autonomous
decision-maker, when a household or group actually holds that authority,
is as much a WEIRD default as assuming a bank account or a smartphone, and
the assumption check below must consider it explicitly, not just physical
infrastructure.

When the input only supports a broad, honest operationalization (a whole
state or region, not a named district or market), narrow to the most
specific subgroup the input actually supports and route the remaining
breadth to Open Questions — do not invent a specific place, clinic, or
market the input never named just to look more specific. A narrower-than-
warranted guess that turns out wrong is worse than an honestly-scoped
population with the gap named.

## Output template

The decision moment and existing-channel list are mandatory, not optional
colour — a brief with a generic "who" and no specific moment or channel
hasn't mapped anything yet. Every section that describes the population or
its context must state whether that description is directly observed,
reported by someone who lives it, or drawn from general literature about
the country/sector rather than this specific population — an unsourced
specific claim is indistinguishable from an invented one. The WEIRD-default
assumption check is mandatory even when the answer is "confirmed, no gap
found" — state that explicitly rather than omitting the section, and it
must consider decision-making authority, not only physical infrastructure.

```markdown
# Audience & Context Brief

**Program goal (as given):** <verbatim or lightly cleaned goal statement>

## Population, as named vs. as operationalized
- **As named in the input:** <the funder/stakeholder's label, verbatim>
- **Operationalized:** <the narrowest subgroup the input actually
  supports — e.g. "women aged 25-50 running fixed daily produce stalls in
  two named markets," not "smallholder farmers" generally. If the input
  only supports a broad operationalization, say so here and route the
  specific gap to Open Questions rather than naming a place, clinic, or
  market the input never mentioned.>

## Decision moment
- **Where/when the behaviour choice actually gets made:** <the specific
  physical and social moment — not a general time of day> — **Source:**
  <directly observed / reported by someone who lives it / general
  literature about this country or sector, not this specific population>
- **Who else is present or influential at that moment:** <...>

## Existing channels and touchpoints (real, not proposed)
- <channel/touchpoint already reaching this population today, with how
  you know it reaches them> — <reach/frequency, if known>
- <channel 2> — <...>

(A channel that would be convenient for a future intervention but doesn't
currently reach this population belongs to intervention design later, not
to this context map.)

## Environmental constraints at the decision moment
<physical, social, or economic constraints specific to that moment>

## WEIRD-default assumption check (mandatory — state "none found" explicitly if genuinely none)
- <assumption in the input that defaults to Western/formal/literate/
  connected infrastructure, OR to the named population being the
  autonomous decision-maker when a household/group may hold that
  authority instead> — **Confirmed locally?** <yes/no/unknown> —
  **What to check before relying on it:** <...>

## Open questions / what still needs field confirmation
<anything this brief had to infer from limited program context, flagged
for someone to actually go check rather than presented as settled>
```

## Worked example

**Program goal (as given):** "Increase long-term savings among informal-
sector market vendors in Nairobi so they have a buffer against income
shocks." *(Illustrative — not a real program or dataset.)*

```markdown
# Audience & Context Brief

**Program goal (as given):** Increase long-term savings among informal-
sector market vendors in Nairobi so they have a buffer against income
shocks.

## Population, as named vs. as operationalized
- **As named in the input:** "informal-sector market vendors in Nairobi"
- **Operationalized:** Women aged 25-50 running fixed (non-itinerant) daily
  produce and household-goods stalls in Nairobi's Gikomba and Toi markets —
  not itinerant hawkers, and not male-dominated stall categories in the
  same markets, where the daily cash-handling pattern differs.

## Decision moment
- **Where/when:** End-of-day cash count at the stall, cash still in hand,
  in the 15-30 minutes before closing up and travelling home. —
  **Source:** Reported by someone who lives it (one prior field visit to
  Gikomba), not independently confirmed for Toi.
- **Who else present/influential:** Neighbouring stallholders (visible
  cash-counting invites informal borrowing requests); often a
  spouse/family member waiting to receive the day's takings at home.

## Existing channels and touchpoints (real, not proposed)
- Weekly *chama* (rotating savings group) meetings — most vendors already
  belong to one.
- M-Pesa mobile money agent kiosk inside both markets — used daily for
  business transactions already.
- Monthly market vendor association meetings — lower attendance, but a
  standing forum.

## Environmental constraints at the decision moment
No secure overnight storage at the stall. Carrying the day's cash home
after dark is a physical safety risk vendors already actively manage
(e.g. leaving before full dark, splitting cash across pockets).

## WEIRD-default assumption check
- Assumption in input: none stated explicitly, but "savings" in the
  program goal implicitly suggests a bank-style individual account. —
  **Confirmed locally?** No. — **What to check:** Nearest bank branch is
  ~40 minutes away; M-Pesa mobile money access is near-universal in this
  group and should be the default savings channel considered, not a
  bank account.

## Open questions / what still needs field confirmation
Whether the "visible cash-counting invites borrowing requests" constraint
applies equally to Gikomba and Toi, or is more pronounced in one market —
based on one prior field visit to Gikomba only, not confirmed for Toi.
```

## Known failure modes

- **Restating the label.** Repeating "smallholder farmers" or "gig
  workers" verbatim as the operationalized population is not context — it's
  the same abstraction with a longer sentence around it.
- **Inventing channels.** Listing a channel that would be convenient for a
  future intervention (a WhatsApp group that doesn't exist yet) as if it
  already reaches this population conflates context-mapping with
  intervention design.
- **Single-anecdote context.** Treating one interview, one field visit, or
  one team member's assumption as if it characterizes the whole
  population's decision moment. Flag this as a gap in "Open questions"
  rather than presenting it as settled — see the worked example above.
- **Unflagged WEIRD defaults.** Assuming banking, literacy, or connectivity
  infrastructure that hasn't been confirmed for this specific population,
  and not naming it in the assumption check, silently imports a different
  context than the one actually being mapped.
- **Autonomy default.** Treating the named population as the individual,
  autonomous decision-maker for the target behaviour by default, when a
  household, spouse, or elder actually holds go/no-go authority, is a
  WEIRD default just as much as an infrastructure assumption — and the
  easiest one to miss, since it's not on any checklist of physical
  requirements.
- **Fabricated specificity.** Narrowing to a named district, clinic, or
  market that the input never mentioned, in order to satisfy the
  "operationalized" section's specificity bar, is worse than an honestly
  broad operationalization with the gap named in Open Questions — a wrong
  specific claim misleads with false confidence; a flagged gap doesn't.
- **Unsourced claims.** A decision-moment or constraint description with no
  stated source reads identically whether it came from direct observation
  or from general knowledge about the country or sector — the "Source"
  field exists so a reader can tell which, and weight it accordingly.
- **Confusing this with segmentation.** This skill characterizes one
  population's context in depth; it does not divide a population into
  multiple behaviourally distinct personas. If the real need is "which of
  several groups should we target," that's a different job — don't force
  this skill to do both.
