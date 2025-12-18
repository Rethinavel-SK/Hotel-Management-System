import React, { useState, useEffect } from 'react';
import { userAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Calendar, MapPin, Star, Clock, Users, Award, Heart, TrendingUp } from 'lucide-react';
import { useAuth } from '../components/common/AuthContext';
import hotelImage from '../assets/pexels-pixabay-258154.jpg';
import singleRoom from '../assets/single.jpg';
import doubleRoom from '../assets/double.jpg';
import suiteRoom from '../assets/suite.jpg';
import eliteRoom from '../assets/elite.jpg';
import userBg from '../assets/newbg.png';

const UserDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [bookingForm, setBookingForm] = useState({
    roomId: '',
    checkInDate: '',
    checkOutDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showDateForm, setShowDateForm] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

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

  const getRoomImage = (roomType) => {
    switch (roomType?.toLowerCase()) {
      case 'single': return singleRoom;
      case 'double': return doubleRoom;
      case 'suite': return suiteRoom;
      case 'deluxe': return eliteRoom;
      default: return singleRoom;
    }
  };

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-dashboard user-dashboard-bg" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${userBg})`}}>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="welcome-text">
              <h1>Welcome back, {user?.name}!</h1>
              <p>It's {currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
              <div className="user-status">
                <Award size={16} />
                <span>Premium Guest</span>
                {bookings.length > 0 && (
                  <>
                    <Heart size={16} />
                    <span>Loyal Customer</span>
                  </>
                )}
              </div>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <MapPin size={20} />
                <div>
                  <span className="stat-number">{rooms.length}</span>
                  <span className="stat-label">Available</span>
                </div>
              </div>
              <div className="quick-stat">
                <Calendar size={20} />
                <div>
                  <span className="stat-number">{bookings.length}</span>
                  <span className="stat-label">Bookings</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="dashboard-main">
        <div className="container">
          <div className="dashboard-grid">
            {/* Personal Insights */}
            <div className="dashboard-card insights-card-new">
              <div className="insights-header">
                <div className="insights-icon">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h2>Stay Analytics</h2>
                  <p>Your booking journey</p>
                </div>
              </div>
              <div className="insights-stats">
                <div className="stat-row">
                  <div className="stat-icon">📅</div>
                  <div className="stat-info">
                    <span className="stat-value">{bookings.length}</span>
                    <span className="stat-name">Total Bookings</span>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat-icon">✓</div>
                  <div className="stat-info">
                    <span className="stat-value">{bookings.filter(b => b.bookingStatus === 'completed').length}</span>
                    <span className="stat-name">Completed</span>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-value">₹{bookings.reduce((sum, b) => sum + (b.totalAmount || 0), 0)}</span>
                    <span className="stat-name">Total Spent</span>
                  </div>
                </div>
              </div>
              {bookings.length > 2 && (
                <div className="vip-banner">
                  <Heart size={18} />
                  <span>VIP Member - Exclusive Benefits Available</span>
                </div>
              )}
            </div>

            {/* Available Rooms */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Recommended Rooms</h2>
                <span className="room-count">{rooms.length} available</span>
              </div>
              <div className="rooms-list">
                {rooms.slice(0, 3).map((room, index) => (
                  <div key={room._id} className="room-item" onClick={() => {
                    setSelectedRoom(room);
                    setShowRoomModal(true);
                  }}>
                    <div className="room-image-small" style={{backgroundImage: `url(${getRoomImage(room.type)})`}}>
                      {index === 0 && <div className="recommended-badge">Recommended</div>}
                    </div>
                    <div className="room-details">
                      <h4>Room {room.roomNumber}</h4>
                      <p>{room.type} • ₹{room.price}/night</p>
                      <div className="room-rating-small">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={12} fill="#ffd700" color="#ffd700" />
                        ))}
                        <span>(4.8)</span>
                      </div>
                    </div>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedRoom(room);
                        setShowRoomModal(true);
                      }}
                      className="select-btn"
                    >
                      View Details
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Booking Form */}
            {bookingForm.roomId && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Book Room</h2>
                </div>
                <form onSubmit={handleBookRoom} className="booking-form-compact">
                  <div className="date-inputs">
                    <input
                      type="date"
                      placeholder="Check-in"
                      value={bookingForm.checkInDate}
                      onChange={(e) => setBookingForm({...bookingForm, checkInDate: e.target.value})}
                      required
                    />
                    <input
                      type="date"
                      placeholder="Check-out"
                      value={bookingForm.checkOutDate}
                      onChange={(e) => setBookingForm({...bookingForm, checkOutDate: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="book-now-btn">
                    <Calendar size={16} />
                    Confirm Booking
                  </button>
                </form>
              </div>
            )}

            {/* Active Bookings */}
            <div className="dashboard-card full-width">
              <div className="card-header">
                <h2>Active Bookings</h2>
                <span className="booking-count">{bookings.filter(b => b.bookingStatus !== 'cancelled').length} active</span>
              </div>
              <div className="bookings-table">
                {bookings.filter(booking => booking.bookingStatus !== 'cancelled').map(booking => (
                  <div key={booking._id} className="booking-row">
                    <div className="booking-info-row">
                      <div className="room-info">
                        <h4>Room {booking.roomId?.roomNumber}</h4>
                        <span className={`status-badge ${booking.bookingStatus}`}>
                          {booking.bookingStatus}
                        </span>
                      </div>
                      <div className="date-info">
                        <Calendar size={16} />
                        <span>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                      </div>
                      <div className="amount-info">
                        <span className="amount">₹{booking.totalAmount}</span>
                      </div>
                      <div className="booking-actions">
                        {booking.bookingStatus === 'confirmed' && (
                          <button
                            onClick={() => {
                              if (window.confirm('Are you sure you want to cancel this booking?')) {
                                handleCancelBooking(booking._id);
                              }
                            }}
                            className="cancel-booking-btn"
                          >
                            Cancel
                          </button>
                        )}
                        {booking.bookingStatus === 'completed' && (
                          <button className="review-btn">
                            <Star size={14} />
                            Review
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cancelled Bookings */}
            {bookings.filter(b => b.bookingStatus === 'cancelled').length > 0 && (
              <div className="dashboard-card full-width">
                <div className="card-header">
                  <h2>Cancelled Bookings</h2>
                  <span className="booking-count">{bookings.filter(b => b.bookingStatus === 'cancelled').length} cancelled</span>
                </div>
                <div className="bookings-table">
                  {bookings.filter(booking => booking.bookingStatus === 'cancelled').map(booking => (
                    <div key={booking._id} className="booking-row">
                      <div className="booking-info-row">
                        <div className="room-info">
                          <h4>Room {booking.roomId?.roomNumber}</h4>
                          <span className={`status-badge ${booking.bookingStatus}`}>
                            {booking.bookingStatus}
                          </span>
                        </div>
                        <div className="date-info">
                          <Calendar size={16} />
                          <span>{new Date(booking.checkInDate).toLocaleDateString()} - {new Date(booking.checkOutDate).toLocaleDateString()}</span>
                        </div>
                        <div className="amount-info">
                          <span className="amount">₹{booking.totalAmount}</span>
                        </div>
                        <div className="booking-actions">
                          <span style={{color: '#666', fontSize: '0.9rem'}}>Cancelled</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Room Details Modal */}
      {showRoomModal && selectedRoom && (
        <div className="modal-overlay" onClick={() => {
          setShowRoomModal(false);
          setShowDateForm(false);
        }}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowRoomModal(false)}>×</button>
            <div className="room-modal-image" style={{backgroundImage: `url(${getRoomImage(selectedRoom.type)})`}}></div>
            <div className="room-modal-content">
              <h2>Room {selectedRoom.roomNumber}</h2>
              <div className="room-type-info">
                <span className="room-type">{selectedRoom.type}</span>
                <div className="room-rating">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                  ))}
                  <span>(4.8)</span>
                </div>
              </div>
              <div className="room-features-list">
                <h3>Room Features</h3>
                <ul>
                  <li>King-size bed with premium linens</li>
                  <li>City or garden view</li>
                  <li>Marble bathroom with rainfall shower</li>
                  <li>Complimentary WiFi & minibar</li>
                  <li>24/7 room service</li>
                  <li>Air conditioning & heating</li>
                </ul>
              </div>
              <div className="room-amenities">
                <h3>Amenities</h3>
                <div className="amenities-grid">
                  <span>📺 Smart TV</span>
                  <span>☕ Coffee Machine</span>
                  <span>🛁 Luxury Bath</span>
                  <span>🌐 Free WiFi</span>
                </div>
              </div>
              <div className="room-price-section">
                <div className="price-display">
                  <span className="price">₹{selectedRoom.price}</span>
                  <span className="price-period">/night</span>
                </div>
                {!showDateForm ? (
                  <button
                    onClick={() => setShowDateForm(true)}
                    className="book-room-btn"
                  >
                    <Calendar size={16} />
                    Book This Room
                  </button>
                ) : (
                  <div className="date-booking-form">
                    <h4>Select Your Stay Dates</h4>
                    <div className="date-inputs-modal">
                      <input
                        type="date"
                        placeholder="Check-in"
                        value={bookingForm.checkInDate}
                        onChange={(e) => setBookingForm({...bookingForm, checkInDate: e.target.value})}
                        required
                      />
                      <input
                        type="date"
                        placeholder="Check-out"
                        value={bookingForm.checkOutDate}
                        onChange={(e) => setBookingForm({...bookingForm, checkOutDate: e.target.value})}
                        required
                      />
                    </div>
                    <div className="modal-form-actions">
                      <button
                        onClick={() => setShowDateForm(false)}
                        className="back-btn"
                      >
                        Back
                      </button>
                      <button
                        onClick={() => {
                          if (bookingForm.checkInDate && bookingForm.checkOutDate) {
                            setBookingForm({...bookingForm, roomId: selectedRoom._id});
                            setShowRoomModal(false);
                            setShowDateForm(false);
                            toast.success(`Room booked for ${bookingForm.checkInDate} to ${bookingForm.checkOutDate}!`);
                          } else {
                            toast.error('Please select both check-in and check-out dates');
                          }
                        }}
                        className="confirm-booking-btn"
                      >
                        Confirm Booking
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;