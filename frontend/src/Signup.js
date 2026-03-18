import React, { useState } from 'react';
import './Signup.css';

const Signup = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setMessage('Name is required');
      setMessageType('error');
      return false;
    }

    if (!formData.email.trim()) {
      setMessage('Email is required');
      setMessageType('error');
      return false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setMessage('Please enter a valid email address');
      setMessageType('error');
      return false;
    }

    if (formData.password.length < 6) {
      setMessage('Password must be at least 6 characters long');
      setMessageType('error');
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('Account created successfully! 🎉');
        setMessageType('success');
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
      } else {
        setMessage(data.message || 'Something went wrong. Please try again.');
        setMessageType('error');
      }
    } catch (error) {
      setMessage('Network error. Please check your connection and try again.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-decoration">
        <div className="floating-shape shape-1"></div>
        <div className="floating-shape shape-2"></div>
        <div className="floating-shape shape-3"></div>
      </div>

      <div className="signup-container">
        <div className="signup-header">
          <h1>Join BaseSystem</h1>
          <p>Create your account and get started</p>
        </div>

        <form className="signup-form" onSubmit={handleSubmit}>
          {message && (
            <div className={`message ${messageType}`}>
              <span>{messageType === 'success' ? '✓' : '⚠'}</span>
              {message}
            </div>
          )}

          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
              <span className="input-icon">👤</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
              <span className="input-icon">✉</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
              <span className="input-icon">🔒</span>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
              />
              <span className="input-icon">🔐</span>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <>
                <div className="spinner"></div>
                Creating Account...
              </>
            ) : (
              <>
                <span>🚀</span>
                Create Account
              </>
            )}
          </button>
        </form>

        <div className="signup-footer">
          <p>
            Already have an account?{' '}
            <a href="#login">Sign in here</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;