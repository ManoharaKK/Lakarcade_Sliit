const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  viewCount: {
    type: Number,
    default: 0
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  subtitle: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    trim: true,
    enum: ['Wooden Crafts', 'Textiles & Fabric', 'Ceramics & Pottery', 'Jewelry & Accessories', 'Home & Living']
  },
  branches: {
    type: String,
    trim: true,
    enum: ['One Galle face', 'Colombo City Centre Mall', 'Canowin Arcade B', 'Port city Downtown', 'Shangri-La Hambantota']
  },
  price: {
    type: Number,
    required: false,
    min: [0, 'Price must be positive'],
    default: 0
  },
  earlyPrice: {
    type: Number,
    min: [0, 'Early price must be positive']
  },
  discountPercentage: {
    type: Number,
    min: [0, 'Discount must be positive'],
    max: [100, 'Discount cannot exceed 100%']
  },
  salesEndDate: {
    type: Date
  },
  localTaxesIncluded: {
    type: String,
    default: null
  },
  material: {
    type: String,
    trim: true
  },
  dimensions: {
    type: String,
    trim: true
  },
  weight: {
    type: String,
    trim: true
  },
  color: {
    type: String,
    trim: true
  },
  craftTechnique: {
    type: String,
    trim: true
  },
  origin: {
    type: String,
    trim: true
  },
  authenticity: {
    type: String,
    trim: true
  },
  careInstruction: {
    type: [String],
    default: []
  },
  shipping: {
    type: String,
    trim: true
  },
  returnsDescription: {
    type: String,
    trim: true
  },
  images: {
    type: [String],
    default: []
  },
  artisanStory: {
    type: String,
    trim: true
  },
  selectVillage: {
    type: String,
    trim: true
  },
  review: {
    averageRating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0
    },
    totalReviews: {
      type: Number,
      min: [0, 'Total reviews must be positive'],
      default: 0
    },
    reviews: {
      type: [{
        starCount: Number,
        profilePic: String,
        name: String,
        description: String
      }],
      default: []
    }
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

