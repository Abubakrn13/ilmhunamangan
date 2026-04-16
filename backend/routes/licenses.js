// backend/routes/licenses.js
const express = require('express');
const License = require('../models/License');
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

// Get all licenses (admin only)
router.get('/', auth, async (req, res) => {
  try {
    const licenses = await License.find()
      .populate('usedBy', 'username')
      .sort({ createdAt: -1 });
    res.json(licenses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create license (admin only)
router.post('/', auth, async (req, res) => {
  try {
    const { plan, type } = req.body;
    
    // Generate license code
    const generateCode = () => {
      return `${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    };

    const code = generateCode();
    const days = type === 'month' ? 30 : 365;

    const license = new License({
      code,
      plan,
      type,
      days
    });

    await license.save();
    res.status(201).json(license);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Activate license - AUTO-DELETES after single use
router.post('/activate', auth, async (req, res) => {
  try {
    const { code } = req.body;

    const license = await License.findOne({ code: code.trim() });
    if (!license) {
      return res.status(404).json({ success: false, message: 'Kod xato!' });
    }

    if (license.used) {
      return res.status(400).json({ success: false, message: 'Bu kod ishlatilgan!' });
    }

    // Activate license for user
    const user = await User.findById(req.user.id);
    
    const today = new Date();
    const currentEnd = user.subscriptionEnd ? new Date(user.subscriptionEnd) : new Date();
    const startDate = currentEnd > today ? currentEnd : today;
    startDate.setDate(startDate.getDate() + license.days);

    user.plan = license.plan;
    user.subscriptionEnd = startDate;
    await user.save();

    // Delete license after single use (avtomatik o'chirish)
    await License.findByIdAndDelete(license._id);

    res.json({ 
      success: true, 
      message: 'Tarif faollashdi!',
      user: {
        plan: user.plan,
        subscriptionEnd: user.subscriptionEnd
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete license
router.delete('/:id', auth, async (req, res) => {
  try {
    const license = await License.findByIdAndDelete(req.params.id);
    if (!license) return res.status(404).json({ error: 'License not found' });
    res.json({ message: 'License deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
