import React, { useState, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

function Login({ onSuccess, onSwitchToRegister }) {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError('Please fill all fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        { email, password }
      );

      login(res.data.user, res.data.token);
      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        background: 'radial-gradient(circle at top right, #0f172a, #020617)',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}
    >
      <div
        className="glass-panel"
        style={{
          padding: '40px 30px',
          width: '100%',
          maxWidth: '400px',
          display: 'flex',
          flexDirection: 'column',
          gap: '24px'
        }}
      >
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '8px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Welcome Back
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Hyperlocal Delivery Dispatcher Portal
          </p>
        </div>

        {error && (
          <div
            className="badge-cancelled"
            style={{
              padding: '12px',
              borderRadius: '8px',
              textTransform: 'none',
              fontSize: '0.85rem',
              fontWeight: 500,
              width: '100%',
              display: 'block',
              textAlign: 'center'
            }}
          >
            {error}
          </div>
        )}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Email Address</label>
            <input
              type="email"
              className="glass-input"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              className="glass-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
            />
          </div>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '14px' }}
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Don't have an account?{' '}
          <span
            onClick={onSwitchToRegister}
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            Register here
          </span>
        </div>

        {/* Admin Demo Credentials Box */}
        <div 
          onClick={() => {
            setEmail('admin1@gmail.com');
            setPassword('rhrrhr');
          }}
          className="glass-panel"
          style={{
            padding: '14px 16px',
            background: 'rgba(14, 165, 233, 0.04)',
            border: '1px dashed rgba(14, 165, 233, 0.25)',
            borderRadius: '12px',
            fontSize: '0.85rem',
            textAlign: 'left',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            marginTop: '8px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(14, 165, 233, 0.08)';
            e.currentTarget.style.borderColor = 'var(--primary)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(14, 165, 233, 0.04)';
            e.currentTarget.style.borderColor = 'rgba(14, 165, 233, 0.25)';
          }}
        >
          <div style={{ fontWeight: 700, color: 'var(--primary)', marginBottom: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>🔑 Admin Demo Account</span>
            <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 6px', borderRadius: '4px', fontWeight: 600 }}>Autofill</span>
          </div>
          <div style={{ color: 'var(--text-muted)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
            <div><strong>Email:</strong> <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>admin1@gmail.com</span></div>
            <div><strong>Password:</strong> <span style={{ color: 'var(--text-main)', fontFamily: 'monospace' }}>rhrrhr</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
