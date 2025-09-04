import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const VerifyEmail: React.FC = () => {
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);

  const { verifyEmail, sendOTP } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const email = location.state?.email || '';
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const isNewUser = location.state?.isNewUser || false;

  React.useEffect(() => {
    if (!email) {
      toast.error('Email not found. Please try registering again.');
      navigate('/register');
    }
  }, [email, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!otp) {
      toast.error('Please enter the OTP');
      return;
    }

    if (otp.length !== 6) {
      toast.error('OTP must be 6 digits');
      return;
    }

    setLoading(true);
    
    try {
      const success = await verifyEmail(email, otp);
      
      if (success) {
        toast.success('Email verified successfully!');
        navigate('/dashboard');
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
    setResendLoading(true);
    
    try {
      const success = await sendOTP(email);
      
      if (success) {
        toast.success('OTP resent successfully! Please check your email.');
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Verify Your Email</h2>
        
        <div className="verify-info">
          <p>We've sent a 6-digit verification code to:</p>
          <strong>{email}</strong>
          <p>Please enter the code below to verify your email address.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="otp">Verification Code</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit code"
              maxLength={6}
              required
            />
          </div>

          <button 
            type="submit" 
            className="auth-button"
            disabled={loading}
          >
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-links">
          <p>
            Didn't receive the code? 
            <button 
              type="button"
              className="link-button"
              onClick={handleResendOTP}
              disabled={resendLoading}
            >
              {resendLoading ? 'Resending...' : 'Resend OTP'}
            </button>
          </p>
          <p>
            <button 
              type="button"
              className="link-button"
              onClick={() => navigate('/register')}
            >
              Back to Registration
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
