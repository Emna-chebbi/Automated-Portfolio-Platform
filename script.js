document.addEventListener('DOMContentLoaded', () => {

  /* ---- mobile nav toggle ---- */
  const topbar = document.getElementById('topbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && topbar) {
    navToggle.addEventListener('click', () => {
      const isOpen = topbar.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      topbar.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---- active link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => { if (pageYOffset >= s.offsetTop - 120) current = s.getAttribute('id'); });
    links.forEach(l => l.classList.toggle('active', l.getAttribute('href') === `#${current}`));
  }, { passive: true });

  /* ---- scroll reveal ---- */
  document.querySelectorAll('.exp-card, .project-card, .skill-card, .cert-card, .cc, .contact-row')
    .forEach(el => el.classList.add('reveal'));
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('in'); });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  /* ---- signature terminal: type out boot lines, then start a live uptime clock ---- */
  const termLines = document.querySelectorAll('#termBody .term-line[data-text]');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const typeLine = (el, text, speed) => new Promise(resolve => {
    if (reduceMotion) { el.textContent = text; el.setAttribute('data-typed', ''); resolve(); return; }
    el.setAttribute('data-typed', '');
    let i = 0;
    const tick = () => {
      el.textContent = text.slice(0, i);
      i++;
      if (i <= text.length) { setTimeout(tick, speed); } else { resolve(); }
    };
    tick();
  });

  const bootSequence = async () => {
    for (const line of termLines) {
      const text = line.getAttribute('data-text');
      const isCommand = !line.classList.contains('term-ok') && text.includes(' ') === false ? true : text.startsWith('whoami') || text.startsWith('cat ') || text.startsWith('systemctl');
      await typeLine(line, text, isCommand ? 42 : 14);
      await new Promise(r => setTimeout(r, isCommand ? 220 : 320));
    }
    startUptime();
  };

  const startUptime = () => {
    const el = document.getElementById('termUptime');
    if (!el) return;
    const start = Date.now();
    const pad = (n) => String(n).padStart(2, '0');
    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      const h = pad(Math.floor(elapsed / 3600));
      const m = pad(Math.floor((elapsed % 3600) / 60));
      const s = pad(elapsed % 60);
      el.textContent = `${h}:${m}:${s}`;
    };
    tick();
    setInterval(tick, 1000);
  };

  if (termLines.length) bootSequence();
});
