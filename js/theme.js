/**
 * ATCHAYA T Portfolio - Main Script
 * Handles Dark/Light Mode, Custom Scroll animations, Form validation, and Dynamic filtering.
 */

document.addEventListener('DOMContentLoaded', () => {
  // ==========================================================================
  // 1. THEME CONTROLLER (Dark / Light Mode)
  // ==========================================================================
  const themeToggleBtn = document.getElementById('theme-toggle');
  
  // Set theme based on localStorage or System preference
  const currentTheme = localStorage.getItem('theme') || 
                       (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  
  document.documentElement.setAttribute('data-theme', currentTheme);
  
  // Theme Toggle click handler
  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      let theme = document.documentElement.getAttribute('data-theme');
      let newTheme = theme === 'dark' ? 'light' : 'dark';
      
      // Apply theme with a smooth fade effect
      document.body.style.opacity = '0.95';
      setTimeout(() => {
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        document.body.style.opacity = '1';
      }, 100);
    });
  }

  // ==========================================================================
  // 2. STICKY GLASS NAVBAR
  // ==========================================================================
  const navbar = document.querySelector('.navbar');
  const handleScroll = () => {
    if (window.scrollY > 20) {
      navbar.classList.add('scrolled', 'glass-nav');
    } else {
      navbar.classList.remove('scrolled', 'glass-nav');
    }
  };
  window.addEventListener('scroll', handleScroll);
  handleScroll(); // Run once in case user starts scrolled down

  // Close mobile navbar on nav-link click
  const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
  const navbarCollapse = document.querySelector('.navbar-collapse');
  if (navbarCollapse) {
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (navbarCollapse.classList.contains('show')) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
          if (bsCollapse) bsCollapse.hide();
        }
      });
    });
  }

  // ==========================================================================
  // 3. STATS COUNT-UP ANIMATION
  // ==========================================================================
  const statsSection = document.getElementById('stats-counter-section');
  let statsAnimated = false;

  const animateCounters = () => {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'), 10);
      let count = 0;
      const speed = target > 50 ? 20 : 100; // Speed adjustment based on size
      const increment = Math.ceil(target / 30); // Reach target in 30 steps
      
      const updateCount = () => {
        if (count < target) {
          count += increment;
          if (count > target) count = target;
          counter.innerText = count + (counter.getAttribute('data-suffix') || '');
          setTimeout(updateCount, speed);
        } else {
          counter.innerText = target + (counter.getAttribute('data-suffix') || '');
        }
      };
      updateCount();
    });
  };

  // ==========================================================================
  // 4. SKILLS PROGRESS BAR ANIMATION
  // ==========================================================================
  const skillsSection = document.getElementById('skills-section');
  let skillsAnimated = false;

  const animateSkills = () => {
    const progressBars = document.querySelectorAll('.skill-bar-fill');
    progressBars.forEach(bar => {
      const percentage = bar.getAttribute('data-percentage');
      bar.style.width = percentage + '%';
    });
  };

  // Scroll Intersection Observer for Stats and Skills
  const observerOptions = {
    root: null,
    threshold: 0.15
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        if (entry.target.id === 'stats-counter-section' && !statsAnimated) {
          animateCounters();
          statsAnimated = true;
        }
        if (entry.target.id === 'skills-section' && !skillsAnimated) {
          animateSkills();
          skillsAnimated = true;
        }
      }
    });
  }, observerOptions);

  if (statsSection) observer.observe(statsSection);
  if (skillsSection) observer.observe(skillsSection);

  // Fallback trigger if IntersectionObserver is not supported or fails
  setTimeout(() => {
    if (!statsAnimated && document.getElementById('stats-counter-section')) {
      animateCounters();
      statsAnimated = true;
    }
    if (!skillsAnimated && document.getElementById('skills-section')) {
      animateSkills();
      skillsAnimated = true;
    }
  }, 1000);

  // ==========================================================================
  // 5. CLIENT-SIDE PROJECT CATEGORY FILTER
  // ==========================================================================
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-grid-item');

  if (filterButtons.length > 0 && projectCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // Update active class on buttons
        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filterValue = btn.getAttribute('data-filter');

        projectCards.forEach(card => {
          card.style.transition = 'transform 0.4s ease, opacity 0.4s ease';
          if (filterValue === 'all' || card.classList.contains(filterValue)) {
            card.style.display = 'block';
            setTimeout(() => {
              card.style.opacity = '1';
              card.style.transform = 'scale(1)';
            }, 50);
          } else {
            card.style.opacity = '0';
            card.style.transform = 'scale(0.8)';
            setTimeout(() => {
              card.style.display = 'none';
            }, 300);
          }
        });
      });
    });
  }

  // ==========================================================================
  // 6. CONTACT FORM VALIDATION & SUBMISSION
  // ==========================================================================
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
      e.preventDefault();
      
      let isValid = true;
      const name = document.getElementById('name');
      const email = document.getElementById('email');
      const subject = document.getElementById('subject');
      const message = document.getElementById('message');

      // Clear previous validation states
      [name, email, subject, message].forEach(input => {
        if (input) {
          input.classList.remove('is-invalid', 'is-valid');
          const fb = input.parentElement.querySelector('.invalid-feedback');
          if (fb) fb.style.display = 'none';
        }
      });

      // Name Validation
      if (name && name.value.trim().length < 3) {
        name.classList.add('is-invalid');
        isValid = false;
      } else if (name) {
        name.classList.add('is-valid');
      }

      // Email Validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (email && !emailRegex.test(email.value.trim())) {
        email.classList.add('is-invalid');
        isValid = false;
      } else if (email) {
        email.classList.add('is-valid');
      }

      // Subject Validation
      if (subject && subject.value.trim().length < 3) {
        subject.classList.add('is-invalid');
        isValid = false;
      } else if (subject) {
        subject.classList.add('is-valid');
      }

      // Message Validation
      if (message && message.value.trim().length < 10) {
        message.classList.add('is-invalid');
        isValid = false;
      } else if (message) {
        message.classList.add('is-valid');
      }

      // If valid, simulate submission and show toast
      if (isValid) {
        const btn = contactForm.querySelector('button[type="submit"]');
        const originalBtnText = btn.innerHTML;
        btn.innerHTML = '<i class="fa fa-spinner fa-spin me-2"></i>Sending...';
        btn.disabled = true;

        // Simulate AJAX request
        setTimeout(() => {
          // Reset form
          contactForm.reset();
          [name, email, subject, message].forEach(input => {
            if (input) input.classList.remove('is-valid');
          });

          btn.innerHTML = originalBtnText;
          btn.disabled = false;

          // Show Toast Success
          const toastEl = document.getElementById('successToast');
          if (toastEl) {
            const toast = new bootstrap.Toast(toastEl);
            toast.show();
          }
        }, 1500);
      }
    });
  }
});
