import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          MERN Auth
        </Link>
        
        <div className="nav-menu">
          {user ? (
            <div className="nav-user">
              <span className="nav-username">Welcome, {user.name}</span>
              <button onClick={handleLogout} className="nav-button logout">
                Logout
              </button>
            </div>
          ) : (
            <div className="nav-auth">
              <Link to="/login" className="nav-button">
                Login
              </Link>
              <Link to="/register" className="nav-button register">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
