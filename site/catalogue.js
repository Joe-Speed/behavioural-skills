(async function () {
  const grid = document.getElementById("skill-grid");
  const categoryFilters = document.getElementById("category-filters");
  const stageFilters = document.getElementById("stage-filters");
  const sidebar = document.getElementById("install-sidebar");
  const searchInput = document.getElementById("skill-search");

  let data;
  try {
    data = await loadIndex();
  } catch (err) {
    renderError(grid, err);
    return;
  }

  bindCommandPalette(data.skills);

  const activeCategories = new Set();
  const activeStages = new Set();
  const selectedSlugs = new Set();
  let searchQuery = "";
  const skillsBySlug = new Map(data.skills.map((s) => [s.slug, s]));

  sidebar.innerHTML = `
    <h2>Install</h2>
    <p class="install-hint">Select skills from the list to build a combined install command.</p>
    ${renderInstallPanel({ withSelection: true })}
  `;
  const panel = sidebar.querySelector(".install-panel");
  const selectedCount = panel.querySelector(".selected-count");
  const selectedChips = panel.querySelector(".selected-chips");
  const refreshTerminal = bindInstallPanel(panel, () => Array.from(selectedSlugs));

  function refreshSelection() {
    selectedCount.textContent = String(selectedSlugs.size);
    renderSelectedChips(selectedChips, selectedSlugs, skillsBySlug, (slug) => {
      selectedSlugs.delete(slug);
      const checkbox = grid.querySelector(`input[data-slug="${CSS.escape(slug)}"]`);
      if (checkbox) checkbox.checked = false;
      refreshSelection();
    });
    refreshTerminal();
  }

  function firstSentence(text) {
    const clean = text.replace(/\s+/g, " ").trim();
    // Trigger descriptions end sentences in ".", "?", or "!" (optionally
    // followed by a closing quote), and abbreviations like "e.g." must not
    // be mistaken for a sentence end. If none found within budget, fall
    // back to the last whole word that fits, with an ellipsis — never
    // slice mid-word.
    const match = clean.match(/^.{1,220}?(?<!\be\.g)(?<!\bi\.e)(?<!\betc)[.!?]["')]?(?=\s|$)/);
    if (match) return match[0];
    if (clean.length <= 220) return clean;
    const truncated = clean.slice(0, 220);
    const lastSpace = truncated.lastIndexOf(" ");
    return (lastSpace > 0 ? truncated.slice(0, lastSpace) : truncated) + "…";
  }

  function renderChips(container, items, activeSet) {
    container.innerHTML = "";
    const allChip = document.createElement("span");
    allChip.className = "chip" + (activeSet.size === 0 ? " active" : "");
    allChip.textContent = "All";
    allChip.onclick = () => {
      activeSet.clear();
      renderAll();
    };
    container.appendChild(allChip);

    for (const item of items) {
      const chip = document.createElement("span");
      chip.className = "chip" + (activeSet.has(item.id) ? " active" : "");
      chip.textContent = item.label;
      chip.onclick = () => {
        if (activeSet.has(item.id)) activeSet.delete(item.id);
        else activeSet.add(item.id);
        renderAll();
      };
      container.appendChild(chip);
    }
  }

  function renderGrid() {
    const q = searchQuery.trim().toLowerCase();
    const filtered = data.skills.filter((s) => {
      const catOk = activeCategories.size === 0 || activeCategories.has(s.category);
      const stageOk = activeStages.size === 0 || activeStages.has(s.stage);
      const searchOk = !q || `${s.title} ${s.description}`.toLowerCase().includes(q);
      return catOk && stageOk && searchOk;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="empty-state">No skills match${q ? ` "${escapeHtml(searchQuery)}"` : " this filter combination"}.</p>`;
      return;
    }

    grid.innerHTML = "";
    for (const skill of filtered) {
      const card = document.createElement("div");
      card.className = "skill-card";
      card.innerHTML = `
        <label class="skill-card-check">
          <input type="checkbox" data-slug="${skill.slug}" ${selectedSlugs.has(skill.slug) ? "checked" : ""} />
        </label>
        <a class="skill-card-link" href="${skillUrl(skill.slug)}">
          <h3>${skill.title}</h3>
          <div class="tags">
            <span class="tag">${lookupLabel(data.taxonomy.categories, skill.category)}</span>
            <span class="tag">${lookupLabel(data.taxonomy.stages, skill.stage)}</span>
          </div>
          <p class="desc">${firstSentence(skill.description)}</p>
        </a>
      `;
      card.querySelector("input").addEventListener("change", (e) => {
        if (e.target.checked) selectedSlugs.add(skill.slug);
        else selectedSlugs.delete(skill.slug);
        refreshSelection();
      });
      grid.appendChild(card);
    }
  }

  function renderAll() {
    renderChips(categoryFilters, data.taxonomy.categories, activeCategories);
    renderChips(stageFilters, data.taxonomy.stages, activeStages);
    renderGrid();
  }

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    renderGrid();
  });

  renderAll();
})();
