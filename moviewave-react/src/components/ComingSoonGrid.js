import React, { useState, useEffect } from 'react';
import { fetchMovies } from '../api/tmdb';
import ComingSoonCard from './ComingSoonCard';

const ComingSoonGrid = ({ searchQuery }) => {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getMovies = async () => {
      try {
        const upcoming = await fetchMovies('movie/upcoming');
        setMovies(upcoming);
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
    return <div className="coming-soon-scroll"><p>Loading...</p></div>;
  }

  return (
    <div className="coming-soon-scroll">
      {filteredMovies.length > 0 ? (
        filteredMovies.map(movie => (
          <ComingSoonCard key={movie.id} movie={movie} />
        ))
      ) : (
        <p className="no-results">No upcoming movies found matching "{searchQuery}"</p>
      )}
    </div>
  );
};

export default ComingSoonGrid;
