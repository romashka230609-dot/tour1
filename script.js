/* =====================================================
   RomashkaTour — script.js
   LanpreventDefaultuage switching, animations, nav, FAQ, etc.
   ===================================================== */

'use strict';

document.documentElement.classList.add('js');

/* ─── CURRENT LANGUAGE ──────────────────────────────── */
let currentLang = localStorage.getItem('rtLang') || 'ru';

/* ─── PRELOADER ──────────────────────────────────────── */
window.addEventListener('load', () => {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    setTimeout(() => {
      preloader.classList.add('hidden');
      setTimeout(() => {
        preloader.style.display = 'none';
      }, 700);
    }, 800);
  }
  applyLanguage(currentLang);
  initCounters();
});

/* ─── LANGUAGE SWITCHER ─────────────────────────────── */
function applyLanguage(lang) {
  currentLang = lang;
  localStorage.setItem('rtLang', lang);

  // Update all data-ru / data-en elements
  document.querySelectorAll('[data-ru]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (text !== null) {
      // Use innerHTML to support <strong> tags in translations
      el.innerHTML = text;
    }
  });

  // Update html lang attr
  document.documentElement.lang = lang === 'ru' ? 'ru' : 'en';

  // Update lang buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.lang === lang);
  });
}

document.addEventListener('DOMContentLoaded', () => {
  // Language buttons
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      applyLanguage(btn.dataset.lang);
    });
  });

  // ─── STICKY HEADER ──────────────────────────────────
  const header = document.getElementById('header');
  if (header) {
    window.addEventListener('scroll', () => {
      header.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  // ─── MOBILE NAV ──────────────────────────────────────
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  let navOverlay = document.querySelector('.nav-overlay');

  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  function openNav() {
    if (!nav || !burger) return;
    nav.classList.add('open');
    burger.classList.add('open');
    navOverlay.classList.add('visible');
    document.body.style.overflow = 'hidden';
  }
  function closeNav() {
    if (!nav || !burger) return;
    nav.classList.remove('open');
    burger.classList.remove('open');
    navOverlay.classList.remove('visible');
    document.body.style.overflow = '';
  }

  if (burger && nav) burger.addEventListener('click', () => nav.classList.contains('open') ? closeNav() : openNav());
  navOverlay.addEventListener('click', closeNav);

  // Close nav on link click
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // ─── FAQ ACCORDION ──────────────────────────────────
  document.querySelectorAll('.faq-q').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');

      // Close all
      document.querySelectorAll('.faq-item.open').forEach(open => {
        open.classList.remove('open');
      });

      // Toggle current
      if (!isOpen) item.classList.add('open');
    });
  });

  // ─── BUBBLE PARTICLES ───────────────────────────────
  const particlesContainer = document.getElementById('heroParticles');
  if (particlesContainer) {
    for (let i = 0; i < 22; i++) {
      createBubble(particlesContainer);
    }
  }

  // ─── AOS SCROLL ANIMATION ───────────────────────────
  initAOS();

  // ─── REVIEW TICKER DUPLICATE ────────────────────────
  const ticker = document.getElementById('reviewTicker');
  if (ticker) {
    const clone = ticker.innerHTML;
    ticker.innerHTML += clone; // duplicate for infinite loop
  }

  // ─── SMOOTH SCROLL ──────────────────────────────────
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const offset = 80;
        window.scrollTo({ top: target.offsetTop - offset, behavior: 'smooth' });
      }
    });
  });

  // ─── GALLERY LIGHTBOX ───────────────────────────────
  initGalleryLightbox();
});

/* ─── BUBBLE CREATION ───────────────────────────────── */
function createBubble(container) {
  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const size = Math.random() * 60 + 10;
  const left = Math.random() * 100;
  const delay = Math.random() * 12;
  const duration = Math.random() * 12 + 10;
  const opacity = Math.random() * 0.4 + 0.05;

  bubble.style.cssText = `
    width: ${size}px;
    height: ${size}px;
    left: ${left}%;
    bottom: -${size}px;
    animation-duration: ${duration}s;
    animation-delay: ${delay}s;
    opacity: ${opacity};
  `;
  container.appendChild(bubble);
}

/* ─── AOS SCROLL ANIMATION ──────────────────────────── */
function initAOS() {
  const elements = document.querySelectorAll('[data-aos]');
  if (!elements.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const delay = parseInt(el.dataset.aosDelay || 0);
        setTimeout(() => {
          el.classList.add('visible');
        }, delay);
        observer.unobserve(el);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  elements.forEach(el => observer.observe(el));
}

/* ─── COUNTER ANIMATION ─────────────────────────────── */
function initCounters() {
  const counters = document.querySelectorAll('.stat-num[data-count]');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => observer.observe(el));
}

