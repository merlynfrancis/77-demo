/* =========================================================================
   77 MARINE — THEME CONTROLLER
   ------------------------------------------------------------------------
   - Persists theme to localStorage
   - Toggles [data-theme] on <html>
   - Syncs <meta name="theme-color">
   - Updates aria-pressed on theme switch buttons
   - Emits a `seven77themechange` event for other modules
   The brand logo is a mask-based SVG that inherits from CSS, so it
   themes automatically — no JS swap required.
   ========================================================================= */

(function () {
  "use strict";

  const STORAGE_KEY = "seven77-theme";
  const LEGACY_KEY = "kha-theme";
  const DEFAULT_THEME = "ocean";
  const THEMES = ["ocean", "steel", "gulf"];

  const THEME_COLOR = {
    ocean: "#050a14",
    steel: "#f4f6fa",
    gulf: "#0a1a2e",
  };

  function isValidTheme(theme) {
    return THEMES.indexOf(theme) > -1;
  }

  function getSafeTheme(theme) {
    return isValidTheme(theme) ? theme : DEFAULT_THEME;
  }

  function getSavedTheme() {
    try {
      const saved =
        localStorage.getItem(STORAGE_KEY) || localStorage.getItem(LEGACY_KEY);
      return getSafeTheme(saved);
    } catch (e) {
      return DEFAULT_THEME;
    }
  }

  function saveTheme(theme) {
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch (e) {}
  }

  function updateThemeButtons(theme) {
    document.querySelectorAll("[data-theme-set]").forEach(function (btn) {
      const isActive = btn.getAttribute("data-theme-set") === theme;
      btn.setAttribute("aria-pressed", isActive ? "true" : "false");
      btn.classList.toggle("is-active", isActive);
    });
  }

  function updateBrowserThemeColor(theme) {
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute("content", THEME_COLOR[theme] || THEME_COLOR.ocean);
  }

  function applyTheme(theme) {
    const safe = getSafeTheme(theme);
    document.documentElement.setAttribute("data-theme", safe);
    saveTheme(safe);
    updateThemeButtons(safe);
    updateBrowserThemeColor(safe);
    window.dispatchEvent(
      new CustomEvent("seven77themechange", { detail: { theme: safe } })
    );
  }

  function bindThemeSwitcher() {
    document.querySelectorAll("[data-theme-set]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyTheme(btn.getAttribute("data-theme-set"));
      });
    });
  }

  function init() {
    bindThemeSwitcher();
    applyTheme(getSavedTheme());
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }

  window.SEVEN77 = window.SEVEN77 || {};
  window.SEVEN77.theme = { get: getSavedTheme, set: applyTheme };
  // Backwards compat
  window.KHA = window.KHA || {};
  window.KHA.theme = window.SEVEN77.theme;
})();
