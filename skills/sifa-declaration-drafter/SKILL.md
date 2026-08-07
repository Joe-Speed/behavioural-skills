---
name: sifa-declaration-drafter
title: SIFA Declaration Drafter
description: >-
  Use when a piece of work — a research report, an intervention design, a
  paper, a deliverable — is being written up and the team needs to declare
  how humans and AI tools actually interacted in producing it. Invoke it
  when someone asks "how do we disclose what the AI did on this project?"
  or when a journal, funder, or org policy requires an AI-use statement.
  Do not invoke to audit the team's prior beliefs about the target
  population — that is researcher-bias-self-audit — and do not invoke it
  as an AI-use policy or approval gate: it discloses what happened, it
  does not rule on whether it was acceptable.
category: research-transparency
stage: report
evidence_base:
  - framework: SIFA — Statement of Intellectual Fellowship and Accountability
    citation: >-
      Schomerus, M., & Saleh, E. SIFA: Statement of Intellectual
      Fellowship and Accountability. Busara. Browser-based declaration
      tool mapping AI involvement onto CRediT contributor roles.
    url: https://mareikeschomerus-ctrl.github.io/sIfA/
  - framework: CRediT — Contributor Roles Taxonomy
    citation: >-
      Brand, A., Allen, L., Altman, M., Hlava, M., & Scott, J. (2015).
      Beyond authorship: attribution, contribution, collaboration, and
      credit. Learned Publishing, 28(2), 151-155.
weird_context:
  status: likely-generalizes
  note: >-
    The declaration practice itself is procedural and travels: it makes no
    claims about human behaviour, only about disclosure. What is
    culturally specific is the CRediT taxonomy's origin in Western academic
    publishing — its 14 roles assume a journal-article division of labour,
    and authorship/credit norms differ across research cultures and
    sectors. Teams outside that context should treat the role list as a
    checklist to adapt (dropping or renaming roles that don't exist in
    their workflow) rather than a form to force their work into.
inputs:
  - type: ai_use_account
    description: >-
      The team's raw, honest account of how the work was produced: who did
      which parts, which AI tools were used where and roughly how heavily,
      and anything they're unsure whether to disclose. Honesty in, honesty
      out — this skill structures the account, it cannot verify it.
    source: user
    required: true
outputs:
  - type: sifa_declaration
    description: >-
      A structured SIFA declaration: per applicable CRediT role, the human
      contributor(s), any AI tool involved, the extent of AI involvement
      on SIFA's none/some/extensive scale, and an audit note explaining
      the rating — with accountability explicitly retained by the humans.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Structures a team's raw account of who-did-what into a SIFA declaration —
per applicable CRediT contributor role: the humans, the AI tool involved
(if any), the extent of AI involvement on SIFA's none/some/extensive
scale, plus an audit note justifying each rating.

## When to invoke it

- A report, paper, intervention design, or other deliverable is being
  finalized and the team needs a standardised statement of where AI tools
  were involved in producing it.
- A journal, funder, or organisational policy asks for an AI-use
  disclosure and the team's current answer is an unstructured paragraph
  ("we used ChatGPT a bit for drafting").
- A team wants to make its human-AI division of labour inspectable
  *before* someone else asks — SIFA's framing is a deliberate, voluntary
  disclosure, not a compliance response.
- Do **not** invoke to examine the team's prior beliefs about the target
  population — that is
  [researcher-bias-self-audit](../researcher-bias-self-audit)'s job, and
  it runs *before* the work; this skill runs *after* it.
- Do **not** invoke as an approval mechanism. The declaration records
  what happened; whether a given level of AI involvement was appropriate
  is a policy question for the journal, funder, or org — this skill must
  not answer it.

## What it draws on

SIFA (Schomerus & Saleh, Busara) maps AI involvement onto the CRediT
contributor-role taxonomy (Brand et al., 2015) — the same 14 roles
(Conceptualization, Methodology, Investigation, Formal analysis,
Writing — original draft, Writing — review & editing, Visualization, and
so on) that major journals already use for human contributors. That
mapping is the core move this skill preserves: instead of one vague
project-level sentence, AI involvement is declared role by role, on
SIFA's three-point scale (none / some / extensive), each rating carrying
a brief audit note saying what the tool actually did. Using an
established taxonomy makes declarations comparable across projects and
journals rather than bespoke prose.

Two SIFA principles are load-bearing and this skill enforces them. First,
*accountability stays human*: an AI tool is never listed as a contributor
alongside people — it appears only inside a role a named human is
accountable for. Second, *the audit note is the substance*: a bare "2"
next to Writing — original draft tells a reader almost nothing; "first
draft of sections 2-4 generated from our outline, then substantially
restructured by the authors" tells them exactly what to weigh.

Judgment call the source doesn't fully specify: SIFA is a self-report
tool, and so is this skill. It structures what the team says happened; it
has no way to detect an omitted tool or an understated rating. The output
therefore states that it is a self-declaration on its face.

## Output template

