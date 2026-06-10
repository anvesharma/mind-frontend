import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import './GetRated.css';

export default function GetRated() {
  const navigate = useNavigate();
  const location = useLocation();
  const rateeId = location.state?.rateeId;
  const [emails, setEmails] = useState(['', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleEmailChange = (index, value) => {
    const updated = [...emails];
    updated[index] = value.trim().toLowerCase();
    setEmails(updated);
  };

  const validEmails = emails.filter(e => e && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e));
  const hasDuplicates = validEmails.length !== new Set(validEmails).size;
  const canPay = validEmails.length >= 3 && !hasDuplicates;

  const handlePay = async () => {
    if (!canPay) return;
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/social/create-checkout', {
        emails: validEmails,
        rateeId,
      });
      window.location.href = res.data.url;
    } catch (err) {
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
          <p className="gr-sub">Get your <strong>real rating</strong> for just <span className="gr-price">$1.99</span></p>
          <p className="gr-sub2">Send Mind to up to 5 people who know you — unlock what they really think</p>
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
          <div className="gr-emails-title">Who should rate you?</div>
          <div className="gr-emails-sub">Enter up to 5 email addresses — min 3 required to unlock results</div>
          <div className="gr-emails-grid">
            {emails.map((email, i) => (
              <div className="gr-email-row" key={i}>
                <span className="gr-email-num">{i + 1}</span>
                <input
                  className="gr-email-input"
                  type="email"
                  placeholder={i < 3 ? `friend${i + 1}@email.com (required)` : `friend${i + 1}@email.com (optional)`}
                  value={email}
                  onChange={e => handleEmailChange(i, e.target.value)}
                />
              </div>
            ))}
          </div>
          {hasDuplicates && <p className="gr-error">Please remove duplicate email addresses</p>}
          {error && <p className="gr-error">{error}</p>}
          <div className="gr-email-count">
            {validEmails.length < 3
              ? `Enter ${3 - validEmails.length} more email${3 - validEmails.length > 1 ? 's' : ''} to continue`
              : `${validEmails.length} ${validEmails.length === 1 ? 'person' : 'people'} will rate you`}
          </div>
        </div>

        <button
          className={`gr-pay-btn ${canPay ? 'active' : 'disabled'}`}
          onClick={handlePay}
          disabled={!canPay || loading}
        >
          {loading ? 'Redirecting to payment...' : canPay ? 'Pay $1.99 & send →' : 'Enter at least 3 emails to pay'}
        </button>

        <p className="gr-fine-print">One-time payment. No subscription. Results unlock when 3+ people complete your rating (within 7 days).</p>

        <button className="gr-back" onClick={() => navigate(-1)}>← Back to my results</button>
      </div>
    </div>
  );
}
