import React from 'react';
import MovieCard from './MovieCard';
import ComingSoonCard from './ComingSoonCard';

const Home = () => {
  const placeholderImage = 'data:image/gif;base64,R0lGODlhAQABAIAAAMLCwgAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==';

  // Dummy data for now
  const nowShowingMovies = [
    {
      title: 'F1: The Movie',
      genre: 'Action • 142m',
      rating: '8.5',
      poster: placeholderImage,
      ticketPrice: 250
    },
    {
      title: 'Saiyaara',
      genre: 'Romance • 121m',
      rating: '8.2',
      poster: placeholderImage,
      ticketPrice: 220
    },
    {
      title: 'War 2',
      genre: 'Thriller • 128m',
      rating: '7.8',
      poster: placeholderImage,
      ticketPrice: 300
    },
    {
      title: 'Mahavatar Narsimha',
      genre: 'Animation • 121m',
      rating: '8.0',
      poster: placeholderImage,
      ticketPrice: 200
    },
    {
        title: 'Coolie: The Powerhouse',
        genre: 'Romance • 128m',
        rating: '7.5',
        poster: placeholderImage,
        ticketPrice: 180
      },
      {
        title: 'Sarbala ji',
        genre: 'Comedy • 128m',
        rating: '7.2',
        poster: placeholderImage,
        ticketPrice: 150
      },
      {
        title: 'Weapons',
        genre: 'Horror • 128m',
        rating: '6.8',
        poster: placeholderImage,
        ticketPrice: 260
      },
      {
        title: 'Freakier Friday',
        genre: 'Comedy • 128m',
        rating: '7.9',
        poster: placeholderImage,
        ticketPrice: 190
      }
  ];

  const comingSoonMovies = [
    {
      title: 'Kalki 2898 AD',
      releaseDate: 'Coming Soon',
      poster: placeholderImage
    },
    {
      title: 'Deadpool & Wolverine',
      releaseDate: 'Coming Soon',
      poster: placeholderImage
    },
    {
      title: 'Alien: Romulus',
      releaseDate: 'Coming Soon',
      poster: placeholderImage
    },
    {
        title: 'Pushpa 2: The Rule',
        releaseDate: 'Coming Soon',
        poster: placeholderImage
    }
  ];

  return (
    <main>
    <section id="now" className="section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Now Showing</h2>
          <p className="section-subtitle">Latest blockbusters in theaters</p>
        </div>

        <div className="movie-grid">
          {nowShowingMovies.map(movie => (
            <MovieCard key={movie.title} movie={movie} />
          ))}
        </div>
      </div>
    </section>

    {/* COMING SOON */}
    <section id="coming" className="section section-alt">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">Coming Soon</h2>
          <p className="section-subtitle">Upcoming releases to watch out for</p>
        </div>

        <div className="coming-soon-scroll">
          {comingSoonMovies.map(movie => (
            <ComingSoonCard key={movie.title} movie={movie} />
          ))}
        </div>
      </div>
    </section>
  </main>
  );
};

export default Home;
