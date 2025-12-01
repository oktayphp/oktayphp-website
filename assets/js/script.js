document.addEventListener('DOMContentLoaded', function () {
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');
  const themeToggle = document.getElementById('themeToggle');
  const body = document.body;
  const yearEl = document.getElementById('year');
  const navbar = document.getElementById('navbar');

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // منوی موبایل (همبرگر)
  function openMenu() {
    navLinks.classList.add('open');
    hamburger.classList.add('open');
    hamburger.setAttribute('aria-expanded', 'true');
    // جلوگیری از اسکرول پس‌زمینه
    document.documentElement.style.overflow = 'hidden';
    document.body.style.overflow = 'hidden';
    // تمرکز روی اولین لینک منو برای دسترس‌پذیری
    const firstLink = navLinks.querySelector('a');
    if (firstLink) firstLink.focus();
  }
  function closeMenu() {
    navLinks.classList.remove('open');
    hamburger.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.documentElement.style.overflow = '';
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', (e) => {
    const isOpen = navLinks.classList.contains('open');
    if (isOpen) closeMenu();
    else openMenu();
    e.stopPropagation();
  });

  // بستن منو وقتی کاربر روی یکی از لینک‌ها کلیک می‌کند
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.addEventListener('click', () => {
      closeMenu();
    });
  });

  // بستن منو در کلیک خارج از منو
  document.addEventListener('click', (e) => {
    if (!navLinks.classList.contains('open')) return;
    const target = e.target;
    if (!navLinks.contains(target) && !hamburger.contains(target)) {
      closeMenu();
    }
  });

  // بستن منو با Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' || e.key === 'Esc') {
      if (navLinks.classList.contains('open')) closeMenu();
    }
  });

  // بستن منو هنگام تغییر اندازه صفحه (اگر از موبایل به دسکتاپ تغییر کرد)
  window.addEventListener('resize', () => {
    if (window.innerWidth > 900 && navLinks.classList.contains('open')) {
      closeMenu();
    }
  });

  // Theme toggle (همان قبلی)
  const savedTheme = localStorage.getItem('site-theme') || 'light';
  body.classList.toggle('dark', savedTheme === 'dark');
  themeToggle.textContent = savedTheme === 'dark' ? '☀️' : '🌙';
  themeToggle.addEventListener('click', () => {
    const isDark = body.classList.toggle('dark');
    themeToggle.textContent = isDark ? '☀️' : '🌙';
    localStorage.setItem('site-theme', isDark ? 'dark' : 'light');
  });

  // افکت پارالاکس ساده برای hero-bg و تغییر کلاس navbar در اسکرول
  window.addEventListener('scroll', () => {
    const sc = window.scrollY;
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) heroBg.style.transform = `translateY(${sc * 0.2}px)`;
    if (sc > 20) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  });

  /* تایپ افکت */
  const typeEl = document.getElementById('typeText');
  const skills = ['HTML', 'CSS', 'JavaScript', 'PHP', 'MySQL', 'Laravel', 'Python'];
  let ti = 0, ci = 0, isDeleting = false;
  function typeLoop() {
    if (!typeEl) return;
    const full = skills[ti];
    if (!isDeleting) {
      typeEl.textContent = full.slice(0, ++ci);
      if (ci === full.length) {
        isDeleting = true;
        setTimeout(typeLoop, 800);
        return;
      }
    } else {
      typeEl.textContent = full.slice(0, --ci);
      if (ci === 0) {
        isDeleting = false;
        ti = (ti + 1) % skills.length;
      }
    }
    setTimeout(typeLoop, isDeleting ? 50 : 120);
  }
  if (typeEl) typeLoop();

  /* reveal با IntersectionObserver (همان قبلی) */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  /* انیمیشن نوار مهارت‌ها */
  function animateSkillBars(){
    document.querySelectorAll('.bar').forEach(bar => {
      const p = parseInt(bar.getAttribute('data-percent')) || 0;
      bar.style.width = p + '%';
    });
  }
  const skillsSection = document.getElementById('skills');
  if (skillsSection) {
    const skObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateSkillBars();
          skObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    skObs.observe(skillsSection);
  }

  /* ارسال فرم تماس با fetch */
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      formStatus.textContent = 'در حال ارسال ...';
      formStatus.className = 'form-status';
      const formData = new FormData(contactForm);
      try {
        const res = await fetch(contactForm.action, { method: 'POST', body: formData, headers: { 'Accept': 'application/json' }});
        const data = await res.json();
        if (data.success) {
          formStatus.textContent = data.message || 'پیام با موفقیت ارسال شد.';
          formStatus.classList.add('form-success');
          contactForm.reset();
        } else {
          formStatus.textContent = data.message || 'ارسال پیام با خطا مواجه شد.';
          formStatus.classList.add('form-error');
        }
      } catch (err) {
        formStatus.textContent = 'خطا در ارتباط با سرور. دوباره امتحان کنید.';
        formStatus.classList.add('form-error');
      }
    });
  }
});
