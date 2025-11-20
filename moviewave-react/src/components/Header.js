import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

const Header = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');

  useEffect(() => {
    setSearchTerm(searchParams.get('search') || '');
  }, [searchParams]);

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    if (value) {
      navigate(`/?search=${encodeURIComponent(value)}`, { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  return (
    <header className="nav" role="banner">
      <div className="container">
        <div className="nav-inner">
          <Link className="brand" to="/">
            🎬 <span>MakeMyShow</span>
          </Link>

          <nav className="nav-menu" role="navigation" aria-label="Main">
            <ul className="nav-links">
              <li><Link to="/">Home</Link></li>
              <li><a href="#now">Now Showing</a></li>
              <li><a href="#coming">Coming Soon</a></li>
              <li><a href="#contact">Contact</a></li>
            </ul>
          </nav>

          <div className="nav-actions">
            <div className="search-container">
              <input
                className="search"
                placeholder="Search movies..."
                aria-label="Search movies"
                value={searchTerm}
                onChange={handleSearch}
              />
              <svg className="search-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                strokeWidth="2">
                <circle cx="11" cy="11" r="8"></circle>
                <path d="m21 21-4.35-4.35"></path>
              </svg>
            </div>
            <Link to="/signin" className="btn btn-ghost">Sign In</Link>
            <button className="mobile-menu-toggle" aria-label="Toggle menu">
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
