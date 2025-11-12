import React from 'react';
import { IMAGE_BASE_URL } from '../api/tmdb';

const ComingSoonCard = ({ movie }) => {
  return (
    <div className="coming-soon-card">
      <div className="coming-soon-poster">
        <img src={`${IMAGE_BASE_URL}${movie.poster_path}`} alt={movie.title} />
      </div>
      <div className="coming-soon-info">
        <h3>{movie.title}</h3>
        <p>{movie.release_date}</p>
      </div>
    </div>
  );
};

export default ComingSoonCard;
