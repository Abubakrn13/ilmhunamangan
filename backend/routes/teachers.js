// backend/routes/teachers.js
const express = require('express');
const Teacher = require('../models/Teacher');
const Group = require('../models/Group');
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

// Get all teachers for user
router.get('/', auth, async (req, res) => {
  try {
    const teachers = await Teacher.find({ userId: req.user.id })
      .sort({ createdAt: -1 });
    res.json(teachers);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single teacher
router.get('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findOne({ _id: req.params.id, userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create teacher
router.post('/', auth, async (req, res) => {
  try {
    const teacher = new Teacher({
      ...req.body,
      userId: req.user.id
    });
    await teacher.save();
    res.status(201).json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update teacher
router.put('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });
    res.json(teacher);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete teacher
router.delete('/:id', auth, async (req, res) => {
  try {
    const teacher = await Teacher.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!teacher) return res.status(404).json({ error: 'Teacher not found' });

    // Remove teacher from groups
    await Group.updateMany(
      { teacherId: teacher._id },
      { $unset: { teacherId: 1 } }
    );

    res.json({ message: 'Teacher deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
