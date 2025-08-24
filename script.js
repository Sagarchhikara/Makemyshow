// ========== GLOBAL VARIABLES ==========
let currentSlide = 0;
let slideInterval;
let isPlaying = true;

// ========== BOOKING VARIABLES ==========
let bookingState = {
  movieTitle: '',
  time: '',
  ticketQuantity: 1,
  selectedSeats: [],
  totalPrice: 0,
};

const TICKET_PRICE = 150; // Price per ticket

// ========== DOM ELEMENTS ==========
const mainContent = document.querySelector('main');
const heroSection = document.getElementById('home');
const bookingSection = document.getElementById('booking');
const backToMoviesBtn = document.getElementById('back-to-movies');
const bookingMovieTitle = document.getElementById('booking-movie-title');
const bookingSteps = document.querySelectorAll('.booking-step');
const timeStep = document.getElementById('step-1-time');
const ticketsStep = document.getElementById('step-2-tickets');
const seatsStep = document.getElementById('step-3-seats');
const timeSlots = document.querySelectorAll('.time-slot');
const quantityMinusBtn = document.getElementById('quantity-minus');
const quantityPlusBtn = document.getElementById('quantity-plus');
const quantityDisplay = document.getElementById('quantity-display');
const confirmQuantityBtn = document.getElementById('confirm-quantity-btn');
const seatMap = document.getElementById('seat-map');
const summaryMovieTitle = document.getElementById('summary-movie-title');
const summaryTime = document.getElementById('summary-time');
const summarySeats = document.getElementById('summary-seats');
const summaryTotal = document.getElementById('summary-total');
const confirmBookingBtn = document.getElementById('confirm-booking-btn');
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

document.addEventListener('DOMContentLoaded', () => {
  initSlideshow();
  initMobileMenu();
  initMovieCards();
  initSearch();
  initSmoothScrolling();
  initScrollAnimations();
  initComingSoonScroll();
  initLazyLoading();
  initBooking();
});

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
  bookingState.movieTitle = movieTitle;

  if(bookingMovieTitle) bookingMovieTitle.textContent = `Book Tickets for ${movieTitle}`;
  if(summaryMovieTitle) summaryMovieTitle.textContent = movieTitle;

  if(mainContent) mainContent.style.display = 'none';
  if(heroSection) heroSection.style.display = 'none';
  if(bookingSection) bookingSection.style.display = 'block';

  resetBookingFlow();
  if(bookingSection) smoothScrollTo(bookingSection);
}

// Handle trailer play
function handlePlayTrailer(card) {
  const movieTitle = card.querySelector('h3')?.textContent;
  console.log(`Playing trailer for: ${movieTitle}`);
  showNotification(`Playing trailer for "${movieTitle}"`);
}

// ========== BOOKING FLOW ==========

function initBooking() {
  if(backToMoviesBtn) backToMoviesBtn.addEventListener('click', handleBackToMovies);
  timeSlots.forEach(slot => slot.addEventListener('click', handleTimeSelection));
  if(quantityMinusBtn) quantityMinusBtn.addEventListener('click', () => handleQuantityChange(-1));
  if(quantityPlusBtn) quantityPlusBtn.addEventListener('click', () => handleQuantityChange(1));
  if(confirmQuantityBtn) confirmQuantityBtn.addEventListener('click', handleConfirmQuantity);
  if(confirmBookingBtn) confirmBookingBtn.addEventListener('click', handleConfirmBooking);
}

function goToStep(stepNumber) {
  bookingSteps.forEach((step, index) => {
    step.classList.toggle('active', index + 1 === stepNumber);
  });
}

function handleBackToMovies() {
  if(mainContent) mainContent.style.display = 'block';
  if(heroSection) heroSection.style.display = 'block';
  if(bookingSection) bookingSection.style.display = 'none';
}

function resetBookingFlow() {
    goToStep(1);
    bookingState.time = '';
    bookingState.ticketQuantity = 1;
    bookingState.selectedSeats = [];
    updateQuantityDisplay();
    updateBookingSummary();
    timeSlots.forEach(slot => slot.classList.remove('selected'));
    if(confirmBookingBtn) confirmBookingBtn.disabled = true;
    if (seatMap) {
      seatMap.innerHTML = '';
    }
}

