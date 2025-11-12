import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../api/tmdb';
import ComingSoonCard from './ComingSoonCard';

const ComingSoonGrid = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      const upcoming = await fetchMovies('movie/upcoming');
      setMovies(upcoming);
    };
    getMovies();
  }, []);

  return (
    <div className="coming-soon-scroll">
      {movies.map(movie => (
        <ComingSoonCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default ComingSoonGrid;
