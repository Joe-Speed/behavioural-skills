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
