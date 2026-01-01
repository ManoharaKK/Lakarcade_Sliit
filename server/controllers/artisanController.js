const Artisan = require('../models/Artisan');

// Create Artisan
exports.createArtisan = async (req, res) => {
  try {
    // Process products - convert comma-separated string to array if needed
    if (req.body.products && typeof req.body.products === 'string') {
      req.body.products = req.body.products.split(',').map(p => p.trim()).filter(p => p);
    }
    
    // Process awards - convert string to array if needed
    if (req.body.awards && typeof req.body.awards === 'string') {
      req.body.awards = req.body.awards.split('\n').filter(line => line.trim());
    }

    const artisan = new Artisan(req.body);
    await artisan.save();
    res.status(201).json({
      success: true,
      message: 'Artisan created successfully',
      data: artisan
    });
  } catch (error) {
    console.error('Create Artisan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Artisan',
      error: error.message
    });
  }
};

// Get all Artisans
exports.getAllArtisans = async (req, res) => {
  try {
    const artisans = await Artisan.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: artisans.length,
      data: artisans
    });
  } catch (error) {
    console.error('Get Artisans error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Artisans',
      error: error.message
    });
  }
};

// Get single Artisan
exports.getArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }
    res.status(200).json({
      success: true,
      data: artisan
    });
  } catch (error) {
    console.error('Get Artisan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Artisan',
      error: error.message
    });
  }
};

// Update Artisan
exports.updateArtisan = async (req, res) => {
  try {
    // Process products - convert comma-separated string to array if needed
    if (req.body.products && typeof req.body.products === 'string') {
      req.body.products = req.body.products.split(',').map(p => p.trim()).filter(p => p);
    }
    
    // Process awards - convert string to array if needed
    if (req.body.awards && typeof req.body.awards === 'string') {
      req.body.awards = req.body.awards.split('\n').filter(line => line.trim());
    }

    const artisan = await Artisan.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Artisan updated successfully',
      data: artisan
    });
  } catch (error) {
    console.error('Update Artisan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Artisan',
      error: error.message
    });
  }
};

// Delete Artisan
exports.deleteArtisan = async (req, res) => {
  try {
    const artisan = await Artisan.findByIdAndDelete(req.params.id);
    if (!artisan) {
      return res.status(404).json({
        success: false,
        message: 'Artisan not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Artisan deleted successfully'
    });
  } catch (error) {
    console.error('Delete Artisan error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Artisan',
      error: error.message
    });
  }
};

