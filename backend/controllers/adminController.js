const User = require('../models/User');
const Room = require('../models/Room');
const Booking = require('../models/Booking');

const createManager = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const manager = await User.create({ name, email, password, role: 'manager' });
    res.status(201).json({
      _id: manager._id,
      name: manager.name,
      email: manager.email,
      role: manager.role
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllManagers = async (req, res) => {
  try {
    const managers = await User.find({ role: 'manager' }).select('-password');
    res.json(managers);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate('managedBy', 'name email');
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email')
      .populate('roomId', 'roomNumber type price');
    res.json(bookings);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

const getRevenue = async (req, res) => {
  try {
    const bookings = await Booking.find({ bookingStatus: 'completed' });
    const totalRevenue = bookings.reduce((sum, booking) => sum + booking.totalAmount, 0);
    res.json({ totalRevenue, totalBookings: bookings.length });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = {
  createManager,
  getAllManagers,
  getAllUsers,
  getAllRooms,
  getAllBookings,
  getRevenue
};