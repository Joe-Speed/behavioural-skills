---
name: values-affirmation-drafter
title: Values-Affirmation Drafter
description: >-
  Use when an intervention needs to buffer a specific population against a
  named evaluative or stigmatized concern (financial shame, academic
  underperformance, a health stigma) before or around the moment they would
  otherwise feel judged or defensive, and no values-affirmation exercise
  has been drafted yet. Invoke once the target population and the specific
  threat domain are named, not just "make people feel better." Do not
  invoke as a way to address a structural or material barrier (lack of
  money, lack of access, lack of time) — a values-affirmation exercise
  buffers the psychological response to a threat, it does not remove the
  threat's underlying cause.
category: intervention-design
stage: design
evidence_base:
  - framework: Self-affirmation theory and applied self-affirmation interventions
    citation: >-
      Cohen, G. L., & Sherman, D. K. (2014). The psychology of change:
      Self-affirmation and social psychological intervention. Annual
      Review of Psychology, 65, 333-371.
  - framework: Self-affirmation theory (mechanism)
    citation: >-
      Sherman, D. K., & Cohen, G. L. (2006). The psychology of
      self-defense: Self-affirmation theory. Advances in Experimental
      Social Psychology, 38, 183-242.
  - framework: Documented heterogeneity in self-affirmation effects
    citation: >-
      Hanselman, P., Sinclair, K. R., & Borman, G. D. (2017). New evidence
      on self-affirmation effects and theorized sources of heterogeneity
      from large-scale replications. Journal of Educational Psychology,
      109(3), 405-424.
