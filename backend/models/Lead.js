// backend/models/Lead.js
const mongoose = require('mongoose');

const leadSchema = new mongoose.Schema({
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
  source: { 
    type: String 
  },
  status: { 
    type: String, 
    enum: ['New', 'Contacted', 'Interested', 'Not Interested', 'Registered'],
    default: 'New' 
  },
  comment: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('Lead', leadSchema);
