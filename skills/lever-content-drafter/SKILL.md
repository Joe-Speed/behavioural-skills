---
name: lever-content-drafter
title: Lever Content Drafter
description: >-
  Use when intervention-lever-selector has produced a lever brief whose
  selected lever names a concrete behaviour change technique, and a field
  team now needs the actual words — the message, script, signage, or
  interface copy that delivers it. Invoke it when someone asks "so what
  does the SMS / poster / agent script actually say?" Do not invoke on a
  bare intervention function with no named technique — route back to
  intervention-lever-selector first — and do not use it for
  values-affirmation exercises, which values-affirmation-drafter owns
  end to end.
category: intervention-design
stage: design
evidence_base:
  - framework: Behaviour Change Technique Taxonomy (v1) — technique definitions as fidelity anchor
    citation: >-
      Michie, S., Richardson, M., Johnston, M., et al. (2013). The
      Behavior Change Technique Taxonomy (v1) of 93 hierarchically
      clustered techniques. Annals of Behavioral Medicine, 46(1), 81-95.
  - framework: EAST framework for applying behavioural insights to delivery design
    citation: >-
      Service, O., Hallsworth, M., Halpern, D., et al. (2014). EAST: Four
      Simple Ways to Apply Behavioural Insights. The Behavioural Insights
      Team, London.
  - framework: Experimental pre-testing of health education materials
    citation: >-
      Whittingham, J. R. D., Ruiter, R. A. C., Castermans, D., Huiberts, A.,
      & Kok, G. (2008). Designing effective health education materials:
      experimental pre-testing of a theory-based brochure to increase
      knowledge. Health Education Research, 23(3), 414-426.
weird_context:
  status: mixed-evidence
  note: >-
    The BCTTv1's definitions are stated as mechanism descriptions and
    travel reasonably well, but EAST's worked examples are drawn almost
    entirely from UK government trials, and most message-design evidence
    (framing, salience, personalization effects) comes from WEIRD,
    high-literacy, high-SMS-penetration populations. Register, idiom,
    reading level, and channel norms are all local: a draft produced by
    this skill is working copy for local adaptation and pre-testing, never
    final copy — and final copy should be drafted natively in the delivery
    language by a local speaker, not translated from this skill's output.
inputs:
  - type: intervention_lever_brief
    description: >-
      The lever brief from intervention-lever-selector, with its Selected
      lever section naming a specific BCTTv1 technique. It is that named
      technique this skill drafts content for — a brief that stops at a
      function name ("Environmental restructuring") isn't ready for this
      skill yet.
    source: skill-output
    required: true
  - type: audience_context_brief
    description: >-
      The audience & context brief from context-and-audience-mapper, whose
      confirmed channels and decision moment determine the delivery format
      and timing. Optional — but without it the channel must be stated and
      confirmed by the user, not assumed, and the draft must flag the
      channel as unconfirmed.
    source: skill-output
    required: false
outputs:
  - type: intervention_content_draft
    description: >-
      Delivery-ready draft content — message text, script lines, signage,
      or interface copy — instantiating the lever brief's named technique,
      with a fidelity trace, delivery notes, an EAST check, and the
      comprehension pre-test required before launch.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Turns the selected lever's named behaviour change technique into the
literal draft content — message text, script lines, signage, or interface
copy — a field team would deliver, with every content element traced to
the technique's defined active ingredient.

## When to invoke it

- [intervention-lever-selector](../intervention-lever-selector) has
  produced a brief whose Selected lever names a concrete BCTTv1 technique,
  and the next question is "what do we actually say / show / print?"
- A field team is about to write intervention copy ad hoc — an SMS, a
  poster, an agent script — without checking that the copy actually
  delivers the technique the lever was selected for.
- Do **not** invoke on a lever brief that stops at a function name with no
  named BCT — that brief isn't finished; route back to
  intervention-lever-selector's output template, which requires one.
- Do **not** use it to draft a values-affirmation exercise —
  [values-affirmation-drafter](../values-affirmation-drafter) owns that
  protocol end to end, including its value-list adaptation and delivery
  cautions.
