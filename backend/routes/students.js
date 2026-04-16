// backend/routes/students.js
const express = require('express');
const Student = require('../models/Student');
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

// Get all students for user
router.get('/', auth, async (req, res) => {
  try {
    const students = await Student.find({ userId: req.user.id })
      .populate('groups', 'name')
      .sort({ createdAt: -1 });
    res.json(students);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single student
router.get('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, userId: req.user.id })
      .populate('groups', 'name');
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create student
router.post('/', auth, async (req, res) => {
  try {
    const student = new Student({
      ...req.body,
      userId: req.user.id
    });
    await student.save();
    res.status(201).json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update student
router.put('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete student
router.delete('/:id', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!student) return res.status(404).json({ error: 'Student not found' });
    
    // Remove student from groups
    await Group.updateMany(
      { students: student._id },
      { $pull: { students: student._id } }
    );
    
    res.json({ message: 'Student deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add bonus/score to student
router.post('/:id/bonus', auth, async (req, res) => {
  try {
    const { points, reason } = req.body;
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $inc: { score: parseInt(points) || 0 } },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });
    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add student to group
router.post('/:id/groups/:groupId', auth, async (req, res) => {
  try {
    const student = await Student.findOne({ _id: req.params.id, userId: req.user.id });
    if (!student) return res.status(404).json({ error: 'Student not found' });

    const group = await Group.findOne({ _id: req.params.groupId, userId: req.user.id });
    if (!group) return res.status(404).json({ error: 'Group not found' });

    if (!student.groups.includes(group._id)) {
      student.groups.push(group._id);
      await student.save();

      if (!group.students.includes(student._id)) {
        group.students.push(student._id);
        await group.save();
      }
    }

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove student from group
router.delete('/:id/groups/:groupId', auth, async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { $pull: { groups: req.params.groupId } },
      { new: true }
    );
    if (!student) return res.status(404).json({ error: 'Student not found' });

    await Group.findOneAndUpdate(
      { _id: req.params.groupId },
      { $pull: { students: student._id } }
    );

    res.json(student);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
