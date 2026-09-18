/* =========================================================
   IDPS Course UI v1.0
   Progressive enhancement only.
   All instructional content must remain available without JS.
   ========================================================= */

(() => {
  "use strict";

  function initializeSwitcher(root) {
    if (!root || root.dataset.idpsReady === "true") return;

    const buttons = [...root.querySelectorAll("[data-idps-switch]")];
    const panels = [...root.querySelectorAll("[data-idps-panel]")];
    if (!buttons.length || !panels.length) return;

    root.dataset.idpsReady = "true";
    root.classList.add("is-enhanced");

    function activate(name, focusButton = false) {
      buttons.forEach((button) => {
        const active = button.dataset.idpsSwitch === name;
        button.setAttribute("aria-selected", String(active));
        button.tabIndex = active ? 0 : -1;
        if (active && focusButton) button.focus();
      });

      panels.forEach((panel) => {
        const active = panel.dataset.idpsPanel === name;
        panel.hidden = !active;
        panel.setAttribute("aria-hidden", String(!active));
      });
    }

    buttons.forEach((button, index) => {
      button.addEventListener("click", () => activate(button.dataset.idpsSwitch));

      button.addEventListener("keydown", (event) => {
        if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
        event.preventDefault();

        let targetIndex = index;
        if (event.key === "ArrowLeft") targetIndex = (index - 1 + buttons.length) % buttons.length;
        if (event.key === "ArrowRight") targetIndex = (index + 1) % buttons.length;
        if (event.key === "Home") targetIndex = 0;
        if (event.key === "End") targetIndex = buttons.length - 1;

        activate(buttons[targetIndex].dataset.idpsSwitch, true);
      });
    });

    const initiallySelected = buttons.find((button) => button.getAttribute("aria-selected") === "true");
    activate(initiallySelected?.dataset.idpsSwitch || buttons[0].dataset.idpsSwitch);
  }

  function initializeIdpsUI(context = document) {
    context.querySelectorAll("[data-idps-switcher]").forEach(initializeSwitcher);
  }

  function boot() {
    initializeIdpsUI(document);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }

  // MkDocs Material may expose document$ when instant navigation is enabled later.
  // Supporting it now makes the component safe for future navigation settings.
  if (window.document$ && typeof window.document$.subscribe === "function") {
    window.document$.subscribe(() => initializeIdpsUI(document));
  }

  window.IDPSUI = Object.freeze({ initialize: initializeIdpsUI });
})();