- Do **not** use it to choose between levers or techniques — that decision
  already happened upstream; this skill takes exactly one named technique.

## What it draws on

The BCTTv1 (Michie et al., 2013) defines each technique's active
ingredient — what must actually be present for the technique to be the
one delivered. That definition is this skill's fidelity anchor: a draft
instantiates a technique only if some concrete content element delivers
the defined ingredient. Copy that is merely persuasive, on-topic, and
well-written but contains no such element is a different (unselected,
undiagnosed) intervention wearing the selected one's name. The BCTTv1
defines techniques, not copy — the mapping from a definition to an actual
sentence, sign, or script line is this skill's own operationalization, and
the fidelity trace exists so that mapping is inspectable rather than
asserted.

EAST (Service et al., 2014) supplies the delivery-design checklist: Easy
(one action, low reading level, no ambiguity about what to do), Attractive
(salient at the moment of delivery), Social (only with a truthful, named
data source — an invented social norm is both unethical and a documented
backfire risk), Timely (delivered at the decision moment the audience &
context brief identified, not whenever the channel is convenient).

Pre-testing (Whittingham et al., 2008) is why the output ends with a
required pre-test rather than a launch recommendation: materials that
looked fine to their designers routinely fail comprehension checks with
the actual population, so the draft is a hypothesis until a named check
passes.

## Output template

The fidelity trace is mandatory: every content element either maps to a
part of the technique's BCTTv1 definition or gets cut (or explicitly
justified as delivery scaffolding, e.g. a greeting). A Social line in the
EAST check that makes a norm claim must name the data source that makes
it true.

```markdown
# Intervention Content Draft

**Technique being instantiated:** <BCT number + name, carried verbatim
from the lever brief's Selected lever, plus its BCTTv1 definition>
**Delivery channel:** <channel and format — from the audience & context
brief where available; otherwise state the assumed channel and flag it
UNCONFIRMED>
**Language note:** <what language the final copy must be drafted in, by
whom — this draft's language is working copy only if it differs>

## Draft content
<the literal copy: message text, script lines, sign wording, interface
strings — at the target population's reading level, one requested action>

## Fidelity trace
| Content element | Part of the technique's definition it delivers |
|---|---|
| "<quoted element>" | <the specific clause of the BCTTv1 definition> |
<elements that deliver nothing are decoration — cut or justify>

## Delivery notes
- **Sender/messenger:** <who the content appears to come from, and why
  that source is credible to this population>
- **Timing:** <when, relative to the decision moment>
- **Frequency ceiling:** <how many exposures before fatigue or reactance
  risk outweighs marginal effect>

## EAST check
- **Easy:** <the one action requested, and the reading-level check>
- **Attractive:** <what makes it salient at the delivery moment>
- **Social:** <the norm claim made, with the named data source that makes
  it true — or "no social-norm claim made", with why>
- **Timely:** <how delivery lands at the decision moment>

## Required pre-test before launch
<the specific comprehension/acceptability check, with n and a pass
criterion — e.g. "5-10 members of the target population, shown the draft
cold, restate the requested action in their own words; pass = all
restatements name the intended action">

## What this draft does not do
<explicit limits — e.g. content supports the environmental or structural
change, it does not substitute for it>
```

## Worked example

**Selected lever (from intervention-lever-selector):** BCTTv1 12.1
Restructuring the physical environment — a privacy partition and a marked
"quick deposit" position at the existing M-Pesa agent kiosk, so deposits
aren't visible to neighbouring stalls. *(Illustrative — continues the
running example from context-and-audience-mapper through
intervention-lever-selector; not a real design.)*

