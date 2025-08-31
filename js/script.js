// ========== GLOBAL VARIABLES ==========
let currentSlide = 0;
let slideInterval;
let isPlaying = true;

// ========== DOM ELEMENTS ==========
const slides = document.querySelectorAll('.slide');
const heroTitle = document.getElementById('hero-title');
const heroTag = document.getElementById('hero-tag');
const heroRating = document.getElementById('hero-rating');
const dotsContainer = document.querySelector('.hero-dots');
const leftArrow = document.querySelector('.hero-arrow.left');
const rightArrow = document.querySelector('.hero-arrow.right');
const heroSlideshow = document.querySelector('.hero-slideshow');
const mobileMenuToggle = document.querySelector('.mobile-menu-toggle');
const navMenu = document.querySelector('.nav-menu');
const searchInput = document.querySelector('.search');

// ========== UTILITY FUNCTIONS ==========

// Debounce function for performance optimization
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Smooth scroll to element
function smoothScrollTo(element) {
  if (element) {
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}

// Add class with animation delay
function addClassWithDelay(elements, className, delay = 100) {
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(className);
    }, index * delay);
  });
}

// ========== SLIDESHOW FUNCTIONALITY ==========

// Initialize slideshow
function initSlideshow() {
  if (slides.length === 0) return;

  // Create dots
  createDots();

  // Set initial slide
  updateSlideInfo();

  // Start autoplay
  startAutoplay();

  // Add event listeners
  addSlideEventListeners();
}

// Create navigation dots
function createDots() {
  if (!dotsContainer) return;

  dotsContainer.innerHTML = '';

  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.classList.add('dot');
    if (index === currentSlide) {
      dot.classList.add('active');
    }
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    dot.addEventListener('click', () => goToSlide(index));
    dotsContainer.appendChild(dot);
  });
}

// Go to specific slide
function goToSlide(index) {
  if (index < 0 || index >= slides.length) return;

  // Remove active class from all slides and dots
  slides.forEach(slide => slide.classList.remove('active'));
  document.querySelectorAll('.dot').forEach(dot => dot.classList.remove('active'));

  // Add active class to current slide and dot
  slides[index].classList.add('active');
  document.querySelectorAll('.dot')[index]?.classList.add('active');

  currentSlide = index;
  updateSlideInfo();
}

// Go to next slide
function nextSlide() {
  const nextIndex = (currentSlide + 1) % slides.length;
  goToSlide(nextIndex);
}

// Go to previous slide
function prevSlide() {
  const prevIndex = (currentSlide - 1 + slides.length) % slides.length;
  goToSlide(prevIndex);
}

// Update slide information
function updateSlideInfo() {
  if (!slides[currentSlide]) return;

  const slideData = slides[currentSlide].dataset;

  if (heroTitle && slideData.title) {
    heroTitle.textContent = slideData.title;
  }

  if (heroTag && slideData.tag) {
    heroTag.textContent = slideData.tag;
  }

  if (heroRating && slideData.rating) {
    heroRating.textContent = slideData.rating;
  }
}

// Start autoplay
function startAutoplay() {
  if (slideInterval) clearInterval(slideInterval);
  slideInterval = setInterval(nextSlide, 5000);
  isPlaying = true;
}

// Stop autoplay
function stopAutoplay() {
  if (slideInterval) clearInterval(slideInterval);
  isPlaying = false;
}

// Add slideshow event listeners
function addSlideEventListeners() {
  // Arrow navigation
  leftArrow?.addEventListener('click', () => {
    prevSlide();
    stopAutoplay();
    setTimeout(startAutoplay, 3000); // Resume after 3 seconds
  });

  rightArrow?.addEventListener('click', () => {
    nextSlide();
    stopAutoplay();
    setTimeout(startAutoplay, 3000); // Resume after 3 seconds
  });

  // Pause on hover
  heroSlideshow?.addEventListener('mouseenter', stopAutoplay);
  heroSlideshow?.addEventListener('mouseleave', () => {
    if (!isPlaying) startAutoplay();
  });

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      prevSlide();
      stopAutoplay();
      setTimeout(startAutoplay, 3000);
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      stopAutoplay();
      setTimeout(startAutoplay, 3000);
    }
  });
}

