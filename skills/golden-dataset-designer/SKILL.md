---
name: golden-dataset-designer
title: Golden Dataset Designer
description: >-
  Use when an AI product's response quality is being judged by ad-hoc
  spot checks — someone tries a few prompts and declares it "pretty
  good" — and the team needs a repeatable answer sheet before any model,
  prompt, or knowledge-base change can be evaluated rather than vibed.
  Invoke it before shipping a model swap, a rewritten system prompt, or a
  knowledge-base update with no regression check. Do not invoke to
  measure whether the product changes its users — that is Level 3
  territory (user-funnel-builder, evaluation-design-scoper) — and do not
  invoke to write the knowledge base or guardrails themselves; this skill
  specifies the test set that checks them.
category: measurement
stage: measure
evidence_base:
  - framework: >-
      The Agency Fund AI Evaluation Playbook — Level 1 model evaluation
    citation: >-
      Wu, Z., On, R., Walsh, J., Korley, E., Madon, T., & Wong, L. (2025).
      AI Evaluation in the Social Sector: A Living Playbook — Level 1:
      Model Evaluation. The Agency Fund.
    url: https://eval.playbook.org.ai/level1
  - framework: >-
      TAF model-evaluation workshop — golden datasets and judge
      calibration
    citation: >-
      The Agency Fund (2025). Model evaluation workshop materials, AI4GD
      Midpoint Sprint, Nairobi, June 2025. taf-ai-eval-playbook
      repository, public/model-eval-case-study.
    url: https://github.com/agency-fund/taf-ai-eval-playbook
weird_context:
  status: likely-generalizes
  note: >-
    Unusually for this catalogue, the source material is non-WEIRD in
    origin — the workshop this skill operationalizes was built in Nairobi
    for LMIC deployments. The caveat is technical rather than cultural:
    reference-based scoring (semantic-similarity metrics against an ideal
    answer) is least reliable in exactly the low-resource languages and
    code-switching registers these products serve, so a golden dataset in
    Swahili-English mix needs its automated scores calibrated against
    human judgment before anyone trusts a pass rate.
inputs:
  - type: ai_product_account
    description: >-
      The team's account of the product: its domain, who asks it what, in
      which languages and registers, what its knowledge base covers, and
      which failures would be harmful rather than merely wrong. The
      coverage plan is derived from this — especially from what the
      account says users actually ask.
    source: user
    required: true
outputs:
  - type: golden_dataset_spec
    description: >-
      A build specification for the product's golden evaluation dataset:
      coverage plan across knowledge, implementation, personalization,
      and stress-test buckets; sourcing rules for real queries;
      ideal-response authoring rules tied to the knowledge base and
      guardrails; and the scoring plan that will consume it.
authors:
  - Joe Speed
version: 0.1.0
---

## What it does

Specifies a golden evaluation dataset for one AI product — the query
buckets it must cover, where queries come from, who authors each ideal
response under what rules, plus how outputs will be scored against it —
so model, prompt, or knowledge-base changes get checked against an answer
sheet instead of impressions.

## When to invoke it

- Response quality is currently assessed by someone typing a few test
  prompts after each change ("vibe checks" — the playbook's own term for
  the practice this replaces as the *only* method).
- A model swap, system-prompt rewrite, or knowledge-base update is about
  to ship with no way to detect regressions against the previous version.
- [ai-eval-level-matcher](/behavioural-skills/skill?slug=ai-eval-level-matcher) has recommended
  Level 1 evaluation and the team has no gold-standard test set to run.
- Safety behaviour (refusals, escalations) has never been tested
  systematically — only noticed anecdotally in logs.
- Do **not** invoke to measure user outcomes — whether farmers learn,
  decide, or act differently is Level 3, owned by the funnel's proximal
  outcome stage and
  [evaluation-design-scoper](/behavioural-skills/skill?slug=evaluation-design-scoper).
- Do **not** invoke to author the knowledge base or guardrail policy
  itself. The spec references both as inputs to ideal-response authoring;
  writing them is upstream content work.

## What it draws on

Level 1 of The Agency Fund's AI Evaluation Playbook (Wu et al., 2025) and
its Nairobi model-evaluation workshop materials, which define golden
datasets as "test questions with the correct answers that help you check
whether your AI is working properly." The workshop's structure is adopted
directly: a golden dataset of query/ideal-response pairs (the workshop's
floor is ~40; more for products with broad domains) spanning four
buckets — **knowledge** (canonical factual questions), **implementation**
(procedural "how do I actually do this" questions), **personalization**
(questions whose right answer depends on the user's stated context and
constraints), and **stress-test** (queries probing brittleness,
hallucination under confident-sounding premises, safety, and ethics —
including queries the product must *refuse* per its guardrails).

The scoring plan follows the playbook's three method families and its
warning labels. Reference-based automated metrics (semantic similarity,
contextual precision against the golden answer) are cheap and run on
every change; rubric-based **LLM-as-judge** scoring covers criteria with
no single correct phrasing — but the workshop is blunt that LLM judges
"typically align with humans only ~50% of the time" out of the box, so
the spec must include a human-calibration step (paired human scores on a
sample, iterate the judge prompt on discrepancies) before judge scores
are trusted; and **human annotation** remains the reference standard the
other two are calibrated against.

Judgment call the source doesn't fully specify: version binding. A golden
run is meaningless if nobody knows which model, system prompt, and
knowledge-base version produced it, so this skill makes the spec name the
config fields every run must record — matching the workshop's own
config-worksheet practice.

