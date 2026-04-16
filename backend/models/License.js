// backend/models/License.js
const mongoose = require('mongoose');

const licenseSchema = new mongoose.Schema({
  code: { 
    type: String, 
    required: true,
    unique: true 
  },
  plan: { 
    type: String, 
    enum: ['trial', 'start', 'pro', 'business'],
    required: true 
  },
  type: { 
    type: String, 
    enum: ['month', 'year'],
    required: true 
  },
  days: { 
    type: Number, 
    required: true 
  },
  used: { 
    type: Boolean,
    default: false 
  },
  usedBy: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    default: null 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

module.exports = mongoose.model('License', licenseSchema);
