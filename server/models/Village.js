const mongoose = require('mongoose');

const villageSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: [true, 'Village name is required'],
    trim: true
  },
  region: {
    type: String,
    required: [true, 'Region is required'],
    trim: true
  },
  famousFor: {
    type: String,
    trim: true
  },
  location: {
    name: {
      type: String,
      trim: true
    },
    image: {
      type: String,
      trim: true
    }
  },
  description: {
    type: [String],
    default: []
  },
  makingVideo: {
    type: String,
    trim: true
  },
  impactDescription: {
    type: [String],
    default: []
  },
  impactImages: {
    type: [String],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Village', villageSchema);

