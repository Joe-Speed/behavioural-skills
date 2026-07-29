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
// With nothing selected yet, names falls back to a placeholder token so the
// terminal always shows a complete (if unrunnable) command rather than
// disappearing.
function buildInstallCommand(slugs, platform) {
  const names = slugs.length > 0 ? slugs.join(",") : "<select-skills>";
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
      <p class="install-hint" data-install-hint>Copy, paste, run. Updates as you change platform${withSelection ? " or selection" : ""}.</p>

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

      <details class="install-advanced">
        <summary>
          <span>Advanced</span>
          <svg class="install-advanced-chevron" viewBox="0 0 16 16" fill="none" aria-hidden="true"><path d="M3.5 6 8 10.5 12.5 6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </summary>
        <div class="install-advanced-body">
          <div class="install-advanced-grid">
            <div>
              <p class="install-advanced-label">Project root</p>
              <div class="install-cd-slot"></div>
            </div>
            <div>
              <p class="install-advanced-label">Verify</p>
              <div class="install-verify-slot"></div>
            </div>
          </div>
          <p class="install-path-note">Selected skills are installed into <code>skills/</code> in your project, unmodified.</p>
        </div>
      </details>
    </div>
  `;
}

// Native <details> snaps open/closed with no transition. Animates the
// body's height instead: on open, set it to 0 then to scrollHeight so the
// browser has a start and end value to transition between; on close, the
// reverse, only flipping the `open` attribute off once the transition ends.
function bindAdvancedUnfurl(details) {
  const summary = details.querySelector("summary");
  const body = details.querySelector(".install-advanced-body");
  if (!summary || !body) return;

  summary.addEventListener("click", (evt) => {
    evt.preventDefault();

    if (details.open) {
      const startHeight = body.getBoundingClientRect().height;
      body.style.height = `${startHeight}px`;
      body.getBoundingClientRect(); // force reflow so the next line transitions
      body.style.height = "0px";
      body.addEventListener(
        "transitionend",
        () => {
          details.open = false;
          body.style.height = "";
        },
        { once: true }
      );
    } else {
      details.open = true;
      const endHeight = body.scrollHeight;
      body.style.height = "0px";
      body.getBoundingClientRect();
      body.style.height = `${endHeight}px`;
      body.addEventListener("transitionend", () => { body.style.height = ""; }, { once: true });
    }
  });
}

// Wires up a panel rendered by renderInstallPanel(). getSlugs() is called on
// every render to get the current skill slug list, so the catalogue can pass
// a closure over its live selection while skill.html passes a fixed one.
// Returns a refresh() function the caller can invoke after the selection
// changes elsewhere (e.g. a checkbox toggle).
function bindInstallPanel(panel, getSlugs) {
  const slot = panel.querySelector(".install-terminal-slot");
  const cdSlot = panel.querySelector(".install-cd-slot");
  const verifySlot = panel.querySelector(".install-verify-slot");
  const select = panel.querySelector(".platform-input");
  const hint = panel.querySelector("[data-install-hint]");
  bindAdvancedUnfurl(panel.querySelector(".install-advanced"));

  function refresh() {
    const slugs = getSlugs();
    const platform = select.value;
    const isWindows = platform === "windows";
    const lang = isWindows ? "powershell" : "bash";

    const command = buildInstallCommand(slugs, platform);
    slot.innerHTML = renderTerminal(command, lang);
    bindTerminalCopyButtons(slot);

    cdSlot.innerHTML = renderTerminal(isWindows ? "cd C:\\path\\to\\your-project" : "cd /path/to/your-project", lang);
    bindTerminalCopyButtons(cdSlot);

    verifySlot.innerHTML = renderTerminal(isWindows ? "dir skills" : "ls skills/", lang);
    bindTerminalCopyButtons(verifySlot);

    if (hint) hint.hidden = slugs.length > 0;
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

function formatStarCount(n) {
  if (n >= 1000) return (n / 1000).toFixed(1).replace(/\.0$/, "") + "k";
  return String(n);
}

// Every page includes a .github-badge in its header; fetch the live star
// count for it. GitHub's REST API allows anonymous CORS reads of public repo
// metadata, so no token or proxy is needed. Fails silently (drops the count,
// keeps the link) on rate-limit or network errors.
async function bindGithubStarBadge() {
  const countEl = document.querySelector(".github-badge-count");
  if (!countEl) return;
  try {
    const res = await fetch("https://api.github.com/repos/Joe-Speed/behavioural-skills");
    if (!res.ok) throw new Error(String(res.status));
    const data = await res.json();
    countEl.textContent = formatStarCount(data.stargazers_count);
  } catch (err) {
    console.error("Could not load GitHub star count", err);
    countEl.remove();
  }
}

bindGithubStarBadge();
