# Org-preset workflows in the Workflow Builder

Design note for the ROADMAP entry of the same name. Status: **not yet
built** — this documents the agreed shape so whoever builds it (or
pitches it to an org) isn't reinventing decisions.

## The idea in one paragraph

The Workflow Builder starts from a blank canvas. A preset picker lets a
user start instead from a named organisation's typical skill sequence —
"the Busara-style flow", "the BIT-style flow" — pre-loaded as an
editable starting arrangement. The differentiator is provenance: each
preset is enumerated and confirmed by the organisation itself, so it's a
"pre-approved" sequence the org has endorsed, not a guess reconstructed
from their public writing. First outreach targets: Ideas42, Busara, the
Behavioural Insights Team, the WHO Behavioural Insights unit, BIRD Lab.

## Principles

1. **A preset is a starting arrangement, not a template.** Loaded steps
   are ordinary, fully editable workflow steps. Nothing locks.
2. **Provenance is the product.** A preset without a named attestor and
   date is visibly second-class ("reconstructed"), and we prefer not to
   ship those at all.
3. **Honest about gaps.** If an org's real flow has a step our catalogue
   can't cover, the preset shows the gap rather than trimming the flow
   to fit our inventory.
4. **Zero cost to non-users.** Someone building from scratch should
   never pay screen space or attention for presets after their first
   action.

## UI presentation

### Entry point: the empty canvas

The "Your workflow" pane's empty state (currently "Add a skill to start
building your workflow.") becomes the preset picker:

```
Add a skill to start building — or start from an organisation's flow:

┌──────────────────────────────────────────┐
│ Busara-style flow          7 steps       │
│ Diagnose-first field flow for LMIC       │
│ programs.                                │
│ ✓ Confirmed by <name>, Busara · 2026-09  │
└──────────────────────────────────────────┘
┌──────────────────────────────────────────┐
│ BIT-style flow             6 steps       │
│ Define → EAST-style design → trial.      │
│ ⚠ Reconstructed from published work —    │
│   not yet org-confirmed                  │
└──────────────────────────────────────────┘

3 orgs so far — is yours missing? Propose your flow →
```

- Cards disappear once the canvas has steps.
- A small "Start from a preset ▾" button next to **Clear** covers the
  mid-session case; loading over a non-empty canvas requires an
  overwrite confirm.
- The trailing "is yours missing?" line links to the Propose page and is
  part of the outreach loop, not decoration.

### Rejected placements

- **Picker strip above both panes** — steals vertical space from every
  session for a first-30-seconds decision.
- **Preset cards inside the library column** — conflates "one skill"
  with "a sequence of seven"; same visual weight, different object,
  broken drag semantics.
- **Separate page / modal** — presets are a starting arrangement; they
  belong where starting happens.

### Loaded state

- Steps land in the existing step list; the existing input-satisfaction
  checks (✓ / ⚠ per required input) run unchanged and do the pedagogy.
- Each preset-loaded step shows the preset's one-line **rationale**
  under its title ("Busara runs the bias audit before diagnosis
  because…"). This is the payload — the reason to pick a named org flow
  over guessing.
- A header chip above the step list: `Based on: Busara flow`, flipping
  to `Based on: Busara flow (edited)` on the first add/remove/reorder.
  The chip text (including edited-state and confirmation date) is
  carried into the generated Markdown plan.
- **Gap steps** render as ghost steps in sequence position: greyed, no
  input checks, text like "Busara runs a scoping interview here — no
  skill covers this yet → propose one". Gap steps are skipped by the
  install command and marked plainly in the Markdown plan.

## Data format

`site/data/presets.json`, checked in (not build-derived):

```json
{
  "presets": [
    {
      "id": "busara-field-flow",
      "org": "Busara",
      "title": "Busara-style flow",
      "one_liner": "Diagnose-first field flow for LMIC programs.",
      "provenance": {
        "status": "confirmed",
        "attestor": "<name and role at the org>",
        "date": "2026-09-15",
        "notes": "optional: scope caveats the org asked to attach"
      },
      "steps": [
        { "slug": "researcher-bias-self-audit",
          "rationale": "one line: why the org runs this step here" },
        { "gap": true,
          "label": "Scoping interview",
          "note": "No catalogue skill covers this yet." },
        { "slug": "comb-barrier-decomposer",
          "rationale": "…" }
      ]
    }
  ]
}
```

Rules:

- `provenance.status` ∈ `confirmed | reconstructed`. `confirmed`
  requires `attestor` + `date`. No third state — if we can't fill the
  field, the preset doesn't ship.
- Every `slug` must exist in `skills/`. `scripts/validate.js` (or
  `test-site.js`) gains a check so a renamed skill fails CI, not the
  page.
- A preset is an ordered list; it deliberately reuses nothing from the
  dependency graph. The graph still judges the loaded sequence live, so
  an org flow that leaves a required input dangling shows its ⚠ honestly
  — that is a feature, not a bug to pre-launder.

## Provenance and outreach

- Launch with confirmed presets only, even if that means launching with
  one. An empty picker with the "is yours missing?" line is better than
  a picker full of guesses wearing org names.
- Outreach asks each org for: (1) their ordered typical flow in their
  own words, (2) one line of rationale per step, (3) a named attestor
  willing to be listed, (4) what we may call it ("X-style flow" vs their
  branded name). What they get: a linkable, runnable version of their
  methodology in front of practitioners, with attribution.
- Targets, in order: Busara (existing SIFA relationship), Ideas42, BIT,
  WHO Behavioural Insights unit, BIRD Lab.
- Re-confirmation: provenance dates are displayed, not hidden; a preset
  older than ~2 years gets a gentle "confirmed 2026 — may have evolved"
  styling rather than silent staleness.

## Build order

1. Data format + CI validation (no UI): merge `presets.json` with an
   empty `presets` array.
2. Empty-state picker + load-into-canvas + chip + rationale display +
   gap steps. With zero presets this renders exactly as today.
3. Markdown-plan and install-command integration (chip line, gap
   markers).
4. First confirmed org preset lands as data only — no code change.

Steps 1–2 are buildable now; nothing blocks on outreach except the data.

## Open questions

- Does an org get to *update* their preset unilaterally (PR from their
  handle auto-trusted) or does each change need re-attestation?
- One preset per org, or per-program-type variants ("BIT rapid trial"
  vs "BIT full evaluation")? Format allows multiple; picker UX prefers
  ≤2 per org.
- Should the generated Markdown plan carry the org's rationale lines
  verbatim (attribution implications) — probably yes with a "as
  described by <org>, <date>" line, but confirm during outreach.
