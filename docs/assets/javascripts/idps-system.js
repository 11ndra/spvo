/* =========================================================
   IDPS Course UI v1.2
   Progressive enhancement only.
   All instructional content must remain available without JS.
   ========================================================= */

(() => {
  "use strict";

  function initializeSwitcher(root) {
    if (!root || root.dataset.idpsReady === "true") return;

    const controls = root.querySelector(".idps-switcher__controls");
    const buttons = [...root.querySelectorAll("[data-idps-switch]")];
    const panels = [...root.querySelectorAll("[data-idps-panel]")];
    if (!controls || !buttons.length || !panels.length) return;

    controls.setAttribute("role", "tablist");
    buttons.forEach((button) => {
      button.setAttribute("role", "tab");
      const panelId = button.getAttribute("aria-controls");
      if (!panelId) return;
      const panel = root.querySelector(`#${CSS.escape(panelId)}`);
      if (!panel) return;
      if (!button.id) button.id = `${panelId}-tab`;
      panel.setAttribute("role", "tabpanel");
      panel.setAttribute("aria-labelledby", button.id);
    });

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

  function initializeFocusMap(root) {
    if (!root || root.dataset.idpsFocusReady === "true") return;

    const controls = root.querySelector(".idps-focus-map__controls");
    const buttons = [...root.querySelectorAll("[data-idps-focus]")];
    const targets = [...root.querySelectorAll("[data-idps-focus-target]")];
    if (!controls || !buttons.length || !targets.length) return;

    root.dataset.idpsFocusReady = "true";
    root.classList.add("is-enhanced");
    controls.setAttribute("role", "group");

    function targetMatches(target, name) {
      if (name === "all") return true;
      return (target.dataset.idpsFocusTarget || "")
        .split(/\s+/)
        .filter(Boolean)
        .includes(name);
    }

    function activate(name) {
      const showAll = name === "all";
      root.classList.toggle("is-filtered", !showAll);

      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.idpsFocus === name));
      });

      targets.forEach((target) => {
        const active = targetMatches(target, name);
        target.classList.toggle("is-focused", !showAll && active);
        target.classList.toggle("is-dimmed", !showAll && !active);
      });
    }

    buttons.forEach((button) => {
      button.addEventListener("click", () => activate(button.dataset.idpsFocus));
    });

    activate(buttons.find((button) => button.getAttribute("aria-pressed") === "true")?.dataset.idpsFocus || "all");
  }

  function initializeIdpsUI(context = document) {
    context.querySelectorAll("[data-idps-switcher]").forEach(initializeSwitcher);
    context.querySelectorAll("[data-idps-focus-map]").forEach(initializeFocusMap);
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
