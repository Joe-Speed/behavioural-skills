// Flip this to a real URL to have submissions POST to a backend instead of
// opening a pre-filled GitHub issue. The form and its payload shape don't
// change either way — only this constant does. If set, the endpoint's origin
// must also be added to connect-src in every page's CSP meta tag, or the
// browser will block the fetch.
const SUBMISSION_ENDPOINT = null; // e.g. "https://your-backend.example.com/api/skill-drafts"

const GITHUB_REPO = "Joe-Speed/behavioural-skills";

(async function () {
  const form = document.getElementById("propose-form");
  const status = document.getElementById("propose-status");
  const categorySelect = document.getElementById("category-select");
  const stageSelect = document.getElementById("stage-select");

  function populateOptions(select, items) {
    for (const item of items) {
      const opt = document.createElement("option");
      opt.value = item.id;
      opt.textContent = item.label;
      select.appendChild(opt);
    }
  }

  try {
    const data = await loadIndex();
    populateOptions(categorySelect, data.taxonomy.categories);
    populateOptions(stageSelect, data.taxonomy.stages);
    bindCommandPalette(data);
  } catch (err) {
    console.error(err);
  }

  function buildIssueBody(payload) {
    return [
      `**What it does:** ${payload.what_it_does}`,
      ``,
      `**Trigger description:**\n${payload.description}`,
      ``,
      `**Category:** ${payload.category}`,
      `**Stage:** ${payload.stage}`,
      ``,
      `**What it draws on:**\n${payload.evidence_base}`,
      ``,
      `**Declared input(s):** ${payload.inputs}`,
      `**Declared output(s):** ${payload.outputs}`,
      ``,
      `**Known failure modes:**\n${payload.failure_modes || "_not yet specified_"}`,
      ``,
      `**Proposed by:** ${payload.author}`,
    ].join("\n");
  }

  form.addEventListener("submit", async (evt) => {
    evt.preventDefault();
    const payload = Object.fromEntries(new FormData(form).entries());

    status.hidden = false;

    if (SUBMISSION_ENDPOINT) {
      try {
        const res = await fetch(SUBMISSION_ENDPOINT, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error(`Submission endpoint returned ${res.status}`);
        status.textContent = "Draft submitted. Thank you — someone will follow up.";
      } catch (err) {
        status.textContent = `Could not submit: ${err.message}`;
      }
      return;
    }

    const title = encodeURIComponent(`New skill: ${payload.title}`);
    const body = encodeURIComponent(buildIssueBody(payload));
    const url = `https://github.com/${GITHUB_REPO}/issues/new?title=${title}&body=${body}&labels=new-skill-proposal`;
    status.textContent = "Opening a pre-filled GitHub issue in a new tab…";
    window.open(url, "_blank", "noopener");
  });
})();
