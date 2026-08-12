import React, { useState } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Mail, Lock, Shield, Eye, EyeOff, User, Building, ArrowLeft, Key } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { handleLogin, handleRegister, isDarkMode, token } = useAppContext();
  const navigate = useNavigate();

  // If already logged in, redirect to dashboard
  React.useEffect(() => {
    if (token) {
      navigate('/dashboard');
    }
  }, [token, navigate]);
  
  // mode: 'login', 'register', 'forgot'
  const [mode, setMode] = useState('login');
  
  // Login states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // Register states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [companyName, setCompanyName] = useState('');

  // UI States
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const onLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const successLogin = await handleLogin(email, password);
      if (successLogin) {
        navigate('/dashboard');
      } else {
        setError('Invalid email or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onRegisterSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const successReg = await handleRegister(firstName, lastName, regEmail, regPassword, companyName);
      if (successReg) {
        setSuccess('Registration successful! Logging in...');
      } else {
        setError('Registration failed. Email might already be registered.');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const onForgotSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simulate password reset request
    setTimeout(() => {
      setSuccess('Reset instructions sent to your email address!');
      setLoading(false);
      setTimeout(() => {
        setSuccess('');
        setMode('login');
      }, 3000);
    }, 1500);
  };

  return (
    <div className={`auth-page ${mode === 'register' ? 'signup-page' : ''}`} style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      minHeight: '100vh',
      width: '100vw',
      background: 'var(--bg-primary)',
      padding: '24px',
      position: 'fixed',
      inset: 0,
      zIndex: 1000,
      overflowY: 'auto'
    }}>
      <div className="glass-panel animate-fade-in" style={{
        width: '100%',
        maxWidth: '460px',
        padding: '40px',
        display: 'flex',
        flexDirection: 'column',
        gap: '24px',
        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
        margin: 'auto'
      }}>
        {/* Header */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px', textAlign: 'center' }}>
          <img src="/vgrow-logo.jpg" alt="VGROW Logo" style={{ width: '60px', height: '60px', borderRadius: '16px', objectFit: 'cover' }} />
          <div>
            <h2 className="logo-title" style={{ fontSize: '24px', fontWeight: '800', color: 'var(--text-primary)' }}>
              {mode === 'login' ? 'Welcome Back' : mode === 'register' ? 'Create SaaS Account' : 'Recover Password'}
            </h2>
            <p className="logo-subtitle" style={{ fontSize: '13px', marginTop: '4px' }}>
              {mode === 'login' 
                ? 'Log in to access your premium workspace' 
                : mode === 'register' 
                ? 'Get started with VGROW CRM in seconds' 
                : 'Enter your email to receive a password reset link'}
            </p>
          </div>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid var(--accent-rose)',
            color: 'var(--accent-rose)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.1)',
            border: '1px solid var(--accent-emerald)',
            color: 'var(--accent-emerald)',
            padding: '12px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {success}
          </div>
        )}

        {/* LOGIN MODE */}
        {mode === 'login' && (
          <form onSubmit={onLoginSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-field">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="vaibhav@vgrow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '40px', width: '100%' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '12px',
                    top: '12px',
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-muted)',
                    cursor: 'pointer'
                  }}
                >
                  {showPassword ? <EyeOff style={{ width: '16px', height: '16px' }} /> : <Eye style={{ width: '16px', height: '16px' }} />}
                </button>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                <input type="checkbox" style={{ accentColor: 'var(--accent-indigo)' }} />
                Remember me
              </label>
              <button
                type="button"
                onClick={() => { setError(''); setSuccess(''); setMode('forgot'); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', fontWeight: '600', cursor: 'pointer', padding: 0 }}
              >
                Forgot Password?
              </button>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: '12px',
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                width: '100%',
                marginTop: '10px'
              }}
            >
              {loading ? 'Logging in...' : 'Sign In'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => { setError(''); setSuccess(''); setMode('register'); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Sign Up
              </button>
            </div>
          </form>
        )}

        {/* REGISTER MODE */}
        {mode === 'register' && (
          <form onSubmit={onRegisterSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div className="form-field">
              <label className="form-label">Company Name</label>
              <div style={{ position: 'relative' }}>
                <Building style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Acme Corporation"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-group-grid" style={{ gap: '12px' }}>
              <div className="form-field">
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
              <div className="form-field">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  required
                  className="form-input"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  style={{ width: '100%' }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Email Address</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="john.doe@acme.com"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>
            </div>

            <div className="form-field">
              <label className="form-label">Password</label>
              <div style={{ position: 'relative' }}>
                <Lock style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  className="form-input"
                  placeholder="Create password"
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  style={{ paddingLeft: '40px', paddingRight: '40px', width: '100%' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: '12px',
                fontWeight: '700',
                width: '100%',
                marginTop: '10px'
              }}
            >
              {loading ? 'Creating account...' : 'Create Admin Workspace'}
            </button>

            <div style={{ textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)', marginTop: '8px' }}>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setError(''); setSuccess(''); setMode('login'); }}
                style={{ background: 'none', border: 'none', color: 'var(--accent-indigo)', fontWeight: '700', cursor: 'pointer', padding: 0 }}
              >
                Sign In
              </button>
            </div>
          </form>
        )}

        {/* FORGOT PASSWORD MODE */}
        {mode === 'forgot' && (
          <form onSubmit={onForgotSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div className="form-field">
              <label className="form-label">Account Email</label>
              <div style={{ position: 'relative' }}>
                <Mail style={{ position: 'absolute', left: '12px', top: '12px', width: '16px', height: '16px', color: 'var(--text-muted)' }} />
                <input
                  type="email"
                  required
                  className="form-input"
                  placeholder="john.doe@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  style={{ paddingLeft: '40px', width: '100%' }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary"
              disabled={loading}
              style={{
                padding: '12px',
                fontWeight: '700',
                width: '100%',
                marginTop: '10px'
              }}
            >
              {loading ? 'Sending link...' : 'Send Recovery Link'}
            </button>

            <button
              type="button"
              onClick={() => { setError(''); setSuccess(''); setMode('login'); }}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                fontWeight: '700',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '8px',
                fontSize: '13px'
              }}
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </form>
        )}


      </div>
    </div>
  );
}
