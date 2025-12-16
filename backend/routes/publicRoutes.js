const express = require('express');
const Room = require('../models/Room');

const router = express.Router();

router.get('/rooms', async (req, res) => {
  try {
    const rooms = await Room.find({ availability: true }).populate('managedBy', 'name');
    res.json(rooms);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;