Only roles that apply to the work are listed — but every role where *any*
AI involvement occurred must appear, including ones the team considers
trivial ("it just fixed our grammar" is a Writing — review & editing
disclosure). The scale is SIFA's: 0 = none, 1 = some, 2 = extensive.

```markdown
# SIFA Declaration — <work title>

**Human authors accountable for this work:** <names — accountability for
every role below, including AI-assisted ones, rests with these people>
**AI tools used anywhere in the work:** <tool + version/model, one line
each; "none" for a clean-hands declaration is also a valid output>
**Declaration basis:** Self-reported by the authors on <date>. This
statement records the authors' own account; it is a disclosure, not an
external audit.

## Role-by-role declaration
| CRediT role | Human contributor(s) | AI tool | AI involvement (0-2) | Audit note |
|---|---|---|---|---|
| <role> | <names> | <tool or —> | <0/1/2> | <what the tool concretely did, and what the humans did around it> |

<one row per applicable role; roles with no AI involvement and no
ambiguity may be grouped in a single 0 row for brevity>

## Roles not applicable to this work
<CRediT roles omitted and why, one line — so an omission reads as a
judgment, not an oversight>

## What the humans remain accountable for
<one short paragraph: the claims, analysis, and errors in this work are
the named authors' responsibility regardless of the tool ratings above>
```

## Worked example

**AI use account (user-supplied, condensed):** "Two of us designed the
market-vendor savings study. I used Claude to sweep the deposit-behaviour
literature and it drafted the report's background section, which Amara
rewrote. Amara ran the diagnostic interviews herself. Analysis was ours
in R, though I had the model debug two scripts. It also made the first
version of two charts. Oh, and it tightened the whole report's grammar at
the end." *(Illustrative — continues the catalogue's running example; not
a real declaration.)*

```markdown
# SIFA Declaration — Market-vendor mobile savings study, final report

**Human authors accountable for this work:** J. Okello, A. Diallo
**AI tools used anywhere in the work:** Claude (Anthropic, Sonnet-class
model, 2026 releases)
**Declaration basis:** Self-reported by the authors on 2026-08-07. This
statement records the authors' own account; it is a disclosure, not an
external audit.

## Role-by-role declaration
| CRediT role | Human contributor(s) | AI tool | AI involvement (0-2) | Audit note |
|---|---|---|---|---|
| Conceptualization | Okello, Diallo | — | 0 | Study question and design set by the authors before any tool use. |
| Investigation | Diallo | — | 0 | All diagnostic interviews conducted and coded by Diallo in person. |
| Data curation / Formal analysis | Okello | Claude | 1 | Analysis specified and run by Okello in R; Claude debugged two analysis scripts. No analytic decisions delegated. |
| Visualization | Okello | Claude | 2 | First drafts of Figures 2-3 generated by Claude from the cleaned data; Okello set the chart types and corrected axis scaling before inclusion. |
| Writing — original draft | Diallo | Claude | 2 | Background section first-drafted by Claude from Okello's literature sweep prompts, then substantially rewritten by Diallo; all other sections human-drafted. |
| Writing — review & editing | Okello, Diallo | Claude | 1 | Full-report grammar and consistency pass by Claude; accepted line-by-line by the authors. |

## Roles not applicable to this work
Funding acquisition, Project administration, Resources, Software,
Supervision — two-person unfunded pilot with no standing software output;
Validation is folded into Formal analysis above.

## What the humans remain accountable for
Every claim, effect estimate, and error in this report is the
responsibility of Okello and Diallo, including content first drafted or
debugged by the tool ratings above.
```

## Known failure modes

- **The vague-virtue declaration.** Audit notes like "AI was used
  responsibly throughout" rate everything a 1 and explain nothing. The
  note's test: could a skeptical reader tell what the tool concretely
  produced versus what the humans produced? If not, the declaration is
  reassurance, not disclosure.
- **Laundering through the scale.** Rating extensive first-drafting as
  "1 — some" because 2 feels embarrassing. The scale anchors are SIFA's,
  not the team's comfort: if the tool produced the first version of the
  artifact, that role is a 2 no matter how heavily it was edited after.
- **The AI as author.** Listing the tool in the contributor column, or
  writing audit notes in which the tool "decided" or "concluded." SIFA's
  accountability principle is the opposite: tools appear only inside
  roles a named human answers for.
- **Trivial-use omission.** Dropping the grammar pass or a debugged
  script because "that's not really AI use." Any role the tool touched
  appears in the table — small ratings with honest notes are exactly what
  makes the big ratings credible.
- **Treating the output as verification.** This is self-report. A team
  that omits a tool produces a clean-looking declaration; nothing in this
  skill can catch that, which is why the declaration-basis line is
  mandatory and unhedged.
- **Out of scope: policy rulings.** An input like "declare our AI use in
  a way that will pass the journal's policy" asks the declaration to
  answer an acceptability question. Structure what happened; whether it
  passes is the journal's call, and shading notes toward a desired ruling
  is the failure the tool exists to prevent.
