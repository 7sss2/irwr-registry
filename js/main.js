window.IRWR = window.IRWR || {};

// escape dynamic values before interpolating into innerHTML templates (XSS guard)
IRWR.escapeHtml = function (str) {
  return String(str).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
};

// A record's real photo (verified against the source, see scripts/photo-manifest.json)
// takes priority; records without one fall back to a picsum.photos placeholder.
IRWR.photoUrl = function (record, seedSuffix, w, h) {
  if (record.photo) return record.photo;
  const seed = encodeURIComponent(record.photoSeed) + (seedSuffix || '');
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
};

document.addEventListener('DOMContentLoaded', () => {
  // ruler ticks
  const rulerTrack = document.getElementById('rulerTrack');
  if (rulerTrack) {
    for (let i = 0; i < 60; i++) rulerTrack.appendChild(document.createElement('span'));
  }

  // mega-title marquee, seeded from IRWR.CATEGORIES if data.js has loaded, else a static label
  const megaTrack = document.getElementById('megaTrack');
  if (megaTrack) {
    const item = '<span class="mega-item"><span class="m-irwr">IRWR</span> <span class="m-rest">INTERNATIONAL REGISTER WORLD RECORD</span> <span class="m-star">✦</span></span>';
    const half = item.repeat(4);
    megaTrack.innerHTML = `<span style="display:flex;">${half}</span><span style="display:flex;">${half}</span>`;
  }

  // scroll progress, sticky header, hero parallax, to-top
  const progressBar = document.getElementById('scrollProgress');
  const toTop = document.getElementById('toTop');
  const header = document.getElementById('siteHeader');
  const heroBg = document.getElementById('heroBg');
  window.addEventListener('scroll', () => {
    const h = document.documentElement;
    const pct = (h.scrollTop) / (h.scrollHeight - h.clientHeight) * 100;
    if (progressBar) progressBar.style.width = pct + '%';
    if (toTop) toTop.classList.toggle('show', h.scrollTop > 700);
    if (header) header.classList.toggle('solid', h.scrollTop > 60);
    if (heroBg) heroBg.style.transform = `translateY(${h.scrollTop * 0.15}px) scale(1.05)`;
  });
  if (toTop) toTop.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  // cursor glow
  const glow = document.getElementById('cursorGlow');
  if (glow) {
    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
      glow.style.opacity = 1;
    });
    document.addEventListener('mouseleave', () => { glow.style.opacity = 0; });
  }

  // ripple
  document.querySelectorAll('[data-ripple]').forEach((btn) => {
    btn.addEventListener('click', function (e) {
      const r = document.createElement('span');
      r.className = 'ripple';
      const rect = this.getBoundingClientRect();
      r.style.left = (e.clientX - rect.left) + 'px';
      r.style.top = (e.clientY - rect.top) + 'px';
      r.style.width = r.style.height = Math.max(rect.width, rect.height) + 'px';
      this.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });

  // reveal-on-scroll — threshold:0 fires as soon as any part of the target is
  // visible. A ratio-based threshold (e.g. 0.1) can never fire for a JS-populated
  // grid section that ends up many viewport-heights tall (records/holders grids),
  // since the visible fraction of the whole element can never reach 10%.
  const revealObs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) { entry.target.classList.add('in'); revealObs.unobserve(entry.target); }
    });
  }, { threshold: 0 });
  document.querySelectorAll('.reveal').forEach((el) => revealObs.observe(el));

  // mobile nav toggle
  const navToggle = document.getElementById('navToggle');
  const mnav = document.getElementById('mnav');
  if (navToggle && mnav) {
    navToggle.addEventListener('click', () => {
      const open = mnav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(open));
    });
    mnav.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => {
      mnav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  // active nav highlight
  const page = document.body.dataset.page;
  if (page) {
    document.querySelectorAll(`[data-page="${page}"]`).forEach((a) => a.classList.add('active'));
  }

  IRWR.initCounters('.num[data-count]');
});

// animated count-up, triggered on scroll-into-view
IRWR.initCounters = function (selector) {
  const els = document.querySelectorAll(selector);
  if (!els.length) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.dataset.count, 10);
      const suffix = el.dataset.suffix || '';
      const duration = 1200;
      const start = performance.now();
      function tick(now) {
        const p = Math.min((now - start) / duration, 1);
        el.textContent = Math.round(target * p).toLocaleString() + suffix;
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });
  els.forEach((el) => obs.observe(el));
};

// CSS-perspective 3D tilt on hover, driven by cursor position
IRWR.initTilt = function (selector) {
  document.querySelectorAll(selector).forEach((card) => {
    card.classList.add('tilt');
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `perspective(700px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => { card.style.transform = ''; });
  });
};
