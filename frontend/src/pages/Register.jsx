import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Register({ onSuccess, onSwitchToLogin, initialRole = 'customer', onBackToHome }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState(initialRole);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setRole(initialRole);
  }, [initialRole]);

  const handleRegister = async () => {
    if (!name || !email || !password || !phone) {
      setError('Please fill all fields, including phone number');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/register`,
        { name, email, password, role, phone }
      );

      if (onSuccess) onSuccess();

    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
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
          maxWidth: '430px',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px'
        }}
      >
        {onBackToHome && (
          <div 
            onClick={onBackToHome}
            style={{ 
              alignSelf: 'flex-start', 
              color: 'var(--text-muted)', 
              fontSize: '0.85rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              transition: 'color 0.2s',
              marginBottom: '-8px'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
          >
            ← Back to Home
          </div>
        )}
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ fontSize: '2rem', fontWeight: 800, marginBottom: '6px', background: 'linear-gradient(135deg, #0ea5e9, #6366f1)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            Create Account
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Register to join the hyperlocal network
          </p>
        </div>

        {error && (
          <div
            className="badge-cancelled"
            style={{
              padding: '10px',
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

        <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Full Name</label>
            <input
              type="text"
              className="glass-input"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Email Address</label>
            <input
              type="email"
              className="glass-input"
              placeholder="john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Phone Number</label>
            <input
              type="text"
              className="glass-input"
              placeholder="+1 (555) 000-0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Password</label>
            <input
              type="password"
              className="glass-input"
              placeholder="Min 6 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '4px' }}>Account Role</label>
            <select
              className="glass-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">Customer</option>
              <option value="rider">Rider</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleRegister}
          disabled={loading}
          className="btn-primary"
          style={{ width: '100%', padding: '14px', marginTop: '10px' }}
        >
          {loading ? 'Creating Account...' : 'Register'}
        </button>

        <div style={{ textAlign: 'center', fontSize: '0.88rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <span
            onClick={onSwitchToLogin}
            style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}
          >
            Sign In here
          </span>
        </div>

        {/* Admin Demo Info Box */}
        <div 
          style={{
            padding: '12px 14px',
            background: 'rgba(14, 165, 233, 0.03)',
            border: '1px dashed rgba(14, 165, 233, 0.2)',
            borderRadius: '10px',
            fontSize: '0.8rem',
            textAlign: 'center',
            color: 'var(--text-muted)',
            marginTop: '8px'
          }}
        >
          💡 Need Admin access? Go to <span onClick={onSwitchToLogin} style={{ color: 'var(--primary)', cursor: 'pointer', fontWeight: 600, textDecoration: 'underline' }}>Sign In</span> and use the pre-configured Demo Admin Account.
        </div>
      </div>
    </div>
  );
}

export default Register;
