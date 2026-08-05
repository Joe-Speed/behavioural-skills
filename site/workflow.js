(async function () {
  const libraryEl = document.getElementById("workflow-library-groups");
  const stepsList = document.getElementById("workflow-steps");
  const stepsEmpty = document.getElementById("workflow-steps-empty");
  const generateBtn = document.getElementById("workflow-generate");
  const clearBtn = document.getElementById("workflow-clear");
  const output = document.getElementById("workflow-output");
  const installSlot = document.getElementById("workflow-install-slot");
  const copyMdBtn = document.getElementById("workflow-copy-md");
  const downloadBtn = document.getElementById("workflow-download-md");

  let data;
  try {
    data = await loadIndex();
  } catch (err) {
    renderError(libraryEl, err);
    return;
  }

  bindCommandPalette(data);
  bindCopyButton(copyMdBtn, "Copied");

  const skillsBySlug = new Map(data.skills.map((s) => [s.slug, s]));
  const ioTypesById = new Map(data.taxonomy.io_types.map((t) => [t.id, t]));

  // The workflow being built, as an ordered list of slugs. Steps can repeat
  // a skill — nothing about running key-behaviour-definer twice on two
  // different sub-populations is invalid, so this doesn't enforce
  // uniqueness.
  let steps = [];

  function renderLibrary() {
    const groups = data.taxonomy.stages
      .map((stage) => ({ stage, skills: data.skills.filter((s) => s.stage === stage.id) }))
      .filter((g) => g.skills.length > 0);

    libraryEl.innerHTML = groups
      .map(
        ({ stage, skills }) => `
          <div class="workflow-library-group">
            <p class="workflow-library-stage">${escapeHtml(stage.label)}</p>
            ${skills
              .map(
                (skill) => `
                  <div class="workflow-library-card" draggable="true" data-slug="${escapeHtml(skill.slug)}">
                    <span class="workflow-library-card-title">${escapeHtml(skill.title)}</span>
                    <button type="button" class="workflow-add-btn" data-slug="${escapeHtml(skill.slug)}" aria-label="Add ${escapeHtml(
                      skill.title
                    )} to workflow">+</button>
                  </div>
                `
              )
              .join("")}
          </div>
        `
      )
      .join("");
  }

  // Which io_types are available to step `index` — produced by every step
  // strictly before it in the sequence. A required input is otherwise only
  // satisfiable if a human supplies it directly (user_suppliable).
  function availableTypesBefore(index) {
    const types = new Set();
    for (let i = 0; i < index; i++) {
      const skill = skillsBySlug.get(steps[i]);
      for (const out of skill.outputs || []) types.add(out.type);
    }
    return types;
  }

  function checkInput(input, availableTypes) {
    const userSuppliable = ioTypesById.get(input.type)?.user_suppliable === true;
    return { ...input, satisfied: userSuppliable || availableTypes.has(input.type) };
  }

  function stepInputChecks(index) {
    const skill = skillsBySlug.get(steps[index]);
    const available = availableTypesBefore(index);
    return (skill.inputs || []).map((input) => checkInput(input, available));
  }

  function addStep(slug, atIndex = steps.length) {
    steps.splice(atIndex, 0, slug);
    renderSteps();
  }

  function removeStep(index) {
    steps.splice(index, 1);
    renderSteps();
  }

  function moveStep(from, to) {
    if (from === to || to < 0 || to >= steps.length) return;
    const [slug] = steps.splice(from, 1);
    steps.splice(to, 0, slug);
    renderSteps();
  }

  function renderSteps() {
    output.hidden = true; // any edit invalidates a previously generated plan

    stepsEmpty.hidden = steps.length > 0;
    stepsList.innerHTML = steps
      .map((slug, index) => {
        const skill = skillsBySlug.get(slug);
        const checks = stepInputChecks(index);
        const unmetCount = checks.filter((c) => c.required !== false && !c.satisfied).length;
        return `
          <li class="workflow-step${unmetCount > 0 ? " workflow-step-warning" : ""}" draggable="true" data-index="${index}">
            <span class="workflow-step-order">${index + 1}</span>
            <div class="workflow-step-body">
              <h3><a href="${skillUrl(slug)}">${escapeHtml(skill.title)}</a></h3>
              <ul class="workflow-step-inputs">
                ${checks
                  .map(
                    (c) => `
                      <li class="${c.satisfied ? "workflow-io-ok" : "workflow-io-warning"}">
                        ${c.satisfied ? "✓" : "⚠"} <code>${escapeHtml(c.type)}</code>${
                      c.required === false ? ' <span class="workflow-io-optional">optional</span>' : ""
                    }${c.satisfied ? "" : " — not produced earlier in this workflow"}
                      </li>
                    `
                  )
                  .join("")}
              </ul>
            </div>
            <div class="workflow-step-actions">
              <button type="button" class="workflow-step-move" data-dir="up" data-index="${index}" aria-label="Move up" ${
          index === 0 ? "disabled" : ""
        }>&uarr;</button>
              <button type="button" class="workflow-step-move" data-dir="down" data-index="${index}" aria-label="Move down" ${
          index === steps.length - 1 ? "disabled" : ""
        }>&darr;</button>
              <button type="button" class="workflow-step-remove" data-index="${index}" aria-label="Remove step">&times;</button>
            </div>
          </li>
        `;
      })
      .join("");

    generateBtn.disabled = steps.length === 0;
  }

  // --- Library: drag source + click-to-add fallback (touch/keyboard) ---

  libraryEl.addEventListener("dragstart", (evt) => {
    const card = evt.target.closest(".workflow-library-card");
    if (!card) return;
    evt.dataTransfer.setData("text/plain", JSON.stringify({ source: "library", slug: card.dataset.slug }));
    evt.dataTransfer.effectAllowed = "copy";
  });

  libraryEl.addEventListener("click", (evt) => {
    const btn = evt.target.closest(".workflow-add-btn");
    if (btn) addStep(btn.dataset.slug);
  });

  // --- Sequence: drop target for both new adds and reordering ---

  stepsList.addEventListener("dragover", (evt) => evt.preventDefault());

  stepsList.addEventListener("dragstart", (evt) => {
    const li = evt.target.closest(".workflow-step");
    if (!li) return;
    evt.dataTransfer.setData("text/plain", JSON.stringify({ source: "step", index: Number(li.dataset.index) }));
    evt.dataTransfer.effectAllowed = "move";
  });

  stepsList.addEventListener("drop", (evt) => {
    evt.preventDefault();
    let payload;
    try {
      payload = JSON.parse(evt.dataTransfer.getData("text/plain"));
    } catch {
      return;
    }

    const targetLi = evt.target.closest(".workflow-step");
    const dropIndex = targetLi ? Number(targetLi.dataset.index) : steps.length;

    if (payload.source === "library") {
      addStep(payload.slug, dropIndex);
    } else if (payload.source === "step") {
      const to = payload.index < dropIndex ? dropIndex - 1 : dropIndex;
      moveStep(payload.index, to);
    }
  });

  stepsList.addEventListener("click", (evt) => {
    const moveBtn = evt.target.closest(".workflow-step-move");
    const removeBtn = evt.target.closest(".workflow-step-remove");
    if (moveBtn) {
      const index = Number(moveBtn.dataset.index);
      moveStep(index, index + (moveBtn.dataset.dir === "up" ? -1 : 1));
    } else if (removeBtn) {
      removeStep(Number(removeBtn.dataset.index));
    }
  });

  clearBtn.addEventListener("click", () => {
    steps = [];
    renderSteps();
  });

  // --- Generate: a runnable install command + a downloadable/copyable plan ---

  function buildWorkflowMarkdown() {
    const lines = [`# Workflow: ${steps.length} skill${steps.length === 1 ? "" : "s"}`, "", "## Steps"];

    steps.forEach((slug, index) => {
      const skill = skillsBySlug.get(slug);
      const checks = stepInputChecks(index);
      lines.push(
        `${index + 1}. **${skill.title}** — ${lookupLabel(data.taxonomy.categories, skill.category)} / ${lookupLabel(
          data.taxonomy.stages,
          skill.stage
        )}`
      );
      for (const c of checks) {
        const status = c.satisfied
          ? c.required === false
            ? "optional, satisfied"
            : "satisfied"
          : `NOT YET SATISFIED — not produced by an earlier step${c.required === false ? " (optional)" : ""}`;
        lines.push(`   - Needs \`${c.type}\`: ${status}`);
      }
      for (const o of skill.outputs || []) {
        lines.push(`   - Produces \`${o.type}\``);
      }
    });

    lines.push("", "## Install these skills", "```bash", buildInstallCommand([...new Set(steps)], "unix"), "```");
    return lines.join("\n");
  }

  function downloadTextFile(filename, text) {
    const blob = new Blob([text], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  }

  generateBtn.addEventListener("click", () => {
    const markdown = buildWorkflowMarkdown();
    installSlot.innerHTML = renderTerminal(buildInstallCommand([...new Set(steps)], "unix"), "bash");
    bindTerminalCopyButtons(installSlot);
    copyMdBtn.dataset.copyText = markdown;
    downloadBtn.onclick = () => downloadTextFile("workflow.md", markdown);
    output.hidden = false;
  });

  renderLibrary();
  renderSteps();
})();
