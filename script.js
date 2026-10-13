/* =====================================================
   SALON DETAILS: edit everything here in one place
   ===================================================== */
const CONFIG = {
  name: 'Janani Beauty Saloon',
  phone: '+917010760076',
  phoneDisplay: '+91 70107 60076',
  whatsapp: '917010760076',
  whatsappMessage: 'Hi Janani Beauty Saloon, I would like to book an appointment.',
  email: 'info@jananibeautysaloon.com', // TODO
  address: 'No 2, Muthu Saravanan Complex,\nOpposite to DABC Orchid Apartment,\nPolachery, Tamil Nadu 600127',
  hours: 'Monday – Sunday\n10:00 AM – 8:00 PM', // TODO: confirm
  mapsQuery: 'Janani Beauty Saloon, Muthu Saravanan Complex, Polachery, Tamil Nadu 600127',
  instagram: '#',
  facebook: '#',
};

/* ---------- Fill details ---------- */
document.querySelectorAll('[data-config]').forEach(el => {
  const val = CONFIG[el.dataset.config];
  if (val) el.textContent = val;
});

const links = {
  phone: `tel:${CONFIG.phone}`,
  whatsapp: `https://wa.me/${CONFIG.whatsapp}?text=${encodeURIComponent(CONFIG.whatsappMessage)}`,
  email: `mailto:${CONFIG.email}`,
  maps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(CONFIG.mapsQuery)}`,
  instagram: CONFIG.instagram,
  facebook: CONFIG.facebook,
};
document.querySelectorAll('[data-link]').forEach(el => {
  el.href = links[el.dataset.link] || '#';
});
document.getElementById('mapFrame').src =
  `https://maps.google.com/maps?q=${encodeURIComponent(CONFIG.mapsQuery)}&output=embed`;
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- Header + back-to-top + active nav ---------- */
const header = document.getElementById('header');
const toTop = document.getElementById('toTop');
const navLinks = document.querySelectorAll('.nav a');
const sections = [...navLinks].map(a => document.querySelector(a.getAttribute('href')));

window.addEventListener('scroll', () => {
  const y = window.scrollY;
  header.classList.toggle('scrolled', y > 50);
  toTop.classList.toggle('show', y > 600);
  let current = 0;
  sections.forEach((s, i) => { if (s && s.offsetTop - 140 <= y) current = i; });
  navLinks.forEach((a, i) => a.classList.toggle('active', i === current));
});

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById('menuToggle');
const nav = document.getElementById('nav');
menuToggle.addEventListener('click', () => {
  menuToggle.classList.toggle('open');
  nav.classList.toggle('open');
});
navLinks.forEach(a => a.addEventListener('click', () => {
  menuToggle.classList.remove('open');
  nav.classList.remove('open');
}));

/* ---------- Scroll reveal ---------- */
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => revealObserver.observe(el));

