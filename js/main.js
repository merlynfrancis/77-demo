/* =========================================================================
   77 MARINE — MAIN JS
   ------------------------------------------------------------------------
   - Sticky header scroll state
   - Unified mobile nav drawer (works on every page)
   - Active nav link highlight
   - Footer year
   - Client ribbon population (from data.js)
   ========================================================================= */

(function () {
  "use strict";

  /* ---------- Header scroll state -------------------------------------- */
  function initHeader() {
    const header = document.querySelector(".site-header");
    if (!header) return;
    const onScroll = () => {
      if (window.scrollY > 12) header.classList.add("is-scrolled");
      else header.classList.remove("is-scrolled");
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ---------- Mobile nav drawer (single unified implementation) -------- */
  function initMobileDrawer() {
    const toggle = document.querySelector(".nav-toggle");
    const drawer = document.getElementById("mobile-drawer");
    const overlay = document.querySelector("[data-mobile-overlay]");
    if (!toggle || !drawer || !overlay) return;

    const closeBtn = drawer.querySelector("[data-mobile-close]");

    function open() {
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      toggle.setAttribute("aria-label", "Close menu");
      drawer.setAttribute("aria-hidden", "false");
      overlay.removeAttribute("hidden");
      const first = drawer.querySelector('a[href], button:not([disabled])');
      if (first) first.focus();
    }

    function close() {
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      drawer.setAttribute("aria-hidden", "true");
      setTimeout(() => {
        if (!document.body.classList.contains("nav-open")) {
          overlay.setAttribute("hidden", "");
        }
      }, 320);
    }

    toggle.addEventListener("click", () => {
      const isOpen = toggle.getAttribute("aria-expanded") === "true";
      isOpen ? close() : open();
    });
    overlay.addEventListener("click", close);
    if (closeBtn) closeBtn.addEventListener("click", close);

    drawer.querySelectorAll("a").forEach((a) => a.addEventListener("click", close));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") close();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth >= 1180) close();
    });
  }

  /* ---------- Active nav link ------------------------------------------ */
  function initActiveLink() {
    const path = location.pathname.split("/").pop() || "index.html";
    document.querySelectorAll(".nav-links a, .mobile-nav-links a").forEach((a) => {
      const href = a.getAttribute("href");
      if (!href) return;
      if (href === path || (path === "" && href === "index.html")) {
        a.setAttribute("aria-current", "page");
      }
    });
  }

  /* ---------- Year in footer ------------------------------------------- */
  function initYear() {
    document.querySelectorAll("[data-year]").forEach((el) => {
      el.textContent = new Date().getFullYear();
    });
  }

  /* ---------- Client ribbon -------------------------------------------- */
  function initRibbon() {
    const track = document.querySelector("[data-ribbon]");
    if (!track || !window.KHA || !window.KHA.clients) return;
    const html = window.KHA.clients
      .map(
        (c) =>
          `<img class="ribbon-logo" src="${c.file}" alt="${c.name}" loading="lazy" decoding="async" />`
      )
      .join("");
    // Duplicate for seamless loop
    track.innerHTML = html + html;
  }

  /* ---------- Init ----------------------------------------------------- */
  function init() {
    initHeader();
    initMobileDrawer();
    initActiveLink();
    initYear();
    initRibbon();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
