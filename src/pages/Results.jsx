import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './Results.css';

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
          <button className="btn-primary" onClick={() => navigate('/assessment')}>
            Review someone else
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
              marginTop: 4,
              padding: '12px 20px',
              borderRadius: 'var(--radius)',
              border: '1px solid rgba(29,184,138,0.35)',
              background: 'rgba(29,184,138,0.07)',
              color: '#1db88a',
              fontSize: '0.9rem',
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            <span style={{ fontSize: '1rem' }}>✦</span>
            Join Board of Influencers
          </a>
        </div>
      </div>
    </div>
  );
}
