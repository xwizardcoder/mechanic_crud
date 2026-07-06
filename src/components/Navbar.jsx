import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'dark');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="Mechanic Booking System home">
          <div className="navbar-logo" aria-hidden="true">M</div>
          <div>
            <div className="navbar-title">MechPro</div>
            <div className="navbar-subtitle">Booking System</div>
          </div>
        </Link>

        <ul className="navbar-nav" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              aria-label="Dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              aria-label="All bookings"
            >
              All Bookings
            </NavLink>
          </li>
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <button
            onClick={toggleTheme}
            className="btn btn-ghost"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            style={{ fontSize: 14 }}
          >
            {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
          <Link
            to="/bookings/new"
            className="navbar-cta"
            aria-label="Create new booking"
          >
            + New Booking
          </Link>
        </div>
      </div>
    </nav>
  );
}
