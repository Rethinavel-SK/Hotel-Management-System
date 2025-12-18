import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Users, Building, Calendar, DollarSign, Shield, TrendingUp, UserPlus, Eye, BarChart3, Crown } from 'lucide-react';
import { useAuth } from '../components/common/AuthContext';
import backgroundImage from '../assets/bk.jpg';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState({
    users: [],
    managers: [],
    rooms: [],
    bookings: [],
    revenue: { totalRevenue: 0, totalBookings: 0 }
  });
  const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeTab, setActiveTab] = useState('overview');
  const [showManagerForm, setShowManagerForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [users, managers, rooms, bookings, revenue] = await Promise.all([
        adminAPI.getAllUsers(),
        adminAPI.getAllManagers(),
        adminAPI.getAllRooms(),
        adminAPI.getAllBookings(),
        adminAPI.getRevenue()
      ]);
      
      setData({
        users: users.data,
        managers: managers.data,
        rooms: rooms.data,
        bookings: bookings.data,
        revenue: revenue.data
      });
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateManager = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createManager(newManager);
      toast.success('Manager created successfully');
      setNewManager({ name: '', email: '', password: '' });
      setShowManagerForm(false);
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create manager');
    }
  };

  const totalRevenue = data.revenue.totalRevenue || 0;
  const occupancyRate = data.rooms.length > 0 ? ((data.rooms.length - data.rooms.filter(r => r.availability).length) / data.rooms.length * 100).toFixed(1) : 0;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="admin-dashboard" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${backgroundImage})`}}>
      {/* Admin Header */}
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-welcome">
              <div className="admin-crown">
                <Crown size={32} />
              </div>
              <div>
                <h1>System Administrator</h1>
                <p>Welcome back, {user?.name} • {currentTime.toLocaleString()}</p>
                <div className="admin-badge">
                  <Shield size={16} />
                  <span>Full System Access</span>
                </div>
              </div>
            </div>
            <div className="admin-quick-stats">
              <div className="admin-stat">
                <TrendingUp size={24} />
                <div>
                  <span className="admin-stat-number">₹{totalRevenue}</span>
                  <span className="admin-stat-label">Total Revenue</span>
                </div>
              </div>
              <div className="admin-stat">
                <BarChart3 size={24} />
                <div>
                  <span className="admin-stat-number">{occupancyRate}%</span>
                  <span className="admin-stat-label">Occupancy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admin Navigation */}
      <div className="admin-nav">
        <div className="container">
          <div className="admin-nav-tabs">
            <button 
              className={`admin-tab ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              <BarChart3 size={18} />
              Overview
            </button>
            <button 
              className={`admin-tab ${activeTab === 'users' ? 'active' : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <Users size={18} />
              Users & Managers
            </button>
            <button 
              className={`admin-tab ${activeTab === 'bookings' ? 'active' : ''}`}
              onClick={() => setActiveTab('bookings')}
            >
              <Calendar size={18} />
              All Bookings
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-main">
        <div className="container">
          {activeTab === 'overview' && (
            <div className="admin-overview">
              <div className="admin-stats-grid">
                <div className="admin-stat-card users">
                  <div className="admin-stat-icon">
                    <Users size={28} />
                  </div>
                  <div className="admin-stat-content">
                    <h3>{data.users.length}</h3>
                    <p>Total Users</p>
                    <span className="admin-stat-trend">+{data.users.filter(u => new Date(u.createdAt) > new Date(Date.now() - 7*24*60*60*1000)).length} this week</span>
                  </div>
                </div>
                <div className="admin-stat-card managers">
                  <div className="admin-stat-icon">
                    <Shield size={28} />
                  </div>
                  <div className="admin-stat-content">
                    <h3>{data.managers.length}</h3>
                    <p>Active Managers</p>
                    <span className="admin-stat-trend">Managing {data.rooms.length} rooms</span>
                  </div>
                </div>
                <div className="admin-stat-card rooms">
                  <div className="admin-stat-icon">
                    <Building size={28} />
                  </div>
                  <div className="admin-stat-content">
                    <h3>{data.rooms.length}</h3>
                    <p>Total Rooms</p>
                    <span className="admin-stat-trend">{data.rooms.filter(r => r.availability).length} available</span>
                  </div>
                </div>
                <div className="admin-stat-card revenue">
                  <div className="admin-stat-icon">
                    <TrendingUp size={28} />
                  </div>
                  <div className="admin-stat-content">
                    <h3>₹{totalRevenue}</h3>
                    <p>Total Revenue</p>
                    <span className="admin-stat-trend">{data.bookings.length} bookings</span>
                  </div>
                </div>
              </div>

              <div className="admin-recent-activity">
                <h2>Recent System Activity</h2>
                <div className="admin-activity-list">
                  {data.bookings.slice(0, 5).map(booking => (
                    <div key={booking._id} className="admin-activity-item">
                      <div className="activity-icon">
                        <Calendar size={20} />
                      </div>
                      <div className="activity-content">
                        <p><strong>{booking.userId?.name}</strong> booked Room {booking.roomId?.roomNumber}</p>
                        <span>{new Date(booking.createdAt || booking.checkInDate).toLocaleDateString()}</span>
                      </div>
                      <div className="activity-amount">₹{booking.totalAmount}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div className="admin-users">
              <div className="admin-section-header">
                <h2>User & Manager Management</h2>
                <button 
                  onClick={() => setShowManagerForm(!showManagerForm)}
                  className="admin-primary-btn"
                >
                  <UserPlus size={18} />
                  Add Manager
                </button>
              </div>

              {showManagerForm && (
                <div className="admin-form-card">
                  <h3>Create New Manager</h3>
                  <form onSubmit={handleCreateManager} className="admin-form">
                    <input
                      type="text"
                      placeholder="Full Name"
                      value={newManager.name}
                      onChange={(e) => setNewManager({...newManager, name: e.target.value})}
                      required
                    />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={newManager.email}
                      onChange={(e) => setNewManager({...newManager, email: e.target.value})}
                      required
                    />
                    <input
                      type="password"
                      placeholder="Password"
                      value={newManager.password}
                      onChange={(e) => setNewManager({...newManager, password: e.target.value})}
                      required
                    />
                    <button type="submit" className="admin-submit-btn">Create Manager</button>
                  </form>
                </div>
              )}

              <div className="admin-tables-grid">
                <div className="admin-table-card">
                  <h3>Managers ({data.managers.length})</h3>
                  <div className="admin-table-scroll">
                    {data.managers.map(manager => (
                      <div key={manager._id} className="admin-user-row">
                        <div className="user-avatar">
                          <Shield size={20} />
                        </div>
                        <div className="user-info">
                          <h4>{manager.name}</h4>
                          <p>{manager.email}</p>
                        </div>
                        <div className="user-role">Manager</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="admin-table-card">
                  <h3>Users ({data.users.length})</h3>
                  <div className="admin-table-scroll">
                    {data.users.slice(0, 10).map(user => (
                      <div key={user._id} className="admin-user-row">
                        <div className="user-avatar">
                          <Users size={20} />
                        </div>
                        <div className="user-info">
                          <h4>{user.name}</h4>
                          <p>{user.email}</p>
                        </div>
                        <div className="user-role">Guest</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'bookings' && (
            <div className="admin-bookings">
              <h2>All Bookings ({data.bookings.length})</h2>
              <div className="admin-bookings-grid">
                {data.bookings.map(booking => (
                  <div key={booking._id} className="admin-booking-card">
                    <div className="booking-header">
                      <h4>Room {booking.roomId?.roomNumber}</h4>
                      <span className={`admin-status-badge ${booking.bookingStatus}`}>
                        {booking.bookingStatus}
                      </span>
                    </div>
                    <div className="booking-details">
                      <p><strong>Guest:</strong> {booking.userId?.name}</p>
                      <p><strong>Dates:</strong> {new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</p>
                      <p><strong>Amount:</strong> ₹{booking.totalAmount}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;