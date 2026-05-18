import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">📊 Employee Analytics</Link>
      </div>
      {user && (
        <div className="navbar-links">
          <Link to="/" className={isActive('/') ? 'active' : ''}>Dashboard</Link>
          <Link to="/employees" className={isActive('/employees') ? 'active' : ''}>Employees</Link>
          <Link to="/add-employee" className={isActive('/add-employee') ? 'active' : ''}>Add Employee</Link>
          <Link to="/ai-recommendations" className={isActive('/ai-recommendations') ? 'active' : ''}>AI Insights</Link>
          <div className="navbar-user">
            <span>👤 {user.name}</span>
            <button onClick={handleLogout} className="btn-logout">Logout</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