// ========== MOBILE MENU ==========

function initMobileMenu() {
  if (!mobileMenuToggle || !navMenu) return;

  mobileMenuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    mobileMenuToggle.classList.toggle('active');

    // Toggle aria-expanded
    const isExpanded = navMenu.classList.contains('active');
    mobileMenuToggle.setAttribute('aria-expanded', isExpanded);
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!navMenu.contains(e.target) && !mobileMenuToggle.contains(e.target)) {
      navMenu.classList.remove('active');
      mobileMenuToggle.classList.remove('active');
      mobileMenuToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// ========== MOVIE CARDS INTERACTIONS ==========

function initMovieCards() {
  const movieCards = document.querySelectorAll('.movie-card');

  movieCards.forEach(card => {
    // Add tilt effect on mouse move
    card.addEventListener('mousemove', handleCardTilt);
    card.addEventListener('mouseleave', resetCardTilt);

    // Add click handlers
    const bookButton = card.querySelector('.btn-primary');
    const playButton = card.querySelector('.play-btn');

    bookButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      handleBookTicket(card);
    });

    playButton?.addEventListener('click', (e) => {
      e.stopPropagation();
      handlePlayTrailer(card);
    });

    // Add keyboard navigation
    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const bookButton = card.querySelector('.btn-primary');
        if (bookButton) {
          bookButton.click();
        }
      }
    });
  });
}

// Handle card tilt effect
function handleCardTilt(e) {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = (y - centerY) / 10;
  const rotateY = (centerX - x) / 10;

  card.style.transform = `
    perspective(1000px) 
    rotateX(${rotateX}deg) 
    rotateY(${rotateY}deg) 
    translateZ(10px)
  `;
}

// Reset card tilt
function resetCardTilt(e) {
  const card = e.currentTarget;
  card.style.transform = '';
}

// Handle ticket booking
function handleBookTicket(card) {
  const movieTitle = card.querySelector('h3')?.textContent;

  // Add visual feedback
  const button = card.querySelector('.btn-primary');
  if (button) {
    const originalText = button.textContent;
    button.textContent = 'Booking...';
    button.disabled = true;

    setTimeout(() => {
      button.textContent = 'Booked!';
      setTimeout(() => {
        button.textContent = originalText;
        button.disabled = false;
      }, 2000);
    }, 1000);
  }

  // Simulate booking process
  console.log(`Booking ticket for: ${movieTitle}`);

  // Show notification (you can replace this with a proper notification system)
  showNotification(`Booking initiated for "${movieTitle}"`);
}

// Handle trailer play
function handlePlayTrailer(card) {
  const movieTitle = card.querySelector('h3')?.textContent;
  console.log(`Playing trailer for: ${movieTitle}`);
  showNotification(`Playing trailer for "${movieTitle}"`);
}

// ========== SEARCH FUNCTIONALITY ==========

function initSearch() {
  if (!searchInput) return;

  const debouncedSearch = debounce(handleSearch, 300);

  searchInput.addEventListener('input', debouncedSearch);
  searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  });
}

function handleSearch() {
  const query = searchInput.value.trim().toLowerCase();
  if (!query) {
    showAllMovies();
    return;
  }

  const movieCards = document.querySelectorAll('.movie-card');
  let foundMovies = 0;

  movieCards.forEach(card => {
    const title = card.querySelector('h3')?.textContent.toLowerCase() || '';
    const genre = card.querySelector('.movie-genre')?.textContent.toLowerCase() || '';

    if (title.includes(query) || genre.includes(query)) {
      card.style.display = 'block';
      card.classList.add('fade-in-up');
      foundMovies++;
    } else {
      card.style.display = 'none';
      card.classList.remove('fade-in-up');
    }
  });

  // Show search results feedback
  if (foundMovies === 0) {
    showNotification('No movies found matching your search');
  }
}

