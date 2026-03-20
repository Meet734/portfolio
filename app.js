/* =============================================
   PORTFOLIO — SHARED JAVASCRIPT
============================================= */

// ---------- PARTICLE BACKGROUND ----------
(function initCanvas() {
  const canvas = document.getElementById('bgCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  function rnd(min, max) { return Math.random() * (max - min) + min; }

  function makeParticle() {
    return {
      x: rnd(0, W), y: rnd(0, H),
      r: rnd(0.5, 2),
      vx: rnd(-0.2, 0.2),
      vy: rnd(-0.2, 0.2),
      alpha: rnd(0.3, 0.8)
    };
  }

  for (let i = 0; i < 160; i++) particles.push(makeParticle());

  function connect() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          ctx.beginPath();
          ctx.strokeStyle = `rgba(59,130,246,${0.2 * (1 - dist / 120)})`;
          ctx.lineWidth = 0.5;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }
  }

  function tick() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(59,130,246,0.8)';
      ctx.fillStyle = `rgba(59,130,246,${p.alpha})`;
      ctx.fill();
      ctx.shadowBlur = 0; // reset for next drawing
    });
    connect();
    requestAnimationFrame(tick);
  }
  tick();
})();

// ---------- ACTIVE NAV ITEM ----------
(function markActiveNav() {
  const page = document.body.dataset.page || 'home';
  document.querySelectorAll('.nav-item').forEach(link => {
    link.classList.remove('active');
    if (link.dataset.page === page) link.classList.add('active');
  });
})();

// ---------- MOBILE SIDEBAR ----------
(function mobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const sidebar   = document.getElementById('sidebar');
  const overlay   = document.getElementById('sidebarOverlay');
  if (!hamburger) return;

  function open() {
    sidebar.classList.add('open');
    overlay.classList.add('show');
    hamburger.classList.add('open');
  }
  function close() {
    sidebar.classList.remove('open');
    overlay.classList.remove('show');
    hamburger.classList.remove('open');
  }

  hamburger.addEventListener('click', () => sidebar.classList.contains('open') ? close() : open());
  overlay.addEventListener('click', close);
  document.querySelectorAll('.nav-item').forEach(l => l.addEventListener('click', close));
})();

// ---------- TYPEWRITER (Home only) ----------
(function typewriter() {
  const el = document.getElementById('typewriterText');
  if (!el) return;
  const words = [
    'scalable backends.',
    'cloud-native apps.',
    'AI-powered pipelines.',
    'real-time systems.',
    'elegant APIs.',
    'web applications.'
  ];
  let wi = 0, ci = 0, deleting = false;

  function tick() {
    const word = words[wi];
    el.textContent = deleting ? word.slice(0, ci--) : word.slice(0, ci++);
    if (!deleting && ci > word.length) {
      deleting = true;
      return setTimeout(tick, 1400);
    }
    if (deleting && ci < 0) {
      deleting = false; ci = 0;
      wi = (wi + 1) % words.length;
      return setTimeout(tick, 300);
    }
    setTimeout(tick, deleting ? 50 : 90);
  }
  tick();
})();

// ---------- SKILL BAR ANIMATION ----------
(function animateSkills() {
  const fills = document.querySelectorAll('.skill-fill');
  if (!fills.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('animated');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  fills.forEach(f => obs.observe(f));
})();

// ---------- PROJECT FILTER ----------
(function projectFilter() {
  const filterBtns = document.querySelectorAll('.filter-btn');
  const cards       = document.querySelectorAll('.project-card');
  const emptyMsg    = document.getElementById('projectsEmpty');
  const countEl     = document.getElementById('projectCount');
  if (!filterBtns.length) return;

  function applyFilter(filter) {
    let visible = 0;
    cards.forEach(card => {
      const tags = card.dataset.tags ? card.dataset.tags.split(',') : [];
      const show  = filter === 'all' || tags.includes(filter);
      if (show) {
        card.classList.remove('hidden');
        visible++;
      } else {
        card.classList.add('hidden');
      }
    });
    if (emptyMsg) emptyMsg.style.display = visible === 0 ? 'flex' : 'none';
    if (countEl) countEl.textContent = visible;
  }

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      applyFilter(btn.dataset.filter);
    });
  });

  applyFilter('all');
})();

// ---------- CONTACT FORM (Web3Forms) ----------
(function contactForm() {
  const form      = document.getElementById('contactForm');
  const submitBtn = document.getElementById('formSubmitBtn');
  const successEl = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async function (e) {
    e.preventDefault();
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Sending…</span>';

    const data = new FormData(form);
    const json = Object.fromEntries(data.entries());

    try {
      const res = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(json)
      });
      const result = await res.json();
      if (result.success) {
        successEl.classList.add('show');
        form.reset();
        setTimeout(() => successEl.classList.remove('show'), 6000);
      } else {
        alert('Something went wrong. Please try emailing me directly at meetvaghasiya734@gmail.com');
      }
    } catch (err) {
      alert('Network error. Please try emailing me directly at meetvaghasiya734@gmail.com');
    } finally {
      submitBtn.disabled = false;
      submitBtn.innerHTML = '<i class="fas fa-paper-plane"></i><span>Send Message</span>';
    }
  });
})();
