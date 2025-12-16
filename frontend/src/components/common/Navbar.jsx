import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  const getDashboardLink = () => {
    if (!user) return '/';
    switch (user.role) {
      case 'admin': return '/admin';
      case 'manager': return '/manager';
      case 'user': return '/user';
      default: return '/';
    }
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo">
          Grand Hotel
        </Link>
        <div className="nav-menu">
          {user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <div className="nav-user">
                <User size={20} />
                <span>{user.name}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <LogOut size={20} />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/" className="nav-link">Home</Link>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/register" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;