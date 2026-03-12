/* =============================================
   MICHAEL AMO-ARTHUR — PORTFOLIO JS
   ============================================= */

/* ---- NAV ---- */
const navbar     = document.getElementById('navbar');
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });
}
if (hamburger) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
  });
}

function closeMobile() {
  if (hamburger) hamburger.classList.remove('open');
  if (mobileMenu) mobileMenu.classList.remove('open');
}

/* ---- SMOOTH SCROLL ---- */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) { e.preventDefault(); closeMobile(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

/* ---- REVEAL ON SCROLL ---- */
const revealEls = document.querySelectorAll('.reveal');
const revealObs = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      const siblings = [...(entry.target.parentElement?.querySelectorAll('.reveal:not(.visible)') || [])];
      const idx = siblings.indexOf(entry.target);
      entry.target.style.transitionDelay = (idx * 0.06) + 's';
      entry.target.classList.add('visible');
      revealObs.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealEls.forEach(el => revealObs.observe(el));

/* ---- TABS ---- */
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.about-text-col') || btn.closest('.tabs')?.parentElement;
    group?.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    group?.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('tab-' + btn.dataset.tab);
    if (panel) panel.classList.add('active');
  });
});

/* ============================================================
   VIDEO LIGHTBOX — click video to open fullscreen overlay
   ============================================================ */
function buildVideoLightbox() {
  const overlay = document.createElement('div');
  overlay.id = 'videoLightbox';
  overlay.innerHTML = `
    <div class="vlb-backdrop"></div>
    <div class="vlb-box">
      <button class="vlb-close" aria-label="Close">✕</button>
      <video class="vlb-video" controls playsinline></video>
    </div>
  `;
  document.body.appendChild(overlay);

  // Close on backdrop click or button
  overlay.querySelector('.vlb-backdrop').addEventListener('click', closeVideoLightbox);
  overlay.querySelector('.vlb-close').addEventListener('click', closeVideoLightbox);

  // Close on Escape
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeVideoLightbox();
  });
}

function openVideoLightbox(src) {
  const overlay = document.getElementById('videoLightbox');
  const vid     = overlay.querySelector('.vlb-video');
  vid.src = src;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  vid.play().catch(() => {});
}

function closeVideoLightbox() {
  const overlay = document.getElementById('videoLightbox');
  if (!overlay) return;
  const vid = overlay.querySelector('.vlb-video');
  vid.pause();
  vid.src = '';
  overlay.classList.remove('open');
  document.body.style.overflow = '';
}

/* ---- Wire up project media videos ---- */
buildVideoLightbox();

document.querySelectorAll('.project-media').forEach(media => {
  const video = media.querySelector('video');
  if (!video) return;

  // Show fallback until loaded; hide on error
  video.addEventListener('loadeddata', () => {
    video.style.opacity = '1';
    const fb = media.querySelector('.project-media-fallback');
    if (fb) fb.style.display = 'none';
  });
  video.addEventListener('error', () => {
    video.style.display = 'none';
    const fb = media.querySelector('.project-media-fallback');
    if (fb) fb.style.display = 'flex';
  });

  // Hover: play/pause preview
  const card = video.closest('.project-card');
  if (card) {
    card.addEventListener('mouseenter', () => video.play().catch(() => {}));
    card.addEventListener('mouseleave', () => video.pause());
  }

  // Click on video area → open lightbox
  media.addEventListener('click', (e) => {
    e.stopPropagation(); // don't fire card click
    const src = video.getAttribute('src');
    if (src && video.style.display !== 'none') {
      openVideoLightbox(src);
    }
  });

  // Add a visual "play" hint
  media.classList.add('has-video');
});

/* ============================================================
   CLICKABLE PROJECT CARDS — entire card navigates to case study
   ============================================================ */
document.querySelectorAll('.project-card').forEach(card => {
  // Find the primary CTA link (first .btn-primary inside .project-links)
  const primaryLink = card.querySelector('.project-links .btn-primary, .project-links .btn-ghost');
  if (!primaryLink) return;

  const href   = primaryLink.getAttribute('href');
  const isExt  = primaryLink.getAttribute('target') === '_blank';

  // Make card feel clickable
  card.style.cursor = 'pointer';

  card.addEventListener('click', (e) => {
    // Don't hijack clicks on actual buttons/links inside the card
    if (e.target.closest('a, button')) return;
    if (isExt) {
      window.open(href, '_blank', 'noopener');
    } else {
      window.location.href = href;
    }
  });
});

/* ---- TILT on project cards ---- */
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width  - 0.5;
    const y = (e.clientY - rect.top)  / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${y * -6}deg) rotateY(${x * 6}deg) translateY(-4px)`;
  });
  card.addEventListener('mouseleave', () => { card.style.transform = ''; });
});

/* ---- CONTACT FORM ---- */
function handleFormSubmit(e) {
  e.preventDefault();
  const btn     = document.getElementById('formSubmitBtn');
  const success = document.getElementById('formSuccess');
  if (!btn) return;
  btn.disabled    = true;
  btn.textContent = 'Sending…';
  setTimeout(() => {
    btn.textContent = 'Sent ✓';
    if (success) success.classList.add('show');
    e.target.reset();
    setTimeout(() => {
      btn.disabled    = false;
      btn.textContent = 'Send Message →';
      if (success) success.classList.remove('show');
    }, 4000);
  }, 1200);
}

/* ---- ACTIVE NAV on scroll ---- */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');
const sectionObs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const id = entry.target.getAttribute('id');
      navLinks.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + id ? 'var(--text)' : '';
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObs.observe(s));