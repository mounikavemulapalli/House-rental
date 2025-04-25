import { Link } from 'react-router-dom';
import { useState } from 'react'; // Import useState to manage menu toggle

import './Navbar.css';

const Navbar = props => {
  const [menuOpen, setMenuOpen] = useState(false); // State to manage the menu toggle

  const toggleMenu = () => {
    setMenuOpen(!menuOpen); // Toggle the menu state
  };

  return (
    <nav className="nav-header">
      <div className="nav-content">
        <div className="nav-bar-large-container">
          <Link to="/" className="shopper-logo-name">
            <span>Sample App</span>
          </Link>

          <ul className="nav-menu">
            <li className="nav-menu-item">
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
          </ul>
        </div>

        {/* Mobile Menu */}
        <div className="nav-bar-mobile-logo-container">
          <Link to="/" className="shopper-logo-name">
            <span>Sample App</span>
          </Link>

          {/* Hamburger Menu */}
          <button
            className="menu-toggle-btn"
            onClick={toggleMenu} // Handle the toggle on button click
          >
            &#9776;
          </button>
        </div>

        {/* Mobile Navigation Menu */}
        <div className={`nav-menu-mobile ${menuOpen ? 'show' : ''}`}>
          <ul className="nav-menu-list-mobile">
            <li className="nav-menu-item">
              <Link to="/register" className="nav-link">
                Register
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/login" className="nav-link">
                Login
              </Link>
            </li>
            <li className="nav-menu-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>

          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
