(async function () {
  const list = document.getElementById("whats-new-list");

  let data;
  try {
    data = await loadIndex();
  } catch (err) {
    renderError(list, err);
    return;
  }

  bindCommandPalette(data);

  // Each skill's changelog is derived from git log by scripts/build-index.js
  // (see getChangelog there) — this just flattens every skill's entries into
  // one feed, newest first. Nothing here is hand-authored.
  // Changelogs arrive oldest-first per skill; the index tiebreak keeps
  // same-day version bumps newest-first instead of inheriting that order.
  const entries = data.skills
    .flatMap((skill) =>
      (skill.changelog || []).map((entry, entryIndex) => ({ ...entry, entryIndex, skill }))
    )
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.entryIndex - a.entryIndex));

  if (entries.length === 0) {
    list.innerHTML = `<li class="empty-state">No version history yet.</li>`;
    return;
  }

  list.innerHTML = entries
    .map(
      (entry) => `
        <li class="whats-new-entry">
          <div class="whats-new-meta">
            <span class="changelog-date">${escapeHtml(entry.date)}</span>
            <a href="${skillUrl(entry.skill.slug)}">${escapeHtml(entry.skill.title)}</a>
            <span class="changelog-version">v${escapeHtml(entry.version)}</span>
          </div>
          <p>${escapeHtml(entry.summary)}</p>
        </li>
      `
    )
    .join("");
})();
