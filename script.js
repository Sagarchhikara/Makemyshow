// ========== CONFIGURATION ==========
const API_KEY = '48e8311bc75552ff9f831b9c52e76a2d'; // TMDB API key
const API_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';
const USE_API = true; // Switch to false to use local data (changed to false for testing)

// ========== LOCAL DATA (for testing if USE_API is false) ==========
const localMovies = [
    { id: 967847, title: 'F1: The Movie', poster_path: 'f1-movie.png', vote_average: 8.5, original_language: 'en' },
    { id: 967848, title: 'Saiyaara', poster_path: 'saiyaara.avif', vote_average: 8.2, original_language: 'hi' },
    { id: 967849, title: 'War 2', poster_path: 'war-2.jpg', vote_average: 7.8, original_language: 'hi' },
    { id: 967850, title: 'Mahavatar Narsimha', poster_path: 'narsimha.jpeg', vote_average: 8.0, original_language: 'hi' },
    { id: 967851, title: 'Coolie: The Powerhouse', poster_path: 'coolie.jpg', vote_average: 7.5, original_language: 'hi' },
    { id: 967852, title: 'Sarbala ji', poster_path: 'sarbala-ji.jpg', vote_average: 7.2, original_language: 'hi' },
    { id: 967853, title: 'Weapons', poster_path: 'weapons.webp', vote_average: 6.8, original_language: 'en' },
    { id: 967854, title: 'Freakier Friday', poster_path: 'freaky-friday.jpeg', vote_average: 7.9, original_language: 'en' },
];

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
const movieGrid = document.querySelector('.movie-grid');

// ========== API & DATA HANDLING ==========

/**
 * Fetches data from the TMDB API or returns cached data.
 * @param {string} endpoint - The API endpoint to fetch from.
 * @param {boolean} forceRefresh - Whether to force a refresh from the API.
 * @returns {Promise<Object>} - The fetched data.
 */
async function fetchMovieData(endpoint, params = {}, forceRefresh = false) {
    const paramString = new URLSearchParams(params).toString();
    const cacheKey = `tmdb_${endpoint}_${paramString}`;

    // Note: localStorage is not available in artifacts, using fallback
    // const cachedData = localStorage.getItem(cacheKey);
    const now = new Date().getTime();

    console.log(`Fetching from API: ${endpoint}`);
    try {
        if (API_KEY === 'YOUR_TMDB_API_KEY') {
            showNotification(
                'Please add your TMDB API key to script.js',
                'error'
            );
            return null;
        }

        const allParams = {
            api_key: API_KEY,
            language: 'en-US',
            page: 1,
            ...params,
        };

        const queryString = new URLSearchParams(allParams).toString();
        const response = await fetch(`${API_URL}/${endpoint}?${queryString}`);

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }
        const data = await response.json();

        return data;
    } catch (error) {
        console.error('Error fetching movie data:', error);
        showNotification(`Error fetching data: ${error.message}`, 'error');
        return null;
    }
}

// ========== UI RENDERING ==========

/**
 * Renders movie cards in the grid.
 * @param {Array<Object>} movies - An array of movie objects.
 */
function renderMovieCards(movies) {
    console.log('Rendering movie cards:', movies);
    if (!movieGrid) {
        console.error('Movie grid container not found');
        return;
    }

    movieGrid.innerHTML = '';

    if (!movies || movies.length === 0) {
        movieGrid.innerHTML = '<p class="no-movies-message">No movies found. Try a different search.</p>';
        return;
    }

    movies.forEach(movie => {
        const {
            id,
            title,
            poster_path,
            vote_average,
            original_language
        } = movie;

        const posterUrl = movie.poster_path
            ? (USE_API ? `${IMAGE_BASE_URL}${movie.poster_path}` : movie.poster_path)
            : 'https://via.placeholder.com/500x750?text=No+Image';

        const card = document.createElement('article');
        card.classList.add('movie-card');
        card.tabIndex = 0;
        card.dataset.movieId = id; // Store movie ID for later use

        card.innerHTML = `
            <div class="movie-poster">
              <img src="${posterUrl}" alt="Poster for ${title}" loading="lazy">
              <div class="movie-overlay">
                <button class="play-btn" aria-label="Play trailer for ${title}">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <polygon points="5,3 19,12 5,21"></polygon>
                  </svg>
                </button>
              </div>
              <div class="movie-rating">★ ${vote_average.toFixed(1)}</div>
            </div>
            <div class="movie-info">
              <h3>${title}</h3>
              <p class="movie-genre">Lang: ${original_language.toUpperCase()}</p>
              <button class="btn btn-primary btn-small">Book Now</button>
            </div>
        `;
        movieGrid.appendChild(card);
    });

    console.log('Movie cards rendered successfully');

    // Re-initialize interactions for the new cards
    initMovieCards();
    // Re-initialize scroll animations for new cards
    initScrollAnimations();
}

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

    // Show a simple alert for booking
    alert(`You are booking a ticket for "${movieTitle}".`);

    // Add visual feedback on the button
    const button = card.querySelector('.btn-primary');
    if (button) {
        const originalText = button.textContent;
        if (button.disabled) return; // Prevent multiple clicks

        button.textContent = 'Processing...';
        button.disabled = true;

        setTimeout(() => {
            button.textContent = 'Booked!';
            setTimeout(() => {
                button.textContent = originalText;
                button.disabled = false;
            }, 1500);
        }, 500);
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

    const debouncedSearch = debounce(() => handleSearch(false), 500);

    searchInput.addEventListener('input', debouncedSearch);
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch(true); // Force immediate search on Enter
        }
    });
}

async function handleSearch(forceImmediate = false) {
    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
        // If search is cleared, show the default list
        if (USE_API) {
            const data = await fetchMovieData('movie/now_playing');
            if (data && data.results) {
                renderMovieCards(data.results);
            }
        } else {
            renderMovieCards(localMovies);
        }
        return;
    }

    if (USE_API) {
        const data = await fetchMovieData('search/movie', { query: query }, forceImmediate);
        if (data) {
            renderMovieCards(data.results);
        }
    } else {
        const filteredMovies = localMovies.filter(movie =>
            movie.title.toLowerCase().includes(query)
        );
        renderMovieCards(filteredMovies);
    }
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
        backgroundColor: '#1f2937',
        color: '#f9fafb',
        padding: '1rem 1.5rem',
        borderRadius: '8px',
        border: '1px solid #374151',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        zIndex: '1000',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease',
        maxWidth: '300px',
        wordWrap: 'break-word'
    });

    if (type === 'error') {
        notification.style.borderColor = '#ef4444';
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

    images.forEach(img => imageObserver.observe(img));
}

// ========== INITIALIZATION ==========

/**
 * Main initialization function.
 */
async function init() {
    console.log('Initializing MovieWave application...');

    // Initialize core functionalities
    initSlideshow();
    initMobileMenu();
    initSearch();
    initSmoothScrolling();
    initComingSoonScroll();
    initLazyLoading();

    // Load initial movie data
    if (USE_API) {
        console.log('Loading movies from API...');
        const data = await fetchMovieData('movie/now_playing');
        if (data && data.results) {
            renderMovieCards(data.results);
        }
    } else {
        console.log('Using local data source.');
        renderMovieCards(localMovies);
    }
}

// Run initialization on page load
document.addEventListener('DOMContentLoaded', init);