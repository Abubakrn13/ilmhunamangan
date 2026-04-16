// backend/routes/attendance.js
const express = require('express');
const Attendance = require('../models/Attendance');
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

// Get attendance records
router.get('/', auth, async (req, res) => {
  try {
    const { groupId, date, studentId } = req.query;
    const query = { userId: req.user.id };
    
    if (groupId) query.groupId = groupId;
    if (studentId) query.studentId = studentId;
    if (date) query.date = new Date(date);

    const attendance = await Attendance.find(query)
      .populate('studentId', 'name')
      .populate('groupId', 'name')
      .sort({ date: -1 });
    res.json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create attendance record
router.post('/', auth, async (req, res) => {
  try {
    const { studentId, groupId, date, status, comment } = req.body;
    
    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      userId: req.user.id,
      studentId,
      groupId,
      date: new Date(date)
    });

    if (existingAttendance) {
      // Update existing
      existingAttendance.status = status || existingAttendance.status;
      existingAttendance.comment = comment || existingAttendance.comment;
      await existingAttendance.save();
      return res.json(existingAttendance);
    }

    const attendance = new Attendance({
      userId: req.user.id,
      studentId,
      groupId,
      date: new Date(date),
      status,
      comment
    });
    await attendance.save();
    res.status(201).json(attendance);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Bulk create attendance
router.post('/bulk', auth, async (req, res) => {
  try {
    const { groupId, date, records } = req.body;
    const results = [];

    for (const record of records) {
      const existingAttendance = await Attendance.findOneAndUpdate(
        {
          userId: req.user.id,
          studentId: record.studentId,
          groupId,
          date: new Date(date)
        },
        {
          status: record.status,
          comment: record.comment
        },
        { new: true, upsert: true }
      );
      results.push(existingAttendance);
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete attendance record
router.delete('/:id', auth, async (req, res) => {
  try {
    const attendance = await Attendance.findOneAndDelete({ 
      _id: req.params.id, 
      userId: req.user.id 
    });
    if (!attendance) return res.status(404).json({ error: 'Attendance not found' });
    res.json({ message: 'Attendance deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
