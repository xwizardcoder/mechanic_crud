import { NavLink, Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './Sidebar.css'; // We'll create this next

export default function Sidebar() {
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <aside className="sidebar" role="navigation" aria-label="Main navigation">
      <div className="sidebar-header">
        <Link to="/" className="sidebar-brand" aria-label="Mechanic Booking System home">
          <div className="sidebar-logo" aria-hidden="true">M</div>
          <div className="sidebar-title">MechPro</div>
        </Link>
      </div>

      <div className="sidebar-content">
        <ul className="sidebar-nav" role="list">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              aria-label="Dashboard"
            >
              Dashboard
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/bookings"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              aria-label="All bookings"
            >
              Bookings
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/payslip"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              aria-label="Payslip"
            >
              Payslip
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/time-tools"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              aria-label="Time tools"
            >
              Time tools
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/performance"
              className={({ isActive }) => `sidebar-link${isActive ? ' active' : ''}`}
              aria-label="Performance"
            >
              Performance
            </NavLink>
          </li>
        </ul>
      </div>

      <div className="sidebar-footer">
        <ul className="sidebar-nav" role="list" style={{ marginBottom: 24 }}>
          <li>
            <a href="#settings" className="sidebar-link">Setting</a>
          </li>
          <li>
            <a href="#support" className="sidebar-link">Support</a>
          </li>
          <li>
            <button onClick={toggleTheme} className="sidebar-link w-full text-left">
              Theme: {theme === 'dark' ? 'Dark' : 'Light'}
            </button>
          </li>
        </ul>

        <div className="user-profile">
          <div className="user-avatar">AD</div>
          <div className="user-info">
            <div className="user-name">Admin User</div>
            <div className="user-email">admin@mechpro.local</div>
          </div>
        </div>
      </div>
    </aside>
  );
}
