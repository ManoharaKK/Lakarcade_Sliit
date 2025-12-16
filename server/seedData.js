const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import User model
const User = require('./models/User');

// Sample data
const sampleUsers = [
  {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1234567890',
    password: 'Password123',
    role: 'user',
    isEmailVerified: true,
    address: {
      street: '123 Main Street',
      city: 'Colombo',
      state: 'Western Province',
      zipCode: '00100',
      country: 'Sri Lanka'
    },
    preferences: {
      newsletter: true,
      notifications: true
    }
  },
  {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane.smith@example.com',
    phone: '+1234567891',
    password: 'Password123',
    role: 'artisan',
    isEmailVerified: true,
    address: {
      street: '456 Artisan Lane',
      city: 'Kandy',
      state: 'Central Province',
      zipCode: '20000',
      country: 'Sri Lanka'
    },
    preferences: {
      newsletter: true,
      notifications: false
    }
  },
  {
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@lakarcade.com',
    phone: '+1234567892',
    password: 'Admin123',
    role: 'admin',
    isEmailVerified: true,
    address: {
      street: '789 Admin Street',
      city: 'Colombo',
      state: 'Western Province',
      zipCode: '00100',
      country: 'Sri Lanka'
    },
    preferences: {
      newsletter: true,
      notifications: true
    }
  },
  {
    firstName: 'Priya',
    lastName: 'Fernando',
    email: 'priya.fernando@example.com',
    phone: '+94771234567',
    password: 'Password123',
    role: 'user',
    isEmailVerified: true,
    address: {
      street: '321 Temple Road',
      city: 'Anuradhapura',
      state: 'North Central Province',
      zipCode: '50000',
      country: 'Sri Lanka'
    },
    preferences: {
      newsletter: false,
      notifications: true
    }
  },
  {
    firstName: 'Kumar',
    lastName: 'Perera',
    email: 'kumar.perera@example.com',
    phone: '+94771234568',
    password: 'Password123',
    role: 'artisan',
    isEmailVerified: false,
    address: {
      street: '654 Craft Street',
      city: 'Galle',
      state: 'Southern Province',
      zipCode: '80000',
      country: 'Sri Lanka'
    },
    preferences: {
      newsletter: true,
      notifications: true
    }
  }
];

// Connect to database
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lakarcade', {
      dbName: 'lakarcade'
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ Database connection error:', error.message);
    process.exit(1);
  }
};

// Seed the database
const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');
    
    // Clear existing users (optional - remove this if you want to keep existing data)
    await User.deleteMany({});
    console.log('🗑️  Cleared existing users');
    
    // Create sample users
    const createdUsers = [];
    
    for (const userData of sampleUsers) {
      const user = new User(userData);
      await user.save();
      createdUsers.push(user);
      console.log(`✅ Created user: ${user.firstName} ${user.lastName} (${user.email})`);
    }
    
    console.log(`🎉 Successfully seeded ${createdUsers.length} users!`);
    console.log('\n📋 Sample Users Created:');
    console.log('=====================================');
    
    createdUsers.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Phone: ${user.phone}`);
      console.log(`   Role: ${user.role}`);
      console.log(`   City: ${user.address.city}`);
      console.log(`   Verified: ${user.isEmailVerified ? 'Yes' : 'No'}`);
      console.log('   ---------------------------------');
    });
    
    console.log('\n🔐 Login Credentials for Testing:');
    console.log('=====================================');
    console.log('Regular User: john.doe@example.com / Password123');
    console.log('Artisan User: jane.smith@example.com / Password123');
    console.log('Admin User: admin@lakarcade.com / Admin123');
    console.log('Sri Lankan User: priya.fernando@example.com / Password123');
    console.log('Unverified User: kumar.perera@example.com / Password123');
    
    console.log('\n🚀 You can now test your sign-in/sign-up forms!');
    
  } catch (error) {
    console.error('❌ Seeding error:', error);
  } finally {
    mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Run the seeding process
const runSeed = async () => {
  await connectDB();
  await seedDatabase();
};

// Execute if run directly
if (require.main === module) {
  runSeed();
}

module.exports = { seedDatabase, sampleUsers };
