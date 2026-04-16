// backend/models/Student.js
const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema({
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
  phone2: { 
    type: String 
  },
  groups: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Group' 
  }],
  balance: { 
    type: Number, 
    default: 0 
  },
  score: { 
    type: Number, 
    default: 0 
  },
  comment: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'archived'],
    default: 'active' 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Student', studentSchema);