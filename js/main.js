/* ═══════════════════════════════════════
   DATIOO — Main JavaScript
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {
  // --- Announcement Bar Dismiss ---
  const announcementBar = document.querySelector('.announcement-bar');
  const dismissBtn = document.querySelector('.announcement-dismiss');
  const header = document.querySelector('.site-header');

  if (dismissBtn && announcementBar) {
    dismissBtn.addEventListener('click', () => {
      announcementBar.classList.add('hidden');
      header.classList.remove('has-announcement');
    });
  }

  // --- Sticky Nav with scroll effect ---
  const onScroll = () => {
    const scrolled = window.scrollY > 60;
    header.classList.toggle('scrolled', scrolled);

    // Back to top visibility
    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- Mobile Menu ---
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  const mobileOverlay = document.querySelector('.mobile-nav-overlay');

  const toggleMobile = (open) => {
    const isOpen = open !== undefined ? open : !mobileNav.classList.contains('active');
    mobileNav.classList.toggle('active', isOpen);
    mobileOverlay.classList.toggle('active', isOpen);
    hamburger.classList.toggle('active', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  };

  if (hamburger) {
    hamburger.addEventListener('click', () => toggleMobile());
  }

  if (mobileOverlay) {
    mobileOverlay.addEventListener('click', () => toggleMobile(false));
  }

  const mobileClose = document.querySelector('.mobile-nav-close');
  if (mobileClose) {
    mobileClose.addEventListener('click', () => toggleMobile(false));
  }

  // Close mobile nav on link click
  document.querySelectorAll('.mobile-nav .nav-link').forEach(link => {
    link.addEventListener('click', () => toggleMobile(false));
  });

  // --- Smooth Scroll for anchor links ---
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        const headerHeight = header.offsetHeight;
        const top = target.getBoundingClientRect().top + window.scrollY - headerHeight;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // --- Back to Top ---
  const backToTopBtn = document.querySelector('.back-to-top');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      toggleMobile(false);
    }
  });

  // --- Services Carousel ---
  const carouselTrack = document.getElementById('servicesTrack');
  const carouselPrev = document.querySelector('.carousel-prev');
  const carouselNext = document.querySelector('.carousel-next');
  const dotsContainer = document.getElementById('servicesDots');

  if (carouselTrack && carouselPrev && carouselNext && dotsContainer) {
    const cards = carouselTrack.querySelectorAll('.service-card');
    const gap = 24;

    const getVisibleCount = () => {
      const card = cards[0];
      if (!card) return 1;
      return Math.round(carouselTrack.offsetWidth / (card.offsetWidth + gap)) || 1;
    };

    const getPageCount = () => Math.max(1, cards.length - getVisibleCount() + 1);

    const getSlideWidth = () => {
      const card = cards[0];
      if (!card) return 0;
      return card.offsetWidth + gap;
    };

    const buildDots = () => {
      const count = getPageCount();
      dotsContainer.innerHTML = '';
      for (let i = 0; i < count; i++) {
        const dot = document.createElement('span');
        dot.className = 'carousel-dot';
        dot.addEventListener('click', () => {
          carouselTrack.scrollTo({ left: getSlideWidth() * i, behavior: 'smooth' });
        });
        dotsContainer.appendChild(dot);
      }
      updateCarouselDots();
    };

    const updateCarouselDots = () => {
      const sw = getSlideWidth();
      if (!sw) return;
      const index = Math.min(Math.round(carouselTrack.scrollLeft / sw), getPageCount() - 1);
      dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    carouselNext.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: getSlideWidth(), behavior: 'smooth' });
    });

    carouselPrev.addEventListener('click', () => {
      carouselTrack.scrollBy({ left: -getSlideWidth(), behavior: 'smooth' });
    });

    carouselTrack.addEventListener('scroll', updateCarouselDots, { passive: true });
    window.addEventListener('resize', buildDots);
    buildDots();

    // Drag-to-scroll
    let isDragging = false;
    let dragStartX = 0;
    let scrollStartLeft = 0;

    carouselTrack.addEventListener('mousedown', (e) => {
      isDragging = true;
      dragStartX = e.pageX;
      scrollStartLeft = carouselTrack.scrollLeft;
    });

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return;
      carouselTrack.scrollLeft = scrollStartLeft - (e.pageX - dragStartX);
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
  }

  // --- Gallery Swiper ---
  const galleryTrack = document.getElementById('galleryTrack');
  const galleryDotsContainer = document.getElementById('galleryDots');
  const galleryPrev = document.querySelector('.gallery-prev');
  const galleryNext = document.querySelector('.gallery-next');

  if (galleryTrack && galleryDotsContainer) {
    const slides = galleryTrack.querySelectorAll('.gallery-slide');

    // Build dots
    slides.forEach((_, i) => {
      const dot = document.createElement('span');
      dot.className = 'gallery-dot' + (i === 0 ? ' active' : '');
      dot.addEventListener('click', () => {
        galleryTrack.scrollTo({ left: galleryTrack.offsetWidth * i, behavior: 'smooth' });
      });
      galleryDotsContainer.appendChild(dot);
    });

    const updateGalleryDots = () => {
      const index = Math.round(galleryTrack.scrollLeft / galleryTrack.offsetWidth);
      galleryDotsContainer.querySelectorAll('.gallery-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
      });
    };

    galleryTrack.addEventListener('scroll', updateGalleryDots, { passive: true });

    if (galleryNext) {
      galleryNext.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: galleryTrack.offsetWidth, behavior: 'smooth' });
      });
    }
    if (galleryPrev) {
      galleryPrev.addEventListener('click', () => {
        galleryTrack.scrollBy({ left: -galleryTrack.offsetWidth, behavior: 'smooth' });
      });
    }

    // Autoplay
    let autoplayInterval = setInterval(() => {
      const index = Math.round(galleryTrack.scrollLeft / galleryTrack.offsetWidth);
      if (index >= slides.length - 1) {
        galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
      } else {
        galleryTrack.scrollBy({ left: galleryTrack.offsetWidth, behavior: 'smooth' });
      }
    }, 4000);

    const resetAutoplay = () => {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(() => {
        const index = Math.round(galleryTrack.scrollLeft / galleryTrack.offsetWidth);
        if (index >= slides.length - 1) {
          galleryTrack.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
          galleryTrack.scrollBy({ left: galleryTrack.offsetWidth, behavior: 'smooth' });
        }
      }, 4000);
    };

    [galleryPrev, galleryNext].forEach(btn => {
      if (btn) btn.addEventListener('click', resetAutoplay);
    });
    galleryDotsContainer.addEventListener('click', resetAutoplay);
  }

  // --- Contact Form Validation ---
  const form = document.querySelector('.contact-form form');
  if (form) {
    // Get i18n error messages if available
    const getErrorMsg = (key, fallback) => {
      if (window.datiooI18n) {
        const lang = document.documentElement.lang || 'en';
        const t = typeof translations !== 'undefined' ? translations[lang] : null;
        if (t && t[key]) return t[key];
      }
      return fallback;
    };

    form.addEventListener('submit', (e) => {
      let valid = true;

      const fields = [
        { name: 'name', type: 'text' },
        { name: 'email', type: 'email' },
        { name: 'phone', type: 'phone' },
        { name: 'message', type: 'text' }
      ];

      fields.forEach(({ name, type }) => {
        const group = form.querySelector(`[name="${name}"]`).closest('.form-group');
        const input = group.querySelector('input, textarea');
        const error = group.querySelector('.error-message');
        const value = input.value.trim();

        group.classList.remove('error');

        if (!value) {
          group.classList.add('error');
          if (error) error.textContent = getErrorMsg('contact.form.required', 'This field is required');
          valid = false;
        } else if (type === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          group.classList.add('error');
          if (error) error.textContent = getErrorMsg('contact.form.invalidEmail', 'Please enter a valid email');
          valid = false;
        } else if (type === 'phone' && !/^[\+\d\s\-\(\)]{7,20}$/.test(value)) {
          group.classList.add('error');
          if (error) error.textContent = getErrorMsg('contact.form.invalidEmail', 'Please enter a valid phone number');
          valid = false;
        }
      });

      if (!valid) {
        e.preventDefault();
        const firstError = form.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstError) firstError.focus();
      }
    });
  }

  // --- Intersection Observer: Fade-in on scroll ---
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
  );

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

  // --- Footer: Auto-update year ---
  const yearEl = document.querySelector('.current-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
});
