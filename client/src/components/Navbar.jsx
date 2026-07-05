import { NavLink, Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="navbar" role="navigation" aria-label="Main navigation">
      <div className="navbar-inner">
        <Link to="/" className="navbar-brand" aria-label="Mechanic Booking System home">
          <div className="navbar-logo" aria-hidden="true">🔧</div>
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
              📊 Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              aria-label="All bookings"
            >
              📋 All Bookings
            </NavLink>
          </li>
        </ul>

        <Link
          to="/bookings/new"
          className="navbar-cta"
          aria-label="Create new booking"
        >
          ＋ New Booking
        </Link>
      </div>
    </nav>
  );
}
