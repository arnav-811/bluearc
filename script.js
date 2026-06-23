// ── Nav scroll ──────────────────────────────────────────
const nav = document.getElementById('nav');
if (nav) {
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 60);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

// ── Mobile menu ─────────────────────────────────────────
const navToggle = document.getElementById('navToggle');
const navMenu   = document.getElementById('navMenu');
const spans     = navToggle ? navToggle.querySelectorAll('span') : [];

if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => {
    const open = navMenu.classList.toggle('open');
    spans[0].style.transform = open ? 'rotate(45deg) translate(5px, 5px)' : '';
    spans[1].style.opacity   = open ? '0' : '';
    spans[2].style.transform = open ? 'rotate(-45deg) translate(5px, -5px)' : '';
  });

  // Close when a plain link is tapped (not dropdown toggles)
  navMenu.querySelectorAll('a:not(.has-dropdown > a)').forEach(a => {
    a.addEventListener('click', () => {
      navMenu.classList.remove('open');
      spans[0].style.transform = '';
      spans[1].style.opacity   = '';
      spans[2].style.transform = '';
    });
  });
}

// ── Mobile dropdown toggles ──────────────────────────────
document.querySelectorAll('.has-dropdown > .nav-link').forEach(link => {
  link.addEventListener('click', e => {
    if (window.innerWidth <= 768) {
      e.preventDefault();
      const parent = link.closest('.has-dropdown');
      parent.classList.toggle('mobile-open');
    }
  });
});

// ── Scroll reveal ────────────────────────────────────────
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Stats counter animation ──────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1600;
  const start = performance.now();
  const step = now => {
    const progress = Math.min((now - start) / duration, 1);
    const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.floor(ease * target);
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

// ── Metric bars ──────────────────────────────────────────
const barObserver = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const fill = e.target.querySelector('.metric-fill');
      if (fill) fill.style.width = fill.dataset.width + '%';
      barObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.metric').forEach(el => barObserver.observe(el));

// ── Testimonial slider ───────────────────────────────────
const track  = document.getElementById('testimonialTrack');
const dots   = document.querySelectorAll('.dot');
const prev   = document.getElementById('sliderPrev');
const next   = document.getElementById('sliderNext');
let current  = 0;

function goTo(index) {
  const slides = track ? track.querySelectorAll('.testimonial-slide') : [];
  if (!slides.length) return;
  current = (index + slides.length) % slides.length;
  track.style.transform = `translateX(-${current * 100}%)`;
  dots.forEach((d, i) => d.classList.toggle('active', i === current));
}

if (prev)  prev.addEventListener('click',  () => goTo(current - 1));
if (next)  next.addEventListener('click',  () => goTo(current + 1));
dots.forEach(d => d.addEventListener('click', () => goTo(parseInt(d.dataset.index, 10))));

// Auto-advance every 5 s
if (track) setInterval(() => goTo(current + 1), 5000);

// ── Contact form ─────────────────────────────────────────
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', e => {
    e.preventDefault();
    const btn = document.getElementById('submitBtn');
    const orig = btn.textContent;
    btn.textContent = 'Message Sent ✓';
    btn.style.background = '#059669';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      btn.disabled = false;
      contactForm.reset();
    }, 4000);
  });
}

// ── Newsletter form ───────────────────────────────────────
document.querySelectorAll('.newsletter-form').forEach(form => {
  const btn   = form.querySelector('.newsletter-btn');
  const input = form.querySelector('.newsletter-input');
  btn.addEventListener('click', () => {
    if (!input.value.trim()) return;
    const orig = btn.textContent;
    btn.textContent = 'Done ✓';
    btn.style.background = '#059669';
    setTimeout(() => {
      btn.textContent = orig;
      btn.style.background = '';
      input.value = '';
    }, 3000);
  });
});

// ── Active nav link highlight ─────────────────────────────
(function highlightNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-link').forEach(a => {
    const href = a.getAttribute('href') || '';
    if (href && href !== '#' && path.startsWith(href.split('#')[0])) {
      a.style.color = 'var(--cyan)';
    }
  });
})();