function showAllMovies() {
  const movieCards = document.querySelectorAll('.movie-card');
  movieCards.forEach(card => {
    card.style.display = 'block';
    card.classList.add('fade-in-up');
  });
}

// ========== SMOOTH SCROLLING ==========

function initSmoothScrolling() {
  const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();

      const targetId = link.getAttribute('href');
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        smoothScrollTo(targetElement);

        // Close mobile menu if open
        if (navMenu && navMenu.classList.contains('active')) {
          navMenu.classList.remove('active');
          mobileMenuToggle.classList.remove('active');
          mobileMenuToggle.setAttribute('aria-expanded', 'false');
        }
      }
    });
  });
}

// ========== INTERSECTION OBSERVER ==========

function initScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('fade-in-up');
        observer.unobserve(entry.target);
      }
    });
  }, observerOptions);

  // Observe movie cards
  const movieCards = document.querySelectorAll('.movie-card');
  movieCards.forEach(card => observer.observe(card));

  // Observe coming soon cards
  const comingCards = document.querySelectorAll('.coming-soon-card');
  comingCards.forEach(card => observer.observe(card));

  // Observe section headers
  const sectionHeaders = document.querySelectorAll('.section-header');
  sectionHeaders.forEach(header => observer.observe(header));
}

// ========== COMING SOON SCROLL ==========

function initComingSoonScroll() {
  const scrollContainer = document.querySelector('.coming-soon-scroll');
  if (!scrollContainer) return;

  let isScrolling = false;

  // Add mouse wheel horizontal scrolling
  scrollContainer.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
      e.preventDefault();
      scrollContainer.scrollLeft += e.deltaY;
    }
  });

  // Add touch scrolling for mobile
  let startX = 0;
  let scrollLeft = 0;

  scrollContainer.addEventListener('touchstart', (e) => {
    startX = e.touches[0].clientX;
    scrollLeft = scrollContainer.scrollLeft;
  });

  scrollContainer.addEventListener('touchmove', (e) => {
    if (!startX) return;

    const x = e.touches[0].clientX;
    const diff = startX - x;
    scrollContainer.scrollLeft = scrollLeft + diff;
  });

  scrollContainer.addEventListener('touchend', () => {
    startX = 0;
  });
}

// ========== NOTIFICATIONS ==========

function showNotification(message, type = 'info', duration = 3000) {
  // Remove existing notification
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create notification element
  const notification = document.createElement('div');
  notification.classList.add('notification', `notification-${type}`);
  notification.textContent = message;

  // Style the notification
  Object.assign(notification.style, {
    position: 'fixed',
    top: '2rem',
    right: '2rem',
    backgroundColor: 'var(--bg-tertiary)',
    color: 'var(--text-primary)',
    padding: '1rem 1.5rem',
    borderRadius: 'var(--radius-medium)',
    border: '1px solid var(--border)',
    boxShadow: 'var(--shadow-medium)',
    zIndex: '1000',
    transform: 'translateX(100%)',
    transition: 'transform 0.3s ease',
    maxWidth: '300px',
    wordWrap: 'break-word'
  });

  if (type === 'error') {
    notification.style.borderColor = 'var(--accent)';
  }

  document.body.appendChild(notification);

  // Animate in
  setTimeout(() => {
    notification.style.transform = 'translateX(0)';
  }, 10);

  // Animate out and remove
  setTimeout(() => {
    notification.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 300);
  }, duration);
}

// ========== PERFORMANCE OPTIMIZATIONS ==========

// Lazy load images
function initLazyLoading() {
  const images = document.querySelectorAll('img[src]');

  const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;

        // Add loading animation
        img.style.opacity = '0';
        img.style.transition = 'opacity 0.3s ease';

        img.addEventListener('load', () => {
          img.style.opacity = '1';
        });

        imageObserver.unobserve(img);
      }
    });
  });