/* ---------- Counters ---------- */
const counterObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const el = entry.target;
    const target = +el.dataset.target;
    const start = performance.now();
    const duration = 2000;
    const tick = now => {
      const p = Math.min((now - start) / duration, 1);
      el.textContent = Math.floor(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-IN');
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    counterObserver.unobserve(el);
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---------- Reviews slider ---------- */
const slides = document.getElementById('slides');
const dotsWrap = document.getElementById('dots');
const total = slides.children.length;
let slide = 0;
for (let i = 0; i < total; i++) {
  const b = document.createElement('button');
  b.setAttribute('aria-label', `Review ${i + 1}`);
  b.onclick = () => { goTo(i); restart(); };
  dotsWrap.appendChild(b);
}
function goTo(i) {
  slide = i;
  slides.style.transform = `translateX(-${i * 100}%)`;
  [...dotsWrap.children].forEach((d, j) => d.classList.toggle('active', j === i));
}
let timer;
const restart = () => { clearInterval(timer); timer = setInterval(() => goTo((slide + 1) % total), 5000); };
goTo(0);
restart();

/* ---------- Click animation for WhatsApp / Call buttons ---------- */
const toast = document.createElement('div');
toast.className = 'toast';
document.body.appendChild(toast);
let toastTimer;
function showToast(icon, text) {
  toast.innerHTML = `<i class="${icon}"></i><span>${text}</span>`;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function burst(x, y) {
  const colors = ['#f1d58a', '#d9b45c', '#fff3c9', '#1f8a66', '#c9a24a'];
  const spawn = (el, dist) => {
    const angle = Math.random() * Math.PI * 2;
    el.style.left = x + 'px';
    el.style.top = y + 'px';
    el.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
    el.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
    el.style.setProperty('--rot', (Math.random() * 540 - 270) + 'deg');
    document.body.appendChild(el);
    el.addEventListener('animationend', () => el.remove());
  };
  for (let i = 0; i < 22; i++) {
    const p = document.createElement('span');
    p.className = 'burst' + (i % 4 === 0 ? ' star' : '');
    if (i % 4 === 0) p.textContent = '✦';
    else p.style.background = colors[i % colors.length];
    spawn(p, 50 + Math.random() * 70);
  }
  // mini beauty-tool confetti
  ['i-lipstick', 'i-brush', 'i-scissors', 'i-polish', 'i-comb', 'i-mirror'].forEach(id => {
    const t = document.createElement('span');
    t.className = 'burst tool';
    t.innerHTML = `<svg class="icon"><use href="#${id}" /></svg>`;
    spawn(t, 90 + Math.random() * 80);
  });
  // two expanding gold shockwave rings
  [0, 140].forEach(delay => {
    const s = document.createElement('span');
    s.className = 'shock';
    s.style.left = x + 'px';
    s.style.top = y + 'px';
    s.style.animationDelay = delay + 'ms';
    document.body.appendChild(s);
    s.addEventListener('animationend', () => s.remove());
  });
}

/* Full-screen "booking moment" overlay */
const overlay = document.createElement('div');
overlay.className = 'book-overlay';
overlay.setAttribute('role', 'status');
overlay.innerHTML = `
  <button class="bo-close" aria-label="Cancel"><i class="fa-solid fa-xmark"></i></button>
  <div class="bo-inner">
    <div class="bo-logo">
      <span class="bo-ring"></span><span class="bo-ring r2"></span>
      <img src="images/logo.png" alt="" />
      <span class="bo-badge"><i></i></span>
    </div>
    <h3 class="bo-title"><span></span><span class="bo-dots"><b>.</b><b>.</b><b>.</b></span></h3>
    <p class="bo-sub"></p>
    <div class="bo-bar"><span></span></div>
    <small class="bo-hint">Tap anywhere to continue</small>
  </div>`;
document.body.appendChild(overlay);
let pendingGo = null;

function closeOverlay() {
  overlay.classList.remove('open');
  clearTimeout(pendingGo?.timer);
  pendingGo = null;
}
function goNow() {
  if (!pendingGo) return;
  const { go } = pendingGo;
  clearTimeout(pendingGo.timer);
  pendingGo = null;
  go();
  setTimeout(closeOverlay, 350);
}
overlay.addEventListener('click', e => {
  if (e.target.closest('.bo-close')) closeOverlay();
  else goNow();
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && overlay.classList.contains('open')) closeOverlay();
});

function showOverlay(x, y, isWa, go) {
  overlay.style.setProperty('--x', x + 'px');
  overlay.style.setProperty('--y', y + 'px');
  overlay.querySelector('.bo-badge').className = 'bo-badge' + (isWa ? '' : ' phone');
  overlay.querySelector('.bo-badge i').className = isWa ? 'fa-brands fa-whatsapp' : 'fa-solid fa-phone';
  overlay.querySelector('.bo-title span').textContent = isWa ? 'Opening WhatsApp' : 'Calling';
  overlay.querySelector('.bo-sub').textContent = isWa
    ? `Book your glow-up with ${CONFIG.name}`
    : `${CONFIG.name} · ${CONFIG.phoneDisplay}`;
  overlay.classList.remove('open');
  void overlay.offsetWidth; // restart the entrance animations
  overlay.classList.add('open');
  pendingGo = { go, timer: setTimeout(goNow, 1600) };
}

document.querySelectorAll('[data-link="whatsapp"], [data-link="phone"]').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const rect = btn.getBoundingClientRect();
    // keyboard "clicks" have no pointer position, so use the button centre
    const x = e.detail ? e.clientX : rect.left + rect.width / 2;
    const y = e.detail ? e.clientY : rect.top + rect.height / 2;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    // ripple + pop only on real buttons, not plain text links
    if (!reduceMotion && btn.matches('.btn, .float-wa, .socials a')) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      const size = Math.max(rect.width, rect.height) * 2;
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x - rect.left - size / 2 + 'px';
      ripple.style.top = y - rect.top - size / 2 + 'px';
      btn.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());

      btn.classList.remove('clicked');
      void btn.offsetWidth; // restart the animation on repeat clicks
      btn.classList.add('clicked');
    }
    if (!reduceMotion) burst(x, y);

    const isWa = btn.dataset.link === 'whatsapp';
    const go = () => {
      if (!isWa) { location.href = btn.href; return; }
      const win = window.open(btn.href, '_blank');
      if (win) win.opener = null;
      else location.href = btn.href;
    };

    if (reduceMotion) {
      showToast(isWa ? 'fa-brands fa-whatsapp' : 'fa-solid fa-phone',
        isWa ? 'Opening WhatsApp…' : `Calling ${CONFIG.phoneDisplay}…`);
      go();
      return;
    }
    // let the burst play for a moment, then sweep in the overlay
    setTimeout(() => showOverlay(x, y, isWa, go), 180);
  });
});

