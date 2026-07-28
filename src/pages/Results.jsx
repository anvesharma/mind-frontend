import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './Results.css';

const TrialSignupButton = () => {
  const [status, setStatus] = useState('idle'); // idle | loading | needEmail | done | error
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const submit = async (payload) => {
    setStatus('loading');
    try {
      await api.post('/users/trial-signup', payload || {});
      setStatus('done');
    } catch (err) {
      if (err.response?.status === 400 && err.response?.data?.error === 'email_required') {
        setStatus('needEmail');
      } else {
        setStatus('error');
      }
    }
  };

  const handleClick = () => {
    if (status === 'loading' || status === 'done') return;
    submit();
  };

  const handleEmailSubmit = () => {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
    submit({ email: email.trim(), name: name.trim() || undefined });
  };

  if (status === 'done') {
    return (
      <div style={{
        padding: '13px 20px', borderRadius: 'var(--radius)',
        border: '1px solid rgba(29,184,138,0.4)', background: 'rgba(29,184,138,0.1)',
        color: '#1db88a', fontSize: '14px', fontWeight: 600, textAlign: 'center',
        lineHeight: 1.4, whiteSpace: 'nowrap',
      }}>
        ✓ Thanks! We'll reach out shortly.
      </div>
    );
  }

  if (status === 'needEmail') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 240 }}>
        <input
          type="text" placeholder="Your name" value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(29,184,138,0.3)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '14px' }}
        />
        <input
          type="email" placeholder="Your work email" value={email}
          onChange={(e) => setEmail(e.target.value)} autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
          style={{ padding: '11px 14px', borderRadius: 10, border: '1px solid rgba(29,184,138,0.3)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '14px' }}
        />
        <button
          onClick={handleEmailSubmit}
          style={{ padding: '12px 20px', borderRadius: 'var(--radius)', border: 'none', background: '#1db88a', color: '#050810', fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer', whiteSpace: 'nowrap' }}
        >
          Confirm free trial →
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={status === 'loading'}
      style={{
        padding: '13px 24px', borderRadius: 'var(--radius)', border: 'none',
        background: '#1db88a', color: '#050810',
        fontSize: '15px', fontWeight: 700, fontFamily: 'Inter, sans-serif',
        cursor: status === 'loading' ? 'default' : 'pointer', whiteSpace: 'nowrap',
      }}
    >
      {status === 'loading' ? 'Signing up…'
        : status === 'error' ? 'Try again'
        : 'Sign up for free trial →'}
    </button>
  );
};

export default function Results() {
  const { rateeId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/responses/results/${rateeId}`)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [rateeId]);

  if (loading) return (
    <div className="results-bg">
      <p style={{ color: 'var(--text-secondary)' }}>Loading results...</p>
    </div>
  );

  if (!data) return null;

  const { ratee, scores, percentiles } = data;

  const dimensions = [
    { label: 'Leader',                  score: scores.leader_score,  percentile: percentiles.leader_percentile },
    { label: 'Manager',                 score: scores.manager_score, percentile: percentiles.manager_percentile },
    { label: 'Independent Contributor', score: scores.ic_score,      percentile: percentiles.ic_percentile },
  ];

  const getColor = (score) => {
    if (score >= 9.0) return '#a8f0d8';
    if (score >= 7.5) return '#1db88a';
    if (score >= 6.5) return '#7a9ab5';
    return '#e05c5c';
  };

  return (
    <div className="results-bg">
      <div className="results-wrapper">
        <div className="login-logo" style={{ marginBottom: 32 }}>
          <span className="logo-dot" />
          <span className="logo-text">Mind</span>
        </div>

        <h1 className="results-title">{ratee?.user_name}</h1>
        <p className="results-sub">Review complete</p>

        <div className="results-grid">
          {dimensions.map((dim) => (
            <div className="result-card" key={dim.label}>
              <div className="result-label">{dim.label}</div>
              <div className="result-score" style={{ color: getColor(dim.score) }}>
                {dim.score?.toFixed(2)}
                <span className="result-max">/10</span>
              </div>
              <div className="result-percentile">
                <span className="percentile-badge" style={{ borderColor: getColor(dim.score), color: getColor(dim.score) }}>
                  Top {100 - dim.percentile}%
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="total-percentile">
          <span className="total-label">Overall percentile</span>
          <span className="total-value">Top {100 - percentiles.total_percentile}%</span>
        </div>

        <div className="results-actions">
          <TrialSignupButton />
          <button className="btn-secondary" onClick={() => navigate('/assessment')}>
            Review again
          </button>
          <button className="btn-secondary" onClick={() => navigate('/reports')}>
            Sample reports
          </button>
          <a
            href="https://www.discovermind.net/influencer-board.html"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              padding: '13px 20px',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(29,184,138,0.35)',
              background: 'rgba(29,184,138,0.07)',
              color: '#1db88a',
              fontSize: '15px',
              fontWeight: 600,
              textDecoration: 'none',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '1rem' }}>✦</span>
            Join Board of Influencers
          </a>
          <a href="mailto:nova@discovermind.net?subject=Mind%20Feedback&body=Here's%20my%20feedback%20on%20Mind:%0D%0A%0D%0A"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '12px 20px', borderRadius: 12, border: '1px solid rgba(29,184,138,0.3)', color: '#1db88a', fontSize: '15px', fontWeight: 600, textDecoration: 'none', whiteSpace: 'nowrap' }}>
            💬 Share feedback
          </a>
        </div>
      </div>
    </div>
  );
}
