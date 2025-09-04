import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard: React.FC = () => {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/login');
    }
  }, [user, loading, navigate]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        <h1>Welcome to Your Dashboard!</h1>
        
        <div className="user-info">
          <h2>Account Information</h2>
          <div className="info-grid">
            <div className="info-item">
              <label>Name:</label>
              <span>{user.name}</span>
            </div>
            <div className="info-item">
              <label>Email:</label>
              <span>{user.email}</span>
            </div>
            <div className="info-item">
              <label>Account Status:</label>
              <span className={`status ${user.isAccountVerified ? 'verified' : 'unverified'}`}>
                {user.isAccountVerified ? '✅ Verified' : '❌ Unverified'}
              </span>
            </div>
            <div className="info-item">
              <label>User ID:</label>
              <span className="user-id">{user._id}</span>
            </div>
          </div>
        </div>

        {!user.isAccountVerified && (
          <div className="verification-notice">
            <h3>⚠️ Email Verification Required</h3>
            <p>Your email is not verified yet. Please check your email for the verification code.</p>
            <button 
              className="verify-button"
              onClick={() => navigate('/verify-email', { 
                state: { 
                  email: user.email,
                  isNewUser: false 
                } 
              })}
            >
              Verify Email Now
            </button>
          </div>
        )}

        <div className="dashboard-actions">
          <h3>Quick Actions</h3>
          <div className="action-buttons">
            <button 
              className="action-button primary"
              onClick={() => navigate('/verify-email', { 
                state: { 
                  email: user.email,
                  isNewUser: false 
                } 
              })}
            >
              📧 Verify Email
            </button>
            
            <button 
              className="action-button secondary"
              onClick={() => navigate('/reset-password')}
            >
              🔒 Change Password
            </button>
            
            <button 
              className="action-button danger"
              onClick={handleLogout}
            >
              🚪 Logout
            </button>
          </div>
        </div>

        <div className="dashboard-stats">
          <h3>Authentication Features Tested</h3>
          <div className="features-list">
            <div className="feature-item">✅ User Registration</div>
            <div className="feature-item">✅ Email/Password Login</div>
            <div className="feature-item">✅ JWT Authentication</div>
            <div className="feature-item">✅ Email OTP Verification</div>
            <div className="feature-item">✅ Password Reset</div>
            <div className="feature-item">✅ Protected Routes</div>
            <div className="feature-item">✅ Session Management</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
