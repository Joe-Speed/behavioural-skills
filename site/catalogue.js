(async function () {
  const grid = document.getElementById("skill-grid");
  const categoryFilters = document.getElementById("category-filters");
  const stageFilters = document.getElementById("stage-filters");

  let data;
  try {
    data = await loadIndex();
  } catch (err) {
    renderError(grid, err);
    return;
  }

  const activeCategories = new Set();
  const activeStages = new Set();

  function firstSentence(text) {
    const clean = text.replace(/\s+/g, " ").trim();
    const idx = clean.indexOf(". ");
    return idx > 0 && idx < 220 ? clean.slice(0, idx + 1) : clean.slice(0, 220);
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
    const filtered = data.skills.filter((s) => {
      const catOk = activeCategories.size === 0 || activeCategories.has(s.category);
      const stageOk = activeStages.size === 0 || activeStages.has(s.stage);
      return catOk && stageOk;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `<p class="empty-state">No skills match this filter combination.</p>`;
      return;
    }

    grid.innerHTML = "";
    for (const skill of filtered) {
      const card = document.createElement("a");
      card.className = "skill-card";
      card.href = skillUrl(skill.slug);
      card.innerHTML = `
        <h3>${skill.title}</h3>
        <div class="tags">
          <span class="tag">${lookupLabel(data.taxonomy.categories, skill.category)}</span>
          <span class="tag">${lookupLabel(data.taxonomy.stages, skill.stage)}</span>
        </div>
        <p class="desc">${firstSentence(skill.description)}</p>
      `;
      grid.appendChild(card);
    }
  }

  function renderAll() {
    renderChips(categoryFilters, data.taxonomy.categories, activeCategories);
    renderChips(stageFilters, data.taxonomy.stages, activeStages);
    renderGrid();
  }

  renderAll();
})();
