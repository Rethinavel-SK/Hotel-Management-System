import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { LogOut, User, ArrowLeft } from 'lucide-react';

const scrollToSection = (sectionId) => {
  const element = document.getElementById(sectionId);
  if (element) {
    element.scrollIntoView({ behavior: 'smooth' });
  }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';

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
          {isAuthPage ? (
            <button onClick={() => navigate('/')} className="back-btn">
              <ArrowLeft size={20} />
              <span>Back to Home</span>
            </button>
          ) : user ? (
            <>
              <Link to={getDashboardLink()} className="nav-link">Dashboard</Link>
              <div className="nav-user">
                <User size={20} />
                <span>{user.name}</span>
              </div>
              <button onClick={logout} className="logout-btn">
                <LogOut size={20} />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <button onClick={() => scrollToSection('hero')} className="nav-link">Home</button>
              <button onClick={() => scrollToSection('welcome')} className="nav-link">About</button>
              <button onClick={() => scrollToSection('room-types')} className="nav-link">Rooms</button>
              <button onClick={() => scrollToSection('available-rooms')} className="nav-link">Available</button>
              <button onClick={() => scrollToSection('floating-features')} className="nav-link">Services</button>
              <button onClick={() => scrollToSection('hotel-gallery')} className="nav-link">Gallery</button>
              <button onClick={() => scrollToSection('contact')} className="nav-link">Contact</button>
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