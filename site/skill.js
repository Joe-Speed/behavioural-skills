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
    main.innerHTML = `<p class="empty-state">No skill found for slug "${escapeHtml(slug || "")}". <a href="./">Back to catalogue</a>.</p>`;
    return;
  }

  document.title = `Behavioural Skills — ${skill.title}`;
  bindCommandPalette(data);

  // skill?slug= is the interactive alias; s/<slug> is the real, fully-
  // rendered content page search engines should index.
  const canonicalLink = document.createElement("link");
  canonicalLink.rel = "canonical";
  canonicalLink.href = shareUrl(skill.slug);
  document.head.appendChild(canonicalLink);

  function producersOf(ioType, consumerSlug) {
    return data.graph.edges
      .filter((e) => e.via === ioType && e.to === consumerSlug && e.from !== `external:${ioType}`)
      .map((e) => e.from);
  }
  function consumersOf(ioType, producerSlug) {
    return data.graph.edges
      .filter((e) => e.via === ioType && e.from === producerSlug)
      .map((e) => e.to);
  }

  const inputsHtml = (skill.inputs || [])
    .map((input) => {
      const producers = producersOf(input.type, skill.slug);
      const producedNote =
        producers.length > 0
          ? `Produced by ${producers.map((p) => `<a href="${skillUrl(p)}">${escapeHtml(p)}</a>`).join(", ")}`
          : input.source === "user"
          ? "Supplied by a human, not another skill"
          : "No producing skill in the current catalogue";
      return `<li><code>${escapeHtml(input.type)}</code> ${input.required === false ? "(optional)" : ""}<br>${escapeHtml(input.description)}<br><span class="chain-links">${producedNote}</span></li>`;
    })
    .join("");

  const outputsHtml = (skill.outputs || [])
    .map((output) => {
      const consumers = consumersOf(output.type, skill.slug);
      const consumedNote =
        consumers.length > 0
          ? `Consumed by ${consumers.map((c) => `<a href="${skillUrl(c)}">${escapeHtml(c)}</a>`).join(", ")}`
          : "Terminal output — no skill in the current catalogue consumes this yet";
      return `<li><code>${escapeHtml(output.type)}</code><br>${escapeHtml(output.description)}<br><span class="chain-links">${consumedNote}</span></li>`;
    })
    .join("");

  const evidenceHtml = (skill.evidence_base || [])
    .map(
      (e) =>
        `<li><strong>${escapeHtml(e.framework)}</strong><br>${escapeHtml(e.citation)}${e.url ? ` — <a href="${escapeHtml(e.url)}" target="_blank" rel="noopener">source</a>` : ""}</li>`
    )
    .join("");

  // marked passes raw HTML tokens through verbatim, and this lands in
  // innerHTML. The CSP blocks script execution, but an HTML block in a
  // contributed SKILL.md could still spoof page content (e.g. a fake
  // install box) — drop raw HTML entirely; skills are pure markdown.
  marked.use({ renderer: { html: () => "" } });
  const sectionsHtml = (skill.sections || [])
    .map((s) => `<h2>${escapeHtml(s.heading)}</h2>${marked.parse(s.markdown)}`)
    .join("");

  main.innerHTML = `
    <div class="skill-header">
      <h1>${escapeHtml(skill.title)}</h1>
      <p class="description">${escapeHtml(skill.description)}</p>
      <div class="skill-header-actions">${renderShareLinkButton(skill.slug)}</div>
    </div>

    <div class="install-block">
      <h2>Install this skill</h2>
      ${renderInstallPanel()}
    </div>

    <dl class="meta-grid">
      <div><dt>Category</dt><dd>${escapeHtml(lookupLabel(data.taxonomy.categories, skill.category))}</dd></div>
      <div><dt>Research stage</dt><dd>${escapeHtml(lookupLabel(data.taxonomy.stages, skill.stage))}</dd></div>
      <div><dt>WEIRD context</dt><dd>${escapeHtml(skill.weird_context.status)}</dd></div>
      <div><dt>Version</dt><dd>${escapeHtml(skill.version)}</dd></div>
      <div><dt>Authors</dt><dd>${escapeHtml((skill.authors || []).join(", "))}</dd></div>
    </dl>

    ${skill.weird_context.note ? `<p class="notice">${escapeHtml(skill.weird_context.note)}</p>` : ""}

    <h2>Evidence base</h2>
    <ul class="io-list">${evidenceHtml}</ul>

    <h2>Inputs</h2>
    <ul class="io-list">${inputsHtml}</ul>

    <h2>Outputs</h2>
    <ul class="io-list">${outputsHtml}</ul>

    <div class="skill-body">${sectionsHtml}</div>

    <h2>Version history <a class="whats-new-link" href="whats-new">See all skills' updates &rarr;</a></h2>
    ${renderChangelog(skill.changelog)}
  `;

  bindInstallPanel(main.querySelector(".install-panel"), () => [skill.slug]);
  bindShareLinkButtons(main);
})();
