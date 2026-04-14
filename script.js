document.addEventListener('DOMContentLoaded', () => {

  // --- 1. Init AOS (Animate On Scroll) ---
  if(typeof AOS !== 'undefined') {
    AOS.init({
      once: true,
      offset: 80,
      duration: 1000,
      easing: 'ease-out-cubic',
    });
  }

  // --- 2. Init Typed.js ---
  if(typeof Typed !== 'undefined') {
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
      cursorChar: '█', // Premium terminal cursor
      autoInsertCss: true
    });
  }

  // --- 3. Init Vanta.js Network Background ---
  let vantaEffect = null;
  const initVanta = (theme) => {
    // Prevent re-init if already running
    if(vantaEffect) vantaEffect.destroy();

    // Setup colors based on theme
    const isLight = theme === 'light';
    const bgColor = isLight ? 0xF8FAFC : 0x050814;
    const color = isLight ? 0x2563EB : 0x8B5CF6; // Blue in light, Neon Purple in dark
    const backgroundColor = isLight ? 0x6D28D9 : 0x3B82F6; // Accent in light, Neon Blue in dark

    if(typeof VANTA !== 'undefined') {
      vantaEffect = VANTA.NET({
        el: "#vanta-bg",
        mouseControls: true,
        touchControls: true,
        gyroControls: false,
        minHeight: 200.00,
        minWidth: 200.00,
        scale: 1.00,
        scaleMobile: 1.00,
        color: color,
        backgroundColor: bgColor,
        points: 12.00,
        maxDistance: 22.00,
        spacing: 18.00,
        showDots: true
      });
    }
  };


  // --- 4. Theme Toggle Logic ---
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('i');
  
  // Checking Local Storage for Theme
  const savedTheme = localStorage.getItem('theme') || 'dark';
  if (savedTheme === 'light') {
    document.documentElement.setAttribute('data-theme', 'light');
    themeIcon.classList.replace('fa-moon', 'fa-sun');
  }
  
  // Initialize Vanta with current theme
  initVanta(savedTheme);

  // --- 5. Mobile Menu Toggle ---
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const navLinksItems = document.querySelectorAll('.nav-link');
  const navOverlay = document.getElementById('navOverlay');
  
  const closeMobileMenu = () => {
    navLinks.classList.remove('active');
    if(navOverlay) navOverlay.classList.remove('active');
    const icon = mobileMenuBtn.querySelector('i');
    if(icon && icon.classList.contains('fa-times')) {
      icon.classList.replace('fa-times', 'fa-bars');
    }
  };

  mobileMenuBtn.addEventListener('click', () => {
    const isActive = navLinks.classList.toggle('active');
    if(navOverlay) navOverlay.classList.toggle('active');
    const icon = mobileMenuBtn.querySelector('i');
    if (isActive) {
      icon.classList.replace('fa-bars', 'fa-times');
    } else {
      icon.classList.replace('fa-times', 'fa-bars');
    }
  });

  // Close mobile menu on clicking any navigation link
  navLinksItems.forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
  
  // Close mobile menu on clicking the background overlay
  if (navOverlay) {
    navOverlay.addEventListener('click', closeMobileMenu);
  }
  
  themeToggle.addEventListener('click', () => {
    closeMobileMenu(); // Ensures mobile menu closes when theme is toggled
    
    let currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
    let targetTheme = 'light';
    
    if (currentTheme === 'light') {
      targetTheme = 'dark';
      document.documentElement.removeAttribute('data-theme');
      themeIcon.classList.replace('fa-sun', 'fa-moon');
    } else {
      document.documentElement.setAttribute('data-theme', 'light');
      themeIcon.classList.replace('fa-moon', 'fa-sun');
    }
    
    localStorage.setItem('theme', targetTheme);
    // Dynamically update Vanta background on theme change
    initVanta(targetTheme);
  });

  // --- 6. Navbar Scroll Effect & Active Link Spy ---
  const navbar = document.querySelector('.navbar');
  const sections = document.querySelectorAll('section');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (pageYOffset >= (sectionTop - 300)) {
        current = section.getAttribute('id');
      }
    });

    navLinksItems.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  // --- 7. Progress Bar Animation on Scroll ---
  const progressBars = document.querySelectorAll('.skill-bar');
  const skillsSection = document.getElementById('skills');
  let animated = false;

  const animateSkills = () => {
    if(!skillsSection) return;
    const sectionPos = skillsSection.getBoundingClientRect().top;
    const screenPos = window.innerHeight;

    if(sectionPos < screenPos - 100 && !animated) {
      progressBars.forEach(bar => {
        const value = bar.getAttribute('data-value');
        bar.style.width = value + '%';
      });
      animated = true;
    }
  };

  window.addEventListener('scroll', animateSkills);
  animateSkills(); // check on load

  // --- 8. WhatsApp Integration Form ---
  const whatsappBtn = document.getElementById('whatsappBtn');
  if(whatsappBtn) {
    whatsappBtn.addEventListener('click', () => {
      // Fetch Input Elements
      const nameEl = document.getElementById('name');
      const emailEl = document.getElementById('email');
      const subjectEl = document.getElementById('subject');
      const messageEl = document.getElementById('message');

      // Sanitize Strings
      const name = nameEl.value.trim();
      const email = emailEl.value.trim();
      const subject = subjectEl.value.trim();
      const message = messageEl.value.trim();
      
      // Validation Check
      if (!name || !email || !message) {
        alert('Please fill out all mandatory fields (Identity, Return Address, and Transmission Data) to initiate contact.');
        // Add error states
        if(!name) nameEl.style.borderColor = '#EF4444';
        if(!email) emailEl.style.borderColor = '#EF4444';
        if(!message) messageEl.style.borderColor = '#EF4444';
        
        setTimeout(() => {
          nameEl.style.borderColor = '';
          emailEl.style.borderColor = '';
          messageEl.style.borderColor = '';
        }, 3000);
        return;
      }
      
      // Formatting the URL encoded WhatsApp text
      const whatsappMessage = `*New Contact Form Submission*%0A%0A*Name:* ${name}%0A*Email:* ${email}%0A*Subject:* ${subject || 'Not specified'}%0A%0A*Message:*%0A${message}`;
      
      // Configure phone number
      const phoneNumber = '9316361979';
      const whatsappUrl = `https://wa.me/91${phoneNumber}?text=${whatsappMessage}`;
      
      // Fire action in new tab securely
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
    });
  }

  // --- 9. Certifications Modal Logic ---
  const certBtns = document.querySelectorAll('.certification-btn');
  const certModal = document.getElementById('certificateModal');
  const modalImg = document.getElementById('modalCertificateImg');
  
  if (certModal) {
    const closeBtn = certModal.querySelector('.modal-close');
    
    certBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const imgSrc = btn.getAttribute('data-certificate');
        if (imgSrc && modalImg) {
          modalImg.src = imgSrc;
          certModal.classList.add('active');
        }
      });
    });

    closeBtn.addEventListener('click', () => {
      certModal.classList.remove('active');
    });

    certModal.addEventListener('click', (e) => {
      if (e.target === certModal) {
        certModal.classList.remove('active');
      }
    });

    // Close with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && certModal.classList.contains('active')) {
        certModal.classList.remove('active');
      }
    });
  }

});
