import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './PersonalResults.css';

const TYPE_DATA = {
  leader: {
    headline: 'You are a born Leader',
    sub: 'People follow your vision. You inspire before you instruct.',
    tag: 'LEADER',
    emoji: '👑',
    color: '#ef9f27',
    glow: 'rgba(239,159,39,0.25)',
    border: 'rgba(239,159,39,0.4)',
  },
  manager: {
    headline: 'You are a natural Manager',
    sub: 'Teams thrive under you. You turn chaos into coordination.',
    tag: 'MANAGER',
    emoji: '🎯',
    color: '#fac775',
    glow: 'rgba(250,199,117,0.25)',
    border: 'rgba(250,199,117,0.4)',
  },
  ic: {
    headline: 'You are an Elite Contributor',
    sub: 'You outthink the room. Your depth is your superpower.',
    tag: 'INDEPENDENT CONTRIBUTOR',
    emoji: '⚡',
    color: '#faedda',
    glow: 'rgba(250,237,218,0.2)',
    border: 'rgba(250,237,218,0.3)',
  },
};

function getTopType(scores) {
  const { leader_score, manager_score, ic_score } = scores;
  if (leader_score >= manager_score && leader_score >= ic_score) return 'leader';
  if (manager_score >= leader_score && manager_score >= ic_score) return 'manager';
  return 'ic';
}

function ScoreRing({ score, color }) {
  const pct = ((score - 7) / 3) * 100;
  const r = 54, circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <div className="pr-ring-wrap">
      <svg width="130" height="130" viewBox="0 0 130 130">
        <circle cx="65" cy="65" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="10" />
        <circle cx="65" cy="65" r={r} fill="none" stroke={color} strokeWidth="10"
          strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
          transform="rotate(-90 65 65)" style={{ transition: 'stroke-dasharray 1s ease' }} />
      </svg>
      <div className="pr-ring-label">
        <div className="pr-ring-score" style={{ color }}>{score?.toFixed(2)}</div>
        <div className="pr-ring-max">/10</div>
      </div>
    </div>
  );
}

export default function PersonalResults() {
  const { rateeId } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get(`/responses/results/${rateeId}`)
      .then(res => setData(res.data))
      .finally(() => setLoading(false));
  }, [rateeId]);

  if (loading) return (
    <div className="pr-bg">
      <p style={{ color: 'rgba(255,255,255,0.4)' }}>Calculating your Mind profile...</p>
    </div>
  );
  if (!data) return null;

  const { ratee, scores, percentiles } = data;
  const topType = getTopType(scores);
  const type = TYPE_DATA[topType];


  const overallPercentile = percentiles.total_percentile || 0;

  return (
    <div className="pr-bg">
      <canvas id="pr-stars" className="pr-stars" />

      <div className="pr-wrapper">
        <div className="pr-logo">
          <span className="logo-dot" style={{ background: type.color }} />
          <span className="logo-text" style={{ color: type.color }}>Mind</span>
        </div>

        <div className="pr-hero">
          <div className="pr-emoji">{type.emoji}</div>
          <div className="pr-type-tag" style={{ color: type.color, borderColor: type.border, background: type.glow }}>
            {type.tag}
          </div>
          <h1 className="pr-headline" style={{ color: type.color }}>{type.headline}</h1>
          <p className="pr-sub">{type.sub}</p>
          <p className="pr-name">{ratee?.user_name}</p>
        </div>

        <div className="pr-scores">
          {[
            { label: 'Leader', score: scores.leader_score },
            { label: 'Manager', score: scores.manager_score },
            { label: 'Contributor', score: scores.ic_score },
          ].map(d => (
            <div className="pr-score-item" key={d.label}>
              <ScoreRing score={d.score} color={d.label === ['Leader','Manager','Contributor'][[topType === 'leader' ? 0 : topType === 'manager' ? 1 : 2]] ? type.color : 'rgba(255,255,255,0.25)'} />
              <div className="pr-score-label">{d.label}</div>
            </div>
          ))}
        </div>

        <div className="pr-percentile-card" style={{ borderColor: type.border, boxShadow: `0 0 40px ${type.glow}` }}>
          <div className="pr-percentile-label">You rank in the</div>
          <div className="pr-percentile-value" style={{ color: type.color }}>Top {100 - overallPercentile}%</div>
          <div className="pr-percentile-sub">of all Mind users</div>
        </div>

        <div className="pr-actions">
          <button className="pr-btn-primary" style={{ background: type.color, color: '#050810' }}
            onClick={() => navigate('/assessment')}>
            Review someone else
          </button>
          <button className="pr-btn-ghost" onClick={() => navigate('/')}>
            ← Back to Mind
          </button>
        </div>
      </div>
    </div>
  );
}