weird_context:
  status: mixed-evidence
  note: >-
    The overwhelming majority of self-affirmation RCTs were run in US
    school settings (Henrich, Heine, & Norenzayan, 2010, "The weirdest
    people in the world?", Behavioral and Brain Sciences, 33(2-3), 61-83)
    — and Hanselman et al.'s large-scale replications found the effect
    itself is heterogeneous even within that WEIRD population, moderated
    by factors not fully understood. Treat a positive published effect as
    "worked in some US school contexts, with real variation," not as a
    universal effect this skill's output can guarantee anywhere.
inputs:
  - type: affirmation_context_statement
    description: >-
      The target population and the specific evaluative or stigmatized
      domain the exercise needs to buffer against, plus whatever is known
      about which values are actually meaningful to this population.
    source: user
    required: true
  - type: audience_context_brief
    description: >-
      Optional context map for this population, if
      context-and-audience-mapper has already run. When present, use its
      operationalized population and any noted cultural/value information
      to adapt the value category list, instead of defaulting to the
      standard US-derived list.
    source: skill-output
    required: false
outputs:
  - type: values_affirmation_script
    description: >-
      A drafted values-affirmation writing exercise following the
      standard self-affirmation protocol — a locally adapted value
      category list, a selection prompt, and a structured writing prompt —
      plus delivery notes and an explicit caution against using it as a
      substitute for structural fixes.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Turns a population's named evaluative-threat domain into a structured
values-affirmation writing exercise — value selection plus a guided
writing prompt — with delivery timing guidance and a non-substitute
caution against treating it as a structural fix.

## When to invoke it

- A population is about to face, or repeatedly faces, a specific moment
  where a stigmatized or evaluative concern (financial shame, academic
  underperformance, a health stigma) could trigger defensiveness that
  works against the program's goal.
- Someone asks for "something to help people feel less judged/defensive
  about X before we ask them to do Y."
- Do **not** invoke to address a structural or material barrier directly —
  if the actual problem is that a service is unaffordable, inaccessible,
  or unavailable, an affirmation exercise buffers the psychological
  response to that fact, it does not change the fact. Route a structural
  problem to intervention design aimed at the structure itself.

## What it draws on

Cohen & Sherman's applied self-affirmation protocol: ask someone to
identify a personally important value unrelated to the threatened domain,
then write briefly about why it matters and a specific time it mattered to
them. Sherman & Cohen's account of the mechanism — affirming a valued
self-domain broadens perspective and reduces the need to defensively
dismiss threatening information in an unrelated domain — is why the
writing prompt's two-part structure (why it matters, a specific time) is
not optional decoration; a vaguer prompt ("write about something you
value") does not reliably produce the self-affirming effect the mechanism
depends on. Hanselman et al.'s replication findings are the basis for the
mandatory heterogeneity caveat: this intervention's effect size varies by
factors not fully mapped even within similar populations, so the output
must flag that variation rather than imply a guaranteed effect.

## Output template

The non-substitute caution and the heterogeneity caveat are mandatory, not
optional disclaimers — an affirmation script presented without either
invites exactly the two most serious misuses of this technique.

```markdown
# Values-Affirmation Script

**Target population & threat domain (as given):** <verbatim>

## Value category list
<adapt to what's locally/culturally meaningful for this population, using
any input from an audience_context_brief if available — do not transplant
the standard US-derived list (relationships, religion, art, humor,
spontaneity, social skills, athletics, music, career, education,
creativity) uncritically if there is reason to think it doesn't fit>
- <value 1>
- <value 2>
- <...>

## Selection prompt
<verbatim instruction asking the person to identify, from the list above,
the value most personally important to them>

## Writing prompt (two-part structure — both parts required)
1. <why this value is important to you>
2. <describe a specific time this value mattered to you>

## Delivery notes
- **Timing:** <must precede the threat-relevant evaluative moment, not
  follow it — an affirmation written after the threatening event has
  already occurred does not buffer it>
- **Duration:** <brief — the source protocol uses roughly 5-10 minutes>
- **Frequency ceiling:** <state the risk of diminishing or reversed effect
  if administered too often to the same person, per the source literature>

## Non-substitute caution (mandatory)
<state plainly what structural or material barrier, if any, this exercise
does NOT fix, and that it should not be presented or relied on as if it
did>

## Heterogeneity caveat (mandatory)
<name what about this specific population or context is unconfirmed
relative to the published studies, per Hanselman et al.'s documented
effect variation — a null pilot result should be checked against these
factors before concluding the technique itself failed>
```

## Worked example

**Affirmation context statement (as given):** "A financial-literacy
program for first-generation college students. Many avoid asking questions
in workshops or one-on-one advising sessions because they feel judged or
embarrassed discussing money — not knowing how credit scores work, or
having to say they can't afford something classmates take for granted."
*(Illustrative — not a real program.)*

```markdown
# Values-Affirmation Script

**Target population & threat domain (as given):** First-generation college
students in a financial-literacy program, who avoid engaging in workshops
or advising sessions from embarrassment about their financial knowledge or
means relative to peers.

## Value category list
Relationships with family (frequently a stronger value anchor for
first-gen students than the standard list's generic "relationships with
friends/family"), being the first in their family to attend college,
independence/self-reliance, learning and personal growth, community or
cultural belonging, work ethic. Adapted from the standard list's
"relationships," "education," and "career" categories toward what
first-gen-specific research and campus advising literature more commonly
report as salient for this population; the "art," "athletics," and
"music" categories from the standard list are kept but not emphasized.

## Selection prompt
"From the list above, choose the one value that is most personally
important to you — not the one you think you should pick, the one that
actually matters most to you."

## Writing prompt
1. Write a few sentences about why this value is important to you.
2. Describe a specific time this value mattered to you or guided what you
   did.

## Delivery notes
- **Timing:** Administered at the start of the workshop or advising
  session, before any financial-knowledge content or questions are
  introduced — not afterward, once embarrassment may already have been
  triggered.
- **Duration:** Approximately 5-10 minutes, before the session's main
  content begins.
- **Frequency ceiling:** Not every session — repeated administration to
  the same student across many sessions risks a diminished or reversed
  effect per the source literature; consider administering at first
  contact and at most one or two subsequent milestone sessions.

## Non-substitute caution
This exercise does not address the actual financial constraints (cost of
attendance, family financial pressure, lack of prior exposure to financial
concepts) driving the embarrassment — it may reduce defensive avoidance of
the workshop content itself, but the program's financial aid, cost, and
curriculum-accessibility design must be evaluated on their own terms, not
assumed solved because this exercise is in place.

## Heterogeneity caveat
Hanselman et al.'s replications found self-affirmation effects vary by
factors including prior academic performance and the specific framing of
the threat — neither has been confirmed for this financial-literacy
context, which is a different domain than the academic-performance
setting most of the replication literature covers. A null result in a
pilot here should prompt checking these moderators, not an immediate
conclusion that the technique doesn't work for this population.
```

## Known failure modes

- **Uncritical list transplant.** Using the standard US-derived value list
  without checking whether it actually reflects what this population
  values is the most common way this skill's output looks complete but
  isn't locally grounded.
- **Vague writing prompt.** A prompt that skips the "why it matters" or
  "specific time" parts, or merges them into one vague instruction, is not
  the protocol this skill's evidence base validated — the two-part
  structure is the mechanism, not decoration.
- **Wrong-moment delivery.** Administering the exercise after the
  threatening moment (e.g. after a student has already been embarrassed in
  a session) cannot buffer an event that already happened.
- **Over-frequent administration.** Repeating the exercise until its
  effect wears off or reverses, with no stated frequency ceiling, is a
  documented risk this skill's delivery notes exist to flag.
- **Used as a structural substitute.** Presenting this exercise as if it
  addresses the underlying material or structural barrier — the single
  most serious misuse, and the reason the non-substitute caution is
  mandatory, not optional.
- **Null result treated as universal failure.** Concluding "self-
  affirmation doesn't work for this population" from one pilot's null
  result, without checking it against the documented heterogeneity
  moderators, mistakes one context's result for a general finding.
