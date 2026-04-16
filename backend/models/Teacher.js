// backend/models/Teacher.js
const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  phone: { 
    type: String 
  },
  salary: { 
    type: Number, 
    default: 0 
  },
  commission: { 
    type: Number, 
    default: 0 
  },
  subjects: [{ 
    type: String 
  }],
  status: { 
    type: String, 
    enum: ['active', 'inactive'],
    default: 'active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);