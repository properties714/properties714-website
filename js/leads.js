/**
 * Properties714 — Lead submission directly to Supabase
 * No n8n dependency. Handles form state, toasts, and error recovery.
 */
(function () {
  'use strict';

  const SUPA_URL = 'https://pgyzlqfuwclapdjcxvgk.supabase.co';
  const SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneXpscWZ1d2NsYXBkamN4dmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTE2MDQsImV4cCI6MjA5MDI4NzYwNH0.lnQ5KtEAuaNmAvLyk1wVgdBE3-Pnbgc56iwKBZyhClA';

  // ── Toast notifications ────────────────────────────────────────
  function toast(msg, type) {
    type = type || 'success';
    let wrap = document.getElementById('p714-toasts');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'p714-toasts';
      wrap.className = 'toast-container';
      document.body.appendChild(wrap);
    }
    const el = document.createElement('div');
    el.className = 'p714-toast p714-toast--' + type;
    el.innerHTML =
      '<span class="p714-toast-icon">' +
      (type === 'success'
        ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>'
        : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>') +
      '</span>' +
      '<span class="p714-toast-msg">' + msg + '</span>';
    wrap.appendChild(el);
    // auto-dismiss after 5 s
    setTimeout(function () {
      el.classList.add('p714-toast--out');
      setTimeout(function () { el.remove(); }, 350);
    }, 5000);
  }

  // ── Core submit function ───────────────────────────────────────
  async function submitLead(payload) {
    const res = await fetch(SUPA_URL + '/rest/v1/acquisitions_leads', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPA_KEY,
        'Authorization': 'Bearer ' + SUPA_KEY,
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify(payload)
    });
    return res.ok || res.status === 201 || res.status === 204;
  }

  // ── Set button loading/success/error state ─────────────────────
  function setBtnState(btn, state, originalText) {
    if (state === 'loading') {
      btn.disabled = true;
      btn.dataset.origText = btn.innerHTML;
      btn.innerHTML =
        '<svg class="btn-spinner" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg> Sending...';
    } else if (state === 'success') {
      btn.innerHTML =
        '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg> Offer requested!';
      btn.style.background = '#1a5c38';
      btn.style.color = '#fff';
    } else {
      btn.disabled = false;
      btn.innerHTML = originalText || btn.dataset.origText || 'Try again';
    }
  }

  // ── Hero form (index.html) ─────────────────────────────────────
  window.handleHeroForm = async function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    setBtnState(btn, 'loading');

    const payload = {
      name: (document.getElementById('hf-name') || {}).value || '',
      phone: (document.getElementById('hf-phone') || {}).value || '',
      email: '',
      address: (document.getElementById('hf-address') || {}).value || '',
      situation: '',
      notes: '',
      status: 'new',
      source: 'hero_form'
    };

    try {
      const ok = await submitLead(payload);
      if (ok) {
        setBtnState(btn, 'success');
        toast('¡Received! We\'ll call you within 24 hours.', 'success');
        e.target.reset();
      } else {
        throw new Error('non-ok');
      }
    } catch (_) {
      setBtnState(btn, 'reset', origText);
      toast('Something went wrong — please call us at (404) 590-1613.', 'error');
    }
  };

  // ── Sell page form (sell.html) ─────────────────────────────────
  window.handleSellForm = async function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    setBtnState(btn, 'loading');

    const payload = {
      name: (document.getElementById('sell-name') || {}).value || '',
      phone: (document.getElementById('sell-phone') || {}).value || '',
      email: (document.getElementById('sell-email') || {}).value || '',
      address: (document.getElementById('sell-address') || {}).value || '',
      situation: (document.getElementById('sell-situation') || {}).value || '',
      notes: (document.getElementById('sell-notes') || {}).value || '',
      status: 'new',
      source: 'sell_page'
    };

    try {
      const ok = await submitLead(payload);
      if (ok) {
        setBtnState(btn, 'success');
        toast('Offer request received! Eduardo will call you within 24 hours.', 'success');
        e.target.reset();
        // scroll to success confirmation
        document.querySelector('.form-card') && document.querySelector('.form-card').scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        throw new Error('non-ok');
      }
    } catch (_) {
      setBtnState(btn, 'reset', origText);
      toast('Could not submit. Please call (404) 590-1613 directly.', 'error');
    }
  };

  // ── Generic contact form ───────────────────────────────────────
  window.handleContactForm = async function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    setBtnState(btn, 'loading');

    const payload = {
      name: (document.getElementById('contact-name') || {}).value || '',
      phone: (document.getElementById('contact-phone') || {}).value || '',
      email: (document.getElementById('contact-email') || {}).value || '',
      address: '',
      situation: (document.getElementById('contact-topic') || {}).value || 'Contact form',
      notes: (document.getElementById('contact-message') || {}).value || '',
      status: 'new',
      source: 'contact_page'
    };

    try {
      const ok = await submitLead(payload);
      if (ok) {
        setBtnState(btn, 'success');
        toast('Message received! We\'ll get back to you soon.', 'success');
        e.target.reset();
      } else {
        throw new Error('non-ok');
      }
    } catch (_) {
      setBtnState(btn, 'reset', origText);
      toast('Could not submit. Please email us at properties714llc@gmail.com', 'error');
    }
  };

  // ── Investor form ──────────────────────────────────────────────
  window.handleInvestorForm = async function (e) {
    e.preventDefault();
    const btn = e.target.querySelector('button[type="submit"]');
    const origText = btn.innerHTML;
    setBtnState(btn, 'loading');

    const strategy = (document.getElementById('inv-strategy') || {}).value || '';
    const area = (document.getElementById('inv-area') || {}).value || '';
    const budget = (document.getElementById('inv-budget') || {}).value || '';
    const payload = {
      name: (document.getElementById('inv-name') || {}).value || '',
      phone: (document.getElementById('inv-phone') || {}).value || '',
      email: (document.getElementById('inv-email') || {}).value || '',
      address: '',
      situation: 'Investor inquiry',
      notes: [strategy && 'Strategy: ' + strategy, area && 'Area: ' + area, budget && 'Budget: ' + budget].filter(Boolean).join(' | '),
      status: 'new',
      source: 'investor_page'
    };

    try {
      const ok = await submitLead(payload);
      if (ok) {
        setBtnState(btn, 'success');
        toast('You\'re on the list! We\'ll be in touch with deals.', 'success');
        e.target.reset();
      } else {
        throw new Error('non-ok');
      }
    } catch (_) {
      setBtnState(btn, 'reset', origText);
      toast('Could not submit. Please call (404) 590-1613.', 'error');
    }
  };

})();
