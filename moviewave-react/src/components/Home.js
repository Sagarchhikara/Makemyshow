import React from 'react';
import { useSearchParams } from 'react-router-dom';
import MovieGrid from './MovieGrid';
import ComingSoonGrid from './ComingSoonGrid';
import Slideshow from './Slideshow';

const Home = () => {
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';

  return (
    <>
      <Slideshow />
      <main>
        <section id="now" className="section">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Now Showing</h2>
              <p className="section-subtitle">Latest blockbusters in theaters</p>
            </div>
            <MovieGrid searchQuery={searchQuery} />
          </div>
        </section>

        <section id="coming" className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Coming Soon</h2>
              <p className="section-subtitle">Upcoming releases to watch out for</p>
            </div>
            <ComingSoonGrid searchQuery={searchQuery} />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
