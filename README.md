# MERN-Auth Application

A complete MERN stack authentication application with React frontend and Node.js backend.

## Features

### Backend Features (Node.js/Express)
- ✅ User Registration with Email Verification
- ✅ User Login with JWT Authentication
- ✅ Email OTP Verification (via Brevo API)
- ✅ Password Reset with OTP
- ✅ Protected Routes with Middleware
- ✅ Session Management with HTTP-only Cookies
- ✅ MongoDB Database Integration
- ✅ Smart OTP System (handles new/existing users)

### Frontend Features (React/TypeScript)
- ✅ Responsive Design with Modern UI
- ✅ Login/Register Forms
- ✅ Email Verification Interface
- ✅ Password Reset Flow
- ✅ Protected Dashboard
- ✅ Real-time Toast Notifications
- ✅ Context-based State Management
- ✅ TypeScript Support

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local or cloud)
- Brevo (formerly Sendinblue) API account

### Backend Setup
1. Navigate to server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file with:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   BREVO_API_KEY=your_brevo_api_key
   SENDER_EMAIL=your_verified_sender_email
   ```

4. Start the server:
   ```bash
   node server.js
   ```

   Server runs on: `http://localhost:4000`

### Frontend Setup
1. Navigate to client directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the React app:
   ```bash
   npm start
   ```

   React app runs on: `http://localhost:3000`

## API Endpoints

### Authentication Routes (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `POST /logout` - User logout
- `POST /send-otp` - Send OTP (smart: new/existing users)
- `POST /verify-email` - Verify email with OTP
- `POST /send-password-reset-otp` - Send password reset OTP
- `POST /reset-password` - Reset password with OTP
- `POST /is-authenticated` - Check authentication status
- `GET /test-email` - Test email functionality
- `GET /list-users` - List all users (debugging)

### User Routes (`/api/user`)
- `GET /profile` - Get user profile (protected)

## How to Test

### 1. Registration Flow
1. Go to `http://localhost:3000/register`
2. Fill in name, email, and password
3. Click "Register"
4. Check email for OTP verification code
5. Enter OTP on verification page
6. Account is verified and you're logged in

### 2. Login Flow
1. Go to `http://localhost:3000/login`
2. Enter email and password
3. Click "Login"
4. Redirected to dashboard

### 3. Password Reset Flow
1. Click "Forgot Password" on login page
2. Enter email address
3. Check email for reset OTP
4. Enter OTP and new password
5. Password is reset successfully

### 4. Dashboard Features
- View account information
- Check verification status
- Quick action buttons
- Feature checklist

## File Structure

```
mern-auth/
├── server/                 # Backend
│   ├── config/
│   │   ├── mongodb.js     # Database connection
│   │   └── nodemailer.js  # Email configuration
│   ├── controllers/
│   │   ├── authController.js  # Auth logic
│   │   └── userController.js  # User logic
│   ├── middleware/
│   │   └── userAuth.js    # JWT middleware
│   ├── models/
│   │   └── userModel.js   # User schema
│   ├── routes/
│   │   ├── authRoutes.js  # Auth endpoints
│   │   └── userRoutes.js  # User endpoints
│   ├── .env              # Environment variables
│   ├── package.json
│   └── server.js         # Main server file
├── client/                # Frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── context/       # Auth context
│   │   ├── App.tsx        # Main App component
│   │   └── App.css        # Global styles
│   ├── package.json
│   └── public/
└── README.md
```

## Technologies Used

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- bcryptjs for password hashing
- Brevo API for email sending
- cookie-parser for session management

### Frontend
- React 18 with TypeScript
- React Router for navigation
- Axios for API calls
- React Toastify for notifications
- Context API for state management
- Modern CSS with gradients and animations

## Security Features

- ✅ Password hashing with bcrypt
- ✅ JWT tokens stored in HTTP-only cookies
- ✅ OTP expiration (15 minutes for password reset, 24 hours for email verification)
- ✅ Protected routes with middleware
- ✅ Input validation and sanitization
- ✅ CORS configuration
- ✅ Secure cookie settings

## Environment Variables

```env
# Database
MONGODB_URI=mongodb://localhost:27017/mern-auth

# JWT
JWT_SECRET=your-super-secret-jwt-key

# Email (Brevo API)
BREVO_API_KEY=your-brevo-api-key
SENDER_EMAIL=your-verified-sender@email.com

# Server
PORT=4000
NODE_ENV=development
```

## Notes

- Make sure both backend (port 4000) and frontend (port 3000) are running
- Check email spam/junk folder for OTP emails
- OTP codes are also logged to server console for development
- Use existing email addresses or register new ones through the app
- MongoDB connection required for user data storage

## Support

If you encounter any issues:
1. Check server console for error messages
2. Verify environment variables are set correctly
3. Ensure MongoDB is running and accessible
4. Check Brevo API key is valid and sender email is verified
5. Clear browser cookies if authentication issues persist

Happy coding! 🚀
