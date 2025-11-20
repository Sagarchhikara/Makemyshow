import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../api/tmdb';
import MovieCard from './MovieCard';

const MovieGrid = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const nowPlaying = await fetchMovies('movie/now_playing');
        const prices = [250, 300, 350, 275, 325];
        const moviesWithPrice = nowPlaying.map((movie, index) => ({
          ...movie,
          ticketPrice: prices[index % prices.length], // Consistent price
        }));
        setMovies(moviesWithPrice);
      } finally {
        setLoading(false);
      }
    };
    getMovies();
  }, []);

  const filteredMovies = movies.filter(movie =>
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return <div className="movie-grid"><p>Loading...</p></div>;
  }

  return (
    <div className="movie-grid">
      {filteredMovies.length > 0 ? (
        filteredMovies.map(movie => (
          <MovieCard key={movie.id} movie={movie} />
        ))
      ) : (
        <p className="no-results">No movies found matching "{searchQuery}"</p>
      )}
    </div>
  );
};

export default MovieGrid;
