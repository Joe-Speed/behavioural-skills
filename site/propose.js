// Flip this to a real URL to have submissions POST to a backend instead of
// opening a pre-filled GitHub issue. The form and its payload shape don't
// change either way — only this constant does.
const SUBMISSION_ENDPOINT = null; // e.g. "https://your-backend.example.com/api/skill-drafts"

const GITHUB_REPO = "Joe-Speed/behavioral-skills";

(async function () {
  const form = document.getElementById("propose-form");
  const status = document.getElementById("propose-status");
  const categorySelect = document.getElementById("category-select");
  const stageSelect = document.getElementById("stage-select");

  try {
    const data = await loadIndex();
    for (const c of data.taxonomy.categories) {
      const opt = document.createElement("option");
      opt.value = c.id;
      opt.textContent = c.label;
      categorySelect.appendChild(opt);
    }
    for (const s of data.taxonomy.stages) {
      const opt = document.createElement("option");
      opt.value = s.id;
      opt.textContent = s.label;
      stageSelect.appendChild(opt);
    }
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

    status.style.display = "block";

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
