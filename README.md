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
                    selection of skills, read any skill's full spec. Reads
                    only site/data/index.json — no build step beyond
                    scripts/build-index.js.

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

npx serve site       # or: python3 -m http.server --directory site
                      # then open http://localhost:3000 (or 8000)
```

CI runs `validate` and `test:site` (which itself checks the committed index
isn't stale) on every pull request.

## Current catalogue

| Skill | Category | Stage | Consumes | Produces |
|---|---|---|---|---|
| [key-behaviour-definer](skills/key-behaviour-definer) | Behaviour Definition | Define | a program goal statement (user-supplied) | a target behaviour brief |
| [comb-barrier-decomposer](skills/comb-barrier-decomposer) | Diagnosis | Diagnose | a target behaviour brief | COM-B barrier hypotheses |

`comb-barrier-decomposer` consumes `key-behaviour-definer`'s output — this
chain is derived automatically by `scripts/build-index.js` from the two
skills' frontmatter, not hand-wired, and is visible on each skill's page as
its declared inputs/outputs.

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
