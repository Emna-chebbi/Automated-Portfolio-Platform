document.addEventListener('DOMContentLoaded', () => {

  /* ---- mobile nav toggle ---- */
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (navToggle && navbar) {
    navToggle.addEventListener('click', () => {
      const isOpen = navbar.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      navbar.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }));
  }

  /* ---- active link on scroll ---- */
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav-links a');
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

  /* ---- cycle the hero pipeline stages ---- */
  const stages = document.querySelectorAll('#pipelineStages .pstage');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (stages.length && !reduceMotion) {
    let activeIndex = 5; // Deploy starts active
    setInterval(() => {
      stages.forEach(s => s.classList.remove('active'));
      stages[activeIndex].classList.add('done');
      activeIndex = (activeIndex + 1) % stages.length;
      if (activeIndex <= 5) stages.forEach((s, i) => { if (i > activeIndex) s.classList.remove('done'); });
      stages[activeIndex].classList.add('active');
      if (activeIndex === 6) {
        setTimeout(() => {
          stages[6].classList.remove('active');
          stages[6].classList.add('done');
          stages.forEach((s, i) => { if (i < 6) s.classList.remove('done'); });
          activeIndex = 0;
          stages[0].classList.add('active');
        }, 1800);
      }
    }, 1800);
  }
});