/* Mermaid rendering for the course.
   Source diagrams carry semantic classes; CSS owns theme-aware colors.
   The configuration below keeps spacing and labels predictable. */
(() => {
  "use strict";

  async function renderMermaid() {
    if (!window.mermaid) {
      console.error("Mermaid runtime is not available");
      return;
    }

    window.mermaid.initialize({
      startOnLoad: false,
      securityLevel: "strict",
      theme: "base",
      themeVariables: {
        background: "transparent",
        primaryColor: "#eef3ff",
        primaryTextColor: "#172033",
        primaryBorderColor: "#64748b",
        lineColor: "#64748b",
        edgeLabelBackground: "#ffffff",
        tertiaryColor: "#f5f7fb",
        fontFamily: "inherit",
        fontSize: "14px"
      },
      flowchart: {
        htmlLabels: true,
        useMaxWidth: true,
        curve: "linear",
        nodeSpacing: 28,
        rankSpacing: 38,
        padding: 10
      }
    });

    try {
      await window.mermaid.run({ querySelector: ".mermaid" });
    } catch (error) {
      console.error("Mermaid rendering failed", error);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", renderMermaid, { once: true });
  } else {
    renderMermaid();
  }

  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(renderMermaid);
  }
})();
