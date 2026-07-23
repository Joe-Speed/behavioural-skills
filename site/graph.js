(async function () {
  const canvas = document.getElementById("graph-canvas");
  const status = document.getElementById("graph-status");

  let data;
  try {
    data = await loadIndex();
  } catch (err) {
    renderError(canvas, err);
    return;
  }

  const elements = [
    ...data.graph.nodes.map((node) => ({
      data: { id: node.id, label: node.label, kind: node.kind },
    })),
    ...data.graph.edges.map((edge, i) => ({
      data: {
        id: `edge-${i}`,
        source: edge.from,
        target: edge.to,
        label: lookupLabel(data.taxonomy.io_types, edge.via),
      },
    })),
  ];

  const cy = cytoscape({
    container: canvas,
    elements,
    layout: { name: "breadthfirst", directed: true, padding: 30, spacingFactor: 1.4 },
    style: [
      {
        selector: 'node[kind="skill"]',
        style: {
          "background-color": "#8a3b2f",
          label: "data(label)",
          color: "#1c1b19",
          "font-size": 11,
          "text-valign": "bottom",
          "text-margin-y": 6,
          width: 34,
          height: 34,
        },
      },
      {
        selector: 'node[kind="external-input"]',
        style: {
          "background-color": "#9c9584",
          shape: "round-rectangle",
          label: "data(label)",
          color: "#1c1b19",
          "font-size": 10,
          "text-valign": "bottom",
          "text-margin-y": 6,
          width: 24,
          height: 24,
        },
      },
      {
        selector: "edge",
        style: {
          width: 1.5,
          "line-color": "#c9c2b3",
          "target-arrow-color": "#c9c2b3",
          "target-arrow-shape": "triangle",
          "curve-style": "bezier",
          label: "data(label)",
          "font-size": 9,
          color: "#55524c",
          "text-background-color": "#fbfaf8",
          "text-background-opacity": 1,
          "text-background-padding": 2,
        },
      },
    ],
  });

  cy.on("tap", 'node[kind="skill"]', (evt) => {
    window.location.href = skillUrl(evt.target.id());
  });

  cy.nodes().forEach((n) => (n.style("cursor", n.data("kind") === "skill" ? "pointer" : "default")));

  if (data.graph.terminalOutputs.length > 0) {
    const lines = data.graph.terminalOutputs.map(
      (t) =>
        `"${lookupLabel(data.taxonomy.io_types, t.type)}" (produced by ${t.producedBy.join(", ")}) has no consuming skill yet.`
    );
    status.textContent = lines.join(" ");
  }
})();
