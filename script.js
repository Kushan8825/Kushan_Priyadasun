// Year
document.getElementById('year').textContent = new Date().getFullYear();

// Theme toggle
const root = document.documentElement;
document.getElementById('theme-toggle').addEventListener('click', () => {
  const current = root.dataset.theme ||
    (matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  const next = current === 'dark' ? 'light' : 'dark';
  root.dataset.theme = next;
  try { localStorage.setItem('theme', next); } catch (e) {}
});

// Mobile menu
const menuBtn = document.getElementById('menu-btn');
const navLinks = document.getElementById('nav-links');
const setMenu = (open) => {
  navLinks.classList.toggle('open', open);
  menuBtn.setAttribute('aria-expanded', String(open));
  menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
};
menuBtn.addEventListener('click', () => setMenu(!navLinks.classList.contains('open')));
navLinks.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });

// Nav border on scroll
const navWrap = document.querySelector('.nav-wrap');
const onScroll = () => navWrap.classList.toggle('scrolled', window.scrollY > 8);
onScroll();
window.addEventListener('scroll', onScroll, { passive: true });

// Active section highlight: the last linked section whose top has passed 40% of the viewport
const links = [...navLinks.querySelectorAll('a')];
const linked = links.map((l) => document.querySelector(l.getAttribute('href')));
const updateActive = () => {
  const line = window.innerHeight * 0.4;
  let current = -1;
  linked.forEach((s, i) => { if (s.getBoundingClientRect().top <= line) current = i; });
  links.forEach((l, i) => l.classList.toggle('active', i === current));
};
updateActive();
window.addEventListener('scroll', updateActive, { passive: true });
window.addEventListener('resize', updateActive);

// Reveal on scroll, staggering siblings
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('in');
    revealObserver.unobserve(entry.target);
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
document.querySelectorAll('.reveal').forEach((el) => {
  const siblings = [...el.parentElement.children].filter((c) => c.classList.contains('reveal'));
  el.style.setProperty('--d', Math.min(siblings.indexOf(el), 5) * 0.07 + 's');
  revealObserver.observe(el);
});

// Copy email
document.querySelectorAll('[data-copy]').forEach((btn) => {
  btn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      btn.classList.add('copied');
      btn.querySelector('.copy-label').textContent = 'Copied';
      setTimeout(() => {
        btn.classList.remove('copied');
        btn.querySelector('.copy-label').textContent = 'Copy';
      }, 1800);
    } catch (e) {
      location.href = 'mailto:' + btn.dataset.copy;
    }
  });
});
