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
     - Resume / LinkedIn-backed profile corrections
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

  progressBar.style.width = ((scrolled / total) * 100) + '%';
  scrollTopBtn.classList.toggle('visible', scrolled > 400);
  navbar.style.boxShadow = scrolled > 20 ? '0 4px 30px rgba(0,0,0,.3)' : 'none';
  if (scrolled > 100) startCounters();
  updateActiveNav(scrolled);
}

/* ── Active nav link ─────────────────────────────────────── */
function updateActiveNav(scrollY) {
  let current = '';
  document.querySelectorAll('section[id]').forEach((section) => {
    if (scrollY >= section.offsetTop - 120) current = section.getAttribute('id');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.style.color = link.getAttribute('href') === '#' + current ? 'var(--text)' : '';
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

window.closeMobile = closeMobileMenu;

/* ── Contact form feedback ───────────────────────────────── */
function handleFormSubmit(btn) {
  const original = btn.innerHTML;
  btn.innerHTML = '<i class="fas fa-check"></i> Message Sent!';
  btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';

  setTimeout(() => {
    btn.innerHTML = original;
    btn.style.background = '';
  }, 3000);
}

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

  function next() { goTo((current + 1) % slides.length); }
  function startAuto() { timer = setInterval(next, 4000); }
  function stopAuto() { clearInterval(timer); }

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
  document.querySelectorAll('.stat').forEach((stat) => {
    const label = stat.querySelector('.stat-label');
    const value = stat.querySelector('.stat-num');
    if (label?.textContent.trim() === 'Projects' && value) {
      value.dataset.target = '8';
      value.textContent = '8';
    }
  });

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

/* ── Resume / LinkedIn-backed profile corrections ───────── */
function initPortfolioProfile() {
  /* Education: match the current resume exactly. */
  Array.from(document.querySelectorAll('#education .edu-card')).forEach((card) => {
    const school = card.querySelector('.edu-school')?.textContent.trim();
    if (school === 'Sant Gadge Baba Amravati University') {
      const degree = card.querySelector('.edu-degree');
      const gpa = card.querySelector('.edu-gpa');
      const note = card.querySelector('.edu-note');
      if (degree) degree.textContent = 'Bachelor of Engineering in Computer Science';
      if (gpa) gpa.innerHTML = '<i class="fas fa-star"></i> GPA: 3.73 / 4.00';
      if (note) note.textContent = 'Coursework: Data Structures, Algorithms, Object-Oriented Programming, Operating Systems, DBMS, Computer Networks, and Web Technologies.';
    }
  });

  /* Replace legacy/inconsistent work bullets with resume-backed experience. */
  const timeline = document.querySelector('#experience .timeline');
  if (timeline) {
    timeline.innerHTML = `
      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="exp-card">
          <div class="exp-header">
            <div>
              <div class="exp-role">Graduate Intern</div>
              <div class="exp-company"><i class="fas fa-building"></i> Purdue University Fort Wayne – Career Development Center</div>
              <div class="exp-location"><i class="fas fa-map-marker-alt"></i> Fort Wayne, IN</div>
            </div>
            <div class="exp-date">Feb 2025 – May 2026</div>
          </div>
          <ul class="exp-bullets">
            <li>Developed <strong>Python and PostgreSQL-backed reporting workflows exposed through REST APIs</strong>, adding reconciliation checks that reduced manual effort by <strong>40%</strong>; used AI-assisted development tools to accelerate scripting and troubleshooting.</li>
            <li>Partnered directly with end users to translate operational needs into reliable workflows and verified output accuracy across edge cases before release.</li>
            <li>Supported experiential-learning operations by maintaining internship/co-op data, preparing end-of-term assessments, and keeping employer and student records current.</li>
            <li>Performed data management, database support, technical troubleshooting, and reporting using <strong>Handshake, Qualtrics, Excel</strong>, and internal university systems.</li>
            <li>Supported departmental programs and cross-functional Career Development Center initiatives while balancing technical and operational responsibilities.</li>
          </ul>
          <div class="exp-tech">
            <span class="tech-tag">Python</span><span class="tech-tag">PostgreSQL</span>
            <span class="tech-tag">REST APIs</span><span class="tech-tag">Data Validation</span>
            <span class="tech-tag">Handshake</span><span class="tech-tag">Qualtrics</span>
          </div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="exp-card">
          <div class="exp-header">
            <div>
              <div class="exp-role">Senior Software Engineer</div>
              <div class="exp-company"><i class="fas fa-building"></i> HCL Technologies &nbsp;·&nbsp; Client: John Deere</div>
              <div class="exp-location"><i class="fas fa-map-marker-alt"></i> Pune, India</div>
            </div>
            <div class="exp-date">Jul 2023 – Jul 2024</div>
          </div>
          <ul class="exp-bullets">
            <li>Engineered production <strong>order-management services on SAP S/4HANA</strong> using OO-ABAP, CDS Views, AMDP, OData, BAPIs, and RFCs.</li>
            <li>Owned development across implementation, peer review, unit/integration testing, defect resolution, and deployment validation for business-critical dealer workflows.</li>
            <li>Improved order-processing accuracy by <strong>60%</strong> and reduced dealer turnaround time by <strong>35%</strong> through performance optimization and systematic defect isolation.</li>
            <li>Integrated SAP services with external systems and collaborated with business and functional teams to translate operational requirements into maintainable enterprise solutions.</li>
            <li>Performed production troubleshooting, root-cause analysis, query/runtime optimization, and release support to improve reliability and processing performance.</li>
          </ul>
          <div class="exp-tech">
            <span class="tech-tag">SAP S/4HANA</span><span class="tech-tag">OO-ABAP</span>
            <span class="tech-tag">CDS Views</span><span class="tech-tag">AMDP</span>
            <span class="tech-tag">OData</span><span class="tech-tag">BAPI / RFC</span>
          </div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="exp-card">
          <div class="exp-header">
            <div>
              <div class="exp-role">Software Engineer</div>
              <div class="exp-company"><i class="fas fa-building"></i> Capgemini &nbsp;·&nbsp; Client: Bank of Maharashtra</div>
              <div class="exp-location"><i class="fas fa-map-marker-alt"></i> Pune, India</div>
            </div>
            <div class="exp-date">Nov 2021 – Jul 2023</div>
          </div>
          <ul class="exp-bullets">
            <li>Delivered enterprise <strong>reports, interfaces, workflows, and APIs</strong> supporting HR, payroll, compliance, audit, and operational processes.</li>
            <li>Built SAP and non-SAP integrations using <strong>OData, REST/SOAP services, BAPIs, RFCs, and IDocs</strong> to exchange data reliably across systems.</li>
            <li>Designed and executed regression and integration test cases, validated interfaces end-to-end, and resolved defects before production releases.</li>
            <li>Developed reusable ABAP components and business logic while collaborating with functional teams to convert requirements into scalable enterprise solutions.</li>
            <li>Supported production incidents, debugging, impact analysis, and release activities within an Agile delivery environment.</li>
          </ul>
          <div class="exp-tech">
            <span class="tech-tag">ABAP</span><span class="tech-tag">OData</span>
            <span class="tech-tag">REST / SOAP</span><span class="tech-tag">BAPI / RFC</span>
            <span class="tech-tag">IDocs</span><span class="tech-tag">Testing</span>
          </div>
        </div>
      </div>

      <div class="timeline-item">
        <div class="timeline-dot"></div>
        <div class="exp-card">
          <div class="exp-header">
            <div>
              <div class="exp-role">Software Engineer</div>
              <div class="exp-company"><i class="fas fa-building"></i> Atos Syntel &nbsp;·&nbsp; Clients: P&amp;G and E*TRADE</div>
              <div class="exp-location"><i class="fas fa-map-marker-alt"></i> Pune, India</div>
            </div>
            <div class="exp-date">Aug 2018 – Nov 2021</div>
          </div>
          <ul class="exp-bullets">
            <li>Developed modular enterprise applications and system interfaces using <strong>ABAP and SQL</strong> for financial-services and supply-chain business processes.</li>
            <li>Performed impact analysis and runtime profiling that contributed to a <strong>55% reduction in batch-processing time</strong>.</li>
            <li>Implemented application enhancements, reusable reports, interfaces, and data-processing logic across large enterprise environments.</li>
            <li>Performed debugging and root-cause analysis for production issues and supported testing, code reviews, deployments, and maintenance activities.</li>
            <li>Collaborated with functional and technical stakeholders to analyze requirements, assess downstream impact, and deliver stable production changes.</li>
          </ul>
          <div class="exp-tech">
            <span class="tech-tag">ABAP</span><span class="tech-tag">SQL</span>
            <span class="tech-tag">Enterprise Integrations</span><span class="tech-tag">Performance Tuning</span>
            <span class="tech-tag">Root Cause Analysis</span>
          </div>
        </div>
      </div>`;
  }

  /* Add missing skills that are explicitly supported by the resume/projects. */
  function addSkill(categoryName, skillName) {
    const category = Array.from(document.querySelectorAll('.skill-cat')).find((cat) =>
      cat.querySelector('.skill-cat-title')?.textContent.trim() === categoryName
    );
    const tags = category?.querySelector('.skill-tags');
    if (!tags) return;
    const exists = Array.from(tags.querySelectorAll('.skill-tag')).some((tag) => tag.textContent.trim() === skillName);
    if (!exists) {
      const span = document.createElement('span');
      span.className = 'skill-tag';
      span.textContent = skillName;
      tags.appendChild(span);
    }
  }

  ['Vite', 'SQLModel', 'WebSockets', 'Supabase', 'Twilio', 'Framer Motion'].forEach((skill) => addSkill('Web & Full-Stack', skill));
  ['Git'].forEach((skill) => addSkill('Cloud, DevOps & Data', skill));
  ['Machine Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'XceptionNet', 'OpenAI Realtime', 'AI Agents'].forEach((skill) => addSkill('AI / ML / Gen AI', skill));
  ['IDocs', 'REST / SOAP'].forEach((skill) => addSkill('SAP / ERP (Certified)', skill));
  ['Data Structures & Algorithms', 'Object-Oriented Programming', 'Unit Testing', 'Integration Testing', 'Regression Testing', 'Root Cause Analysis', 'AI-Assisted Development'].forEach((skill) => addSkill('Engineering & Process', skill));

  /* New certifications section based on the public LinkedIn Licenses & Certifications data. */
  const skillsSection = document.getElementById('skills');
  if (skillsSection && !document.getElementById('certifications')) {
    const certifications = document.createElement('section');
    certifications.id = 'certifications';
    certifications.innerHTML = `
      <div class="section-inner">
        <div class="section-label">Credentials</div>
        <h2 class="section-title">Certifications</h2>
        <p class="section-sub">Professional certifications spanning enterprise SAP development and software engineering practices.</p>
        <div class="skills-grid reveal">
          <div class="skill-cat">
            <div class="skill-cat-header">
              <div class="skill-cat-icon orange"><i class="fas fa-certificate"></i></div>
              <div>
                <div class="skill-cat-title">SAP Senior Developer – Level 1</div>
                <div class="edu-meta">Capgemini · Issued Oct 2022</div>
              </div>
            </div>
            <div class="skill-tags"><span class="skill-tag">SAP</span><span class="skill-tag">Enterprise Development</span></div>
          </div>

          <div class="skill-cat">
            <div class="skill-cat-header">
              <div class="skill-cat-icon green"><i class="fas fa-certificate"></i></div>
              <div>
                <div class="skill-cat-title">Agile Software Development</div>
                <div class="edu-meta">Coursera · Issued Jan 2022</div>
              </div>
            </div>
            <p class="edu-note">Credential ID: PVBZPLEW4UN7</p>
            <div class="skill-tags"><span class="skill-tag">Agile</span><span class="skill-tag">Software Development</span></div>
          </div>

          <div class="skill-cat">
            <div class="skill-cat-header">
              <div class="skill-cat-icon cyan"><i class="fas fa-certificate"></i></div>
              <div>
                <div class="skill-cat-title">SAP Certified Development Specialist – ABAP for SAP HANA 2.0</div>
                <div class="edu-meta">SAP SE · Verified achievement</div>
              </div>
            </div>
            <div class="skill-tags"><span class="skill-tag">ABAP</span><span class="skill-tag">SAP HANA</span><span class="skill-tag">SAP Certification</span></div>
            <a href="https://www.linkedin.com/posts/vipul-bodhani-58774617a_sap-certified-development-specialist-abap-activity-6830379264353943552-WsOw" target="_blank" rel="noopener noreferrer" class="project-link demo" style="margin-top:1rem;"><i class="fab fa-linkedin-in"></i> View Verification</a>
          </div>
        </div>
      </div>`;
    skillsSection.insertAdjacentElement('afterend', certifications);
  }

  const aboutSubtitle = document.querySelector('#about .section-sub');
  if (aboutSubtitle) {
    aboutSubtitle.textContent = 'From enterprise SAP systems and APIs to full-stack products, machine learning, and real-time AI agents — I build reliable software end-to-end.';
  }
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
        if (filter === 'all' || cats.includes(filter)) card.classList.remove('hidden');
        else card.classList.add('hidden');
      });
    });
  });
}

/* ── Initialise on DOMContentLoaded ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  initFeaturedProjects();
  initPortfolioProfile();
  typeWriter();
  initReveal();
  initPhotoSwitcher();
  initProjectFilter();
});
