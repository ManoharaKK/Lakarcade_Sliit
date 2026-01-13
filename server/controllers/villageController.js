const Village = require('../models/Village');

// Create Village
exports.createVillage = async (req, res) => {
  try {
    // Process description - convert string to array if needed
    if (req.body.description && typeof req.body.description === 'string') {
      req.body.description = req.body.description.split('\n').filter(line => line.trim());
    }
    
    // Process impactDescription - convert string to array if needed
    if (req.body.impactDescription && typeof req.body.impactDescription === 'string') {
      req.body.impactDescription = req.body.impactDescription.split('\n').filter(line => line.trim());
    }
    
    // Process impactImages - convert comma-separated string to array if needed
    if (req.body.impactImages && typeof req.body.impactImages === 'string') {
      req.body.impactImages = req.body.impactImages.split(',').map(img => img.trim()).filter(img => img);
    }

    // Structure location object
    if (req.body.locationName || req.body.locationImage) {
      req.body.location = {
        name: req.body.locationName || '',
        image: req.body.locationImage || ''
      };
      delete req.body.locationName;
      delete req.body.locationImage;
    }

    // Generate ID if not provided
    if (!req.body.id) {
      req.body.id = `village-${Date.now()}`;
    }

    const village = new Village(req.body);
    await village.save();
    res.status(201).json({
      success: true,
      message: 'Village created successfully',
      data: village
    });
  } catch (error) {
    console.error('Create Village error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create Village',
      error: error.message
    });
  }
};

// Get all Villages
exports.getAllVillages = async (req, res) => {
  try {
    const villages = await Village.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      count: villages.length,
      data: villages
    });
  } catch (error) {
    console.error('Get Villages error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Villages',
      error: error.message
    });
  }
};

// Get single Village
exports.getVillage = async (req, res) => {
  try {
    const village = await Village.findOne({ id: req.params.id });
    if (!village) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }
    res.status(200).json({
      success: true,
      data: village
    });
  } catch (error) {
    console.error('Get Village error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch Village',
      error: error.message
    });
  }
};

// Update Village
exports.updateVillage = async (req, res) => {
  try {
    // Process description - convert string to array if needed
    if (req.body.description && typeof req.body.description === 'string') {
      req.body.description = req.body.description.split('\n').filter(line => line.trim());
    }
    
    // Process impactDescription - convert string to array if needed
    if (req.body.impactDescription && typeof req.body.impactDescription === 'string') {
      req.body.impactDescription = req.body.impactDescription.split('\n').filter(line => line.trim());
    }
    
    // Process impactImages - convert comma-separated string to array if needed
    if (req.body.impactImages && typeof req.body.impactImages === 'string') {
      req.body.impactImages = req.body.impactImages.split(',').map(img => img.trim()).filter(img => img);
    }

    // Structure location object
    if (req.body.locationName || req.body.locationImage) {
      req.body.location = {
        name: req.body.locationName || '',
        image: req.body.locationImage || ''
      };
      delete req.body.locationName;
      delete req.body.locationImage;
    }

    const village = await Village.findOneAndUpdate(
      { id: req.params.id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!village) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Village updated successfully',
      data: village
    });
  } catch (error) {
    console.error('Update Village error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update Village',
      error: error.message
    });
  }
};

// Delete Village
exports.deleteVillage = async (req, res) => {
  try {
    const village = await Village.findOneAndDelete({ id: req.params.id });
    if (!village) {
      return res.status(404).json({
        success: false,
        message: 'Village not found'
      });
    }
    res.status(200).json({
      success: true,
      message: 'Village deleted successfully'
    });
  } catch (error) {
    console.error('Delete Village error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete Village',
      error: error.message
    });
  }
};

