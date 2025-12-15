const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  createManager,
  getAllManagers,
  getAllUsers,
  getAllRooms,
  getAllBookings,
  getRevenue
} = require('../controllers/adminController');

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.post('/managers', createManager);
router.get('/managers', getAllManagers);
router.get('/users', getAllUsers);
router.get('/rooms', getAllRooms);
router.get('/bookings', getAllBookings);
router.get('/revenue', getRevenue);

module.exports = router;