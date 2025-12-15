import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut, User } from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  const getDashboardLink = () => {
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
        <Link to={getDashboardLink()} className="nav-logo">
          Hotel Management
        </Link>
        <div className="nav-menu">
          <div className="nav-user">
            <User size={20} />
            <span>{user.name} ({user.role})</span>
          </div>
          <button onClick={logout} className="logout-btn">
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;