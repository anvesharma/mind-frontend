import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './GetRated.css';

export default function GetRated() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const rateeId = location.state?.rateeId || user.user_id;
  const [friends, setFriends] = useState([
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
    { name: '', email: '' },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (index, field, value) => {
    const updated = [...friends];
    updated[index][field] = value.trim();
    setFriends(updated);
  };

  const validFriends = friends.filter(f => f.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email));
  const emails = validFriends.map(f => f.email.toLowerCase());
  const hasDuplicates = emails.length !== new Set(emails).size;
  const canPay = validFriends.length >= 3 && !hasDuplicates;

  const handlePay = async () => {
    if (!canPay) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/social/create-checkout', {
        emails: validFriends.map(f => ({ email: f.email.toLowerCase(), name: f.name || f.email.split('@')[0] })),
        rateeId,
        userName: user.user_name,
      });
      window.location.href = res.data.url;
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gr-bg">
      <div className="gr-wrapper">
        <div className="gr-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="gr-logo-dot" />
          <span className="gr-logo-text">Mind</span>
          <span className="gr-logo-tag">for You</span>
        </div>

        <div className="gr-hero">
          <div className="gr-emoji">🔥</div>
          <h1 className="gr-headline">Are you a born Leader?<br />A great Manager?<br />An exceptional Contributor?</h1>
          <p className="gr-sub">Get your <strong>real review</strong> for just <span className="gr-price">$1.99</span></p>
          <p className="gr-sub2">Send Mind to up to 5 people who know you — Discover who you really are</p>
        </div>

        <div className="gr-what-you-get">
          <div className="gr-what-title">What you get for $1.99</div>
          <div className="gr-what-items">
            <div className="gr-what-item">
              <span className="gr-what-icon">🎯</span>
              <div>
                <div className="gr-what-name">Real L, M, IC scores</div>
                <div className="gr-what-desc">Reviewed by people who actually know you</div>
              </div>
            </div>
            <div className="gr-what-item">
              <span className="gr-what-icon">🌍</span>
              <div>
                <div className="gr-what-name">Global percentile ranking</div>
                <div className="gr-what-desc">See how you compare to people worldwide</div>
              </div>
            </div>
            <div className="gr-what-item">
              <span className="gr-what-icon">✨</span>
              <div>
                <div className="gr-what-name">Your top 5 talents</div>
                <div className="gr-what-desc">What makes you genuinely shine</div>
              </div>
            </div>
            <div className="gr-what-item">
              <span className="gr-what-icon">📈</span>
              <div>
                <div className="gr-what-name">5 growth areas</div>
                <div className="gr-what-desc">Know exactly where to level up</div>
              </div>
            </div>
          </div>
        </div>

        <div className="gr-emails-section">
          <div className="gr-emails-title">Who should review you?</div>
          <div className="gr-emails-sub">Enter up to 5 people — min 3 required to unlock results (min)</div>
          <div className="gr-emails-grid">
            {friends.map((friend, i) => (
              <div className="gr-friend-row" key={i}>
                <span className="gr-email-num">{i + 1}</span>
                <div className="gr-friend-inputs">
                  <input
                    className="gr-email-input gr-name-input"
                    type="text"
                    placeholder={i < 3 ? `Name (required)` : `Name (optional)`}
                    value={friend.name}
                    onChange={e => handleChange(i, 'name', e.target.value)}
                  />
                  <input
                    className="gr-email-input"
                    type="email"
                    placeholder={i < 3 ? `Email (required)` : `Email (optional)`}
                    value={friend.email}
                    onChange={e => handleChange(i, 'email', e.target.value)}
                  />
                </div>
              </div>
            ))}
          </div>
          {hasDuplicates && <p className="gr-error">Please remove duplicate email addresses</p>}
          {error && <p className="gr-error">{error}</p>}
          <div className="gr-email-count">
            {validFriends.length < 3
              ? `Enter ${3 - validFriends.length} more email${3 - validFriends.length > 1 ? 's' : ''} to continue`
              : `${validFriends.length} ${validFriends.length === 1 ? 'person' : 'people'} will review you`}
          </div>
        </div>

        <button
          className={`gr-pay-btn ${canPay ? 'active' : 'disabled'}`}
          onClick={handlePay}
          disabled={!canPay || loading}
        >
          {loading ? 'Redirecting to payment...' : canPay ? 'Pay $1.99 & send →' : 'Enter at least 3 emails to pay'}
        </button>

        <p className="gr-fine-print">One-time payment. No subscription. Results unlock when 3+ people complete your review (within 7 days).</p>
        <button className="gr-back" onClick={() => navigate(-1)}>← Back to my results</button>
      </div>
    </div>
  );
}
