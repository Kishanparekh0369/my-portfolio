document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Init AOS (Animate On Scroll) ---
  if (typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 60,
      duration: 800,
      easing: 'ease-out-cubic',
    });
  }

  // --- 2. Init Typed.js ---
  if (typeof Typed !== 'undefined') {
    new Typed('.typed-text', {
      strings: [
        'Full Stack Developer',
        'Building Real-World Projects',
        'Problem Solver'
      ],
      typeSpeed: 50,
      backSpeed: 30,
      backDelay: 2000,
      loop: true,
      cursorChar: '█',
      autoInsertCss: true
    });
  }

  // --- 3. Cyberpunk Dynamic Particle Grid Canvas ---
  const canvas = document.getElementById('cyberCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = Math.min(Math.floor((width * height) / 24000), 50);

    class CyberParticle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.size = Math.random() * 2 + 0.8;
        this.speedX = (Math.random() - 0.5) * 0.4;
        this.speedY = (Math.random() - 0.5) * 0.4;
        this.hue = Math.random() > 0.5 ? 275 : 190; // Purple & Cyan
        this.alpha = Math.random() * 0.5 + 0.2;
        this.pulse = Math.random() * 0.02 + 0.005;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.alpha += Math.sin(Date.now() * this.pulse) * 0.004;

        if (this.x < 0 || this.x > width) this.speedX *= -1;
        if (this.y < 0 || this.y > height) this.speedY *= -1;
      }
      draw(isLight) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        if (isLight) {
          ctx.fillStyle = `hsla(${this.hue}, 85%, 45%, ${Math.max(0.2, Math.min(0.7, this.alpha))})`;
        } else {
          ctx.fillStyle = `hsla(${this.hue}, 95%, 65%, ${Math.max(0.15, Math.min(0.85, this.alpha))})`;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `hsla(${this.hue}, 100%, 70%, 0.8)`;
        }
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new CyberParticle());
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      const isLight = document.documentElement.getAttribute('data-theme') === 'light';

      // Connect nodes
      for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw(isLight);

        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 125) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            const lineAlpha = (1 - dist / 125) * 0.16;
            ctx.strokeStyle = isLight
              ? `rgba(124, 58, 237, ${lineAlpha * 1.3})`
              : `rgba(168, 85, 247, ${lineAlpha})`;
            ctx.lineWidth = 0.75;
            ctx.stroke();
          }
        }
      }
      requestAnimationFrame(render);
    };

    render();
  }

  // --- 4. Interactive Cursor Glow ---
  const cursorGlow = document.getElementById('cursorGlow');
  if (cursorGlow && window.innerWidth > 992) {
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    const updateCursor = () => {
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;
      cursorGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(updateCursor);
    };
    updateCursor();
  }

  // --- 5. 3D Card Hover Tilt Effect ---
  const tiltCards = document.querySelectorAll(
    '.project-card, .skill-card, .certification-card, .edu-card'
  );
  if (window.innerWidth > 992 && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    tiltCards.forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -4.5;
        const rotateY = ((x - centerX) / centerX) * 4.5;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px)`;
      });

      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // --- 6. Theme Toggle Logic ---
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle ? themeToggle.querySelector('i') : null;

  // Checking Local Storage for Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
  }

  // --- 7. Mobile Menu Toggle ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');
  const navOverlay = document.getElementById('navOverlay');

  const closeMobileMenu = () => {
    if (navLinks) navLinks.classList.remove('active');
    if (navOverlay) navOverlay.classList.remove('active');
    if (mobileMenuBtn) {
      const icon = mobileMenuBtn.querySelector('i');
      if (icon && icon.classList.contains('fa-times')) {
        icon.classList.replace('fa-times', 'fa-bars');
      }
    }
  };

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (!navLinks) return;
      const isActive = navLinks.classList.toggle('active');
      if (navOverlay) navOverlay.classList.toggle('active');
      const icon = mobileMenuBtn.querySelector('i');
      if (icon) {
        if (isActive) {
          icon.classList.replace('fa-bars', 'fa-times');
        } else {
          icon.classList.replace('fa-times', 'fa-bars');
        }
      }
    });
  }

  // Close mobile menu on clicking any navigation link
  navLinksItems.forEach((link) => {
    link.addEventListener('click', closeMobileMenu);
  });

  // Close mobile menu on clicking the background overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      closeMobileMenu();

      let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
      let targetTheme = 'light';

      if (currentTheme === 'light') {
        targetTheme = 'dark';
        document.documentElement.removeAttribute('data-theme');
        if (themeIcon) themeIcon.classList.replace('fa-sun', 'fa-moon');
      } else {
        document.documentElement.setAttribute('data-theme', 'light');
        if (themeIcon) themeIcon.classList.replace('fa-moon', 'fa-sun');
      }

      localStorage.setItem('theme', targetTheme);
    });
  }

  // --- 8. Navbar Scroll Effect & Active Link Spy ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');

  window.addEventListener('scroll', () => {
    if (navbar) {
      if (window.scrollY > 40) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    }

    let current = '';
    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      if (window.pageYOffset >= sectionTop - 300) {
        current = section.getAttribute('id');
      }
    });

    navLinksItems.forEach((link) => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 9. Progress Bar Animation on Scroll ---
  const progressBars = document.querySelectorAll('.skill-bar');
  const skillsSection = document.getElementById('skills');
  let animated = false;

  const animateSkills = () => {
    if (!skillsSection) return;
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;

    if (sectionPos < screenPos - 70 && !animated) {
      progressBars.forEach((bar) => {
        const value = bar.getAttribute('data-value');
        bar.style.width = value + '%';
      });
      animated = true;
    }
  };

  window.addEventListener('scroll', animateSkills);
  animateSkills(); // check on load

  // --- 10. WhatsApp Integration Form ---
  const whatsappBtn = document.getElementById('whatsappBtn');
  if (whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      const nameEl = document.getElementById('name');
      const emailEl = document.getElementById('email');
      const subjectEl = document.getElementById('subject');
      const messageEl = document.getElementById('message');

      const name = nameEl ? nameEl.value.trim() : '';
      const email = emailEl ? emailEl.value.trim() : '';
      const subject = subjectEl ? subjectEl.value.trim() : '';
      const message = messageEl ? messageEl.value.trim() : '';

      // Validation Check
      if (!name || !email || !message) {
        alert(
          'Please fill out all mandatory fields (Identity, Return Address, and Transmission Data) to initiate contact.'
        );
        if (!name && nameEl) nameEl.style.borderColor = '#EF4444';
        if (!email && emailEl) emailEl.style.borderColor = '#EF4444';
        if (!message && messageEl) messageEl.style.borderColor = '#EF4444';

        setTimeout(() => {
          if (nameEl) nameEl.style.borderColor = '';
          if (emailEl) emailEl.style.borderColor = '';
          if (messageEl) messageEl.style.borderColor = '';
        }, 3000);
        return;
      }

      // Formatting the URL encoded WhatsApp text
      const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${encodeURIComponent(
        name
      )}%0A*Email:* ${encodeURIComponent(email)}%0A*Subject:* ${encodeURIComponent(
        subject || 'Not specified'
      )}%0A%0A*Message:*%0A${encodeURIComponent(message)}`;

      const phoneNumber = '9316361979';
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${whatsappMessage}`;

      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // --- 11. Certifications Modal Logic ---
  const certBtns = document.querySelectorAll('.certification-btn');
  const certModal = document.getElementById('certificateModal');
  const modalImg = document.getElementById('modalCertificateImg');

  if (certModal) {
    const closeBtn = certModal.querySelector('.modal-close');

    certBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = btn.getAttribute('data-certificate');
        if (imgSrc && modalImg) {
          modalImg.src = imgSrc;
          certModal.classList.add('active');
        }
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        certModal.classList.remove('active');
      });
    }

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('active');
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        certModal.classList.remove('active');
      }
    });
  }

  // --- 12. Back to Top Logic ---
  const backToTopBtn = document.getElementById('backToTop');

  if (backToTopBtn) {
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add('visible');
      } else {
        backToTopBtn.classList.remove('visible');
      }
    });

    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    });
  }
});
