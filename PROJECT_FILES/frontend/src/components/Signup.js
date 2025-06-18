import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    id: '',
    name: '',
    email: '',
    password: '',
    department: '',
    year: '',
    role: 'student',
  });

  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (!formData.email || !formData.password || !formData.name || !formData.id) {
        throw new Error('Please fill in all required fields');
      }

      if (formData.password.length < 6) {
        throw new Error('Password must be at least 6 characters');
      }

      await axios.post('http://localhost:8000/signup', formData);

      navigate('/login', {
        state: { successMessage: 'Registration successful! Please login.' },
      });
    } catch (err) {
      const errorMessage = err.response?.data?.detail || err.message;
      setError(errorMessage || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span role="img" aria-label="party" style={{ fontSize: '2rem' }}>🎉</span>
        <h2>Welcome to EventMaster</h2>
        <h3>Sign Up</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSignup}>
          <div className="form-group">
            <input
              type="text"
              name="id"
              placeholder="Student ID"
              value={formData.id}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="password"
              name="password"
              placeholder="Password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="text"
              name="department"
              placeholder="Department"
              value={formData.department}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="number"
              name="year"
              placeholder="Year"
              value={formData.year}
              onChange={handleChange}
              required
              min="1"
              max="5"
            />
          </div>
          <div className="form-group">
            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div className="form-group">
            <button type="submit" disabled={isLoading}>
              {isLoading ? 'Registering...' : 'Sign Up'}
            </button>
          </div>
        </form>

        <div className="auth-footer">
          Already have an account?{' '}
          <a href="/login" style={{ color: '#fff', textDecoration: 'underline' }}>Login</a>
        </div>
      </div>
    </div>
  );
}

export default Signup;
