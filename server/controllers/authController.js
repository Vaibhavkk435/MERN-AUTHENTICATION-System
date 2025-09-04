import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import { sendEmailWithBrevo } from '../config/nodemailer.js';

// Register user
export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.json({ success: false, message: "Missing Details" });
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = new userModel({ name, email, password: hashedPassword });
    await user.save();

    // Generate verification OTP
    const verifyOtp = String(Math.floor(100000 + Math.random() * 900000));
    
    // Update user with OTP and expiration
    user.verifyOtp = verifyOtp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000; // 24 hours
    await user.save();

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set cookie and send response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    try {
      await sendEmailWithBrevo(
        email,
        'Verify your email',
        `Your verification code is ${verifyOtp}`
      );
      console.log('✅ Verification email sent successfully to:', email);
      console.log('🔐 OTP sent:', verifyOtp);
    } catch (emailError) {
      console.log('❌ Email sending error:', emailError.message);
      // Still return success but log OTP to console as fallback
      console.log('🔐 FALLBACK - OTP for', email, ':', verifyOtp);
    }

    res.json({ success: true, message: "User registered successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error registering user" });
  }
};

// Login user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.json({ success: false, message: "Email and password are required" });
    }

    // Find user
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Invalid credentials" });
    }

    // Create JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    // Set cookie and send response
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    res.json({ success: true, message: "User logged in successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging in user" });
  }
};

// Logout user
export const logout = async (req, res) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
    });
    res.json({ success: true, message: "User logged out successfully" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error logging out user" });
  }
};

// Test email function
export const testEmail = async (req, res) => {
  try {
    console.log('Testing Brevo API configuration...');
    console.log('BREVO_API_KEY:', process.env.BREVO_API_KEY ? '✅ Set' : '❌ Not set');
    console.log('SENDER_EMAIL:', process.env.SENDER_EMAIL);
    
    await sendEmailWithBrevo(
      process.env.SENDER_EMAIL,
      'Test Email from MERN Auth',
      'This is a test email to verify Brevo API configuration. If you receive this, your setup is working!'
    );
    
    res.json({ success: true, message: "Test email sent successfully via Brevo API!" });
  } catch (error) {
    console.log('Test email error:', error);
    res.json({ success: false, message: "Test email failed", error: error.message });
  }
};

// List users (for debugging only - remove in production)
export const listUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { name: 1, email: 1, isAccountVerified: 1 });
    res.json({ success: true, users: users });
  } catch (error) {
    console.log('List users error:', error);
    res.json({ success: false, message: "Error fetching users" });
  }
};

//Send Verification OTP to the User's Email
export const sendVerificationOtp = async (req, res) => {  
  try{
    const { email } = req.body;
    
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }
    
    const user = await userModel.findOne({ email });
    
    if (!user) {
      return res.json({ 
        success: false, 
        message: "User not found. Please register first.", 
        action: "redirect_to_register" 
      });
    }
    
    if(user.isAccountVerified)
    {
      return res.json({
        success: false,
        message: "Account already verified. You can login directly.",
        action: "redirect_to_login"
      });
    }

    const otp = String(Math.floor(100000 + Math.random() * 900000));

    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000

    await user.save();

    try {
      await sendEmailWithBrevo(
        user.email,
        'Verify your email',
        `Your OTP is ${otp}. It is valid for 24 hours.`
      );
      console.log('✅ OTP email sent successfully to:', user.email);
      console.log('🔐 OTP sent:', otp);
      res.json({success:true,message:"OTP sent to email"});
    } catch (emailError) {
      console.log('❌ Email sending error:', emailError.message);
      console.log('🔐 FALLBACK - OTP for', user.email, ':', otp);
      res.json({success:false,message:"Error sending OTP email", error: emailError.message});
    }
  }
  catch(error)
  {
    console.log('Server error:', error);
    res.json({success:false,message:error.message});
  }
}

