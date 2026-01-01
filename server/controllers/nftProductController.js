const NFTProduct = require('../models/NFTProduct');

// Create NFT Product
exports.createNFTProduct = async (req, res) => {
  try {
    const nftProduct = new NFTProduct(req.body);
    await nftProduct.save();
    res.status(201).json({
      success: true,
      message: 'NFT Product created successfully',
      data: nftProduct
    });
  } catch (error) {
    console.error('Create NFT Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create NFT Product',
      error: error.message
    });
  }
};

// Get all NFT Products
exports.getAllNFTProducts = async (req, res) => {
  try {
    const products = await NFTProduct.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get NFT Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT Products',
      error: error.message
    });
  }
};

// Get single NFT Product
exports.getNFTProduct = async (req, res) => {
  try {
    const product = await NFTProduct.findById(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'NFT Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get NFT Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch NFT Product',
      error: error.message
    });
  }
};

// Update NFT Product
exports.updateNFTProduct = async (req, res) => {
  try {
    const product = await NFTProduct.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'NFT Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'NFT Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update NFT Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update NFT Product',
      error: error.message
    });
  }
};

// Delete NFT Product
exports.deleteNFTProduct = async (req, res) => {
  try {
    const product = await NFTProduct.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'NFT Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'NFT Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete NFT Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete NFT Product',
      error: error.message
    });
  }
};

