import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Building, Calendar, Plus } from 'lucide-react';

const ManagerDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'single',
    price: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        managerAPI.getMyRooms(),
        managerAPI.getMyBookings()
      ]);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleAddRoom = async (e) => {
    e.preventDefault();
    try {
      await managerAPI.addRoom(newRoom);
      toast.success('Room added successfully');
      setNewRoom({ roomNumber: '', type: 'single', price: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add room');
    }
  };

  const handleUpdateBookingStatus = async (bookingId, status) => {
    try {
      await managerAPI.updateBookingStatus(bookingId, status);
      toast.success('Booking status updated');
      fetchData();
    } catch (error) {
      toast.error('Failed to update booking status');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>Manager Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <Building size={24} />
          <div>
            <h3>{rooms.length}</h3>
            <p>My Rooms</p>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <h3>{bookings.length}</h3>
            <p>Total Bookings</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Add New Room</h2>
        <form onSubmit={handleAddRoom} className="form">
          <input
            type="text"
            placeholder="Room Number"
            value={newRoom.roomNumber}
            onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
            required
          />
          <select
            value={newRoom.type}
            onChange={(e) => setNewRoom({...newRoom, type: e.target.value})}
          >
            <option value="single">Single</option>
            <option value="double">Double</option>
            <option value="suite">Suite</option>
            <option value="deluxe">Deluxe</option>
          </select>
          <input
            type="number"
            placeholder="Price per night"
            value={newRoom.price}
            onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
            required
          />
          <button type="submit">
            <Plus size={20} />
            Add Room
          </button>
        </form>
      </div>

      <div className="dashboard-section">
        <h2>My Rooms</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Room Number</th>
                <th>Type</th>
                <th>Price</th>
                <th>Availability</th>
              </tr>
            </thead>
            <tbody>
              {rooms.map(room => (
                <tr key={room._id}>
                  <td>{room.roomNumber}</td>
                  <td>{room.type}</td>
                  <td>₹{room.price}</td>
                  <td>{room.availability ? 'Available' : 'Booked'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Bookings</h2>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map(booking => (
                <tr key={booking._id}>
                  <td>{booking.userId?.name}</td>
                  <td>{booking.roomId?.roomNumber}</td>
                  <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>₹{booking.totalAmount}</td>
                  <td>
                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                        className="btn-success"
                      >
                        Complete
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManagerDashboard;