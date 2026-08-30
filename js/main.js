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
     - Featured project refresh
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
  'Backend Engineer',
  'React + FastAPI Dev',
  'Applied AI Engineer',
  'AI Agent Engineer',
  'Python Developer',
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
  htmlEl.dataset.theme  = isDark ? 'light' : 'dark';
  themeToggle.innerHTML = isDark
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

/* ── Photo Switcher ──────────────────────────────────────── */
function initPhotoSwitcher() {
  const slides = document.querySelectorAll('.photo-slide');
  const dots   = document.querySelectorAll('.photo-dot');
  if (slides.length <= 1) return;

  let current = 0;
  let timer;

  function goTo(idx) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = idx;
    slides[current].classList.add('active');
    dots[current].classList.add('active');
  }

  function next() {
    goTo((current + 1) % slides.length);
  }

  function startAuto() {
    timer = setInterval(next, 4000);
  }

  function stopAuto() {
    clearInterval(timer);
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      stopAuto();
      goTo(i);
      startAuto();
    });
  });

  startAuto();
}

/* ── Featured project refresh ────────────────────────────── */
function initFeaturedProjects() {
  /* Keep the hero count aligned with the actual portfolio. */
  document.querySelectorAll('.stat').forEach((stat) => {
    const label = stat.querySelector('.stat-label');
    const value = stat.querySelector('.stat-num');
    if (label?.textContent.trim() === 'Projects' && value) {
      value.dataset.target = '8';
      value.textContent = '8';
    }
  });

  /* Reflect the newer AI-agent and product work in the portfolio copy. */
  const projectSubtitle = document.querySelector('#projects .section-sub');
  if (projectSubtitle) {
    projectSubtitle.textContent = 'End-to-end products spanning AI agents, real-time systems, full-stack applications, deep learning, and explainable AI.';
  }

  const aboutParagraphs = document.querySelectorAll('#about .about-text p');
  if (aboutParagraphs.length) {
    aboutParagraphs[aboutParagraphs.length - 1].innerHTML = 'My interests include backend engineering, full-stack product development, and applied AI — with recent work including <strong>OneAbyss</strong>, a full-stack productivity platform, and a <strong>real-time AI voice agent</strong> built with Twilio, FastAPI, WebSockets, and OpenAI Realtime.';
  }

  function addSkill(categoryName, skillName) {
    const category = Array.from(document.querySelectorAll('.skill-cat')).find((cat) =>
      cat.querySelector('.skill-cat-title')?.textContent.trim() === categoryName
    );
    const tags = category?.querySelector('.skill-tags');
    if (!tags) return;
    const exists = Array.from(tags.querySelectorAll('.skill-tag')).some(
      (tag) => tag.textContent.trim() === skillName
    );
    if (!exists) {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = skillName;
      tags.appendChild(span);
    }
  }

  addSkill('Web & Full-Stack', 'WebSockets');
  addSkill('Cloud, DevOps & Data', 'Supabase');
  addSkill('AI / ML / Gen AI', 'OpenAI Realtime');
  addSkill('AI / ML / Gen AI', 'AI Agents');

  const grid = document.getElementById('projectsGrid');
  if (!grid || grid.querySelector('[data-project-id="oneabyss"]')) return;

  const newProjects = `
    <div class="project-card" data-project-id="oneabyss" data-category="fullstack">
      <div class="project-thumb thumb-6">
        <span class="thumb-icon">✦</span>
        <span class="project-badge">Featured</span>
        <div class="project-overlay">
          <p>Space-themed productivity platform combining tasks, calendar, journaling, drag-and-drop workflows, authentication, and collaborator invitations.</p>
          <div style="display:flex;gap:.5rem;">
            <a href="https://github.com/vbodhani11/OneSpace" target="_blank" rel="noopener noreferrer" class="overlay-btn"><i class="fab fa-github"></i> Code</a>
            <a href="https://oneabyss.com" target="_blank" rel="noopener noreferrer" class="overlay-btn overlay-btn-green"><i class="fas fa-external-link-alt"></i> Live</a>
          </div>
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta"><span class="project-cat cat-fullstack">Full-Stack</span></div>
        <div class="project-title">OneAbyss</div>
        <p class="project-desc">Personal productivity platform for tasks, calendar planning, private journaling, and collaboration — built with React 19, TypeScript, Supabase, Tailwind CSS, and polished motion interactions.</p>
        <div class="project-tags">
          <span class="project-tag">React 19</span><span class="project-tag">TypeScript</span>
          <span class="project-tag">Supabase</span><span class="project-tag">Tailwind CSS</span>
        </div>
        <div class="project-links">
          <a href="https://github.com/vbodhani11/OneSpace" target="_blank" rel="noopener noreferrer" class="project-link github"><i class="fab fa-github"></i> GitHub</a>
          <a href="https://oneabyss.com" target="_blank" rel="noopener noreferrer" class="project-link demo"><i class="fas fa-external-link-alt"></i> Live App</a>
        </div>
      </div>
    </div>

    <div class="project-card" data-project-id="realtime-voice-agent" data-category="aiml fullstack">
      <div class="project-thumb thumb-3">
        <span class="thumb-icon">🎙️</span>
        <span class="project-badge">Featured</span>
        <div class="project-overlay">
          <p>Low-latency speech-to-speech AI agent with real phone calls, bidirectional audio streaming, transcription, recordings, and automated post-call QA analysis.</p>
          <a href="https://github.com/vbodhani11/Pretty-Good-AI---AI-Engineer-Challenge/tree/Feature-X/pgai-voicebot" target="_blank" rel="noopener noreferrer" class="overlay-btn"><i class="fab fa-github"></i> View Code</a>
        </div>
      </div>
      <div class="project-body">
        <div class="project-meta"><span class="project-cat cat-aiml">AI · ML</span><span class="project-cat cat-fullstack">Real-Time</span></div>
        <div class="project-title">Realtime AI Voice Agent</div>
        <p class="project-desc">Real-time AI voice system that places Twilio calls, streams bidirectional audio through FastAPI WebSockets to OpenAI Realtime, captures transcripts and recordings, and automates post-call quality analysis.</p>
        <div class="project-tags">
          <span class="project-tag">Python</span><span class="project-tag">FastAPI</span>
          <span class="project-tag">Twilio</span><span class="project-tag">OpenAI Realtime</span>
        </div>
        <div class="project-links">
          <a href="https://github.com/vbodhani11/Pretty-Good-AI---AI-Engineer-Challenge/tree/Feature-X/pgai-voicebot" target="_blank" rel="noopener noreferrer" class="project-link github"><i class="fab fa-github"></i> GitHub</a>
        </div>
      </div>
    </div>`;

  grid.insertAdjacentHTML('afterbegin', newProjects);

  /* Put the strongest recent work first for recruiter scanning. */
  const preferredOrder = [
    'OneAbyss',
    'Realtime AI Voice Agent',
    'Deepfake Detector',
    'Explainable AI – Healthcare',
    'Campus Marketplace',
    'Toxic Comment Detection',
    'MeetMatrix – Event Management',
    'Course Resource Library',
  ];

  const cardsByTitle = new Map(
    Array.from(grid.querySelectorAll('.project-card')).map((card) => [
      card.querySelector('.project-title')?.textContent.trim(),
      card,
    ])
  );

  preferredOrder.forEach((title) => {
    const card = cardsByTitle.get(title);
    if (card) grid.appendChild(card);
  });
}

/* ── Project Filter ──────────────────────────────────────── */
function initProjectFilter() {
  const btns  = document.querySelectorAll('.pf-btn');
  const cards = document.querySelectorAll('.project-card');
  if (!btns.length) return;

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;

      cards.forEach(card => {
        const cats = card.dataset.category || '';
        if (filter === 'all' || cats.includes(filter)) {
          card.classList.remove('hidden');
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* ── Initialise on DOMContentLoaded ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedProjects();
  typeWriter();
  initReveal();
  initPhotoSwitcher();
  initProjectFilter();
});
