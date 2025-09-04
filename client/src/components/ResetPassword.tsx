import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const ResetPassword: React.FC = () => {
  const [step, setStep] = useState<'email' | 'reset'>('email');
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);

  const { sendPasswordResetOTP, resetPassword } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSendOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email) {
      toast.error('Please enter your email');
      return;
    }

    setLoading(true);
    
    try {
      const success = await sendPasswordResetOTP(formData.email);
      
      if (success) {
        toast.success('Password reset OTP sent to your email!');
        setStep('reset');
      } else {
        toast.error('Email not found. Please check your email address.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.otp || !formData.newPassword || !formData.confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    
    try {
      const success = await resetPassword(formData.email, formData.otp, formData.newPassword);
      
      if (success) {
        toast.success('Password reset successfully! Please login with your new password.');
        navigate('/login');
      } else {
        toast.error('Invalid or expired OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setLoading(true);
    
    try {
      const success = await sendPasswordResetOTP(formData.email);
      
      if (success) {
        toast.success('OTP resent successfully!');
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Reset Your Password</h2>
        
        {step === 'email' ? (
          <>
            <div className="reset-info">
              <p>Enter your email address and we'll send you a code to reset your password.</p>
            </div>
            
            <form onSubmit={handleSendOTP} className="auth-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Sending...' : 'Send Reset Code'}
              </button>
            </form>
          </>
        ) : (
          <>
            <div className="reset-info">
              <p>We've sent a reset code to:</p>
              <strong>{formData.email}</strong>
              <p>Enter the code and your new password below.</p>
            </div>
            
            <form onSubmit={handleResetPassword} className="auth-form">
              <div className="form-group">
                <label htmlFor="otp">Reset Code</label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={formData.otp}
                  onChange={(e) => setFormData(prev => ({
                    ...prev,
                    otp: e.target.value.replace(/\D/g, '').slice(0, 6)
                  }))}
                  placeholder="Enter 6-digit code"
                  maxLength={6}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="newPassword">New Password</label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleChange}
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  required
                />
              </div>

              <button 
                type="submit" 
                className="auth-button"
                disabled={loading}
              >
                {loading ? 'Resetting...' : 'Reset Password'}
              </button>
            </form>

            <div className="auth-links">
              <p>
                Didn't receive the code? 
                <button 
                  type="button"
                  className="link-button"
                  onClick={handleResendOTP}
                  disabled={loading}
                >
                  Resend Code
                </button>
              </p>
              <p>
                <button 
                  type="button"
                  className="link-button"
                  onClick={() => setStep('email')}
                >
                  Back to Email
                </button>
              </p>
            </div>
          </>
        )}

        <div className="auth-links">
          <p>
            Remember your password? <Link to="/login">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
