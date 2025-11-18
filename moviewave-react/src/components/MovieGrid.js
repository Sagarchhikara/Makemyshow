import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';

const MovieGrid = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    const getMovies = async () => {
      const nowPlaying = await fetchMovies('movie/now_playing');
      const prices = [250, 300, 350, 275, 325];
      const moviesWithPrice = nowPlaying.map((movie, index) => ({
        ...movie,
        ticketPrice: prices[index % prices.length], // Consistent price
      }));
      setMovies(moviesWithPrice);
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
