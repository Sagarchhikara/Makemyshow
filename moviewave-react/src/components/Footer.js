import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer id="contact" className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-brand">
            <div className="brand">🎬 <span>MakeMyShow</span></div>
            <p>Your ultimate destination for movie tickets and entertainment.</p>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4>Movies</h4>
              <Link to="/#now">Now Showing</Link>
              <Link to="/#coming">Coming Soon</Link>
              <Link to="#">Top Rated</Link>
            </div>

            <div className="footer-column">
              <h4>Support</h4>
              <Link to="#">Help Center</Link>
              <Link to="#">Contact Us</Link>
              <Link to="#">FAQs</Link>
            </div>

            <div className="footer-column">
              <h4>Legal</h4>
              <Link to="#">Privacy Policy</Link>
              <Link to="#">Terms of Service</Link>
              <Link to="#">Cookie Policy</Link>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p>&copy; 2025 MakeMyShow. All rights reserved.</p>
          <p>Made with ❤️ for movie lovers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
