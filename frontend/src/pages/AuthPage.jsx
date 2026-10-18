import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api.js';
import './AuthPage.css';

export default function AuthPage() {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);

  // Form fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState('student');
  const [roleField, setRoleField] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (isLogin) {
        // Login payload with role
        const res = await loginUser({ email, password, role });
        if (res?.token) {
          localStorage.setItem('sr_token', res.token);
          // Agar backend se role na aaye toh selected role preserve karein
          const userData = res.user ? { ...res.user, role: res.user.role || role } : { role };
          localStorage.setItem('sr_user', JSON.stringify(userData));
          navigate('/dashboard');
        } else {
          setError(res?.message || 'Login failed. Check credentials and role.');
        }
      } else {
        // Register payload
        const res = await registerUser({
          email,
          password,
          fullName,
          role,
          roleField,
        });
        if (res?.token) {
          localStorage.setItem('sr_token', res.token);
          localStorage.setItem('sr_user', JSON.stringify(res.user));
          navigate('/dashboard');
        } else {
          setSuccess('Registration successful! Please sign in with your role.');
          setIsLogin(true);
        }
      }
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || 'Authentication error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        {/* Header */}
        <div className="auth-header">
          <span className="auth-header-icon">🛡️</span>
          <h1>Satark Rahein</h1>
          <p>
            {isLogin
              ? 'Campus Disaster Preparedness Access'
              : 'Create your Student / Teacher Safety Account'}
          </p>
        </div>

        {/* Tab Toggle */}
        <div className="auth-tabs">
          <button
            type="button"
            className={`auth-tab-btn ${isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(true);
              setError(null);
            }}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`auth-tab-btn ${!isLogin ? 'active' : ''}`}
            onClick={() => {
              setIsLogin(false);
              setError(null);
            }}
          >
            Register
          </button>
        </div>

        {/* Alerts */}
        {error && <div className="auth-error">{error}</div>}
        {success && <div className="auth-success">{success}</div>}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="auth-form" style={{ marginTop: error || success ? '14px' : '0' }}>
          
          {/* Register only: Full Name */}
          {!isLogin && (
            <div className="auth-field">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="e.g., Aman Sharma"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>
          )}

          {/* Institutional Email */}
          <div className="auth-field">
            <label>Institutional Email</label>
            <input
              type="email"
              placeholder="name@institute.edu.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password */}
          <div className="auth-field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Role Selection (Ab Sign In aur Register Dono me dikhega) */}
          <div className="auth-field">
            <label>Campus Role</label>
            <select value={role} onChange={(e) => setRole(e.target.value)}>
              <option value="student">Student</option>
              <option value="teacher">Safety Teacher</option>
              <option value="admin">Campus Administrator</option>
            </select>
          </div>

          {/* Register only: Student ID / Dept */}
          {!isLogin && (
            <div className="auth-field">
              <label>{role === 'student' ? 'Student ID / Section' : 'Department'}</label>
              <input
                type="text"
                placeholder={role === 'student' ? 'e.g., CSE-B 2026' : 'e.g., Civil Engg'}
                value={roleField}
                onChange={(e) => setRoleField(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Authenticating...' : isLogin ? `Access Dashboard as ${role.toUpperCase()} →` : 'Complete Registration →'}
          </button>
        </form>

      </div>
    </div>
  );
}