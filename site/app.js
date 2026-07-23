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
