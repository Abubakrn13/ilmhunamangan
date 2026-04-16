// backend/models/Group.js
const mongoose = require('mongoose');

const groupSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true 
  },
  name: { 
    type: String, 
    required: true 
  },
  teacherId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Teacher' 
  },
  subject: { 
    type: String 
  },
  price: { 
    type: Number, 
    default: 0 
  },
  room: { 
    type: String 
  },
  days: [{ 
    type: String 
  }],
  time: { 
    type: String 
  },
  students: [{ 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Student' 
  }],
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

module.exports = mongoose.model('Group', groupSchema);
