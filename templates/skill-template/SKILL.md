---
# Copy this whole directory to skills/<your-skill-name>/ and rename this
# file's frontmatter to match. Run `npm run validate` before opening a PR —
# see CONTRIBUTING.md for what each field is checked against.

name: your-skill-name # kebab-case, must match the folder name
title: Your Skill Title
description: >-
  Use when <the specific situation, input state, or user intent that should
  fire this skill>. Invoke it when <a second concrete trigger, if useful>.
  Do not invoke when <the nearest situation someone might confuse this
  with>. This is read by both humans and the validator as trigger
  conditions — not a summary of what the skill does. If you find yourself
  writing "this skill helps you..." or "this skill does...", rewrite it as
  a "use when" / "invoke when" clause instead.
category: behaviour-definition # must be an id from schema/taxonomy.yaml#categories
stage: define # must be an id from schema/taxonomy.yaml#stages
evidence_base:
  - framework: Name of the framework, model, or method
    citation: Full citation (author, year, title, source)
    # url: https://doi.org/... (optional)
weird_context:
  status: mixed-evidence # weird-only | likely-generalizes | mixed-evidence | untested-outside-weird
  note: >-
    Optional. Say what specifically is WEIRD-skewed about the evidence base
    or the worked examples, and what a user outside that context should
    validate locally before trusting the output as-is.
inputs:
  - type: some_io_type_id # must exist in schema/taxonomy.yaml#io_types, or be
    # a new id you're introducing in this same PR (add it to taxonomy.yaml
    # and mark user_suppliable: true if a human supplies it directly, or
    # leave it false if you expect another skill to produce it — in which
    # case that producing skill needs to exist too, or validation fails)
    description: What this input actually is, in plain language.
    source: user # user | skill-output
    required: true
outputs:
  - type: some_other_io_type_id
    description: What this output actually is, in plain language.
authors:
  - Your Name
version: 0.1.0
---

## What it does

One sentence. No "and." If you need "and" to describe it, it's two skills —
split it before going further. See CONTRIBUTING.md's atomicity section for
worked good/bad examples.

## When to invoke it

- Bullet the concrete situations, user phrasings, or upstream outputs that
  should trigger this skill.
- Bullet the nearest adjacent situation this skill should **not** handle,
  and say what should be invoked instead.

## What it draws on

Name the framework, model, or paper this skill operationalizes, and explain
in a sentence or two how the skill's logic maps onto it. If the skill makes
a judgment call the source material doesn't fully specify, say so here
rather than leaving it implicit.

## Output template

```markdown
<the literal structure the skill's response should follow — headings,
placeholders, whatever a downstream skill or human would need to parse or
read reliably>
```

## Known failure modes

- Name at least one way this skill produces a plausible-looking but wrong
  result, and what would tip a user off that it happened.
- Name at least one input condition this skill is out of scope for (e.g.
  "a compound behaviour", "a population the evidence base doesn't cover")
  and what to do instead.
