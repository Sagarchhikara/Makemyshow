import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      const nowPlaying = await fetchMovies('movie/now_playing');
      setMovies(nowPlaying);
    };
    getMovies();
  }, []);

  return (
    <div className="movie-grid">
      {movies.map(movie => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  );
};

export default MovieGrid;
