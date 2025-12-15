const express = require('express');
const { protect, authorize } = require('../middleware/authMiddleware');
const {
  addRoom,
  updateRoom,
  getMyRooms,
  getMyBookings,
  updateBookingStatus
} = require('../controllers/managerController');

const router = express.Router();

router.use(protect);
router.use(authorize('manager'));

router.post('/rooms', addRoom);
router.put('/rooms/:id', updateRoom);
router.get('/rooms', getMyRooms);
router.get('/bookings', getMyBookings);
router.put('/bookings/:id', updateBookingStatus);

module.exports = router;