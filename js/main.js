/* =============================================================
   main.js
   All interactive behaviour for the portfolio:
     - Typing / typewriter effect
     - Animated stat counters
     - Scroll progress bar
     - Scroll-reveal (IntersectionObserver)
     - Theme toggle (dark / light)
     - Mobile hamburger menu
     - Navbar shadow on scroll
     - Active nav-link highlighting
     - Contact form feedback
     - Scroll-to-top button visibility
   ============================================================= */

'use strict';

/* ── DOM references ──────────────────────────────────────── */
const progressBar  = document.getElementById('progressBar');
const scrollTopBtn = document.getElementById('scrollTop');
const themeToggle  = document.getElementById('themeToggle');
const hamburger    = document.getElementById('hamburger');
const mobileMenu   = document.getElementById('mobileMenu');
const navbar       = document.getElementById('navbar');
const typedEl      = document.getElementById('typedText');
const htmlEl       = document.documentElement;

/* ── Typewriter ──────────────────────────────────────────── */
const PHRASES = [
  'Software Engineer',
  'Full-Stack Developer',
  'SAP ABAP Expert',
  'AI/ML Engineer',
  'React + FastAPI Dev',
  'ERP Integration Specialist',
];

let phraseIdx = 0;
let charIdx   = 0;
let isDeleting = false;

function typeWriter() {
  const phrase     = PHRASES[phraseIdx];
  const typeSpeed  = isDeleting ? 55 : 85;
  const pauseDelay = 1800;

  if (!isDeleting) {
    typedEl.textContent = phrase.slice(0, ++charIdx);
    if (charIdx === phrase.length) {
      isDeleting = true;
      setTimeout(typeWriter, pauseDelay);
      return;
    }
  } else {
    typedEl.textContent = phrase.slice(0, --charIdx);
    if (charIdx === 0) {
      isDeleting = false;
      phraseIdx  = (phraseIdx + 1) % PHRASES.length;
    }
  }

  setTimeout(typeWriter, typeSpeed);
}

/* ── Stat counters ───────────────────────────────────────── */
let countersStarted = false;

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  if (!target) return;

  let count = 0;
  const step  = Math.max(1, Math.floor(target / 30));
  const timer = setInterval(() => {
    count = Math.min(count + step, target);
    el.textContent = count + '+';
    if (count >= target) clearInterval(timer);
  }, 40);
}

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;
  document.querySelectorAll('[data-target]').forEach(animateCounter);
}

/* ── Scroll-reveal (IntersectionObserver) ────────────────── */
function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.08 }
  );

  document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
}

/* ── Scroll event handler ────────────────────────────────── */
function onScroll() {
  const scrolled = window.scrollY;
  const total    = document.documentElement.scrollHeight - window.innerHeight;

  /* Reading progress bar */
  progressBar.style.width = ((scrolled / total) * 100) + '%';

  /* Scroll-to-top button visibility */
  scrollTopBtn.classList.toggle('visible', scrolled > 400);

  /* Navbar shadow */
  navbar.style.boxShadow = scrolled > 20 ? '0 4px 30px rgba(0,0,0,.3)' : 'none';

  /* Trigger stat counters once user scrolls past hero */
  if (scrolled > 100) startCounters();

  /* Active nav-link highlighting */
  updateActiveNav(scrolled);
}

/* ── Active nav link ─────────────────────────────────────── */
const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-links a');

function updateActiveNav(scrollY) {
  let current = '';
  sections.forEach((section) => {
    if (scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach((link) => {
    link.style.color =
      link.getAttribute('href') === '#' + current ? 'var(--text)' : '';
  });
}

/* ── Theme toggle ────────────────────────────────────────── */
function toggleTheme() {
  const isDark = htmlEl.dataset.theme === 'dark';
  htmlEl.dataset.theme      = isDark ? 'light' : 'dark';
  themeToggle.innerHTML     = isDark
    ? '<i class="fas fa-moon"></i>'
    : '<i class="fas fa-sun"></i>';
}

/* ── Mobile hamburger menu ───────────────────────────────── */
function toggleMobileMenu() {
  mobileMenu.classList.toggle('open');
}

function closeMobileMenu() {
  mobileMenu.classList.remove('open');
}

/* Expose closeMobileMenu globally so inline onclick="" can call it */
window.closeMobile = closeMobileMenu;

/* ── Contact form feedback ───────────────────────────────── */
function handleFormSubmit(btn) {
  const original = btn.innerHTML;
  btn.innerHTML      = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

  setTimeout(() => {
    btn.innerHTML      = original;
    btn.style.background = '';
  }, 3000);
}

/* Expose globally for inline onclick="" */
window.handleFormSubmit = handleFormSubmit;

/* ── Scroll-to-top button ────────────────────────────────── */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ── Event listeners ─────────────────────────────────────── */
window.addEventListener('scroll', onScroll, { passive: true });
themeToggle.addEventListener('click', toggleTheme);
hamburger.addEventListener('click', toggleMobileMenu);
scrollTopBtn.addEventListener('click', scrollToTop);

/* ── Initialise on DOMContentLoaded ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  typeWriter();
  initReveal();
});
