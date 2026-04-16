// backend/models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  plan: { 
    type: String, 
    enum: ['trial', 'start', 'pro', 'business'],
    default: 'trial'
  },
  subscriptionEnd: { 
    type: Date,
    default: null
  },
  role: { 
    type: String, 
    enum: ['admin', 'user'],
    default: 'user'
  },
  storeName: { 
    type: String, 
    default: 'EduCore' 
  },
  theme: { 
    type: String, 
    enum: ['light', 'dark'],
    default: 'light'
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
