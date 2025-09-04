import express from 'express';
import userAuth from '../middleware/userAuth.js';
import {
  login,
  logout,
  register,
  testEmail,
  listUsers,
  sendVerificationOtp,
  sendOTP,
  verifyEmail,
  isAuthenticated,
  resetPassword,
  sendPasswordResetOtp
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/logout', logout);
authRouter.get('/test-email', testEmail);
authRouter.get('/list-users', listUsers);

// Real send-verification-otp route (for existing users only)
authRouter.post('/send-verification-otp', sendVerificationOtp);

// Smart OTP route (handles both new and existing emails)
authRouter.post('/send-otp', sendOTP);

// Verify OTP route
authRouter.post('/verify-email', verifyEmail);

// Authentication check route (requires middleware)
authRouter.post('/is-authenticated', userAuth, isAuthenticated);

// Reset password route
authRouter.post('/send-password-reset-otp', sendPasswordResetOtp);
authRouter.post('/reset-password', resetPassword);

export default authRouter;
