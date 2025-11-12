import React, { useState, useEffect } from 'react';
import { fetchMovies, IMAGE_BASE_URL_ORIGINAL } from '../api/tmdb';
import { Link } from 'react-router-dom';

const Slideshow = () => {
  const [movies, setMovies] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const getMovies = async () => {
      const nowPlaying = await fetchMovies('movie/now_playing');
      setMovies(nowPlaying.slice(0, 5)); // Get top 5 movies for the slideshow
    };
    getMovies();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      nextSlide();
    }, 5000); // Change slide every 5 seconds
    return () => clearTimeout(timer);
  }, [currentSlide]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev === movies.length - 1 ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev === 0 ? movies.length - 1 : prev - 1));
  };

  if (movies.length === 0) {
    return <div>Loading...</div>;
  }

  const activeMovie = movies[currentSlide];

  return (
    <section id="home" className="slideshow-container">
       <div className="slideshow">
        <div className="slides-container">
          {movies.map((movie, index) => (
            <div
              key={movie.id}
              className={`slide ${index === currentSlide ? 'active' : ''}`}
              style={{ backgroundImage: `url(${IMAGE_BASE_URL_ORIGINAL}${movie.backdrop_path})` }}
            >
                <div className="slide-overlay"></div>
            </div>
          ))}
        </div>

        <button className="slideshow-arrow left" aria-label="Previous slide" onClick={prevSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="15,18 9,12 15,6"></polyline>
          </svg>
        </button>

        <button className="slideshow-arrow right" aria-label="Next slide" onClick={nextSlide}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <polyline points="9,6 15,12 9,18"></polyline>
          </svg>
        </button>

        <div className="slideshow-content">
            <h1 id="slideshow-title">{activeMovie.title}</h1>
            <p id="slideshow-tag">{activeMovie.overview}</p>
            <div className="slideshow-actions">
              <Link to={`/booking`} state={{ movie: activeMovie }} className="btn btn-primary">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <polygon points="5,3 19,12 5,21"></polygon>
                  </svg>
                  Book Tickets
              </Link>
            </div>
        </div>
      </div>
    </section>
  );
};

export default Slideshow;
