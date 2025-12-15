const Room = require('../models/Room');
const Booking = require('../models/Booking');

const getAvailableRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ availability: true }).populate('managedBy', 'name');
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const bookRoom = async (req, res) => {
  try {
    const { roomId, checkInDate, checkOutDate } = req.body;
    
    const room = await Room.findById(roomId);
    if (!room || !room.availability) {
      return res.status(400).json({ message: 'Room not available' });
    }

    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const days = Math.ceil((checkOut - checkIn) / (1000 * 60 * 60 * 24));
    const totalAmount = room.price * days;

    const booking = await Booking.create({
      userId: req.user._id,
      roomId,
      checkInDate,
      checkOutDate,
      totalAmount
    });

    await Room.findByIdAndUpdate(roomId, { availability: false });

    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate('roomId', 'roomNumber type price');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { bookingStatus: 'cancelled' },
      { new: true }
    );
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    await Room.findByIdAndUpdate(booking.roomId, { availability: true });
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  getAvailableRooms,
  bookRoom,
  getMyBookings,
  cancelBooking
};