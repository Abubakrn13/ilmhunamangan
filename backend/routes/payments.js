// backend/routes/payments.js
const express = require('express');
const Payment = require('../models/Payment');
const Student = require('../models/Student');
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

// Get all payments for user
router.get('/', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ userId: req.user.id })
      .populate('studentId', 'name')
      .populate('groupId', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments for a specific student
router.get('/student/:studentId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ 
      userId: req.user.id, 
      studentId: req.params.studentId 
    })
      .populate('groupId', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get payments for a specific group
router.get('/group/:groupId', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ 
      userId: req.user.id, 
      groupId: req.params.groupId 
    })
      .populate('studentId', 'name')
      .sort({ createdAt: -1 });
    res.json(payments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create payment
router.post('/', auth, async (req, res) => {
  try {
    const payment = new Payment({
      ...req.body,
      userId: req.user.id
    });
    await payment.save();

    // Update student balance if payment
    if (req.body.type === 'payment') {
      await Student.findByIdAndUpdate(req.body.studentId, {
        $inc: { balance: req.body.amount }
      });
    } else if (req.body.type === 'refund') {
      await Student.findByIdAndUpdate(req.body.studentId, {
        $inc: { balance: -req.body.amount }
      });
    }

    res.status(201).json(payment);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete payment
router.delete('/:id', auth, async (req, res) => {
  try {
    const payment = await Payment.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!payment) return res.status(404).json({ error: 'Payment not found' });

    // Reverse the balance change
    if (payment.type === 'payment') {
      await Student.findByIdAndUpdate(payment.studentId, {
        $inc: { balance: -payment.amount }
      });
    } else if (payment.type === 'refund') {
      await Student.findByIdAndUpdate(payment.studentId, {
        $inc: { balance: payment.amount }
      });
    }

    res.json({ message: 'Payment deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
