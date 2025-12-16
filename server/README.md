# LAKARCADE Backend API

A Node.js/Express backend API for the LAKARCADE platform with user authentication and registration.

## Features

- ✅ User Registration with validation
- ✅ User Login with JWT authentication
- ✅ Password hashing with bcrypt
- ✅ Input validation with express-validator
- ✅ MongoDB integration with Mongoose
- ✅ CORS enabled for frontend integration
- ✅ Error handling and logging
- ✅ User profile management

## Setup Instructions

### 1. Install Dependencies

```bash
cd server
npm install
```

### 2. Environment Configuration

Create a `.env` file in the server directory:

```bash
cp env.example .env
```

Update the `.env` file with your configuration:

```env
# Server Configuration
NODE_ENV=development
PORT=5000

# Database
MONGODB_URI=mongodb://localhost:27017/lakarcade

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_here_make_it_long_and_secure
JWT_EXPIRE=7d

# Client URL (for CORS)
CLIENT_URL=http://localhost:3000
```

### 3. Database Setup

Make sure MongoDB is running on your system:

```bash
# If using local MongoDB
mongod

# Or if using MongoDB Atlas, update MONGODB_URI in .env
```

### 4. Start the Server

```bash
# Development mode (with auto-restart)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication

#### Register User
- **POST** `/api/users/register`
- **Body**: `{ firstName, lastName, email, phone, password, confirmPassword, agreeToTerms }`

#### Login User
- **POST** `/api/users/login`
- **Body**: `{ email, password }`

#### Get User Profile
- **GET** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`

#### Update User Profile
- **PUT** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ firstName, lastName, phone, address, preferences }`

#### Change Password
- **PUT** `/api/users/change-password`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: `{ currentPassword, newPassword }`

#### Delete User Account
- **DELETE** `/api/users/profile`
- **Headers**: `Authorization: Bearer <token>`

### Health Check
- **GET** `/api/health`

## Database Schema

### User Model
```javascript
{
  firstName: String (required, 2-50 chars)
  lastName: String (required, 2-50 chars)
  email: String (required, unique, valid email)
  phone: String (required, valid phone)
  password: String (required, min 8 chars, hashed)
  role: String (enum: 'user', 'admin', 'artisan', default: 'user')
  isActive: Boolean (default: true)
  isEmailVerified: Boolean (default: false)
  profilePicture: String (optional)
  address: Object (optional)
  preferences: Object (optional)
  lastLogin: Date (optional)
  createdAt: Date (auto)
  updatedAt: Date (auto)
}
```

## Security Features

- Password hashing with bcrypt (12 rounds)
- JWT token authentication
- Input validation and sanitization
- CORS protection
- Error handling without sensitive data exposure

## Development

### Project Structure
```
server/
├── controllers/     # Route handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API routes
├── validators/      # Input validation
├── utils/           # Utility functions
├── index.js         # Main server file
└── package.json     # Dependencies
```

### Adding New Features

1. Create model in `models/`
2. Add validation in `validators/`
3. Create controller in `controllers/`
4. Define routes in `routes/`
5. Update main server file if needed

## Testing

Test the API endpoints using tools like Postman or curl:

```bash
# Test registration
curl -X POST http://localhost:5000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "password": "Password123",
    "confirmPassword": "Password123",
    "agreeToTerms": true
  }'

# Test login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**
   - Ensure MongoDB is running
   - Check MONGODB_URI in .env file

2. **CORS Issues**
   - Verify CLIENT_URL in .env matches your frontend URL

3. **JWT Token Issues**
   - Ensure JWT_SECRET is set in .env
   - Check token format in Authorization header

4. **Validation Errors**
   - Check request body format
   - Verify all required fields are provided

## Production Deployment

1. Set `NODE_ENV=production`
2. Use a strong JWT_SECRET
3. Configure proper CORS origins
4. Use MongoDB Atlas or production database
5. Set up proper logging and monitoring
