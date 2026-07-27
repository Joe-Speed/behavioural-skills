// Shared data-loading helpers for every page. The site reads exactly one
// generated file, site/data/index.json, produced by scripts/build-index.js.
// Nothing here talks to a server beyond that static fetch.

async function loadIndex() {
  const res = await fetch("data/index.json");
  if (!res.ok) {
    throw new Error(
      `Could not load data/index.json (${res.status}). Run "npm run build" first.`
    );
  }
  return res.json();
}

function lookupLabel(list, id) {
  const match = list.find((item) => item.id === id);
  return match ? match.label : id;
}

function skillUrl(slug) {
  return `skill.html?slug=${encodeURIComponent(slug)}`;
}

function qs(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function renderError(container, err) {
  container.innerHTML = `<p class="empty-state">${err.message}</p>`;
  console.error(err);
}

function escapeHtml(str) {
  return str.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

// Renders a dark terminal-style box with a copy button. Caller must invoke
// bindTerminalCopyButtons(container) after inserting this into the DOM.
function renderTerminal(command, label = "bash") {
  return `
    <div class="terminal">
      <div class="terminal-bar">
        <span class="terminal-label">${escapeHtml(label)}</span>
        <button class="terminal-copy" type="button" data-command="${escapeHtml(command)}">Copy</button>
      </div>
      <pre class="terminal-body"><code>${escapeHtml(command)}</code></pre>
    </div>
  `;
}

function bindTerminalCopyButtons(container) {
  container.querySelectorAll(".terminal-copy").forEach((btn) => {
    btn.addEventListener("click", async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.command);
        const original = btn.textContent;
        btn.textContent = "Copied";
        btn.classList.add("copied");
        setTimeout(() => {
          btn.textContent = original;
          btn.classList.remove("copied");
        }, 1500);
      } catch (err) {
        console.error("Copy failed", err);
      }
    });
  });
}

const INSTALL_RAW_BASE = "https://raw.githubusercontent.com/Joe-Speed/behavioural-skills/main";

// scripts/install.sh takes a comma-separated --name list; scripts/install.ps1
// takes the PowerShell equivalent -Name. Both only support unix-style / pwsh
// invocation respectively, so platform picks which script (and shell) to show.
function buildInstallCommand(slugs, platform) {
  const names = slugs.join(",");
  if (platform === "windows") {
    return `iwr -useb ${INSTALL_RAW_BASE}/scripts/install.ps1 -OutFile install.ps1; ./install.ps1 -Target . -Name ${names}`;
  }
  return `curl -sSL ${INSTALL_RAW_BASE}/scripts/install.sh | bash -s -- --target . --name ${names}`;
}

// Renders the install panel shell (platform switch + a slot for the
// terminal). withSelection adds the "Selected: N" summary and chip list used
// by the catalogue's multi-skill picker; skill.html omits it since there's
// only ever one skill in scope.
function renderInstallPanel({ withSelection = false } = {}) {
  return `
    <div class="install-panel">
      <p class="install-eyebrow">Install command</p>
      <p class="install-hint">Copy, paste, run. Updates as you change platform${withSelection ? " or selection" : ""}.</p>

      <label class="platform-select">
        <span>Platform</span>
        <select class="platform-input">
          <option value="unix">macOS / Linux</option>
          <option value="windows">Windows</option>
        </select>
      </label>

      ${
        withSelection
          ? `<div class="selected-summary">Selected: <strong class="selected-count">0</strong></div>
             <div class="selected-chips"></div>`
          : ""
      }

      <div class="install-terminal-slot"></div>
    </div>
  `;
}

// Wires up a panel rendered by renderInstallPanel(). getSlugs() is called on
// every render to get the current skill slug list, so the catalogue can pass
// a closure over its live selection while skill.html passes a fixed one.
// Returns a refresh() function the caller can invoke after the selection
// changes elsewhere (e.g. a checkbox toggle).
function bindInstallPanel(panel, getSlugs) {
  const slot = panel.querySelector(".install-terminal-slot");
  const select = panel.querySelector(".platform-input");

  function refresh() {
    const slugs = getSlugs();
    if (slugs.length === 0) {
      slot.innerHTML = `<p class="empty-state">Select at least one skill to generate an install command.</p>`;
      return;
    }
    const platform = select.value;
    const command = buildInstallCommand(slugs, platform);
    slot.innerHTML = renderTerminal(command, platform === "windows" ? "powershell" : "bash");
    bindTerminalCopyButtons(slot);
  }

  select.addEventListener("change", refresh);
  refresh();
  return refresh;
}

// Renders the removable chip list in the catalogue's install panel.
function renderSelectedChips(container, selectedSlugs, skillsByslug, onRemove) {
  container.innerHTML = "";
  for (const slug of selectedSlugs) {
    const skill = skillsByslug.get(slug);
    const chip = document.createElement("span");
    chip.className = "chip selected-chip";
    chip.innerHTML = `${escapeHtml(skill ? skill.title : slug)} <button type="button" aria-label="Remove ${escapeHtml(
      skill ? skill.title : slug
    )}">&times;</button>`;
    chip.querySelector("button").addEventListener("click", () => onRemove(slug));
    container.appendChild(chip);
  }
}