```markdown
# Intervention Content Draft

**Technique being instantiated:** BCTTv1 12.1 Restructuring the physical
environment — "change, or advise to change, the physical environment in
order to facilitate performance of the wanted behaviour or create
barriers to the unwanted behaviour."
**Delivery channel:** Physical signage at the in-market agent kiosk, plus
a one-line verbal script for the agent — per the audience & context
brief, the kiosk at closing time is the confirmed decision moment; no
SMS component, since visibility at the kiosk, not information, is the
barrier.
**Language note:** Working copy below is English. Final sign and script
must be drafted natively in Swahili by a local team member — drafted, not
translated — and the pre-test run on the Swahili version.

## Draft content
Sign, mounted at the partitioned position (working copy):
> **Quick deposit here** — behind the screen, no waiting.

Agent script, one line, said while gesturing to the position (working
copy):
> "Quick deposits this side — it's the fast lane."

## Fidelity trace
| Content element | Part of the technique's definition it delivers |
|---|---|
| "Quick deposit here — behind the screen" | Makes the restructured environment (the partitioned position) findable and usable — the physical change facilitates the wanted behaviour only if vendors know it exists and what it is for |
| "no waiting" / "it's the fast lane" | Frames the partitioned position as the fast option, so choosing privacy costs nothing socially — using it reads as saving time, not as hiding money |
| Agent gestures rather than announcing amounts | Keeps the deposit act itself out of neighbouring vendors' line of sight and hearing — the barrier mechanism the restructuring targets |

## Delivery notes
- **Sender/messenger:** The agent kiosk itself — vendors already trust it
  with transactions; no program branding, which would mark users of the
  position as "the program's people."
- **Timing:** Permanent signage; the script is used only when a vendor
  approaches with cash at closing time.
- **Frequency ceiling:** Not applicable to signage; agents should not
  call vendors over to the position — an agent hawking the fast lane
  recreates the attention the partition exists to remove.

## EAST check
- **Easy:** One action (use the marked position); sign is seven words.
- **Attractive:** "Quick" and "no waiting" are the salient benefit at a
  time-pressed closing hour.
- **Social:** No social-norm claim made — deliberately. The barrier is
  social visibility of depositing; copy that says "many vendors deposit
  here" would re-attach social attention to the exact act the partition
  hides.
- **Timely:** Present at the kiosk at closing time — the confirmed
  decision moment — rather than delivered earlier in the day by SMS.

## Required pre-test before launch
Show the Swahili sign cold to 5-10 vendors from the target markets who
haven't seen it before; each says in their own words what the marked
position is for. Pass = all name depositing (or a fast transaction)
without prompting; any reading of "that's where the program watches you
deposit" is a fail and the copy is redrafted.

## What this draft does not do
The sign and script support the partition — they do not substitute for
it. If market management refuses the physical partition (the lever
brief's open question), this content has nothing to instantiate and the
lever decision goes back to intervention-lever-selector's rejected
functions, not to stronger copywriting.
```

## Known failure modes

- **Technique-shaped decoration.** The copy is persuasive, on-brand, and
  never delivers the BCT's defined active ingredient. Tip-off: delete the
  technique's name from the top of the draft — if nothing about the copy
  now seems mismatched, the fidelity trace was asserted rather than real.
- **Researcher-register copy.** Drafting at the team's own reading level,
  idiom, or formality — or shipping a translation of the working copy
  instead of natively drafted local-language copy. The language note and
  pre-test exist to catch this, but only if the pre-test runs on the
  final-language version.
- **Default-channel assumption.** Writing an SMS because SMS is what
  behavioural-science examples use, when the audience & context brief
  names a different confirmed channel — or when no brief exists and the
  channel was never confirmed at all. An UNCONFIRMED channel flag that
  survives into launch is a failure of the process, not a formality.
- **Invented social proof.** An EAST Social line like "9 out of 10
  vendors already deposit daily" with no data source behind it. If the
  claim is false it's unethical; if it's merely unverified it risks a
  descriptive-norm backfire (normalizing the undesired behaviour, or
  collapsing trust when vendors compare notes). No named source, no norm
  claim.
- **Multiple techniques in one draft.** Folding a bonus technique into
  the copy ("while we're at it, add a commitment prompt") delivers an
  intervention nobody selected or diagnosed. One draft instantiates one
  named technique; a second technique means a second lever decision
  upstream.
- **Out of scope: no named technique.** A lever brief whose selected
  lever is still a bare function name has not finished
  intervention-lever-selector's own template — send it back rather than
  guessing which technique was meant.
