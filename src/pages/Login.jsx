import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './Login.css';

const STEPS = { EMAIL: 'email', OTP: 'otp' };

export default function Login({ mode: modeProp }) {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = modeProp || location.state?.mode || 'work';
  const [step, setStep] = useState(STEPS.EMAIL);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (!email || !name) return setError('Please enter your name and email');
    setError('');
    setLoading(true);
    try {
      await api.post('/auth/send-otp', { email });
      setStep(STEPS.OTP);
    } catch {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (!otp) return setError('Please enter the OTP');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/auth/verify-otp', { email, otp, name });
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify(res.data.user));
      localStorage.setItem('mind_mode', mode);
      navigate('/assessment', { state: { mode } });
    } catch {
      setError('Invalid or expired OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-bg">
      <div className="login-card">
        <div className="login-logo">
          <span className="logo-dot" />
          <span className="logo-text">Mind</span>
        </div>

        {step === STEPS.EMAIL ? (
          <form onSubmit={handleSendOtp}>
            <h1 className="login-title">Welcome</h1>
            <p className="login-sub">
              {mode === 'personal'
                ? 'Find out who you really are — rated by people who know you best'
                : 'Discover the mind behind your team'}
            </p>

            <div className="field">
              <label>Your name</label>
              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            <div className="field">
              <label>Your email</label>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Sending...' : 'Send verification code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp}>
            <h1 className="login-title">Check your email</h1>
            <p className="login-sub">We sent a 6-digit code to <strong>{email}</strong></p>

            <div className="field">
              <label>Verification code</label>
              <input
                type="text"
                placeholder="000000"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                maxLength={6}
                className="otp-input"
                autoFocus
              />
            </div>

            {error && <p className="error">{error}</p>}

            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Verifying...' : 'Verify & continue'}
            </button>

            <button
              type="button"
              className="btn-ghost"
              onClick={() => { setStep(STEPS.EMAIL); setError(''); setOtp(''); }}
            >
              ← Back
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
