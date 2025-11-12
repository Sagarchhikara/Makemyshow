import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
  return (
    <article className="movie-card" tabIndex="0">
      <div className="movie-poster">
        <img src={movie.poster} alt={movie.title} />
        <div className="movie-overlay">
          <button className="play-btn">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="5,3 19,12 5,21"></polygon>
            </svg>
          </button>
        </div>
        <div className="movie-rating">★ {movie.rating}</div>
      </div>
      <div className="movie-info">
        <h3>{movie.title}</h3>
        <p className="movie-genre">{movie.genre}</p>
        <Link to="/booking" state={{ movie }} className="btn btn-primary btn-small">Book Now</Link>
      </div>
    </article>
  );
};

export default MovieCard;
