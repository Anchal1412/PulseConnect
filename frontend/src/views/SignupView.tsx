import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signup } from '../controllers/authController';
import '../Signup.css';

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await signup(form);
      alert('Signup successful. You can now log in.');
      navigate('/login');
    } catch (err: any) {
      console.error('Signup error', err);
      alert(err.response?.data?.message || err.message || 'Signup failed');
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <h2 className="signup-title">Create Account</h2>

        <form className="signup-form" onSubmit={handleSubmit}>
          <input name="name" placeholder="Name" onChange={handleChange} required />
          <input name="email" type="email" placeholder="Email" onChange={handleChange} required />
          <input name="password" type="password" placeholder="Password" onChange={handleChange} required />
          <button type="submit">Signup</button>
        </form>

        <p className="signup-note">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;