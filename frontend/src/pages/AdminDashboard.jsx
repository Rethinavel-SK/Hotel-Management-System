import React, { useState, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Users, Building, Calendar, DollarSign } from 'lucide-react';

const AdminDashboard = () => {
  const [data, setData] = useState({
    users: [],
    managers: [],
    rooms: [],
    bookings: [],
    revenue: { totalRevenue: 0, totalBookings: 0 }
  });
  const [newManager, setNewManager] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(true);

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
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create manager');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Admin Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <Users size={24} />
          <div>
            <h3>{data.users.length}</h3>
            <p>Total Users</p>
          </div>
        </div>
        <div className="stat-card">
          <Building size={24} />
          <div>
            <h3>{data.rooms.length}</h3>
            <p>Total Rooms</p>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <h3>{data.bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
        <div className="stat-card">
          <DollarSign size={24} />
          <div>
            <h3>₹{data.revenue.totalRevenue}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Create Manager</h2>
        <form onSubmit={handleCreateManager} className="form">
          <input
            type="text"
            placeholder="Name"
            value={newManager.name}
            onChange={(e) => setNewManager({...newManager, name: e.target.value})}
            required
          />
          <input
            type="email"
            placeholder="Email"
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
          <button type="submit">Create Manager</button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>Recent Bookings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Room</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Status</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.bookings.slice(0, 10).map(booking => (
                <tr key={booking._id}>
                  <td>{booking.userId?.name}</td>
                  <td>{booking.roomId?.roomNumber}</td>
                  <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>₹{booking.totalAmount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;