/* =========================================================================
   KHA MARINE — ANIMATIONS
   ------------------------------------------------------------------------
   Lightweight reveal-on-scroll using IntersectionObserver.
   - Honors prefers-reduced-motion (no-op)
   - Uses transform + opacity only (cheap)
   - One-shot reveals (unobserves after triggering)
   ========================================================================= */

(function () {
  'use strict';

  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let observer = null;

  function setupObserver() {
    if (reduce || !('IntersectionObserver' in window)) return null;
    return new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.05 });
  }

  function init() {
    observer = setupObserver();
    if (reduce) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    if (!observer) {
      document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-visible'));
      return;
    }
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  }

  // Expose so models.js can register dynamically rendered cards
  window.KHA = window.KHA || {};
  window.KHA.animations = {
    observe(el) {
      if (!observer) {
        if (el && el.classList) el.classList.add('is-visible');
        return;
      }
      observer.observe(el);
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
