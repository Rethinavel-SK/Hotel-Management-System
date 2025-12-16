import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Calendar, MapPin, DollarSign } from 'lucide-react';

const UserDashboard = () => {
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [roomsRes, bookingsRes] = await Promise.all([
        userAPI.getAvailableRooms(),
        userAPI.getMyBookings()
      ]);
      setRooms(roomsRes.data);
      setBookings(bookingsRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleBookRoom = async (e) => {
    e.preventDefault();
    try {
      await userAPI.bookRoom(bookingForm);
      toast.success('Room booked successfully');
      setBookingForm({ roomId: '', checkInDate: '', checkOutDate: '' });
      fetchData();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to book room');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    try {
      await userAPI.cancelBooking(bookingId);
      toast.success('Booking cancelled successfully');
      fetchData();
    } catch (error) {
      toast.error('Failed to cancel booking');
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="dashboard">
      <h1>User Dashboard</h1>
      
      <div className="stats-grid">
        <div className="stat-card">
          <MapPin size={24} />
          <div>
            <h3>{rooms.length}</h3>
            <p>Available Rooms</p>
          </div>
        </div>
        <div className="stat-card">
          <Calendar size={24} />
          <div>
            <h3>{bookings.length}</h3>
            <p>My Bookings</p>
          </div>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Available Rooms</h2>
        <div className="rooms-grid">
          {rooms.map(room => (
            <div key={room._id} className="room-card">
              <h3>Room {room.roomNumber}</h3>
              <p>Type: {room.type}</p>
              <p>Price: ${room.price}/night</p>
              <p>Managed by: {room.managedBy?.name}</p>
              <button
                onClick={() => setBookingForm({...bookingForm, roomId: room._id})}
                className="btn-primary"
              >
                Select Room
              </button>
            </div>
          ))}
        </div>
      </div>

      {bookingForm.roomId && (
        <div className="dashboard-section">
          <h2>Book Room</h2>
          <form onSubmit={handleBookRoom} className="form">
            <input
              type="date"
              placeholder="Check-in Date"
              value={bookingForm.checkInDate}
              onChange={(e) => setBookingForm({...bookingForm, checkInDate: e.target.value})}
              required
            />
            <input
              type="date"
              placeholder="Check-out Date"
              value={bookingForm.checkOutDate}
              onChange={(e) => setBookingForm({...bookingForm, checkOutDate: e.target.value})}
              required
            />
            <button type="submit">Book Room</button>
          </form>
        </div>
      )}

      <div className="dashboard-section">
        <h2>My Bookings</h2>
        <div className="table-container">
          <table>
            <thead>
              <tr>
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
                  <td>{booking.roomId?.roomNumber}</td>
                  <td>{new Date(booking.checkInDate).toLocaleDateString()}</td>
                  <td>{new Date(booking.checkOutDate).toLocaleDateString()}</td>
                  <td>{booking.bookingStatus}</td>
                  <td>₹{booking.totalAmount}</td>
                  <td>
                    {booking.bookingStatus === 'confirmed' && (
                      <button
                        onClick={() => handleCancelBooking(booking._id)}
                        className="btn-danger"
                      >
                        Cancel
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

export default UserDashboard;