## Output template

All four buckets are mandatory. A dataset with no stress-test bucket
tests the product everyone hopes exists, not the one users will poke.

```markdown
# Golden Dataset Specification

**Product:** <name + one line>
**Languages/registers covered:** <including code-switching if users mix
languages — the dataset must look like real traffic, not textbook prose>
**Version binding:** every run records <model id, system-prompt tag,
knowledge-base tag> alongside scores.

## Coverage plan
| Bucket | What it tests | Target count | Query sources |
|---|---|---|---|
| Knowledge | canonical factual questions in domain | <n> | <real logs / expert-written / both> |
| Implementation | procedural guidance users actually need | <n> | <...> |
| Personalization | answers that must change with user context | <n> | <...> |
| Stress-test | brittleness, hallucination bait, safety, must-refuse queries | <n> | <guardrail spec + red-team session + logged incidents> |

## Ideal-response authoring rules
<who writes golden answers (domain expert role, not the engineer), what
they're written against (knowledge-base version, guardrail spec), and the
form rules — e.g. must-include facts vs verbatim text; refusal goldens
quote the guardrail's scripted refusal>

## Scoring plan
<which metric consumes which bucket: reference-based similarity where a
canonical answer exists; LLM-judge rubric (criterion, scale) where
quality is graded — with the mandatory human-calibration step and its
agreement threshold; human review cadence for stress-test results>

## Refresh triggers
<when the dataset must be extended or re-authored: knowledge-base
updates, new observed query patterns, every logged safety incident
becomes a stress-test golden>
```

## Worked example

**AI product account (user-supplied, condensed):** "MaizeMate answers
agronomy questions for smallholder maize farmers in western Kenya over
WhatsApp — mostly in Swahili-English mix, some Luhya. Knowledge base
covers maize varieties, planting windows, top-dressing, common pests.
It must refuse to advise on restricted pesticides and anything medical.
We benchmarked once against an agronomist's test set but it has no
stress-test questions and we've never re-run it." *(Illustrative —
continues the catalogue's running example; not a real program.)*

```markdown
# Golden Dataset Specification

**Product:** MaizeMate — WhatsApp AI agronomy assistant
**Languages/registers covered:** Swahili-English code-switched (majority
of logged traffic), plain Swahili, plain English; 10 Luhya queries to
size the gap rather than pretend coverage.
**Version binding:** every run records model id, system-prompt tag,
knowledge-base tag.

## Coverage plan
| Bucket | What it tests | Target count | Query sources |
|---|---|---|---|
| Knowledge | variety selection, planting windows, fertilizer types | 15 | 10 from pilot logs, 5 agronomist-written |
| Implementation | "how much CAN per acre", top-dressing timing steps | 15 | 12 from logs (most common real questions), 3 written |
| Personalization | same question, different county/rainfall/crop stage from setup data | 10 | written from 5 real user profiles, 2 variants each |
| Stress-test | banned-pesticide requests, confident wrong premises ("my maize has rust so I should double-spray, right?"), medical spillover, prompt-injection attempts | 12 | guardrail spec (6 must-refuse), red-team hour (4), 2 logged incidents |

## Ideal-response authoring rules
Golden answers written by the partner agronomist against knowledge-base
tag kb-2026-08; engineers may not author agronomy content. Answers list
must-include facts and must-not-include claims rather than verbatim text —
except refusal goldens, which quote the guardrail's scripted refusal
exactly, ending after the single refusal sentence.

## Scoring plan
Knowledge + implementation: semantic similarity vs golden answer, with
the pass threshold set only after checking score distributions on
code-switched queries against human ratings (reference-based metrics
degrade off-English). Personalization: LLM-judge rubric "uses the
farmer's stated county and crop stage correctly" (0–3), calibrated on 30
human-scored pairs; judge adopted only at ≥80% agreement. Stress-test:
automated refusal-match plus mandatory human review of every response —
no automated pass.

## Refresh triggers
Every knowledge-base update re-runs the full set before deploy; each
month's top-5 new query patterns become candidate goldens; every safety
incident in logs becomes a stress-test golden within a week.
```

## Known failure modes

- **The all-softball dataset.** Queries written by the people who built
  the knowledge base, phrased the way the knowledge base phrases things.
  Pass rates soar; real farmers, who ask sideways questions in mixed
  language, hit failures the set never contained. Sourcing counts from
  real logs are in the template because of this.
- **No must-refuse goldens.** A dataset that only checks what the product
  should say, never what it must decline, will happily green-light a
  model swap that quietly stopped refusing restricted-pesticide advice.
- **Trusting the judge uncalibrated.** LLM-judge scores adopted without
  the human-agreement check — on ~50% baseline alignment, that's a coin
  flip wearing a rubric. The calibration step is not optional overhead;
  it is the difference between measurement and theater.
- **Similarity scores on code-switched text taken at face value.**
  Reference-based metrics are weakest in exactly this catalogue's
  deployment languages; a threshold tuned on English goldens silently
  fails Swahili-English ones. Distribution-check before threshold-set.
- **The unversioned run.** "Pass rate dropped to 79%" — against which
  model, prompt, and knowledge base? Without version binding the dataset
  can detect that something changed but never what, which is most of its
  job.
- **Out of scope: user outcomes.** A perfect golden pass rate says
  nothing about whether anyone farms differently. That's the funnel's
  proximal-outcome stage and Level 3/4 evaluation — pointing a golden
  dataset at that question is answering "does the model respond well?"
  and calling it impact.
