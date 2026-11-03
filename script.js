// ================================================================
//  Bluespectrum Innovative — Home Page Scripts
// ================================================================

document.addEventListener('DOMContentLoaded', () => {

  // ── 1. Header scroll effect ────────────────────────────────────
  const header = document.querySelector('.site-header');
  function onScroll() {
    header.classList.toggle('scrolled', window.scrollY > 10);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ── 2. Mobile menu ─────────────────────────────────────────────
  const toggle     = document.querySelector('.nav-toggle');
  const menuClose  = document.querySelector('.mobile-menu-close');
  const menuDialog = document.getElementById('mobile-menu');

  function openMenu() {
    if (!menuDialog) return;
    if (menuDialog.showModal) {
      menuDialog.showModal();
    } else {
      menuDialog.setAttribute('open', '');
    }
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden'; // scroll lock
  }

  function closeMenu() {
    if (!menuDialog) return;
    if (menuDialog.close) {
      menuDialog.close();
    } else {
      menuDialog.removeAttribute('open');
    }
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
    toggle.focus(); // return focus to trigger
  }

  if (toggle) toggle.addEventListener('click', openMenu);
  if (menuClose) menuClose.addEventListener('click', closeMenu);

  // Escape key closes menu
  if (menuDialog) {
    menuDialog.addEventListener('cancel', (e) => {
      e.preventDefault();
      closeMenu();
    });
    // Close when a link is clicked
    menuDialog.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', closeMenu);
    });
  }

  // ── 3. Reveal animations (IntersectionObserver) ────────────────
  const revealEls = document.querySelectorAll('.reveal-text');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            // Stagger siblings within same parent
            entry.target.classList.add('is-visible');
            revealObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0, rootMargin: '0px 0px -60px 0px' }
    );
    revealEls.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: show all immediately
    revealEls.forEach(el => el.classList.add('is-visible'));
  }

  // ── 4. Hero image cards entrance ──────────────────────────────
  // Outer cards slide in from ±200px after a short delay
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    // Trigger after page load settles
    const heroImgObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              heroSection.classList.add('cards-visible');
            }, 200);
            heroImgObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );
    heroImgObserver.observe(heroSection);
  }

  // ── 5. Services carousel ───────────────────────────────────────
  const track    = document.getElementById('services-track');
  const btnPrev  = document.getElementById('carousel-prev');
  const btnNext  = document.getElementById('carousel-next');

  if (!track || !btnPrev || !btnNext) return;

  // Step = one card width + gap
  function getCardWidth() {
    const card = track.querySelector('.service-card');
    if (!card) return 368;
    return card.offsetWidth + 8; // 8px gap
  }

  function updateButtons() {
    const atStart = track.scrollLeft <= 4;
    const atEnd   = track.scrollLeft >= track.scrollWidth - track.clientWidth - 4;
    btnPrev.disabled = atStart;
    btnNext.disabled = atEnd;
  }

  function scrollCarousel(dir) {
    track.scrollBy({ left: dir * getCardWidth(), behavior: 'smooth' });
  }

  btnPrev.addEventListener('click', () => scrollCarousel(-1));
  btnNext.addEventListener('click', () => scrollCarousel(1));

  track.addEventListener('scroll', updateButtons, { passive: true });
  // Run once on load to set initial state
  updateButtons();

  // ── Drag/swipe on carousel ─────────────────────────────────────
  let isDragging = false;
  let startX = 0;
  let startScrollLeft = 0;

  track.addEventListener('mousedown', (e) => {
    isDragging = true;
    startX = e.pageX - track.offsetLeft;
    startScrollLeft = track.scrollLeft;
    track.classList.add('is-dragging');
    e.preventDefault();
  });

  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    const x = e.pageX - track.offsetLeft;
    const walk = (x - startX) * 1.2;
    track.scrollLeft = startScrollLeft - walk;
  });

  document.addEventListener('mouseup', () => {
    isDragging = false;
    track.classList.remove('is-dragging');
  });

  // Touch support
  let touchStartX = 0;
  let touchScrollLeft = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchScrollLeft = track.scrollLeft;
  }, { passive: true });

  track.addEventListener('touchmove', (e) => {
    const dx = touchStartX - e.touches[0].clientX;
    track.scrollLeft = touchScrollLeft + dx;
  }, { passive: true });

  track.addEventListener('touchend', updateButtons, { passive: true });

  // Keep buttons in sync after any scroll
  window.addEventListener('resize', updateButtons, { passive: true });

});
