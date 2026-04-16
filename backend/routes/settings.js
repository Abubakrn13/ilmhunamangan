// backend/routes/settings.js
const express = require('express');
const User = require('../models/User');
const router = express.Router();

// Middleware to verify JWT token
const auth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Access denied' });

  try {
    const jwt = require('jsonwebtoken');
    const JWT_SECRET = process.env.JWT_SECRET || 'educore_secret_key_2024';
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// Get user settings
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('storeName theme plan subscriptionEnd');
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update user settings
router.put('/', auth, async (req, res) => {
  try {
    const { storeName, theme } = req.body;
    const updates = {};
    
    if (storeName) updates.storeName = storeName;
    if (theme) updates.theme = theme;

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true }
    ).select('-password');

    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Reset user data (delete all user data)
router.post('/reset', auth, async (req, res) => {
  try {
    const Student = require('../models/Student');
    const Teacher = require('../models/Teacher');
    const Group = require('../models/Group');
    const Payment = require('../models/Payment');
    const Lead = require('../models/Lead');
    const Attendance = require('../models/Attendance');

    await Student.deleteMany({ userId: req.user.id });
    await Teacher.deleteMany({ userId: req.user.id });
    await Group.deleteMany({ userId: req.user.id });
    await Payment.deleteMany({ userId: req.user.id });
    await Lead.deleteMany({ userId: req.user.id });
    await Attendance.deleteMany({ userId: req.user.id });

    res.json({ message: 'All data reset successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;