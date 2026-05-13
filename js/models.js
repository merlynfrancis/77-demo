/* =========================================================================
   77 MARINE — MODELS PAGE
   ------------------------------------------------------------------------
   Renders model cards from KHA.models and wires up category filtering.
   Each card displays the model's Arabic-rooted name, English class,
   spec line, and the brief story behind the name.
   ========================================================================= */

(function () {
  'use strict';

  function init() {
    const grid = document.querySelector('[data-model-grid]');
    const filterBar = document.querySelector('[data-filter-bar]');
    if (!grid || !window.KHA || !window.KHA.models) return;

    const { models, modelCategories } = window.KHA;
    let active = 'all';

    /* Build filter buttons */
    if (filterBar) {
      filterBar.innerHTML = modelCategories.map((c, i) => (
        `<button data-cat="${c.id}" aria-pressed="${i === 0}">${c.label}</button>`
      )).join('');
      filterBar.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (!btn) return;
        active = btn.getAttribute('data-cat');
        filterBar.querySelectorAll('button').forEach(b =>
          b.setAttribute('aria-pressed', b === btn ? 'true' : 'false')
        );
        render();
      });
    }

    /* Render grid */
    function render() {
      const list = active === 'all' ? models : models.filter(m => m.category === active);
      grid.innerHTML = list.map(m => `
        <article class="card card--media model-card">
          <div class="media">
            <img src="${m.image}" alt="${m.name} — ${m.subtitle}" loading="lazy" decoding="async" />
            <span class="tag tag--floating">${m.categoryLabel}</span>
          </div>
          <div class="body">
            <div class="model-card__head">
              <div>
                <h3 class="model-card__name">${m.name}</h3>
                <p class="model-card__sub">${m.subtitle}</p>
              </div>
              <span class="model-card__arabic" aria-hidden="true">${m.arabic}</span>
            </div>
            <p class="model-card__meaning"><em>${m.meaning}</em></p>
            <p class="model-card__desc">${m.description}</p>
            <div class="meta">
              <span>LOA<strong>${m.length}</strong></span>
              <span>CAP<strong>${m.capacity}</strong></span>
            </div>
            <a href="contact.html?model=${encodeURIComponent(m.name)}" class="btn btn--ghost model-card__cta">
              Request Specs
              <svg class="arrow" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5">
                <path d="M2 8h12M9 3l5 5-5 5"/>
              </svg>
            </a>
          </div>
        </article>
      `).join('');

      if (window.KHA.animations && window.KHA.animations.observe) {
        grid.querySelectorAll('.card').forEach((c, i) => {
          c.classList.add('reveal');
          c.setAttribute('data-delay', (i % 4) + 1);
          window.KHA.animations.observe(c);
        });
      }
    }

    render();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
