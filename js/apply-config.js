/**
 * Properties714 — apply-config.js
 * Reads admin settings from localStorage and applies them to the page.
 * Include this script at the bottom of every page's <body>.
 */
(function () {
  'use strict';

  function getData() {
    try { return JSON.parse(localStorage.getItem('p714_data') || '{}'); } catch (e) { return {}; }
  }

  function set(selector, value, attr) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(el => {
      if (attr) el.setAttribute(attr, value);
      else el.textContent = value;
    });
  }

  function setAttr(selector, attr, value) {
    if (!value) return;
    document.querySelectorAll(selector).forEach(el => el.setAttribute(attr, value));
  }

  const data = getData();

  // ── Site Config ──────────────────────────────────────────────
  const cfg = data.siteconfig || {};
  if (cfg.phoneDisplay) set('.site-phone-display', cfg.phoneDisplay);
  if (cfg.phone)        setAttr('a.site-phone-link', 'href', 'tel:' + cfg.phone);
  if (cfg.email)        set('.site-email', cfg.email);
  if (cfg.area)         set('.site-area', cfg.area);
  if (cfg.hours)        set('.site-hours', cfg.hours);
  if (cfg.tagline1)     set('.site-tagline1', cfg.tagline1);
  if (cfg.tagline2)     set('.site-tagline2', cfg.tagline2);

  // ── Hero ─────────────────────────────────────────────────────
  const hero = data.hero || {};

  // Video
  const vid = document.getElementById('hero-video');
  const ph  = document.getElementById('video-placeholder');
  if (vid && hero.videoId && hero.videoId.trim()) {
    vid.src = 'https://www.youtube.com/embed/' + hero.videoId + '?rel=0&modestbranding=1';
    vid.style.display = 'block';
    if (ph) ph.style.display = 'none';
  } else if (vid && !hero.videoId) {
    vid.style.display = 'none';
    if (ph) ph.style.display = 'flex';
  }

  if (hero.videoLabel) set('.video-label', hero.videoLabel);

  // Hero text
  const h1 = document.querySelector('.hero-heading');
  if (h1 && (hero.line1 || hero.line2 || hero.line3)) {
    const l1 = hero.line1 || 'Sell your house';
    const l2 = hero.line2 || 'fast, as-is,';
    const l3 = hero.line3 || 'for cash.';
    h1.innerHTML = l1 + '<br><em>' + l2 + '</em><br>' + l3;
  }

  if (hero.sub)   set('.hero-sub', hero.sub);
  if (hero.badge) set('.hero-badge-text', hero.badge);

  const trusts = document.querySelectorAll('.trust-item span');
  if (hero.trust1 && trusts[0]) trusts[0].textContent = hero.trust1;
  if (hero.trust2 && trusts[1]) trusts[1].textContent = hero.trust2;
  if (hero.trust3 && trusts[2]) trusts[2].textContent = hero.trust3;

  // ── Stats Bar ────────────────────────────────────────────────
  const stats = data.stats || {};
  const statVals = document.querySelectorAll('.stat-val');
  const statLbls = document.querySelectorAll('.stat-lbl');
  for (let i = 1; i <= 5; i++) {
    const s = stats['s' + i];
    if (s && s.val && statVals[i - 1]) statVals[i - 1].textContent = s.val;
    if (s && s.lbl && statLbls[i - 1]) statLbls[i - 1].textContent = s.lbl;
  }

  // ── Properties ───────────────────────────────────────────────
  const props = data.properties;
  const propGrid = document.querySelector('.prop-grid');
  if (props && props.length && propGrid) {
    propGrid.innerHTML = props.slice(0, 3).map(p => `
      <div class="prop-card">
        <div class="prop-img-wrap">
          <img src="${p.img}" alt="Property" />
          <span class="prop-badge ${p.status}">${p.status === 'avail' ? 'Available' : p.status === 'contract' ? 'Under Contract' : 'Sold'}</span>
        </div>
        <div class="prop-body">
          <div class="prop-price">${p.price}</div>
          <div class="prop-addr">${p.addr}</div>
          <div class="prop-specs"><span>${p.beds} bed</span><span>${p.baths} bath</span><span>${p.sqft} sqft</span></div>
          <a href="/properties.html" class="prop-link">Learn more &rarr;</a>
        </div>
      </div>
    `).join('');
  }

  // ── Testimonials ─────────────────────────────────────────────
  const testis = data.testimonials;
  const testiGrid = document.querySelector('.testi-grid');
  if (testis && testis.length && testiGrid) {
    testiGrid.innerHTML = testis.map((t, i) => `
      <div class="testi-card ${i === 1 ? 'testi-card--featured' : ''}">
        <div class="testi-stars">★★★★★</div>
        <blockquote>"${t.quote}"</blockquote>
        <div class="testi-author">
          <div class="testi-avatar">${(t.name || 'X').substring(0, 2).toUpperCase()}</div>
          <div><div class="testi-name">${t.name}</div><div class="testi-loc">${t.loc}</div></div>
        </div>
      </div>
    `).join('');
  }

})();
