import React from 'react';
import MovieGrid from './MovieGrid';
import ComingSoonGrid from './ComingSoonGrid';
import Slideshow from './Slideshow';

const Home = () => {
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
            <MovieGrid />
          </div>
        </section>

        <section id="coming" className="section section-alt">
          <div className="container">
            <div className="section-header">
              <h2 className="section-title">Coming Soon</h2>
              <p className="section-subtitle">Upcoming releases to watch out for</p>
            </div>
            <ComingSoonGrid />
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;
