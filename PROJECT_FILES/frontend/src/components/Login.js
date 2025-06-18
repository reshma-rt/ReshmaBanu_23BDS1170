import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Auth.css';

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // ✅ Fix: Define handleChange
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      console.log("Submitting login...", formData); // Debug

      const res = await axios.post("http://localhost:8000/login", formData);

      console.log("Login response:", res.data); // Debug

      // Store info locally
      localStorage.setItem("email", formData.email);
      localStorage.setItem("role", res.data.role);

      // Redirect based on role
      if (res.data.role === "admin") {
        console.log("Redirecting to admin dashboard");
        navigate("/admin-dashboard");
      } else if (res.data.role === "student") {
        console.log("Redirecting to student dashboard");
        navigate("/student-dashboard");
      } else {
        setError("Unknown user role");
      }
    } catch (err) {
      console.error("Login failed", err);
      setError(err.response?.data?.detail || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <span role="img" aria-label="party" style={{ fontSize: '2rem' }}>🎉</span>
        <h2>Welcome to EventMaster</h2>
        <h3>Login</h3>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={formData.password}
            onChange={handleChange}
          />
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="auth-footer">
          Don't have an account?{' '}
          <a href="/signup" style={{ color: '#fff', textDecoration: 'underline' }}>Sign up</a>
        </div>
      </div>
    </div>
  );
}

export default Login;
