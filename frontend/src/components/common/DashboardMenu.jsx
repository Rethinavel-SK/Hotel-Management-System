import React, { useState } from 'react';
import { useAuth } from './AuthContext';

const DashboardMenu = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();

  const getMenuItems = () => {
    const commonItems = [
      { id: 'dashboard-header', label: 'Overview' },
      { id: 'stats-section', label: 'Statistics' }
    ];

    if (user?.role === 'admin') {
      return [
        ...commonItems,
        { id: 'create-manager', label: 'Create Manager' },
        { id: 'recent-bookings', label: 'Recent Bookings' }
      ];
    } else if (user?.role === 'manager') {
      return [
        ...commonItems,
        { id: 'add-room', label: 'Add Room' },
        { id: 'my-rooms', label: 'My Rooms' },
        { id: 'bookings-section', label: 'Bookings' }
      ];
    } else {
      return [
        ...commonItems,
        { id: 'available-rooms', label: 'Available Rooms' },
        { id: 'my-bookings', label: 'My Bookings' }
      ];
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(`[data-section="${sectionId}"]`) || 
                   document.getElementById(sectionId) ||
                   document.querySelector(`.${sectionId}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMenuOpen(false);
  };

  return (
    <>
      <div className="dashboard-menu-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={`hamburger ${menuOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>

      <div className={`dashboard-side-menu ${menuOpen ? 'open' : ''}`}>
        {getMenuItems().map((item) => (
          <div 
            key={item.id}
            className="dashboard-menu-item" 
            onClick={() => scrollToSection(item.id)}
          >
            <span>{item.label}</span>
          </div>
        ))}
      </div>
    </>
  );
};

export default DashboardMenu;