require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');
const nftProductRoutes = require('./routes/nftProductRoutes');
const productRoutes = require('./routes/productRoutes');
const villageRoutes = require('./routes/villageRoutes');
const artisanRoutes = require('./routes/artisanRoutes');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors({ origin: 'http://localhost:3000' }));
app.use(express.json());

// Routes
app.use('/api/users', userRoutes);
app.use('/api/nft-products', nftProductRoutes);
app.use('/api/products', productRoutes);
app.use('/api/villages', villageRoutes);
app.use('/api/artisans', artisanRoutes);

// 404 handler for API routes (must be after all API routes)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/')) {
    return res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  }
  next();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI, {
  serverSelectionTimeoutMS: 10000, // 10 seconds
  socketTimeoutMS: 45000, // 45 seconds
})
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('📊 Database:', mongoose.connection.db.databaseName);
  console.log('🌐 Host:', mongoose.connection.host);
})
.catch(err => {
  console.error('❌ MongoDB Connection Error:', err.message);
  console.error('\n⚠️  IMPORTANT: Please check the following:');
  console.error('1. Your IP address is whitelisted in MongoDB Atlas');
  console.error('   Go to: Network Access → Add IP Address (or use 0.0.0.0/0 for all IPs)');
  console.error('2. The connection string in .env file is correct');
  console.error('3. The database user has proper permissions');
  process.exit(1);
});

// Start server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
