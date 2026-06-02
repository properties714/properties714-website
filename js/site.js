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

  // ── AI Chat Engine ─────────────────────────────────────────────
  var _chat = { open: false, step: 0, situation: '', address: '', name: '', phone: '', done: false };

  var SUPA_URL = 'https://pgyzlqfuwclapdjcxvgk.supabase.co';
  var SUPA_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBneXpscWZ1d2NsYXBkamN4dmdrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQ3MTE2MDQsImV4cCI6MjA5MDI4NzYwNH0.lnQ5KtEAuaNmAvLyk1wVgdBE3-Pnbgc56iwKBZyhClA';

  var SITUATIONS = {
    'Foreclosure': 'Time is critical with foreclosure — we\'ve helped many Georgia homeowners close <strong>before the auction date</strong>.',
    'Inherited home': 'Inherited properties can be complex. We buy <strong>as-is, no repairs needed</strong>, and handle all the paperwork.',
    'Behind on payments': 'We can often help you <strong>stop the foreclosure process</strong> and put cash in your hands fast.',
    'Divorce': 'We make it simple — a fast close so you can <strong>both move forward</strong> without months of waiting.',
    'Tired landlord': 'We buy rental properties <strong>with tenants in place</strong> — no evictions needed on your end.',
    'Just exploring': 'No pressure at all! Let me show you how fast and simple it can be to get a fair offer.'
  };

  function chatMsg(text, who, cb) {
    var box = document.getElementById('chat-msgs');
    if (!box) return;
    var d = document.createElement('div');
    d.className = 'chat-msg chat-msg--' + who;
    var b = document.createElement('div');
    b.className = 'chat-bub';
    b.innerHTML = text;
    d.appendChild(b);
    box.appendChild(d);
    box.scrollTop = 9999;
    if (cb) setTimeout(cb, 80);
  }

  function chatTyping(cb) {
    var box = document.getElementById('chat-msgs');
    if (!box) return;
    var d = document.createElement('div');
    d.className = 'chat-msg chat-typing-row';
    d.id = 'chat-typ';
    d.innerHTML = '<div class="chat-typing"><span></span><span></span><span></span></div>';
    box.appendChild(d);
    box.scrollTop = 9999;
    setTimeout(function () {
      var t = document.getElementById('chat-typ');
      if (t) t.remove();
      cb();
    }, 1350);
  }

  function chatSetQR(replies) {
    var qr = document.getElementById('chat-qr');
    var ir = document.getElementById('chat-input-row');
    if (!qr || !ir) return;
    qr.innerHTML = '';
    if (replies && replies.length) {
      replies.forEach(function (r) {
        var btn = document.createElement('button');
        btn.className = 'chat-qr-btn';
        btn.textContent = r;
        btn.onclick = function () { chatQRClick(r); };
        qr.appendChild(btn);
      });
      ir.style.display = 'none';
    } else {
      ir.style.display = 'flex';
      setTimeout(function () {
        var inp = document.getElementById('chat-inp');
        if (inp) inp.focus();
      }, 120);
    }
  }

  function chatQRClick(choice) {
    document.getElementById('chat-qr').innerHTML = '';
    document.getElementById('chat-input-row').style.display = 'none';
    chatMsg(choice, 'user');
    _chat.situation = choice;
    var resp = SITUATIONS[choice] || SITUATIONS['Just exploring'];
    chatTyping(function () {
      chatMsg(resp + '<br><br>What\'s the address of the property you\'d like to sell?', 'bot');
      chatSetQR(null);
      var inp = document.getElementById('chat-inp');
      if (inp) inp.placeholder = '1234 Peachtree Blvd, Atlanta, GA';
      _chat.step = 2;
    });
  }

  window.chatSend = function () {
    var inp = document.getElementById('chat-inp');
    if (!inp || !inp.value.trim()) return;
    var val = inp.value.trim();
    inp.value = '';
    document.getElementById('chat-input-row').style.display = 'none';
    chatMsg(val, 'user');

    if (_chat.step === 2) {
      _chat.address = val;
      chatTyping(function () {
        chatMsg('Got it! 🔍 We buy homes all across Georgia. What\'s your name?', 'bot');
        chatSetQR(null);
        var inp2 = document.getElementById('chat-inp');
        if (inp2) inp2.placeholder = 'Your full name';
        _chat.step = 3;
      });
    } else if (_chat.step === 3) {
      _chat.name = val;
      chatTyping(function () {
        chatMsg(val.split(' ')[0] + '! One last thing — what\'s the best phone number to reach you?', 'bot');
        chatSetQR(null);
        var inp2 = document.getElementById('chat-inp');
        if (inp2) { inp2.placeholder = '(404) 555-0000'; inp2.type = 'tel'; }
        _chat.step = 4;
      });
    } else if (_chat.step === 4 && !_chat.done) {
      _chat.phone = val;
      _chat.done = true;
      document.getElementById('chat-input-row').style.display = 'none';
      chatTyping(function () {
        chatMsg('✅ You\'re all set, <strong>' + _chat.name.split(' ')[0] + '</strong>! Our team will review your property and call you <strong>within the hour</strong> with your cash offer. Thank you! 🏡', 'bot');
        fetch(SUPA_URL + '/rest/v1/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': SUPA_KEY, 'Authorization': 'Bearer ' + SUPA_KEY },
          body: JSON.stringify({ address: _chat.address, name: _chat.name, phone: _chat.phone, situation: _chat.situation, source: 'chat-widget' })
        }).catch(function () {});
      });
    }
  };

  window.chatToggle = function () {
    var wrap = document.getElementById('p714-chat');
    var teaser = document.getElementById('chat-teaser');
    var notif = document.getElementById('chat-notif');
    if (!wrap) return;
    _chat.open = !_chat.open;
    wrap.classList.toggle('open', _chat.open);
    if (_chat.open) {
      if (teaser) teaser.classList.remove('show');
      if (notif) notif.style.display = 'none';
      if (_chat.step === 0) {
        _chat.step = 1;
        setTimeout(function () {
          chatTyping(function () {
            chatMsg('Hi! 👋 I\'m your <strong>Properties714 AI Guide</strong>. I can help you get a fair cash offer for your Georgia home in minutes.<br><br>What best describes your situation?', 'bot');
            chatSetQR(['Foreclosure', 'Inherited home', 'Behind on payments', 'Divorce', 'Tired landlord', 'Just exploring']);
          });
        }, 350);
      }
    }
  };

  window.chatDismissTeaser = function () {
    var t = document.getElementById('chat-teaser');
    if (t) t.classList.remove('show');
  };

  function initChat() {
    var inp = document.getElementById('chat-inp');
    if (inp) {
      inp.addEventListener('keydown', function (e) { if (e.key === 'Enter') window.chatSend(); });
    }
    var teaser = document.getElementById('chat-teaser');
    if (teaser) {
      teaser.addEventListener('click', function (e) {
        if (!e.target.closest('.chat-teaser-x')) window.chatToggle();
      });
    }
    // Show teaser after 7 seconds
    setTimeout(function () {
      var t = document.getElementById('chat-teaser');
      if (t && !_chat.open) t.classList.add('show');
    }, 7000);
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

  // ── Rotating hero text ─────────────────────────────────────────
  var ROTATING_WORDS = ['fast.', 'stress-free.', 'as-is.', 'before foreclosure.', 'for cash.', 'in 7 days.'];

  function initRotatingText() {
    var el = document.getElementById('rotating-word');
    if (!el) return;
    var idx = 0;
    setInterval(function () {
      el.classList.add('word-exit');
      setTimeout(function () {
        idx = (idx + 1) % ROTATING_WORDS.length;
        el.textContent = ROTATING_WORDS[idx];
        el.classList.remove('word-exit');
      }, 360);
    }, 2700);
  }

  // ── Video modal ────────────────────────────────────────────────
  function initVideoModal() {
    var modal = document.getElementById('video-modal');
    if (!modal) return;
    modal.addEventListener('click', function (e) {
      if (e.target === modal) window.closeVideoModal();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) {
        window.closeVideoModal();
      }
    });
  }

  window.openVideoModal = function () {
    var modal = document.getElementById('video-modal');
    var frame = document.getElementById('modal-video-frame');
    var noop = document.getElementById('modal-video-noop');
    var heroVideo = document.getElementById('hero-video');
    if (!modal) return;

    var src = (heroVideo && heroVideo.src) ? heroVideo.src : '';
    var hasVideo = src.length > 10 && src.indexOf('http') === 0 && !src.endsWith(window.location.href);

    if (frame) {
      if (hasVideo) {
        frame.src = src + (src.indexOf('?') > -1 ? '&' : '?') + 'autoplay=1';
        frame.style.display = 'block';
      } else {
        frame.src = '';
        frame.style.display = 'none';
      }
    }
    if (noop) noop.style.display = hasVideo ? 'none' : 'flex';

    modal.classList.add('open');
    document.body.style.overflow = 'hidden';
  };

  window.closeVideoModal = function () {
    var modal = document.getElementById('video-modal');
    var frame = document.getElementById('modal-video-frame');
    if (!modal) return;
    modal.classList.remove('open');
    document.body.style.overflow = '';
    setTimeout(function () {
      if (frame) { frame.src = ''; frame.style.display = 'none'; }
      var noop = document.getElementById('modal-video-noop');
      if (noop) noop.style.display = 'flex';
    }, 350);
  };

  // ── Init all ───────────────────────────────────────────────────
  document.addEventListener('DOMContentLoaded', function () {
    initReveal();
    initCounters();
    initTicker();
    initRotatingText();
    initVideoModal();
    initChat();
    initNav();
    initMobileMenu();
    initSmoothScroll();
  });

})();
