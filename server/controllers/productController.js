const Product = require('../models/Product');

// Create Product
exports.createProduct = async (req, res) => {
  try {
    // Process careInstruction - convert string to array if needed
    if (req.body.careInstruction && typeof req.body.careInstruction === 'string') {
      req.body.careInstruction = req.body.careInstruction.split('\n').filter(line => line.trim());
    }
    
    // Process images - convert comma-separated string to array if needed
    if (req.body.images && typeof req.body.images === 'string') {
      req.body.images = req.body.images.split(',').map(img => img.trim()).filter(img => img);
    }

    // Generate ID if not provided
    if (!req.body.id) {
      req.body.id = `product-${Date.now()}`;
    }

    const product = new Product(req.body);
    await product.save();
    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Create Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Product',
      error: error.message
    });
  }
};

// Get all Products
exports.getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Get Products error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Products',
      error: error.message
    });
  }
};

// Get single Product
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findOne({ id: req.params.id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Get Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Product',
      error: error.message
    });
  }
};

// Update Product
exports.updateProduct = async (req, res) => {
  try {
    // Process careInstruction - convert string to array if needed
    if (req.body.careInstruction && typeof req.body.careInstruction === 'string') {
      req.body.careInstruction = req.body.careInstruction.split('\n').filter(line => line.trim());
    }
    
    // Process images - convert comma-separated string to array if needed
    if (req.body.images && typeof req.body.images === 'string') {
      req.body.images = req.body.images.split(',').map(img => img.trim()).filter(img => img);
    }

    const product = await Product.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Update Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Product',
      error: error.message
    });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findOneAndDelete({ id: req.params.id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete Product error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Product',
      error: error.message
    });
  }
};

