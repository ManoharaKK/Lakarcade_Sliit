const mongoose = require('mongoose');

const nftProductSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price must be positive']
  },
  image: {
    type: String,
    required: [true, 'Image URL is required'],
    trim: true
  },
  collectionName: {
    type: String,
    required: [true, 'Collection name is required'],
    trim: true
  },
  rarity: {
    type: String,
    required: [true, 'Rarity is required'],
    trim: true,
    enum: ['Common', 'Rare', 'Epic', 'Legendary', 'Mythic']
  },
  tokenId: {
    type: String,
    sparse: true,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('NFTProduct', nftProductSchema);

