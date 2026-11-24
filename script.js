// ================================================================
//  Bluespectrum Innovative — Enhanced with GSAP + Lenis
//  Motion stack: GSAP 3.12 + ScrollTrigger + Lenis smooth scroll
// ================================================================

document.addEventListener('DOMContentLoaded', () => {

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasGSAP = typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined';
  const hasLenis = typeof Lenis !== 'undefined';

  // ── 1. Header reference (used by scroll handlers below) ────────
  const header = document.querySelector('.site-header');

  // ── 2. Lenis smooth scroll ─────────────────────────────────────
  let lenis = null;

  if (!prefersReduced && hasLenis && hasGSAP) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
      // Prevent Lenis from intercepting the services carousel
      prevent: (node) => node.id === 'services-track',
    });

    // Connect Lenis to GSAP ticker for frame-perfect sync
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    // Keep ScrollTrigger in sync with Lenis scroll position
    lenis.on('scroll', ScrollTrigger.update);

    // Update header on Lenis scroll event
    lenis.on('scroll', ({ scroll }) => {
      if (header) header.classList.toggle('scrolled', scroll > 10);
    });

  } else {
    // Fallback: native scroll for header
    if (header) {
      window.addEventListener('scroll', () => {
        header.classList.toggle('scrolled', window.scrollY > 10);
      }, { passive: true });
      header.classList.toggle('scrolled', window.scrollY > 10);
    }
  }

  // ── 3. Word splitter ────────────────────────────────────────────
  // Splits heading text into animated word spans.
  // Sets aria-label to preserve accessible name.
  // Returns array of inner span elements (the ones GSAP animates).
  function splitWords(el) {
    if (!el) return [];
    const text = el.innerText.trim();
    if (!text) return [];
    el.setAttribute('aria-label', text);
    el.innerHTML = text
      .split(/\s+/)
      .map(w => `<span class="sw" aria-hidden="true"><span class="swi">${w}</span></span>`)
      .join(' ');
    return Array.from(el.querySelectorAll('.swi'));
  }

  // ── 4. Hero intro timeline ──────────────────────────────────────
  const heroSection = document.querySelector('.hero');
  const heroHeading = document.querySelector('.hero-heading');
  const heroEyebrow = document.querySelector('.hero-eyebrow');
  const heroDesc    = document.querySelector('.hero-description');
  const heroButtons = document.querySelector('.hero-buttons');
  const heroCenter  = document.querySelector('.hero-img-card--center');

  if (heroSection && hasGSAP && !prefersReduced) {

    // Split heading into animatable words
    const words = splitWords(heroHeading);
    // Remove CSS reveal class — GSAP owns this element now
    if (heroHeading) heroHeading.classList.remove('reveal-text');

    // Build GSAP intro timeline
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    // Nav: logo then links then CTA button, staggered
    tl.from('.nav-logo', { opacity: 0, y: -14, duration: 0.55 }, 0.05);
    tl.from('.nav-links li', {
      opacity: 0, y: -10, stagger: 0.055, duration: 0.5,
    }, 0.15);
    tl.from('.nav-cta', { opacity: 0, y: -10, duration: 0.5 }, 0.42);

    // Eyebrow tag
    tl.from(heroEyebrow, { opacity: 0, y: 18, duration: 0.52 }, 0.3);

    // Heading words cascade upward from beneath clip (overflow: hidden on .sw)
    if (words.length) {
      tl.from(words, {
        y: '112%',
        duration: 0.72,
        stagger: 0.042,
        ease: 'power3.out',
      }, 0.48);
    }

    // Description paragraph
    tl.from(heroDesc, { opacity: 0, y: 22, duration: 0.58 }, 0.95);

    // CTA buttons
    tl.from(heroButtons, { opacity: 0, y: 14, duration: 0.5 }, 1.1);

    // Center image card rises up
    tl.from(heroCenter, {
      opacity: 0, y: 55, duration: 0.95, ease: 'power2.out',
    }, 0.38);

    // Left + right cards enter via CSS transition (triggered by class)
    // Timing: after center card has risen
    tl.add(() => {
      if (heroSection) heroSection.classList.add('cards-visible');
    }, 0.68);

  } else {
    // Reduced motion or no GSAP: show everything immediately
    if (heroSection) heroSection.classList.add('cards-visible');
    document.querySelectorAll('.reveal-text').forEach(el => el.classList.add('is-visible'));
  }

  // ── 5. ScrollTrigger section reveals ───────────────────────────
  if (hasGSAP && !prefersReduced) {
    ScrollTrigger.defaults({ once: true });

    // --- Helper: split + reveal heading on scroll ---
    function revealHeading(selector, start = 'top 80%') {
      const el = document.querySelector(selector);
      if (!el) return;
      const ws = splitWords(el);
      el.classList.remove('reveal-text');
      el.classList.add('is-visible'); // so it stays visible if ST never fires
      ScrollTrigger.create({
        trigger: el,
        start,
        onEnter: () => {
          gsap.from(ws, {
            y: '112%',
            duration: 0.65,
            stagger: 0.038,
            ease: 'power3.out',
            clearProps: 'transform',
          });
        },
      });
    }

    // --- Helper: fade-up single element ---
    function revealFade(selector, extraVars = {}, start = 'top 82%') {
      const el = document.querySelector(selector);
      if (!el) return;
      ScrollTrigger.create({
        trigger: el,
        start,
        onEnter: () => gsap.from(el, {
          opacity: 0, y: 28, duration: 0.65, ease: 'power2.out',
          clearProps: 'transform,opacity',
          ...extraVars,
        }),
      });
    }

    // --- Helper: stagger-fade a set of elements ---
    function revealStagger(selector, stagger = 0.09, start = 'top 85%') {
      const els = Array.from(document.querySelectorAll(selector));
      if (!els.length) return;
      ScrollTrigger.create({
        trigger: els[0],
        start,
        onEnter: () => gsap.from(els, {
          opacity: 0, y: 38, duration: 0.62, stagger,
          ease: 'power2.out',
          onComplete: () => gsap.set(els, { clearProps: 'transform,opacity' }),
        }),
      });
    }

    // ── Research section ──────────────────────────────────────────
    revealHeading('.research-heading');
    revealFade('.research-right');

    // ── Services section ──────────────────────────────────────────
    revealHeading('#services-heading', 'top 82%');
    revealStagger('.service-card', 0.075);

    // ── Approach section ──────────────────────────────────────────
    revealHeading('#approach-heading');
    revealStagger('.approach-card', 0.1);

    // ── Vision section ────────────────────────────────────────────
    revealHeading('#vision-heading');
    revealFade('.vision-body', { delay: 0.3 });

    // Globe floats up with scale (cinematic)
    ScrollTrigger.create({
      trigger: '.vision-globe',
      start: 'top 90%',
      onEnter: () => gsap.from('.vision-globe img', {
        opacity: 0, y: 80, scale: 0.92,
        duration: 1.15, ease: 'power2.out',
        clearProps: 'transform,opacity',
      }),
    });

    // ── CTA section ───────────────────────────────────────────────
    revealHeading('#cta-heading');
    ScrollTrigger.create({
      trigger: '.cta-inner',
      start: 'top 80%',
      onEnter: () => {
        gsap.from('.cta-text > p, .cta-text > a', {
          opacity: 0, y: 20, duration: 0.62, stagger: 0.12,
          ease: 'power2.out', delay: 0.28,
          onComplete: () => gsap.set('.cta-text > p, .cta-text > a', { clearProps: 'transform,opacity' }),
        });
        gsap.from('.cta-photo', {
          opacity: 0, x: 52, duration: 0.95, ease: 'power2.out', delay: 0.1,
          clearProps: 'transform,opacity',
        });
      },
    });

    // ── Footer ────────────────────────────────────────────────────
    revealStagger('.footer-columns .footer-col', 0.08, 'top 90%');
  }

  // ── 6. Hero cursor glow (fine pointer only) ─────────────────────
  if (!prefersReduced && window.matchMedia('(pointer: fine)').matches && heroSection) {
    let rafId = null;
    let mx = 50, my = 50;
    heroSection.addEventListener('mousemove', (e) => {
      const r = heroSection.getBoundingClientRect();
      mx = (e.clientX - r.left) / r.width  * 100;
      my = (e.clientY - r.top)  / r.height * 100;
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          heroSection.style.setProperty('--hgx', mx + '%');
          heroSection.style.setProperty('--hgy', my + '%');
          rafId = null;
        });
      }
    }, { passive: true });
  }

  // ── 7. Mobile menu ──────────────────────────────────────────────
  const toggle     = document.querySelector('.nav-toggle');
  const menuClose  = document.querySelector('.mobile-menu-close');
  const menuDialog = document.getElementById('mobile-menu');

  function openMenu() {
    if (!menuDialog) return;
    menuDialog.showModal ? menuDialog.showModal() : menuDialog.setAttribute('open', '');
    if (toggle) toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }
  function closeMenu() {
    if (!menuDialog) return;
    menuDialog.close ? menuDialog.close() : menuDialog.removeAttribute('open');
    if (toggle) toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    if (toggle) toggle.focus();
  }

  if (toggle)    toggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);
  if (menuDialog) {
    menuDialog.addEventListener('cancel', (e) => { e.preventDefault(); closeMenu(); });
    menuDialog.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));
  }

  // ── 8. Services carousel ────────────────────────────────────────
  const track   = document.getElementById('services-track');
  const btnPrev = document.getElementById('carousel-prev');
  const btnNext = document.getElementById('carousel-next');

  if (track && btnPrev && btnNext) {
    function getCardWidth() {
      const card = track.querySelector('.service-card');
      return card ? card.offsetWidth + 8 : 368;
    }
    function updateBtns() {
      btnPrev.disabled = track.scrollLeft <= 4;
      btnNext.disabled = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    }

    btnPrev.addEventListener('click', () => track.scrollBy({ left: -getCardWidth(), behavior: 'smooth' }));
    btnNext.addEventListener('click', () => track.scrollBy({ left:  getCardWidth(), behavior: 'smooth' }));
    track.addEventListener('scroll', updateBtns, { passive: true });
    window.addEventListener('resize', updateBtns, { passive: true });
    updateBtns();

    // Mouse drag
    let isDragging = false, startX = 0, startSL = 0;
    track.addEventListener('mousedown', (e) => {
      isDragging = true;
      startX  = e.pageX - track.offsetLeft;
      startSL = track.scrollLeft;
      track.classList.add('is-dragging');
      e.preventDefault();
    });
    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      track.scrollLeft = startSL - (e.pageX - track.offsetLeft - startX) * 1.2;
    });
    document.addEventListener('mouseup', () => {
      isDragging = false;
      track.classList.remove('is-dragging');
    });

    // Touch swipe
    let tStart = 0, slStart = 0;
    track.addEventListener('touchstart', (e) => {
      tStart  = e.touches[0].clientX;
      slStart = track.scrollLeft;
    }, { passive: true });
    track.addEventListener('touchmove', (e) => {
      track.scrollLeft = slStart + (tStart - e.touches[0].clientX);
    }, { passive: true });
    track.addEventListener('touchend', updateBtns, { passive: true });
  }

  // ── 9. Button cursor spotlight ──────────────────────────────────
  document.querySelectorAll('.btn, .btn-outline-light, .btn-ev-wl, .btn-ev-sp').forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const r = btn.getBoundingClientRect();
      btn.style.setProperty('--cursor-x', (e.clientX - r.left) + 'px');
      btn.style.setProperty('--cursor-y', (e.clientY - r.top)  + 'px');
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.setProperty('--cursor-x', '-200px');
      btn.style.setProperty('--cursor-y', '-200px');
    });
  });

});
