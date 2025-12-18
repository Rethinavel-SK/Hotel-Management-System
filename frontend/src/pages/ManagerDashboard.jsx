import React, { useState, useEffect } from 'react';
import { managerAPI } from '../services/api';
import { toast } from 'react-toastify';
import { Building, Calendar, Plus, Users, DollarSign, TrendingUp, Clock, Star, Edit } from 'lucide-react';
import { useAuth } from '../components/common/AuthContext';
import singleRoom from '../assets/single.jpg';
import doubleRoom from '../assets/double.jpg';
import suiteRoom from '../assets/suite.jpg';
import eliteRoom from '../assets/elite.jpg';
import managerBg from '../assets/mg.jpg';

const ManagerDashboard = () => {
  const { user } = useAuth();
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [newRoom, setNewRoom] = useState({
    roomNumber: '',
    type: 'single',
    price: ''
  });
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingRoom, setEditingRoom] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAvailableRooms, setShowAvailableRooms] = useState(false);

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
      setShowAddForm(false);
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

  const handleUpdateRoom = async (roomId, updatedData) => {
    try {
      await managerAPI.updateRoom(roomId, updatedData);
      toast.success('Room updated successfully');
      setEditingRoom(null);
      fetchData();
    } catch (error) {
      toast.error('Failed to update room');
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

  const totalRevenue = bookings.reduce((sum, booking) => sum + (booking.totalAmount || 0), 0);
  const completedBookings = bookings.filter(b => b.bookingStatus === 'completed').length;
  const occupancyRate = rooms.length > 0 ? ((rooms.length - rooms.filter(r => r.availability).length) / rooms.length * 100).toFixed(1) : 0;

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="user-dashboard manager-dashboard-bg" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${managerBg})`}}>
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <div className="container">
          <div className="header-content">
            <div className="welcome-text">
              <h1>Manager Dashboard</h1>
              <p>Welcome back, {user?.name}!</p>
              <div className="user-status">
                <Clock size={16} />
                <span>{currentTime.toLocaleTimeString()}</span>
                <Building size={16} />
                <span>Property Manager</span>
              </div>
            </div>
            <div className="quick-stats">
              <div className="quick-stat">
                <Building size={20} />
                <div>
                  <span className="stat-number">{rooms.length}</span>
                  <span className="stat-label">Total Rooms</span>
                </div>
              </div>
              <div className="quick-stat">
                <Users size={20} />
                <div>
                  <span className="stat-number">{bookings.length}</span>
                  <span className="stat-label">Bookings</span>
                </div>
              </div>
              <div className="quick-stat">
                <TrendingUp size={20} />
                <div>
                  <span className="stat-number">{occupancyRate}%</span>
                  <span className="stat-label">Occupancy</span>
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
            {/* Revenue Analytics */}
            <div className="dashboard-card insights-card-new">
              <div className="insights-header">
                <div className="insights-icon">
                  <DollarSign size={24} />
                </div>
                <div>
                  <h2>Revenue Analytics</h2>
                  <p>Financial overview</p>
                </div>
              </div>
              <div className="insights-stats">
                <div className="stat-row">
                  <div className="stat-icon">💰</div>
                  <div className="stat-info">
                    <span className="stat-value">₹{totalRevenue}</span>
                    <span className="stat-name">Total Revenue</span>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat-icon">✅</div>
                  <div className="stat-info">
                    <span className="stat-value">{completedBookings}</span>
                    <span className="stat-name">Completed</span>
                  </div>
                </div>
                <div className="stat-row">
                  <div className="stat-icon">📊</div>
                  <div className="stat-info">
                    <span className="stat-value">{occupancyRate}%</span>
                    <span className="stat-name">Occupancy Rate</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Add Room */}
            <div className="dashboard-card">
              <div className="card-header">
                <h2>Quick Add Room</h2>
                <span className="room-count">{rooms.length} rooms</span>
              </div>
              <div className="quick-add-grid">
                <div className="room-type-quick" onClick={() => {
                  setNewRoom({roomNumber: `${Math.floor(Math.random() * 900) + 100}`, type: 'single', price: '150'});
                  handleAddRoom({preventDefault: () => {}});
                }}>
                  <div className="room-type-image-small" style={{backgroundImage: `url(${singleRoom})`}}></div>
                  <h4>Single Room</h4>
                  <p>₹150/night</p>
                  <button className="quick-add-btn">+ Add Single</button>
                </div>
                <div className="room-type-quick" onClick={() => {
                  setNewRoom({roomNumber: `${Math.floor(Math.random() * 900) + 100}`, type: 'double', price: '220'});
                  handleAddRoom({preventDefault: () => {}});
                }}>
                  <div className="room-type-image-small" style={{backgroundImage: `url(${doubleRoom})`}}></div>
                  <h4>Double Room</h4>
                  <p>₹220/night</p>
                  <button className="quick-add-btn">+ Add Double</button>
                </div>
                <div className="room-type-quick" onClick={() => {
                  setNewRoom({roomNumber: `${Math.floor(Math.random() * 900) + 100}`, type: 'suite', price: '450'});
                  handleAddRoom({preventDefault: () => {}});
                }}>
                  <div className="room-type-image-small" style={{backgroundImage: `url(${suiteRoom})`}}></div>
                  <h4>Suite</h4>
                  <p>₹450/night</p>
                  <button className="quick-add-btn">+ Add Suite</button>
                </div>
                <div className="room-type-quick" onClick={() => {
                  setNewRoom({roomNumber: `${Math.floor(Math.random() * 900) + 100}`, type: 'deluxe', price: '800'});
                  handleAddRoom({preventDefault: () => {}});
                }}>
                  <div className="room-type-image-small" style={{backgroundImage: `url(${eliteRoom})`}}></div>
                  <h4>Deluxe</h4>
                  <p>₹800/night</p>
                  <button className="quick-add-btn">+ Add Deluxe</button>
                </div>
              </div>
              <div className="custom-add-section">
                <h4>Custom Room</h4>
                <div className="custom-add-form">
                  <input
                    type="text"
                    placeholder="Room Number"
                    value={newRoom.roomNumber}
                    onChange={(e) => setNewRoom({...newRoom, roomNumber: e.target.value})}
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
                    placeholder="Price"
                    value={newRoom.price}
                    onChange={(e) => setNewRoom({...newRoom, price: e.target.value})}
                  />
                  <button onClick={() => handleAddRoom({preventDefault: () => {}})} className="book-now-btn">
                    <Plus size={16} />
                    Add Custom
                  </button>
                </div>
              </div>
            </div>

            {/* Available Rooms */}
            <div className="dashboard-card" onClick={() => setShowAvailableRooms(true)} style={{cursor: 'pointer'}}>
              <div className="card-header">
                <h2>Available Rooms</h2>
                <span className="booking-count">{rooms.filter(r => r.availability).length} available</span>
              </div>
              <div className="rooms-list-scrollable">
                {rooms.filter(room => room.availability).slice(0, 3).map(room => (
                  <div key={room._id} className="room-item">
                    <div className="room-image-small" style={{backgroundImage: `url(${getRoomImage(room.type)})`}}></div>
                    <div className="room-details">
                      <h4>Room {room.roomNumber}</h4>
                      <p>{room.type} • ₹{room.price}/night</p>
                      <span className="status-badge available">
                        Available
                      </span>
                    </div>
                  </div>
                ))}
                {rooms.filter(r => r.availability).length > 3 && (
                  <div className="view-more-indicator">
                    <p>Click to view all {rooms.filter(r => r.availability).length} available rooms</p>
                  </div>
                )}
              </div>
            </div>

            {/* Occupied Rooms */}
            {rooms.filter(r => !r.availability).length > 0 && (
              <div className="dashboard-card">
                <div className="card-header">
                  <h2>Occupied Rooms</h2>
                  <span className="booking-count">{rooms.filter(r => !r.availability).length} occupied</span>
                </div>
                <div className="rooms-list-scrollable">
                  {rooms.filter(room => !room.availability).slice(0, 3).map(room => (
                    <div key={room._id} className="room-item">
                      <div className="room-image-small" style={{backgroundImage: `url(${getRoomImage(room.type)})`}}></div>
                      <div className="room-details">
                        <h4>Room {room.roomNumber}</h4>
                        <p>{room.type} • ₹{room.price}/night</p>
                        <span className="status-badge confirmed">
                          Occupied
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
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
                        <h4>{booking.userId?.name}</h4>
                        <p>Room {booking.roomId?.roomNumber}</p>
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
                            onClick={() => handleUpdateBookingStatus(booking._id, 'completed')}
                            className="review-btn"
                          >
                            <Star size={14} />
                            Complete
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
                          <h4>{booking.userId?.name}</h4>
                          <p>Room {booking.roomId?.roomNumber}</p>
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

      {/* Available Rooms Modal */}
      {showAvailableRooms && (
        <div className="modal-overlay" onClick={() => setShowAvailableRooms(false)}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setShowAvailableRooms(false)}>×</button>
            <div className="room-modal-content">
              <h2>All Available Rooms ({rooms.filter(r => r.availability).length})</h2>
              <div className="all-rooms-grid">
                {rooms.filter(room => room.availability).map(room => (
                  <div key={room._id} className="room-item">
                    <div className="room-image-small" style={{backgroundImage: `url(${getRoomImage(room.type)})`}}></div>
                    <div className="room-details">
                      <h4>Room {room.roomNumber}</h4>
                      <p>{room.type} • ₹{room.price}/night</p>
                      <span className="status-badge available">
                        Available
                      </span>
                    </div>
                    <div className="booking-actions">
                      <button className="review-btn" onClick={() => {
                        setEditingRoom(room);
                        setShowAvailableRooms(false);
                      }}>
                        <Edit size={14} />
                        Edit
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="modal-overlay" onClick={() => setEditingRoom(null)}>
          <div className="room-modal" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setEditingRoom(null)}>×</button>
            <div className="room-modal-image" style={{backgroundImage: `url(${getRoomImage(editingRoom.type)})`}}></div>
            <div className="room-modal-content">
              <h2>Edit Room {editingRoom.roomNumber}</h2>
              <form onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                handleUpdateRoom(editingRoom._id, {
                  roomNumber: formData.get('roomNumber'),
                  type: formData.get('type'),
                  price: formData.get('price')
                });
              }}>
                <div className="date-inputs-modal">
                  <input
                    name="roomNumber"
                    type="text"
                    placeholder="Room Number"
                    defaultValue={editingRoom.roomNumber}
                    required
                  />
                  <select name="type" defaultValue={editingRoom.type}>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="suite">Suite</option>
                    <option value="deluxe">Deluxe</option>
                  </select>
                </div>
                <input
                  name="price"
                  type="number"
                  placeholder="Price per night"
                  defaultValue={editingRoom.price}
                  style={{marginBottom: '1rem'}}
                  required
                />
                <div className="modal-form-actions">
                  <button type="button" onClick={() => setEditingRoom(null)} className="back-btn">
                    Cancel
                  </button>
                  <button type="submit" className="confirm-booking-btn">
                    Update Room
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagerDashboard;