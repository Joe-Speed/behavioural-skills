# Behavioural Skills

A curated library of atomic, first-party AI skills for behavioural
science — built so a program designer or product manager at a social
sector organization can bring real behavioural-science rigor into their
workflow without a behavioural scientist in the room.

Originated as an open call between [Irrational Labs](https://irrationallabs.com)
and [The Agency Fund](https://agency.fund) to turn the operations a
behavioural scientist actually performs — decomposing a behaviour into COM-B
components, drafting a values-affirmation prompt, adjusting an effect size
for publication bias — into small, well-specified, chainable units instead
of one monolithic "behavioural science assistant."

## The design constraint

Every skill here is **atomic**: one thing a behavioural scientist does,
narrow enough to describe in a single sentence without the word "and."
Skills are meant to chain — one skill's output is the next skill's declared
input — and the repository is built to make those chains visible and
machine-checkable rather than a matter of prose convention.

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full rule, with worked
good and bad examples.

Browse the catalogue at **[joe-speed.github.io/behavioural-skills](https://joe-speed.github.io/behavioural-skills/)**.

## How it fits together

```
schema/            Single source of truth: skill.schema.json (structural
                    shape of a skill's frontmatter) + taxonomy.yaml
                    (controlled vocabulary for categories, research stages,
                    and the input/output types that let skills chain).

skills/<name>/      One skill per folder. SKILL.md carries YAML frontmatter
                    (name, trigger-phrased description, category, stage,
                    evidence base, WEIRD-context flag, declared inputs and
                    outputs) plus markdown sections: what it does, when to
                    invoke it, what it draws on, the output template, and
                    known failure modes.

scripts/            validate.js   — checks every skill against the schema,
                                    the taxonomy, and the atomicity/
                                    trigger-phrasing/dangling-input rules.
                    build-index.js — walks skills/, derives the dependency
                                    graph by matching declared outputs to
                                    declared inputs, writes
                                    site/data/index.json.
                    install.sh /
                    install.ps1   — copies selected skills into a target
                                    project's skills/ directory, by name,
                                    by category, or all of them.
                    test-site.js  — checks the generated site data is fresh
                                    and internally consistent.

site/               A static catalogue: browse and filter by category and
                    research stage, get a copy-paste install command for any
                    selection of skills, read any skill's full spec
                    (including a real worked example and its version
                    history, derived from git log — nothing hand-authored).
                    A Cmd+K palette searches skills and jumps to the
                    Workflow Builder or What's New page from anywhere. Reads
                    only site/data/index.json — no build step beyond
                    scripts/build-index.js, which also emits one static,
                    real-metadata share page per skill under site/s/ for
                    correct link unfurls on Slack/Twitter/etc.

templates/          Copy skill-template/ to draft a new skill.
```

## Using a skill in your own project

```bash
# List everything available
./scripts/install.sh --list

# Install by name
./scripts/install.sh --target /path/to/your/project --name key-behaviour-definer,comb-barrier-decomposer

# Install by category
./scripts/install.sh --target /path/to/your/project --category diagnosis

# Install everything
./scripts/install.sh --target /path/to/your/project --all
```

PowerShell equivalents:

```powershell
./scripts/install.ps1 -List
./scripts/install.ps1 -Target C:\path\to\your\project -Name key-behaviour-definer,comb-barrier-decomposer
./scripts/install.ps1 -Target C:\path\to\your\project -Category diagnosis
./scripts/install.ps1 -Target C:\path\to\your\project -All
```

Skills land in `<target>/skills/<skill-name>/`, unmodified.

## Developing in this repo

```bash
npm install
npm run validate   # schema + taxonomy + trigger-phrasing + dangling-input checks
npm run build       # regenerates site/data/index.json
npm run test:site   # checks the generated site data is fresh and consistent

npx serve site       # then open http://localhost:3000
                      # site/serve.json enables clean URLs (no .html in the
                      # address bar), matching how GitHub Pages actually
                      # resolves them. python3 -m http.server doesn't honor
                      # that config, so links like /workflow will 404 there.
```

CI runs `validate` and `test:site` (which itself checks the committed index
isn't stale) on every pull request.

## Current catalogue

| Skill | Category | Stage | Consumes | Produces |
|---|---|---|---|---|
| [evidence-base-scoper](skills/evidence-base-scoper) | Evidence Scoping | Prepare | a program goal statement (user-supplied) | an evidence scan brief |
| [context-and-audience-mapper](skills/context-and-audience-mapper) | Context Mapping | Prepare | a program goal statement (user-supplied) | an audience & context brief |
| [researcher-bias-self-audit](skills/researcher-bias-self-audit) | Researcher Calibration | Prepare | a researcher assumption statement (user-supplied) | a bias audit report |
| [key-behaviour-definer](skills/key-behaviour-definer) | Behaviour Definition | Define | a program goal statement (user-supplied), optionally an evidence scan brief and an audience & context brief | a target behaviour brief |
| [comb-barrier-decomposer](skills/comb-barrier-decomposer) | Diagnosis | Diagnose | a target behaviour brief, optionally a bias audit report | COM-B barrier hypotheses |
| [intervention-lever-selector](skills/intervention-lever-selector) | Intervention Design | Design | one field-confirmed COM-B barrier hypothesis | an intervention lever brief |
| [values-affirmation-drafter](skills/values-affirmation-drafter) | Intervention Design | Design | an affirmation context statement (user-supplied), optionally an audience & context brief | a values-affirmation script |
| [evaluation-design-scoper](skills/evaluation-design-scoper) | Measurement | Test | a target behaviour brief, optionally COM-B barrier hypotheses and an intervention lever brief | an evaluation design brief |
| [prior-intervention-post-mortem-reader](skills/prior-intervention-post-mortem-reader) | Risk & Pre-Mortem | Prepare | a prior intervention record (user-supplied) | an intervention post-mortem brief |
| [lever-content-drafter](skills/lever-content-drafter) | Intervention Design | Design | an intervention lever brief, optionally an audience & context brief | an intervention content draft |
| [sifa-declaration-drafter](skills/sifa-declaration-drafter) | Research Transparency | Report | an AI use account (user-supplied) | a SIFA declaration |

`comb-barrier-decomposer` consumes `key-behaviour-definer`'s output, which
in turn optionally consumes both `evidence-base-scoper`'s and
`context-and-audience-mapper`'s output; `researcher-bias-self-audit`
optionally consumes `prior-intervention-post-mortem-reader`'s output and
optionally feeds `comb-barrier-decomposer`; `intervention-lever-selector`
consumes one field-confirmed hypothesis from `comb-barrier-decomposer`;
`lever-content-drafter` consumes `intervention-lever-selector`'s output,
optionally alongside `context-and-audience-mapper`'s; and
`evaluation-design-scoper` consumes `key-behaviour-definer`'s output,
optionally alongside `comb-barrier-decomposer`'s and
`intervention-lever-selector`'s. This chain is derived automatically by
`scripts/build-index.js` from the skills' frontmatter, not hand-wired —
visible on each skill's page as its declared inputs/outputs, and as an
interactive drag-and-drop sequence on the site's
[Workflow Builder](site/workflow.html), which flags any step whose
required input isn't yet produced earlier in the sequence you build.

## Roadmap

See [ROADMAP.md](ROADMAP.md) for what's next. The pre-intervention gap
it originally called for — evidence-gathering and researcher-bias-checking
before a target behaviour is defined — is now built (the first two rows
above); the roadmap tracks what's still open.

## Contributing

Draft ideas, claim a skill, and see the atomicity rule with good/bad
examples in [CONTRIBUTING.md](CONTRIBUTING.md). The site's
["Propose a Skill"](site/propose.html) page is a lower-friction entry point
for a first draft — it defaults to opening a pre-filled GitHub issue with
no setup beyond a GitHub account, and is built so a deployment can instead
point it at a server-side submission endpoint without any change to the
schema or form.

## License

[MIT](LICENSE).
