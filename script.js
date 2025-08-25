/* ========= HERO SLIDESHOW (auto + arrows + dots) ========= */
const slides = Array.from(document.querySelectorAll('.slide'));
const titleEl = document.getElementById('hero-title');
const tagEl = document.getElementById('hero-tag');
const dotsWrap = document.querySelector('.hero-dots');
let index = slides.findIndex(s => s.classList.contains('active'));
if(index < 0) index = 0;

/* build dots */
slides.forEach((s,i)=> {
  const btn = document.createElement('button');
  btn.addEventListener('click', ()=> goto(i));
  if(i===index) btn.classList.add('active');
  dotsWrap.appendChild(btn);
});

const left = document.querySelector('.hero-arrow.left');
const right = document.querySelector('.hero-arrow.right');
left?.addEventListener('click', ()=> goto(index-1));
right?.addEventListener('click', ()=> goto(index+1));

function goto(i){
  const next = (i + slides.length) % slides.length;
  slides.forEach((s,idx)=> s.classList.toggle('active', idx===next));
  Array.from(dotsWrap.children).forEach((d,idx)=> d.classList.toggle('active', idx===next));
  index = next;
  // update info from active slide dataset
  const active = slides[index];
  if(active){
    titleEl.textContent = active.dataset.title || '';
    tagEl.textContent = active.dataset.tag || '';
  }
}

/* autoplay */
let autoplay = setInterval(()=> goto(index+1), 4500);
/* pause on hover */
const heroSlideshow = document.querySelector('.hero-slideshow');
heroSlideshow?.addEventListener('mouseenter', ()=> clearInterval(autoplay));
heroSlideshow?.addEventListener('mouseleave', ()=> autoplay = setInterval(()=> goto(index+1), 4500));

/* set initial info */
goto(index);

/* ========= SCROLL REVEAL (IntersectionObserver) ========= */
const reveals = document.querySelectorAll('.reveal, .fade-up');
const io = new IntersectionObserver((entries)=>{
  entries.forEach(entry=>{
    if(entry.isIntersecting){
      entry.target.classList.add('show');
      io.unobserve(entry.target);
    }
  });
},{threshold:0.2});

reveals.forEach(el => io.observe(el));

/* ========= CARD TILT (subtle) ========= */
const cards = document.querySelectorAll('.movie-card');
cards.forEach(card=>{
  card.addEventListener('mousemove', (e)=>{
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    card.style.transform = `perspective(900px) rotateX(${ -y * 5 }deg) rotateY(${ x * 6 }deg) translateZ(6px)`;
  });
  card.addEventListener('mouseleave', ()=>{
    card.style.transform = '';
  });
});

<<<<<<< HEAD
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
  if (movieTitle) {
    window.location.href = `booking.html?movie=${encodeURIComponent(movieTitle)}`;
  }
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
=======
/* ========= accessibility: keyboard focus visual ========= */
document.querySelectorAll('.movie-card, .card, .btn').forEach(el=>{
  el.addEventListener('focus', ()=> el.classList.add('focus'));
  el.addEventListener('blur', ()=> el.classList.remove('focus'));
});
>>>>>>> parent of 96f1702 (Revamp UI and interactions for MovieWave site)
