const mongoose = require('mongoose');

const artisanSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Artisan name is required'],
    trim: true
  },
  village: {
    type: String,
    required: [true, 'Village is required'],
    trim: true
  },
  specialty: {
    type: String,
    trim: true
  },
  experience: {
    type: Number,
    min: [0, 'Experience must be positive']
  },
  bio: {
    type: String,
    trim: true
  },
  profileImage: {
    type: String,
    trim: true
  },
  products: {
    type: [String],
    default: []
  },
  awards: {
    type: [String],
    default: []
  },
  contact: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Artisan', artisanSchema);

