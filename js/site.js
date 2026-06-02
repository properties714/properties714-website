/**
 * Properties714 — Site enhancements
 * Scroll reveal animations, animated counters, activity ticker, floating buttons
 */
(function () {
  'use strict';

  // ── Scroll reveal ──────────────────────────────────────────────
  function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');
    if (!els.length) return;
    const io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    els.forEach(function (el) { io.observe(el); });
  }

  // ── Animated counters ──────────────────────────────────────────
  function animateCounter(el, end, duration, suffix) {
    suffix = suffix || '';
    var start = 0;
    var startTime = null;
    var isFloat = end !== Math.floor(end);

    function step(ts) {
      if (!startTime) startTime = ts;
      var progress = Math.min((ts - startTime) / duration, 1);
      var eased = 1 - Math.pow(1 - progress, 3);
      var val = start + (end - start) * eased;
      el.textContent = (isFloat ? val.toFixed(1) : Math.floor(val)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
      else el.textContent = end + suffix;
    }
    requestAnimationFrame(step);
  }

  function initCounters() {
    var statVals = document.querySelectorAll('.stat-val[data-count]');
    if (!statVals.length) return;
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var el = entry.target;
            var end = parseFloat(el.dataset.count);
            var suffix = el.dataset.suffix || '';
            animateCounter(el, end, 1800, suffix);
            io.unobserve(el);
          }
        });
      },
      { threshold: 0.5 }
    );
    statVals.forEach(function (el) { io.observe(el); });
  }

  // ── Activity ticker ────────────────────────────────────────────
  var ACTIVITIES = [
    '🏠 Maria S. from Marietta received her cash offer — 2 hours ago',
    '📞 James T. from Atlanta requested a call-back — 4 hours ago',
    '✅ Sandra K. from Decatur closed on her home — yesterday',
    '🏠 Robert M. from Savannah got his offer in under 24h — 2 days ago',
    '📞 Carmen L. from Macon submitted her property — 3 hours ago',
    '✅ Michael R. from Stone Mountain accepted his offer — this morning',
    '🏠 Patricia W. from Norcross received her free offer — 1 hour ago',
  ];

  function initTicker() {
    var ticker = document.getElementById('activity-ticker-text');
    if (!ticker) return;
    var idx = Math.floor(Math.random() * ACTIVITIES.length);
    ticker.textContent = ACTIVITIES[idx];

    setInterval(function () {
      ticker.style.opacity = '0';
      ticker.style.transform = 'translateY(-6px)';
      setTimeout(function () {
        idx = (idx + 1) % ACTIVITIES.length;
        ticker.textContent = ACTIVITIES[idx];
        ticker.style.opacity = '1';
        ticker.style.transform = 'translateY(0)';
      }, 350);
    }, 4500);
  }

  // ── Floating action buttons ────────────────────────────────────
  function initFAB() {
    if (document.getElementById('p714-fab')) return;
    var fab = document.createElement('div');
    fab.id = 'p714-fab';
    fab.className = 'p714-fab';
    fab.innerHTML =
      '<a href="https://wa.me/14045901613?text=Hi%2C%20I%27d%20like%20a%20cash%20offer%20for%20my%20property." ' +
      '  target="_blank" rel="noopener" class="p714-fab-btn p714-fab-wa" aria-label="WhatsApp">' +
      '  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>' +
      '  <span>WhatsApp</span>' +
      '</a>' +
      '<a href="tel:4045901613" class="p714-fab-btn p714-fab-call" aria-label="Call us">' +
      '  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.38 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.56a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>' +
      '  <span>(404) 590-1613</span>' +
      '</a>';
    document.body.appendChild(fab);
  }

  // ── Sticky nav scroll enhancement ─────────────────────────────
  function initNav() {
    var nav = document.getElementById('site-nav');
    if (!nav) return;
    window.addEventListener('scroll', function () {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    }, { passive: true });
  }

  // ── Mobile menu ────────────────────────────────────────────────
  function initMobileMenu() {
    var btn = document.getElementById('hamburger');
    var menu = document.getElementById('mobile-menu');
    if (!btn || !menu) return;
    btn.addEventListener('click', function () {
      menu.classList.toggle('open');
      btn.innerHTML = menu.classList.contains('open') ? '&#10005;' : '&#9776;';
    });
    // close on link click
    menu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () {
        menu.classList.remove('open');
        btn.innerHTML = '&#9776;';
      });
    });
  }

  // ── Smooth scroll anchors ──────────────────────────────────────
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(function (a) {
      a.addEventListener('click', function (e) {
        var target = document.querySelector(a.getAttribute('href'));
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
        }
      });
    });
  }

  // ── Testimonial carousel auto-scroll ─────────────────────────
  function initTestiCarousel() {
    var grid = document.querySelector('.testi-grid');
    if (!grid) return;
    var cards = grid.querySelectorAll('.testi-card');
    if (cards.length < 3) return;
    var current = 1;
    setInterval(function () {
      cards.forEach(function (c) { c.classList.remove('testi-card--active'); });
      current = (current + 1) % cards.length;
      cards[current].classList.add('testi-card--active');
    }, 4000);
  }

  // ── Init all ───────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCounters();
    initTicker();
    initFAB();
    initNav();
    initMobileMenu();
    initSmoothScroll();
  });

})();
