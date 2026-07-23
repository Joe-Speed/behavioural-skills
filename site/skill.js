(async function () {
  const main = document.getElementById("skill-main");
  const slug = qs("slug");

  let data;
  try {
    data = await loadIndex();
  } catch (err) {
    renderError(main, err);
    return;
  }

  const skill = data.skills.find((s) => s.slug === slug);
  if (!skill) {
    main.innerHTML = `<p class="empty-state">No skill found for slug "${slug}". <a href="index.html">Back to catalogue</a>.</p>`;
    return;
  }

  document.title = `Atomic Skills — ${skill.title}`;

  function producersOf(ioType, excludeSlug) {
    return data.graph.edges
      .filter((e) => e.via === ioType && e.to === excludeSlug && e.from !== `external:${ioType}`)
      .map((e) => e.from);
  }
  function consumersOf(ioType, excludeSlug) {
    return data.graph.edges
      .filter((e) => e.via === ioType && e.from === excludeSlug)
      .map((e) => e.to);
  }

  const inputsHtml = (skill.inputs || [])
    .map((input) => {
      const producers = producersOf(input.type, skill.slug);
      const producedNote =
        producers.length > 0
          ? `Produced by ${producers.map((p) => `<a href="${skillUrl(p)}">${p}</a>`).join(", ")}`
          : input.source === "user"
          ? "Supplied by a human, not another skill"
          : "No producing skill in the current catalogue";
      return `<li><code>${input.type}</code> ${input.required === false ? "(optional)" : ""}<br>${input.description}<br><span class="chain-links">${producedNote}</span></li>`;
    })
    .join("");

  const outputsHtml = (skill.outputs || [])
    .map((output) => {
      const consumers = consumersOf(output.type, skill.slug);
      const consumedNote =
        consumers.length > 0
          ? `Consumed by ${consumers.map((c) => `<a href="${skillUrl(c)}">${c}</a>`).join(", ")}`
          : "Terminal output — no skill in the current catalogue consumes this yet";
      return `<li><code>${output.type}</code><br>${output.description}<br><span class="chain-links">${consumedNote}</span></li>`;
    })
    .join("");

  const evidenceHtml = (skill.evidence_base || [])
    .map(
      (e) =>
        `<li><strong>${e.framework}</strong><br>${e.citation}${e.url ? ` — <a href="${e.url}" target="_blank" rel="noopener">source</a>` : ""}</li>`
    )
    .join("");

  const sectionsHtml = (skill.sections || [])
    .map((s) => `<h2>${s.heading}</h2>${marked.parse(s.markdown)}`)
    .join("");

  main.innerHTML = `
    <div class="skill-header">
      <h1>${skill.title}</h1>
      <p class="description">${skill.description}</p>
    </div>

    <dl class="meta-grid">
      <div><dt>Category</dt><dd>${lookupLabel(data.taxonomy.categories, skill.category)}</dd></div>
      <div><dt>Research stage</dt><dd>${lookupLabel(data.taxonomy.stages, skill.stage)}</dd></div>
      <div><dt>WEIRD context</dt><dd>${skill.weird_context.status}</dd></div>
      <div><dt>Version</dt><dd>${skill.version}</dd></div>
      <div><dt>Authors</dt><dd>${(skill.authors || []).join(", ")}</dd></div>
    </dl>

    ${skill.weird_context.note ? `<p class="notice">${skill.weird_context.note}</p>` : ""}

    <h2>Evidence base</h2>
    <ul class="io-list">${evidenceHtml}</ul>

    <h2>Inputs</h2>
    <ul class="io-list">${inputsHtml}</ul>

    <h2>Outputs</h2>
    <ul class="io-list">${outputsHtml}</ul>

    <div class="skill-body">${sectionsHtml}</div>
  `;
})();
