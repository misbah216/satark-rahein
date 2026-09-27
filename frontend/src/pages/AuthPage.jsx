import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser, registerUser } from '../api.js';
import './AuthPage.css';

const ROLES = [
  { id: 'student', label: 'Student' },
  { id: 'teacher', label: 'Teacher' },
  { id: 'admin', label: 'Admin' },
];

// Extra field per role, shown only on Register
const ROLE_FIELD = {
  student: { name: 'rollNumber', label: 'Roll number / class' },
  teacher: { name: 'staffId', label: 'Staff ID / subject' },
  admin: { name: 'instituteCode', label: 'Institute code' },
};

export default function AuthPage() {
  const navigate = useNavigate();
  const [role, setRole] = useState('student');
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  const [form, setForm] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (mode === 'register' && form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    try {
      const payload =
        mode === 'login'
          ? { email: form.email, password: form.password, role }
          : {
              fullName: form.fullName,
              email: form.email,
              password: form.password,
              role,
              roleField: form[ROLE_FIELD[role].name],
            };

      const { token, user } = mode === 'login' ? await loginUser(payload) : await registerUser(payload);

      localStorage.setItem('sr_token', token);
      localStorage.setItem('sr_user', JSON.stringify(user));
      navigate('/dashboard');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const extraField = ROLE_FIELD[role];

  return (
    <div className="auth">
      <div className="auth__card">
        <p className="auth__eyebrow">Satark Rahein</p>
        <h1 className="auth__title">{mode === 'login' ? 'Sign in' : 'Create account'}</h1>

        <div className="auth__roles" role="tablist" aria-label="Select role">
          {ROLES.map((r) => (
            <button
              key={r.id}
              role="tab"
              aria-selected={role === r.id}
              className={`auth__role${role === r.id ? ' is-active' : ''}`}
              onClick={() => setRole(r.id)}
              type="button"
            >
              {r.label}
            </button>
          ))}
        </div>

        <form className="auth__form" onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label className="auth__field">
              <span>Full name</span>
              <input name="fullName" type="text" onChange={handleChange} required />
            </label>
          )}

          <label className="auth__field">
            <span>Email</span>
            <input name="email" type="email" onChange={handleChange} required />
          </label>

          {mode === 'register' && (
            <label className="auth__field">
              <span>{extraField.label}</span>
              <input name={extraField.name} type="text" onChange={handleChange} required />
            </label>
          )}

          <label className="auth__field">
            <span>Password</span>
            <input name="password" type="password" onChange={handleChange} required />
          </label>

          {mode === 'register' && (
            <label className="auth__field">
              <span>Confirm password</span>
              <input name="confirmPassword" type="password" onChange={handleChange} required />
            </label>
          )}

          {error && <p className="auth__error">{error}</p>}

          <button className="auth__submit" type="submit" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : `Register as ${role}`}
          </button>
        </form>

        <p className="auth__switch">
          {mode === 'login' ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button
            type="button"
            className="auth__switch-btn"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? 'Register' : 'Sign in'}
          </button>
        </p>
      </div>
    </div>
  );
}