function animateCounter(el) {
  const target = parseFloat(el.dataset.count);
  const isDecimal = el.dataset.decimal === 'true';
  const duration = 1800;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = target * eased;

    el.textContent = isDecimal
      ? current.toFixed(1)
      : Math.floor(current) + (target >= 1000 ? '+' : '');

    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = isDecimal ? target.toFixed(1) : target + (target >= 1000 ? '+' : '');
  }

  requestAnimationFrame(update);
}

/* ─── GALLERY LIGHTBOX ───────────────────────────────── */
function initGalleryLightbox() {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  // Create lightbox
  const lb = document.createElement('div');
  lb.className = 'lightbox';
  lb.innerHTML = `
    <div class="lb-backdrop"></div>
    <div class="lb-content">
      <button class="lb-close" aria-label="Close"><i class="fas fa-times"></i></button>
      <button class="lb-prev" aria-label="Previous"><i class="fas fa-chevron-left"></i></button>
      <div class="lb-img-wrap">
        <div class="lb-placeholder"></div>
        <p class="lb-caption"></p>
      </div>
      <button class="lb-next" aria-label="Next"><i class="fas fa-chevron-right"></i></button>
    </div>
  `;
  lb.style.cssText = `
    position:fixed;inset:0;z-index:9000;
    display:flex;align-items:center;justify-content:center;
    opacity:0;visibility:hidden;transition:opacity 0.3s,visibility 0.3s;
  `;

  const backdrop = lb.querySelector('.lb-backdrop');
  backdrop.style.cssText = 'position:absolute;inset:0;background:rgba(10,22,40,0.95);backdrop-filter:blur(8px);';

  const content = lb.querySelector('.lb-content');
  content.style.cssText = 'position:relative;z-index:1;display:flex;align-items:center;gap:20px;padding:20px;max-width:90vw;';

  ['.lb-close','.lb-prev','.lb-next'].forEach(sel => {
    const btn = lb.querySelector(sel);
    btn.style.cssText = `
      background:rgba(255,255,255,0.1);border:1px solid rgba(255,255,255,0.2);
      color:white;width:44px;height:44px;border-radius:50%;cursor:pointer;
      display:flex;align-items:center;justify-content:center;font-size:1rem;
      transition:background 0.2s;flex-shrink:0;
    `;
    btn.onmouseenter = () => btn.style.background = 'rgba(10,191,188,0.5)';
    btn.onmouseleave = () => btn.style.background = 'rgba(255,255,255,0.1)';
  });
  lb.querySelector('.lb-close').style.cssText += 'position:absolute;top:-50px;right:0;';

  const placeholder = lb.querySelector('.lb-placeholder');
  placeholder.style.cssText = 'width:600px;max-width:70vw;height:400px;max-height:70vh;background:linear-gradient(160deg,#0d2d58,#0a4a6e);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:4rem;color:rgba(255,255,255,0.3);';

  const caption = lb.querySelector('.lb-caption');
  caption.style.cssText = 'color:white;text-align:center;margin-top:12px;font-size:0.9rem;';

  document.body.appendChild(lb);

  let currentIdx = 0;

  const open = (idx) => {
    currentIdx = idx;
    const item = items[idx];
    const inner = item.querySelector('.gallery-item-inner');
    const cap = item.querySelector('.gallery-caption');
    placeholder.innerHTML = inner ? inner.innerHTML : '<i class="fas fa-image"></i>';
    caption.textContent = cap ? cap.textContent : '';
    lb.style.opacity = '1'; lb.style.visibility = 'visible';
    document.body.style.overflow = 'hidden';
  };
  const close = () => {
    lb.style.opacity = '0'; lb.style.visibility = 'hidden';
    document.body.style.overflow = '';
  };

  items.forEach((item, i) => item.addEventListener('click', () => open(i)));
  lb.querySelector('.lb-backdrop').addEventListener('click', close);
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', () => open((currentIdx - 1 + items.length) % items.length));
  lb.querySelector('.lb-next').addEventListener('click', () => open((currentIdx + 1) % items.length));

  document.addEventListener('keydown', e => {
    if (lb.style.visibility !== 'visible') return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') open((currentIdx - 1 + items.length) % items.length);
    if (e.key === 'ArrowRight') open((currentIdx + 1) % items.length);
  });
}

/* ─── ACTIVE NAV LINK ───────────────────────────────── */
(function markActiveLink() {
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === page);
  });
})();