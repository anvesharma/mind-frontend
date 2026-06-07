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
    if (score >= 9.5) return '#a8f0d8';
    if (score >= 8.5) return '#1db88a';
    if (score >= 7.5) return '#7a9ab5';
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
        <p className="results-sub">Assessment complete</p>

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
            Rate someone else
          </button>
        </div>
      </div>
    </div>
  );
}