function handleTimeSelection(e) {
  const selectedTime = e.target.dataset.time;
  bookingState.time = selectedTime;

  timeSlots.forEach(slot => slot.classList.remove('selected'));
  e.target.classList.add('selected');

  updateBookingSummary();
  goToStep(2);
}

function handleQuantityChange(change) {
  const newQuantity = bookingState.ticketQuantity + change;
  if (newQuantity >= 1 && newQuantity <= 10) {
    bookingState.ticketQuantity = newQuantity;
    updateQuantityDisplay();
  }
}

function updateQuantityDisplay() {
  if(quantityDisplay) quantityDisplay.textContent = bookingState.ticketQuantity;
  if(quantityMinusBtn) quantityMinusBtn.disabled = bookingState.ticketQuantity === 1;
  if(quantityPlusBtn) quantityPlusBtn.disabled = bookingState.ticketQuantity === 10;
}

function handleConfirmQuantity() {
  generateSeatMap();
  updateBookingSummary();
  goToStep(3);
}

function generateSeatMap() {
    if (!seatMap) return;
    seatMap.innerHTML = '';
    const bookedSeats = ['A5', 'B6', 'C7', 'H2', 'F10'];

    for (let i = 0; i < 10; i++) {
        const rowChar = String.fromCharCode(65 + i);
        const rowLabel = document.createElement('div');
        rowLabel.classList.add('row-label');
        rowLabel.textContent = rowChar;
        seatMap.appendChild(rowLabel);

        for (let j = 1; j <= 12; j++) {
            const seat = document.createElement('div');
            const seatId = `${rowChar}${j}`;
            seat.classList.add('seat');
            seat.dataset.seatId = seatId;

            if (bookedSeats.includes(seatId)) {
                seat.classList.add('booked');
            } else {
                seat.addEventListener('click', handleSeatSelection);
            }
            seatMap.appendChild(seat);
        }
    }
}

function handleSeatSelection(e) {
    const seat = e.target;
    if (!seat.classList.contains('seat') || seat.classList.contains('booked')) return;

    const seatId = seat.dataset.seatId;
    const isSelected = seat.classList.contains('selected');

    if (isSelected) {
        bookingState.selectedSeats = bookingState.selectedSeats.filter(s => s !== seatId);
        seat.classList.remove('selected');
    } else {
        if (bookingState.selectedSeats.length < bookingState.ticketQuantity) {
            bookingState.selectedSeats.push(seatId);
            seat.classList.add('selected');
        } else {
            showNotification(`You can only select ${bookingState.ticketQuantity} seats.`, 'error');
        }
    }
    updateBookingSummary();
}

function updateBookingSummary() {
    if(summaryMovieTitle) summaryMovieTitle.textContent = bookingState.movieTitle || 'N/A';
    if(summaryTime) summaryTime.textContent = bookingState.time || 'N/A';

    const seatsText = bookingState.selectedSeats.sort().join(', ') || 'N/A';
    if(summarySeats) summarySeats.textContent = seatsText;

    bookingState.totalPrice = bookingState.selectedSeats.length * TICKET_PRICE;
    if(summaryTotal) summaryTotal.textContent = `₹${bookingState.totalPrice}`;

    if(confirmBookingBtn) confirmBookingBtn.disabled = bookingState.selectedSeats.length !== bookingState.ticketQuantity || bookingState.ticketQuantity === 0;
}

function handleConfirmBooking() {
    showNotification(`Booking confirmed for ${bookingState.movieTitle}! Seats: ${bookingState.selectedSeats.join(', ')}`, 'success');

    bookingState.selectedSeats.forEach(seatId => {
        const seatElement = document.querySelector(`[data-seat-id="${seatId}"]`);
        if(seatElement) {
            seatElement.classList.remove('selected');
            seatElement.classList.add('booked');
            seatElement.removeEventListener('click', handleSeatSelection);
        }
    });

    setTimeout(() => {
        handleBackToMovies();
        resetBookingFlow();
    }, 3000);
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