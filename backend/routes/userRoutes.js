const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  getAvailableRooms,
  bookRoom,
  getMyBookings,
  cancelBooking
} = require('../controllers/userController');

const router = express.Router();

router.use(protect);
router.use(authorize('user'));

router.get('/rooms', getAvailableRooms);
router.post('/bookings', bookRoom);
router.get('/bookings', getMyBookings);
router.put('/bookings/:id/cancel', cancelBooking);

module.exports = router;