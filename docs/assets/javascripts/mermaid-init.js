/* Render Mermaid fences produced by pymdownx.superfences.
   Mermaid is pinned in mkdocs.yml so syntax/rendering does not drift silently. */
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
      theme: "default"
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
