const Room = require('../models/Room');
const Booking = require('../models/Booking');

const addRoom = async (req, res) => {
  try {
    const { roomNumber, type, price } = req.body;
    const room = await Room.create({
      roomNumber,
      type,
      price,
      managedBy: req.user._id
    });
    res.status(201).json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateRoom = async (req, res) => {
  try {
    const room = await Room.findOneAndUpdate(
      { _id: req.params.id, managedBy: req.user._id },
      req.body,
      { new: true }
    );
    if (!room) {
      return res.status(404).json({ message: 'Room not found' });
    }
    res.json(room);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyRooms = async (req, res) => {
  try {
    const rooms = await Room.find({ managedBy: req.user._id });
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getMyBookings = async (req, res) => {
  try {
    const rooms = await Room.find({ managedBy: req.user._id });
    const roomIds = rooms.map(room => room._id);
    const bookings = await Booking.find({ roomId: { $in: roomIds } })
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber type price');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingStatus } = req.body;
    const booking = await Booking.findById(req.params.id).populate('roomId');
    
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    const room = await Room.findOne({ _id: booking.roomId._id, managedBy: req.user._id });
    if (!room) {
      return res.status(403).json({ message: 'Not authorized to update this booking' });
    }

    booking.bookingStatus = bookingStatus;
    await booking.save();
    
    res.json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  addRoom,
  updateRoom,
  getMyRooms,
  getMyBookings,
  updateBookingStatus
};