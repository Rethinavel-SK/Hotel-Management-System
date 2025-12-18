import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { publicAPI } from '../services/api';
import { useAuth } from '../components/common/AuthContext';
import { MapPin, Star, Wifi, Car, Coffee, Dumbbell, Calendar, Users, Clock, Shield, Phone, Mail } from 'lucide-react';
import { toast } from 'react-toastify';
import hotelImage from '../assets/pexels-pixabay-258154.jpg';
import singleRoom from '../assets/single.jpg';
import doubleRoom from '../assets/double.jpg';
import suiteRoom from '../assets/suite.jpg';
import eliteRoom from '../assets/elite.jpg';
import luxuryHotel from '../assets/Luxury-hotel-website-design.jpg';
import hotelGallery from '../assets/template-gallery-1500x900.jpg';
import hotelLobby from '../assets/0c7de2bb336a3fc68daa32fa6e8f3348.jpg';
import diningImage from '../assets/dining.jpg';
import eventsImage from '../assets/events.jpg';
import spaImage from '../assets/images.jpeg';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [guests, setGuests] = useState(1);
  const [currentTime, setCurrentTime] = useState(new Date());

  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchRooms();
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchRooms = async () => {
    try {
      const response = await publicAPI.getAllRooms();
      setRooms(response.data);
    } catch (error) {
      console.error('Failed to fetch rooms');
    }
  };

  const getRoomImage = (roomType) => {
    switch (roomType.toLowerCase()) {
      case 'single': return singleRoom;
      case 'double': return doubleRoom;
      case 'suite': return suiteRoom;
      case 'deluxe': return eliteRoom;
      default: return singleRoom;
    }
  };

  const handleBookNow = () => {
    if (!user) {
      toast.info('Please login to book a room');
      navigate('/login');
    } else {
      navigate('/user');
    }
  };

  const handleExploreRooms = () => {
    document.getElementById('room-types').scrollIntoView({
      behavior: 'smooth'
    });
  };

  const scrollToSection = (sectionId) => {
    document.getElementById(sectionId).scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <div className="home">

      {/* Hero Section */}
      <section id="hero" className="hero" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${hotelImage})`}}>
        <div className="hero-content">
          <h1>Grand Palace Hotel & Resort</h1>
          <p>5-Star Luxury • Since 1975 • Award Winning Service</p>
          <div className="live-info">
            <div className="live-item">
              <Clock size={16} />
              <span>{currentTime.toLocaleTimeString()}</span>
            </div>
            <div className="live-item">
              <Users size={16} />
              <span>{rooms.filter(r => !r.availability).length} Rooms Occupied</span>
            </div>
          </div>
          
          {/* Hero Action Buttons */}
          <div className="hero-actions">
            <button onClick={handleBookNow} className="hero-btn primary">
              Book Your Stay
            </button>
            <button onClick={handleExploreRooms} className="hero-btn secondary">
              Explore Rooms
            </button>
          </div>
          
          {/* Hero Features */}
          <div className="hero-features">
            <div className="hero-feature">
              <span className="feature-text">5-Star Luxury</span>
            </div>
            <div className="hero-feature">
              <span className="feature-text">Award Winning</span>
            </div>
            <div className="hero-feature">
              <span className="feature-text">Prime Location</span>
            </div>
          </div>
        </div>
      </section>

      {/* Welcome Section */}
      <section id="welcome" className="welcome">
        <div className="container">
          <div className="welcome-content">
            <h2>Welcome to Unparalleled Luxury</h2>
            <p className="welcome-subtitle">
              Experience the epitome of hospitality where every detail is crafted to perfection. 
              Our distinguished guests enjoy world-class amenities, personalized service, and 
              breathtaking accommodations in the heart of the city.
            </p>
            <div className="welcome-highlights">
              <div className="highlight">
                <h4>Award-Winning Service</h4>
                <p>Recognized globally for exceptional hospitality and guest satisfaction</p>
              </div>
              <div className="highlight">
                <h4>Prime Location</h4>
                <p>Located in the prestigious downtown district with easy access to attractions</p>
              </div>
              <div className="highlight">
                <h4>Michelin-Starred Dining</h4>
                <p>Exquisite culinary experiences crafted by world-renowned chefs</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Live Stats Section */}
      <section className="live-stats">
        <div className="container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>{rooms.length}</h3>
              <p>Luxury Rooms</p>
            </div>
            <div className="stat-item">
              <h3>{rooms.filter(r => r.availability).length}</h3>
              <p>Available Now</p>
            </div>
            <div className="stat-item">
              <h3>4.8/5</h3>
              <p>Guest Rating</p>
            </div>
            <div className="stat-item">
              <h3>24/7</h3>
              <p>Concierge Service</p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Floating Features Section */}
      <section id="floating-features" className="floating-features">
        <div className="container">
          <div className="floating-grid">
            <div className="floating-card" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${diningImage})`}}>
              <h3>Fine Dining</h3>
              <p>Michelin-starred restaurants with world-class cuisine</p>
            </div>
            <div className="floating-card" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${spaImage})`}}>
              <h3>Spa & Wellness</h3>
              <p>Rejuvenating treatments and state-of-the-art fitness center</p>
            </div>
            <div className="floating-card" style={{backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${eventsImage})`}}>
              <h3>Events & Meetings</h3>
              <p>Elegant venues for weddings, conferences, and celebrations</p>
            </div>
          </div>
        </div>
      </section>

      {/* Hotel Showcase Section */}
      <section className="hotel-showcase">
        <div className="container">
          <div className="showcase-content">
            <div className="showcase-text">
              <h2>Discover Luxury</h2>
              <p>
                Step into a world of unparalleled elegance and sophistication. Our meticulously 
                designed spaces blend contemporary luxury with timeless charm, creating an 
                atmosphere of refined comfort.
              </p>
              <div className="showcase-features">
                <div className="feature">
                  <h4>Architectural Excellence</h4>
                  <p>Award-winning design with stunning interiors</p>
                </div>
                <div className="feature">
                  <h4>Premium Location</h4>
                  <p>Heart of the city with panoramic views</p>
                </div>
              </div>
            </div>
            <div className="showcase-image">
              <img src={luxuryHotel} alt="Luxury Hotel Design" />
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="about">
        <div className="container">
          <h2>Luxury Redefined</h2>
          <div className="about-content">
            <div className="about-text">
              <p>
                <strong>Grand Palace Hotel & Resort</strong> stands as a beacon of luxury hospitality 
                since 1975. Located in the prestigious downtown district, our 5-star property 
                offers unparalleled elegance and world-class service.
              </p>
              <p>
                With 24/7 concierge service, award-winning dining, and state-of-the-art facilities, 
                we cater to discerning travelers seeking the finest accommodations. Our commitment 
                to excellence has earned us recognition as the city's premier luxury destination.
              </p>
              <div className="certifications">
                <div className="cert"><Shield size={20} /> AAA 5-Diamond</div>
                <div className="cert"><Star size={20} /> Forbes 5-Star</div>
                <div className="cert"><Star size={20} /> Michelin Guide</div>
              </div>
            </div>
            <div className="amenities">
              <h3>Premium Amenities</h3>
              <div className="amenities-grid">
                <div className="amenity">
                  <Wifi size={24} />
                  <span>High-Speed WiFi</span>
                </div>
                <div className="amenity">
                  <Car size={24} />
                  <span>Valet Parking</span>
                </div>
                <div className="amenity">
                  <Coffee size={24} />
                  <span>Fine Dining</span>
                </div>
                <div className="amenity">
                  <Dumbbell size={24} />
                  <span>Spa & Fitness</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Room Types Section */}
      <section id="room-types" className="room-types">
        <div className="container">
          <h2>Our Room Categories</h2>
          <div className="room-types-grid">
            <div className="room-type-card">
              <div className="room-type-image" style={{backgroundImage: `url(${singleRoom})`}}></div>
              <div className="room-type-info">
                <h3>Single Rooms</h3>
                <p>Perfect for solo travelers seeking comfort and elegance</p>
                <ul>
                  <li>25m² of luxury space</li>
                  <li>Queen-size bed with premium linens</li>
                  <li>City or garden view</li>
                  <li>Marble bathroom with rainfall shower</li>
                  <li>Complimentary WiFi & minibar</li>
                </ul>
                <div className="price-range">From ₹2,500/night</div>
              </div>
            </div>
            
            <div className="room-type-card">
              <div className="room-type-image" style={{backgroundImage: `url(${doubleRoom})`}}></div>
              <div className="room-type-info">
                <h3>Double Rooms</h3>
                <p>Spacious accommodations for couples and business travelers</p>
                <ul>
                  <li>35m² of refined living space</li>
                  <li>King-size bed or twin beds</li>
                  <li>Panoramic city views</li>
                  <li>Separate work area with ergonomic chair</li>
                  <li>Premium bathroom amenities</li>
                </ul>
                <div className="price-range">From ₹4,000/night</div>
              </div>
            </div>
            
            <div className="room-type-card">
              <div className="room-type-image" style={{backgroundImage: `url(${suiteRoom})`}}></div>
              <div className="room-type-info">
                <h3>Executive Suites</h3>
                <p>Luxurious suites with separate living and sleeping areas</p>
                <ul>
                  <li>65m² of opulent space</li>
                  <li>Separate bedroom and living room</li>
                  <li>Floor-to-ceiling windows</li>
                  <li>Kitchenette with premium appliances</li>
                  <li>Executive lounge access</li>
                </ul>
                <div className="price-range">From ₹7,500/night</div>
              </div>
            </div>
            
            <div className="room-type-card">
              <div className="room-type-image" style={{backgroundImage: `url(${eliteRoom})`}}></div>
              <div className="room-type-info">
                <h3>Presidential Suite</h3>
                <p>The pinnacle of luxury with unmatched elegance and service</p>
                <ul>
                  <li>120m² of presidential luxury</li>
                  <li>Master bedroom with king bed</li>
                  <li>Private terrace with city views</li>
                  <li>Full kitchen and dining area</li>
                  <li>Personal butler service</li>
                </ul>
                <div className="price-range">From ₹12,000/night</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Available Rooms Section */}
      <section id="available-rooms" className="available-rooms">
        <div className="container">
          <h2>Available Rooms Today</h2>
          <p className="section-subtitle">Book now and experience luxury at its finest</p>
          <div className="rooms-grid">
            {rooms.filter(room => room.availability).slice(0, 6).map(room => (
              <div key={room._id} className="room-showcase-card">
                <div 
                  className="room-image"
                  style={{
                    backgroundImage: `url(${getRoomImage(room.type)})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center'
                  }}
                >
                  <div className="room-type-badge">{room.type}</div>
                  <div className="availability-badge available">
                    Available Now
                  </div>
                </div>
                <div className="room-info">
                  <h3>Room {room.roomNumber}</h3>
                  <div className="room-features">
                    <span>• King Bed</span>
                    <span>• City View</span>
                    <span>• 45m²</span>
                  </div>
                  <div className="room-rating">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} fill="#ffd700" color="#ffd700" />
                    ))}
                    <span className="rating-text">(4.8)</span>
                  </div>
                  <div className="price-info">
                    <p className="room-price">₹{room.price}</p>
                    <span className="price-period">/night</span>
                  </div>
                  <button onClick={handleBookNow} className="book-button">
                    Reserve Now
                  </button>
                </div>
              </div>
            ))}
          </div>
          {rooms.filter(room => room.availability).length === 0 && (
            <div className="no-rooms">
              <h3>All rooms are currently occupied</h3>
              <p>Please check back later or contact our reservations team</p>
            </div>
          )}
        </div>
      </section>

      {/* Hotel Gallery Section */}
      <section id="hotel-gallery" className="hotel-gallery">
        <div className="container">
          <h2>Experience Our Hotel</h2>
          <div className="gallery-grid">
            <div className="gallery-item large" style={{backgroundImage: `url(${luxuryHotel})`}}>
              <div className="gallery-overlay">
                <h3>Luxury Hotel Experience</h3>
                <p>World-class hospitality and elegant design</p>
              </div>
            </div>
            <div className="gallery-item" style={{backgroundImage: `url(${hotelLobby})`}}>
              <div className="gallery-overlay">
                <h3>Grand Lobby</h3>
                <p>Majestic entrance with crystal chandeliers</p>
              </div>
            </div>
            <div className="gallery-item" style={{backgroundImage: `url(${hotelGallery})`}}>
              <div className="gallery-overlay">
                <h3>Hotel Gallery</h3>
                <p>Stunning architecture and interiors</p>
              </div>
            </div>
            <div className="gallery-item" style={{backgroundImage: `url(${singleRoom})`}}>
              <div className="gallery-overlay">
                <h3>Elegant Rooms</h3>
                <p>Luxurious accommodations</p>
              </div>
            </div>
            <div className="gallery-item" style={{backgroundImage: `url(${doubleRoom})`}}>
              <div className="gallery-overlay">
                <h3>Premium Suites</h3>
                <p>Spacious and refined</p>
              </div>
            </div>
            <div className="gallery-item" style={{backgroundImage: `url(${suiteRoom})`}}>
              <div className="gallery-overlay">
                <h3>Executive Lounge</h3>
                <p>Exclusive member access</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="contact">
        <div className="container">
          <h2>Get In Touch</h2>
          <div className="contact-info">
            <div className="contact-item">
              <MapPin size={24} />
              <div>
                <h4>Location</h4>
                <p>123 Marine Drive<br/>Nariman Point, Mumbai<br/>Maharashtra 400021, India</p>
              </div>
            </div>
            <div className="contact-item">
              <Phone size={24} />
              <div>
                <h4>Reservations</h4>
                <p>+91 22 6666-7777<br/>24/7 Concierge Available</p>
              </div>
            </div>
            <div className="contact-item">
              <Mail size={24} />
              <div>
                <h4>Email</h4>
                <p>reservations@grandpalace.com<br/>concierge@grandpalace.com</p>
              </div>
            </div>
          </div>
          <div className="emergency-contact">
            <p><strong>Emergency Contact:</strong> +91 22 2222-0911 (24/7)</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;