export const verifyEmail = async(req,res)=>{
  const {email, otp} = req.body;

  if(!email || !otp)
  {
    return res.json({success:false,message:"Email and OTP are required"});
  }

  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({success:false,message:"User not found"});
    }

    if (user.verifyOtp !== otp) {
      return res.json({success:false,message:"Invalid OTP"});
    }

    if(user.verifyOtpExpireAt < Date.now()) {
      return res.json({success:false,message:"OTP expired"});
    }

    user.isAccountVerified = true;
    user.verifyOtp = undefined;
    user.verifyOtpExpireAt = undefined;

    await user.save();

    console.log('✅ Email verified successfully for:', email);
    res.json({success:true,message:"Email verified successfully"});
  } catch (error) {
    console.log('❌ Email verification error:', error);
    res.json({success:false,message:error.message});
  }
}

// Send OTP - handles both new and existing emails
export const sendOTP = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }
    
    let user = await userModel.findOne({ email });
    let isNewUser = false;
    
    // If user doesn't exist, create new user (like registration)
    if (!user) {
      if (!name || !password) {
        return res.json({ 
          success: false, 
          message: "Name and password required for new user registration" 
        });
      }
      
      // Hash password and create user
      const hashedPassword = await bcrypt.hash(password, 10);
      user = new userModel({ name, email, password: hashedPassword });
      await user.save();
      isNewUser = true;
      console.log('✅ New user created:', email);
    }
    
    // Check if already verified
    if (user.isAccountVerified) {
      return res.json({
        success: false,
        message: "Account already verified. You can login directly.",
        action: "redirect_to_login"
      });
    }
    
    // Generate and save OTP
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.verifyOtp = otp;
    user.verifyOtpExpireAt = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();
    
    // Send email via Brevo API
    try {
      await sendEmailWithBrevo(
        user.email,
        'Verify your email',
        `Your OTP is ${otp}. It is valid for 24 hours.`
      );
      console.log('✅ OTP email sent successfully to:', user.email);
      console.log('🔐 OTP sent:', otp);
      
      res.json({
        success: true,
        message: isNewUser ? "Account created and OTP sent to email" : "OTP sent to email",
        isNewUser: isNewUser
      });
    } catch (emailError) {
      console.log('❌ Email sending error:', emailError.message);
      console.log('🔐 FALLBACK - OTP for', user.email, ':', otp);
      res.json({
        success: false,
        message: "Error sending OTP email", 
        error: emailError.message
      });
    }
  } catch (error) {
    console.log('Server error:', error);
    res.json({ success: false, message: error.message });
  }
};

// Check if user is authenticated
export const isAuthenticated = async(req,res)=>{
  try {
    const userId = req.user.id;
    const user = await userModel.findById(userId);
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    res.json({ success: true, message: "User is authenticated", user });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error checking authentication" });
  }
};

//Send password reset OTP to the user's email

export const sendPasswordResetOtp = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.json({ success: false, message: "Email is required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    const otp = String(Math.floor(100000 + Math.random() * 900000));
    user.resetOtp = otp;
    user.resetOtpExpireAt = Date.now() + 15 * 60 * 1000;  // 15 minutes
    await user.save();
    try {
      await sendEmailWithBrevo(
        user.email,
        'Password Reset OTP',
        `Your OTP for password reset is ${otp}. It is valid for 1 hour.`
      );
      console.log('✅ Password reset OTP sent successfully to:', user.email);
      res.json({ success: true, message: "Password reset OTP sent to email" });
    } catch (emailError) {
      console.log('❌ Email sending error:', emailError.message);
      console.log('🔐 FALLBACK - OTP for', user.email, ':', otp);
      res.json({
        success: false,
        message: "Error sending password reset OTP email",
        error: emailError.message
      });
    }
  } catch (error) {
    console.log('Server error:', error);
    res.json({ success: false, message: error.message });
  }
};

//Reset user password using OTP
export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
      return res.json({ success: false, message: "Email, OTP and new password are required" });
    }
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "User not found" });
    }
    if (user.resetOtp === "" || user.resetOtp !== otp || user.resetOtpExpireAt < Date.now()) {
      return res.json({ success: false, message: "Invalid or expired OTP" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    user.password = hashedPassword;
    user.resetOtp = ' ';
    user.resetOtpExpireAt = 0;
    await user.save();
    res.json({ success: true, message: "Password reset successfully" });
  } catch (error) {
    console.log('Server error:', error);
    res.json({ success: false, message: error.message });
  }
};
import userAuth from '../middleware/userAuth.js';