/* ---------- Motion extras ---------- */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(pointer: fine)').matches;

// gold scroll progress bar
const progress = document.createElement('div');
progress.className = 'scroll-progress';
document.body.appendChild(progress);
window.addEventListener('scroll', () => {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? window.scrollY / max : 0})`;
});

// rotating word in the tagline
const rotator = document.querySelector('.rotator');
const words = ['more beautiful', 'more confident', 'more radiant', 'more graceful'];
if (rotator && !reduceMotion) {
  let w = 0;
  setInterval(() => {
    rotator.classList.add('out');
    setTimeout(() => {
      w = (w + 1) % words.length;
      rotator.textContent = words[w];
      rotator.classList.remove('out');
    }, 450);
  }, 3200);
}

if (finePointer && !reduceMotion) {
  // hero parallax + gold sparkle trail
  const hero = document.querySelector('.hero');
  const layers = [...hero.querySelectorAll('[data-depth]')];
  let lastTrail = 0;
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect();
    const mx = (e.clientX - r.left) / r.width - 0.5;
    const my = (e.clientY - r.top) / r.height - 0.5;
    layers.forEach(l => {
      const d = +l.dataset.depth;
      l.style.translate = `${mx * d}px ${my * d}px`;
    });
    const now = performance.now();
    if (now - lastTrail > 40) {
      lastTrail = now;
      const t = document.createElement('span');
      t.className = 'trail';
      t.style.left = e.clientX + 'px';
      t.style.top = e.clientY + 'px';
      document.body.appendChild(t);
      t.addEventListener('animationend', () => t.remove());
    }
  });
  hero.addEventListener('mouseleave', () => layers.forEach(l => { l.style.translate = ''; }));

  // 3D tilt with gold glare
  document.querySelectorAll('.package, .stat, .why-item, .tool-card').forEach(card => {
    card.classList.add('tilt');
    // once the card has faded in, drop its stagger delay so tilting reacts instantly
    card.addEventListener('transitionend', e => {
      if (e.propertyName === 'opacity') card.classList.remove('delay-1', 'delay-2', 'delay-3', 'delay-4', 'delay-5');
    });
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      const angle = Math.hypot(x, y) * 18;
      card.style.rotate = angle > 0.5 ? `${-y} ${x} 0 ${angle}deg` : '';
      card.style.setProperty('--gx', (x + 0.5) * 100 + '%');
      card.style.setProperty('--gy', (y + 0.5) * 100 + '%');
    });
    card.addEventListener('mouseleave', () => { card.style.rotate = ''; });
  });

  // magnetic buttons
  document.querySelectorAll('.btn, .float-wa').forEach(b => {
    b.addEventListener('mousemove', e => {
      const r = b.getBoundingClientRect();
      b.style.translate = `${(e.clientX - r.left - r.width / 2) * 0.25}px ${(e.clientY - r.top - r.height / 2) * 0.35}px`;
    });
    b.addEventListener('mouseleave', () => { b.style.translate = ''; });
  });
}

/* ---------- Rising gold dust (hero) ---------- */
const dust = document.querySelector('.hero-dust');
for (let i = 0; i < 28; i++) {
  const d = document.createElement('span');
  d.className = 'dust';
  const size = 2 + Math.random() * 4;
  d.style.width = d.style.height = size + 'px';
  d.style.left = Math.random() * 100 + '%';
  d.style.setProperty('--sway', (Math.random() * 80 - 40) + 'px');
  d.style.animationDuration = 9 + Math.random() * 10 + 's';
  d.style.animationDelay = -Math.random() * 18 + 's';
  dust.appendChild(d);
}

/* ---------- Falling petals ---------- */
const petals = document.querySelector('.petals');
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  setInterval(() => {
    if (document.hidden || petals.childElementCount > 14) return;
    const p = document.createElement('span');
    p.className = 'petal';
    const size = 8 + Math.random() * 10;
    p.style.left = Math.random() * 100 + 'vw';
    p.style.width = p.style.height = size + 'px';
    p.style.setProperty('--drift', (Math.random() * 200 - 100) + 'px');
    p.style.animationDuration = 8 + Math.random() * 6 + 's';
    petals.appendChild(p);
    p.addEventListener('animationend', () => p.remove());
  }, 900);
}
