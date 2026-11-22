/* ==========================================================================
   One Call Restoration — homepage interactions
   Vanilla JS only. Every component degrades gracefully without JS.
   ========================================================================== */
(function () {
  'use strict';

  var root = document.documentElement;
  root.classList.add('js');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var $ = function (s, c) { return (c || document).querySelector(s); };
  var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
  var mq = function (q) { return window.matchMedia(q); };

  /* ---------------------------------------------------------------- 1. Header */
  var header = $('#site-header');
  var onScrollHeader = function () {
    if (!header) return;
    header.classList.toggle('is-stuck', window.pageYOffset > 12);
  };
  onScrollHeader();

  /* --------------------------------------------------- 2. Mobile drawer + trap */
  var burger = $('#burger');
  var drawer = $('#drawer');
  var drawerClose = $('#drawer-close');
  var lastFocused = null;

  function headerOffset() {
    if (!header) return 0;
    return header.getBoundingClientRect().height;
  }

  function openDrawer() {
    if (!drawer) return;
    lastFocused = document.activeElement;
    drawer.classList.add('is-open');
    document.body.classList.add('is-locked');
    root.classList.add('drawer-open');
    if (burger) burger.setAttribute('aria-expanded', 'true');
    var first = drawer.querySelector('.drawer__close');
    if (first) first.focus();
    document.addEventListener('keydown', drawerKeys, true);
  }

  function closeDrawer() {
    if (!drawer) return;
    drawer.classList.remove('is-open');
    document.body.classList.remove('is-locked');
    root.classList.remove('drawer-open');
    if (burger) { burger.setAttribute('aria-expanded', 'false'); burger.focus(); }
    document.removeEventListener('keydown', drawerKeys, true);
  }

  function drawerKeys(e) {
    if (e.key === 'Escape') { e.preventDefault(); closeDrawer(); return; }
    if (e.key !== 'Tab' || !drawer) return;
    var items = $$('a[href], button:not([disabled]), input, select, textarea', drawer)
      .filter(function (el) { return el.offsetParent !== null; });
    if (!items.length) return;
    var firstEl = items[0];
    var lastEl = items[items.length - 1];
    if (e.shiftKey && document.activeElement === firstEl) { e.preventDefault(); lastEl.focus(); }
    else if (!e.shiftKey && document.activeElement === lastEl) { e.preventDefault(); firstEl.focus(); }
  }

  if (burger && drawer) {
    if (drawer.hasAttribute('hidden')) drawer.removeAttribute('hidden');
    burger.addEventListener('click', function () {
      if (drawer.classList.contains('is-open')) closeDrawer(); else openDrawer();
    });
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);
    // close after choosing an in-page destination
    $$('a[href^="#"]', drawer).forEach(function (a) {
      a.addEventListener('click', function () { setTimeout(closeDrawer, 60); });
    });
    mq('(min-width: 1040px)').addEventListener('change', function (ev) {
      if (ev.matches) closeDrawer();
    });
  }

  /* ---------------------------------------------------- 3. Services dropdown */
  var drop = $('#drop-services');
  if (drop) {
    var btn = $('.has-drop__btn', drop);
    var panel = $('#drop-panel', drop);
    var t = null;

    function setDrop(open) {
      drop.classList.toggle('is-open', open);
      if (btn) btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    }
    if (btn) {
      btn.addEventListener('click', function (e) {
        // first tap on touch just opens the panel; a second tap follows the link
        if (!drop.classList.contains('is-open')) { e.preventDefault(); setDrop(true); }
        else { setDrop(false); }
      });
      btn.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') { setDrop(false); btn.focus(); }
        if (e.key === 'ArrowDown') { e.preventDefault(); setDrop(true); var a = panel && panel.querySelector('a'); if (a) a.focus(); }
      });
    }
    // hover to open, but only where the desktop nav is actually shown
    var navVisible = mq('(min-width: 1040px)');
    drop.addEventListener('mouseenter', function () { if (navVisible.matches) { clearTimeout(t); setDrop(true); } });
    drop.addEventListener('mouseleave', function () { if (navVisible.matches) { t = setTimeout(function () { setDrop(false); }, 160); } });
    drop.addEventListener('focusout', function (e) {
      if (!drop.contains(e.relatedTarget)) setDrop(false);
    });
    document.addEventListener('click', function (e) { if (!drop.contains(e.target)) setDrop(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrop(false); });
  }

  /* ------------------------------------------------- 4. Mobile sub-accordion */
  $$('.drawer__group').forEach(function (group) {
    var b = $('.drawer__group__btn', group);
    if (!b) return;
    b.addEventListener('click', function () {
      var open = b.getAttribute('aria-expanded') === 'true';
      b.setAttribute('aria-expanded', open ? 'false' : 'true');
      group.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
  });

  /* --------------------------------------------------------- 5. Scroll-spy */
  var navLinks = $$('.nav__link[href^="#"]');
  var watched = navLinks.map(function (a) { return document.getElementById(a.getAttribute('href').slice(1)); }).filter(Boolean);
  if ('IntersectionObserver' in window && watched.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        navLinks.forEach(function (a) {
          var on = a.getAttribute('href') === '#' + en.target.id;
          if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    watched.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------ 6. Reveal on scroll */
  var reveals = $$('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window) || !reveals.length) {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  } else {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (en.isIntersecting) { en.target.classList.add('is-in'); ro.unobserve(en.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(function (el) { ro.observe(el); });
  }

  /* ------------------------------------------------------- 7. Review carousel */
  var slider = $('#rev-slider');
  if (slider) {
    var track = $('#rev-track');
    var slides = $$('.rev__slide', track);
    var dotsWrap = $('#rev-dots');
    var count = $('#rev-count');
    var i = 0;

    var pad = function (n) { return (n < 10 ? '0' : '') + n; };

    slides.forEach(function (s, idx) {
      s.setAttribute('aria-hidden', idx === 0 ? 'false' : 'true');
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.className = 'rev__dot';
      dot.setAttribute('role', 'tab');
      dot.setAttribute('aria-selected', idx === 0 ? 'true' : 'false');
      dot.innerHTML = '<span class="sr-only">Review ' + (idx + 1) + '</span>';
      dot.addEventListener('click', function () { go(idx); });
      dotsWrap.appendChild(dot);
    });
    var dots = $$('.rev__dot', dotsWrap);

    function go(n) {
      i = (n + slides.length) % slides.length;
      track.style.transform = 'translate3d(-' + (i * 100) + '%,0,0)';
      slides.forEach(function (s, idx) {
        s.setAttribute('aria-hidden', idx === i ? 'false' : 'true');
        $$('a, button', s).forEach(function (f) { f.tabIndex = idx === i ? 0 : -1; });
      });
      dots.forEach(function (d, idx) { d.setAttribute('aria-selected', idx === i ? 'true' : 'false'); });
      if (count) count.textContent = pad(i + 1) + ' / ' + pad(slides.length);
    }

    var prev = $('#rev-prev'); var next = $('#rev-next');
    if (prev) prev.addEventListener('click', function () { go(i - 1); });
    if (next) next.addEventListener('click', function () { go(i + 1); });
    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(i - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(i + 1); }
    });

    // swipe
    var x0 = null;
    slider.addEventListener('pointerdown', function (e) { x0 = e.clientX; }, { passive: true });
    slider.addEventListener('pointerup', function (e) {
      if (x0 === null) return;
      var dx = e.clientX - x0; x0 = null;
      if (Math.abs(dx) > 46) go(i + (dx < 0 ? 1 : -1));
    });
    go(0);
  }

  /* -------------------------------------------------------------- 8. FAQ */
  var faqItems = $$('#faq-list .faq__item');
  faqItems.forEach(function (item) {
    var btn = $('.faq__q', item);
    var panel = $('.faq__a', item);
    if (!btn || !panel) return;
    btn.addEventListener('click', function () {
      var isOpen = btn.getAttribute('aria-expanded') === 'true';
      faqItems.forEach(function (other) {
        var ob = $('.faq__q', other); var op = $('.faq__a', other);
        if (ob && op && other !== item && ob.getAttribute('aria-expanded') === 'true') {
          ob.setAttribute('aria-expanded', 'false');
          op.style.height = '0px';
        }
      });
      btn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
      if (isOpen) {
        panel.style.height = '0px';
      } else {
        var h = panel.firstElementChild ? panel.firstElementChild.offsetHeight : panel.scrollHeight;
        panel.style.height = reduceMotion ? 'auto' : h + 'px';
        if (!reduceMotion) {
          var done = function (e) {
            if (e.propertyName !== 'height') return;
            panel.removeEventListener('transitionend', done);
            if (btn.getAttribute('aria-expanded') === 'true') panel.style.height = 'auto';
          };
          panel.addEventListener('transitionend', done);
        }
      }
    });
  });
  window.addEventListener('resize', function () {
    $$('#faq-list .faq__a').forEach(function (p) {
      if (p.style.height && p.style.height !== '0px' && p.style.height !== 'auto') p.style.height = 'auto';
    });
  });

  /* ------------------------------------------------------- 9. Quote form */
  var form = $('#quote-form');
  if (form) {
    var EMAIL = 'info@onecallrestoration.ca';
    var statusEl = $('#form-status');
    var fields = {
      name: { el: $('#q-name'), test: function (v) { return v.trim().length >= 2; } },
      phone: { el: $('#q-phone'), test: function (v) { return v.replace(/[^\d]/g, '').length >= 7; } },
      email: { el: $('#q-email'), test: function (v) { return v.trim() === '' || /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()); } },
      message: { el: $('#q-msg'), test: function (v) { return v.trim().length >= 8; } }
    };

    function mark(field, ok) {
      var wrap = field.el.closest('.field');
      if (!wrap) return;
      if (ok) wrap.removeAttribute('data-invalid'); else wrap.setAttribute('data-invalid', '');
      field.el.setAttribute('aria-invalid', ok ? 'false' : 'true');
      var err = $('.field__err', wrap);
      if (err) field.el.setAttribute('aria-describedby', ok ? '' : err.id);
    }

    Object.keys(fields).forEach(function (k) {
      var f = fields[k];
      if (!f.el) return;
      f.el.addEventListener('blur', function () { mark(f, f.test(f.el.value)); });
      f.el.addEventListener('input', function () {
        var wrap = f.el.closest('.field');
        if (wrap && wrap.hasAttribute('data-invalid')) mark(f, f.test(f.el.value));
      });
    });

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var bad = null;
      Object.keys(fields).forEach(function (k) {
        var f = fields[k];
        if (!f.el) return;
        var ok = f.test(f.el.value);
        mark(f, ok);
        if (!ok && !bad) bad = f.el;
      });
      if (bad) {
        bad.focus();
        if (statusEl) {
          statusEl.setAttribute('data-show', 'info');
          statusEl.textContent = 'A few details are still missing — they are highlighted above.';
        }
        return;
      }

      var v = function (el) { return el ? el.value.trim() : ''; };
      var lines = [
        'New enquiry from the One Call Restoration website',
        '',
        'Name:      ' + v(fields.name.el),
        'Phone:     ' + v(fields.phone.el),
        'Email:     ' + (v(fields.email.el) || '—'),
        'Property:  ' + (v($('#q-site')) || '—'),
        'Damage:    ' + v($('#q-type')),
        'Urgency:   ' + v($('#q-urgency')),
        '',
        'Details:',
        v(fields.message.el),
        '',
        '— sent from the One Call Restoration design concept page'
      ];
      var href = 'mailto:' + EMAIL +
        '?subject=' + encodeURIComponent('Restoration enquiry — ' + (v($('#q-type')) || 'general')) +
        '&body=' + encodeURIComponent(lines.join('\n'));

      if (statusEl) {
        statusEl.setAttribute('data-show', 'ok');
        statusEl.innerHTML = 'Your request is drafted. Nothing was sent yet — this page has no server. ' +
          '<a href="' + href + '">Open it in your email app</a>, or ' +
          '<a href="tel:+17809525726">call 780-952-5726</a> if the damage is active right now.';
        statusEl.scrollIntoView({ block: 'center', behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    });
  }

  /* ---------------------------------------- 10. Floating call pill / mobar */
  var pill = $('#callpill');
  var mobar = $('#mobar');
  var toTop = $('#to-top');
  var hero = $('.hero');
  var quiet = [$('#quote'), $('#contact')].filter(Boolean);

  function setFloats(on) {
    [pill, mobar].forEach(function (el) { if (el) el.classList.toggle('is-in', on); });
  }
  var heroSeen = false;
  var quietVisible = false;
  function refreshFloats() { setFloats(heroSeen && !quietVisible); }

  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(function (entries) {
      heroSeen = !entries[0].isIntersecting;
      refreshFloats();
    }, { threshold: 0, rootMargin: '-120px 0px 0px 0px' }).observe(hero);

    var qo = new IntersectionObserver(function (entries) {
      quietVisible = entries.some(function (en) { return en.isIntersecting; });
      refreshFloats();
    }, { threshold: 0.18 });
    quiet.forEach(function (s) { qo.observe(s); });
  } else {
    window.addEventListener('scroll', function () { heroSeen = window.pageYOffset > 500; refreshFloats(); });
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    window.requestAnimationFrame(function () {
      onScrollHeader();
      var y = window.pageYOffset;
      if (toTop) toTop.classList.toggle('is-in', y > 900);
      ticking = false;
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  if (toTop) toTop.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' });
    var l = $('a.logo[href="#top"]'); if (l) l.focus();
  });

  /* ------------------------- 11. In-page links: keep sticky header clearance */
  $$('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var id = a.getAttribute('href');
      if (!id || id === '#' || id.length < 2) return;
      var target = document.getElementById(id.slice(1));
      if (!target) return;
      e.preventDefault();
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset() - 10;
      window.scrollTo({ top: Math.max(0, top), behavior: reduceMotion ? 'auto' : 'smooth' });
      if (!/Moz/i.test(navigator.userAgent)) history.replaceState(null, '', id);
      target.setAttribute('tabindex', '-1');
      setTimeout(function () { target.focus({ preventScroll: true }); }, reduceMotion ? 0 : 420);
    });
  });

  /* -------------------------------------------------------- 12. Footer year */
  var y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());
})();
