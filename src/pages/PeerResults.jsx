import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import './PersonalResults.css';

const TYPE_DATA = {
  leader: { headline: 'You are a born Leader', sub: 'People follow your vision. You inspire before you instruct.', tag: 'LEADER', emoji: '👑', color: '#ef9f27', glow: 'rgba(239,159,39,0.2)', border: 'rgba(239,159,39,0.35)' },
  manager: { headline: 'You are a natural Manager', sub: 'Teams thrive under you. You turn chaos into coordination.', tag: 'MANAGER', emoji: '🎯', color: '#fac775', glow: 'rgba(250,199,117,0.2)', border: 'rgba(250,199,117,0.35)' },
  ic: { headline: 'You are an Elite Contributor', sub: 'You outthink the room. Your depth is your superpower.', tag: 'ELITE CONTRIBUTOR', emoji: '⚡', color: '#faedda', glow: 'rgba(250,237,218,0.15)', border: 'rgba(250,237,218,0.25)' },
};

function getTopType(scores) {
  const l = parseFloat(scores.leader_score), m = parseFloat(scores.manager_score), ic = parseFloat(scores.ic_score);
  if (l >= m && l >= ic) return 'leader';
  if (m >= l && m >= ic) return 'manager';
  return 'ic';
}

function ScoreRing({ score, color, label, isTop }) {
  const pct = Math.max(0, Math.min(100, ((score - 7) / 3) * 100));
  const r = 38, circ = 2 * Math.PI * r, dash = (pct / 100) * circ;
  return (
    <div className="pr-score-item">
      <div className="pr-ring-wrap" style={{ width: isTop ? 110 : 90, height: isTop ? 110 : 90 }}>
        <svg width={isTop ? 110 : 90} height={isTop ? 110 : 90} viewBox="0 0 90 90">
          <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="7" />
          <circle cx="45" cy="45" r={r} fill="none" stroke={isTop ? color : 'rgba(255,255,255,0.2)'} strokeWidth="7"
            strokeDasharray={`${dash} ${circ}`} strokeLinecap="round" transform="rotate(-90 45 45)" />
        </svg>
        <div className="pr-ring-label">
          <div className="pr-ring-score" style={{ color: isTop ? color : 'rgba(255,255,255,0.5)', fontSize: isTop ? '1.2rem' : '1rem' }}>
            {parseFloat(score).toFixed(2)}
          </div>
        </div>
      </div>
      <div className="pr-score-label" style={{ color: isTop ? color : 'rgba(255,255,255,0.35)', fontSize: isTop ? '0.78rem' : '0.7rem' }}>{label}</div>
    </div>
  );
}

export default function PeerResults() {
  const { rateeId } = useParams();
  const navigate = useNavigate();
  const starsRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get(`/responses/personal-results/peer/${rateeId}`)
      .then(res => setData(res.data))
      .catch(() => setError('Could not load your results. Please try again.'))
      .finally(() => setLoading(false));
  }, [rateeId]);

  useEffect(() => {
    const c = starsRef.current;
    if (!c) return;
    const ctx = c.getContext('2d');
    let W, H, stars = [], animId;
    function resize() { W = c.width = window.innerWidth; H = c.height = window.innerHeight; }
    resize(); window.addEventListener('resize', resize);
    for (let i = 0; i < 120; i++) stars.push({ x: Math.random(), y: Math.random(), r: Math.random() * 1.3 + 0.2, op: Math.random(), dop: (Math.random() - 0.5) * 0.006, vx: (Math.random() - 0.5) * 0.00005, vy: (Math.random() - 0.5) * 0.00005, col: Math.random() < 0.2 ? '#ef9f27' : 'white' });
    function tick() {
      ctx.clearRect(0, 0, W, H);
      stars.forEach(s => {
        s.x += s.vx; s.y += s.vy;
        if (s.x < 0) s.x = 1; if (s.x > 1) s.x = 0;
        if (s.y < 0) s.y = 1; if (s.y > 1) s.y = 0;
        s.op += s.dop; if (s.op > 1 || s.op < 0.05) s.dop *= -1;
        ctx.beginPath(); ctx.arc(s.x * W, s.y * H, s.r, 0, Math.PI * 2);
        ctx.fillStyle = s.col; ctx.globalAlpha = s.op; ctx.fill();
      });
      ctx.globalAlpha = 1; animId = requestAnimationFrame(tick);
    }
    tick();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  if (loading) return <div className="pr-bg"><canvas ref={starsRef} className="pr-stars" /><p style={{ color: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 1 }}>Loading your real results...</p></div>;
  if (error || !data) return <div className="pr-bg"><canvas ref={starsRef} className="pr-stars" /><p style={{ color: '#e05c5c', position: 'relative', zIndex: 1 }}>{error}</p></div>;

  const { ratee, scores, percentiles, top5, bottom5 } = data;
  const topType = getTopType(scores);
  const type = TYPE_DATA[topType];
  const overallPct = 100 - (parseInt(percentiles?.total_pct) || 0);
  const dims = [
    { key: 'leader', label: 'Leader', score: scores.leader_score },
    { key: 'manager', label: 'Manager', score: scores.manager_score },
    { key: 'ic', label: 'Contributor', score: scores.ic_score },
  ].sort((a, b) => a.key === topType ? -1 : b.key === topType ? 1 : 0);

  return (
    <div className="pr-bg">
      <canvas ref={starsRef} className="pr-stars" />
      <div className="pr-wrapper">
        <div className="pr-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          <span className="pr-logo-dot" style={{ background: type.color }} />
          <span className="pr-logo-text" style={{ color: type.color }}>Mind</span>
          <span className="pr-logo-tag">for You</span>
        </div>
        <div className="pr-hero">
          <div className="pr-emoji">{type.emoji}</div>
          <div className="pr-type-tag" style={{ color: type.color, borderColor: type.border, background: type.glow }}>{type.tag}</div>
          <h1 className="pr-headline" style={{ color: type.color }}>{type.headline}</h1>
          <p className="pr-sub">{type.sub}</p>
          {ratee?.user_name && <p className="pr-name">{ratee.user_name}</p>}
        </div>
        <div className="pr-scores">
          {dims.map(d => <ScoreRing key={d.key} score={d.score} color={type.color} label={d.label} isTop={d.key === topType} />)}
        </div>
        <div className="pr-percentile-card" style={{ borderColor: type.border, boxShadow: `0 0 40px ${type.glow}` }}>
          <div className="pr-percentile-label">You rank in the</div>
          <div className="pr-percentile-value" style={{ color: type.color }}>Top {overallPct}%</div>
          <div className="pr-percentile-sub">of all Mind users</div>
        </div>
        <div className="pr-attributes">
          <div className="pr-attr-col">
            <div className="pr-attr-title" style={{ color: type.color }}>✦ Your Strengths</div>
            {top5.map((a, i) => <div className="pr-attr-tag pr-attr-top" key={i} style={{ background: type.glow, borderColor: type.border, color: type.color }}>{a.name}</div>)}
          </div>
          <div className="pr-attr-col">
            <div className="pr-attr-title" style={{ color: 'rgba(255,255,255,0.35)' }}>↓ Growth Areas</div>
            {bottom5.map((a, i) => <div className="pr-attr-tag pr-attr-bottom" key={i}>{a.name}</div>)}
          </div>
        </div>
        <div className="pr-actions">
          <button className="pr-btn-primary" style={{ background: type.color, color: '#050810' }} onClick={() => navigate('/')}>Back to Mind</button>
        </div>
      </div>
    </div>
  );
}
