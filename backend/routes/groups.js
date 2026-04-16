// backend/routes/groups.js
const express = require('express');
const Group = require('../models/Group');
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

// Get all groups for user
router.get('/', auth, async (req, res) => {
  try {
    const groups = await Group.find({ userId: req.user.id })
      .populate('teacherId', 'name')
      .populate('students', 'name phone')
      .sort({ createdAt: -1 });
    res.json(groups);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single group
router.get('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('teacherId', 'name')
      .populate('students', 'name phone');
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create group
router.post('/', auth, async (req, res) => {
  try {
    const group = new Group({
      ...req.body,
      userId: req.user.id
    });
    await group.save();
    res.status(201).json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update group
router.put('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!group) return res.status(404).json({ error: 'Group not found' });
    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete group
router.delete('/:id', auth, async (req, res) => {
  try {
    const group = await Group.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    // Remove group from students
    await Student.updateMany(
      { groups: group._id },
      { $pull: { groups: group._id } }
    );

    res.json({ message: 'Group deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add student to group
router.post('/:id/students/:studentId', auth, async (req, res) => {
  try {
    const group = await Group.findOne({ _id: req.params.id, userId: req.user.id });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    const student = await Student.findOne({ _id: req.params.studentId, userId: req.user.id });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    if (!group.students.includes(student._id)) {
      group.students.push(student._id);
      await group.save();

      if (!student.groups.includes(group._id)) {
        student.groups.push(group._id);
        await student.save();
      }
    }

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove student from group
router.delete('/:id/students/:studentId', auth, async (req, res) => {
  try {
    const group = await Group.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $pull: { students: req.params.studentId } },
      { new: true }
    );
    if (!group) return res.status(404).json({ error: 'Group not found' });

    await Student.findOneAndUpdate(
      { _id: req.params.studentId },
      { $pull: { groups: group._id } }
    );

    res.json(group);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;