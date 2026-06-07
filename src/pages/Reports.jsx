import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Reports.css';

const COMPANY = 'Apex Systems';

const TALENT = [
  { name: 'Michelle B', team: 'Pre Sales',        l: 9.7, m: 8.2, ic: 8.9, strengths: ['Resilience','Storytelling','Vision'],        gaps: ['Discipline','Critical Thinking','Coordination'] },
  { name: 'Tyler D',    team: 'Customer Success', l: 9.5, m: 8.8, ic: 9.1, strengths: ['Strategic Thinking','Integrity','Influence'],  gaps: ['Humility','Consistency','Planning'] },
  { name: 'Matthew L',  team: 'Engineering',      l: 9.4, m: 9.2, ic: 9.6, strengths: ['Problem Solving','Logic','Innovation'],        gaps: ['Compassion','Storytelling','Coaching'] },
  { name: 'Sara K',     team: 'Product',          l: 9.1, m: 9.4, ic: 8.7, strengths: ['Decision Making','Planning','Ownership'],      gaps: ['Courage','Inspiration','Creativity'] },
  { name: 'Jason K',    team: 'Sales',            l: 7.2, m: 7.8, ic: 7.5, strengths: ['Confidence','Negotiation','Communication'],    gaps: ['Discipline','Ethical Behaviour','Consistency'] },
  { name: 'Leon B',     team: 'Customer Success', l: 7.5, m: 7.3, ic: 7.9, strengths: ['Curiosity','Creativity','Logic'],              gaps: ['Compassion','Humility','Coaching'] },
  { name: 'Larry J',    team: 'Engineering',      l: 7.6, m: 7.1, ic: 8.1, strengths: ['Execution','Diligence','Ownership'],           gaps: ['Critical Thinking','Consistency','Awareness'] },
  { name: 'Anna M',     team: 'HR',               l: 8.3, m: 8.9, ic: 7.8, strengths: ['Compassion','Listening','Trustworthiness'],    gaps: ['Strategic Thinking','Decision Making','Influence'] },
];

const TEAMS = [
  { name: 'Sales',            avg: 9.3, thi: [8.6,8.9,9.1,9.3,9.0,9.2,9.4,9.1,9.3,9.5,9.3,9.3], strengths: ['Storytelling','Negotiation','Integrity'],          gaps: ['Resilience','Trustworthiness'] },
  { name: 'Engineering',      avg: 9.1, thi: [8.2,8.4,8.7,8.9,9.0,8.8,9.1,9.0,9.2,9.1,9.0,9.1], strengths: ['Problem Solving','Logic','Innovation'],             gaps: ['Compassion','Storytelling'] },
  { name: 'Customer Success', avg: 8.9, thi: [8.0,8.2,8.5,8.7,8.6,8.8,8.9,8.7,9.0,8.8,8.9,8.9], strengths: ['Compassion','Listening','Ethical Behaviour'],       gaps: ['Discipline','Critical Thinking'] },
  { name: 'Product',          avg: 8.7, thi: [7.8,8.0,8.2,8.4,8.3,8.5,8.6,8.8,8.7,8.6,8.8,8.7], strengths: ['Decision Making','Planning','Strategic Thinking'],  gaps: ['Creativity','Courage'] },
  { name: 'Design',           avg: 8.4, thi: [7.5,7.7,8.0,8.1,8.2,8.0,8.3,8.2,8.4,8.3,8.5,8.4], strengths: ['Creativity','Innovation','Awareness'],              gaps: ['Discipline','Consistency'] },
  { name: 'HR',               avg: 8.2, thi: [7.9,8.0,8.1,8.0,8.2,8.1,8.3,8.2,8.1,8.3,8.2,8.2], strengths: ['Compassion','Trustworthiness','Humility'],          gaps: ['Strategic Thinking','Influence'] },
];

const MANAGERS = [
  { name: 'Anna M',     team: 'HR',               score: 8.9, trend: 'up',   flag: false },
  { name: 'Sara K',     team: 'Product',          score: 9.4, trend: 'up',   flag: false },
  { name: 'Michelle B', team: 'Pre Sales',        score: 8.2, trend: 'up',   flag: false },
  { name: 'Tyler D',    team: 'Customer Success', score: 8.8, trend: 'flat', flag: false },
  { name: 'Leon B',     team: 'Customer Success', score: 7.3, trend: 'down', flag: true  },
  { name: 'Larry J',    team: 'Engineering',      score: 7.1, trend: 'down', flag: true  },
  { name: 'Jason K',    team: 'Sales',            score: 7.8, trend: 'flat', flag: true  },
];

const PROFILE = {
  name: 'Tyler D', team: 'Customer Success',
  l: 9.5, m: 8.8, ic: 9.1, percentile: 95,
  attributes: [
    { name: 'Strategic Thinking', value: 9.8 },
    { name: 'Integrity',          value: 9.6 },
    { name: 'Influence',          value: 9.5 },
    { name: 'Vision',             value: 9.4 },
    { name: 'Inspiration',        value: 9.3 },
    { name: 'Ownership',          value: 9.2 },
    { name: 'Trustworthiness',    value: 9.1 },
    { name: 'Communication',      value: 9.0 },
    { name: 'Courage',            value: 8.9 },
    { name: 'Decision Making',    value: 8.8 },
    { name: 'Problem Solving',    value: 8.7 },
    { name: 'Negotiation',        value: 8.5 },
    { name: 'Coaching',           value: 8.3 },
    { name: 'Resilience',         value: 8.1 },
    { name: 'Adaptability',       value: 7.9 },
    { name: 'Listening',          value: 7.8 },
    { name: 'Awareness',          value: 7.7 },
    { name: 'Humility',           value: 7.4 },
    { name: 'Consistency',        value: 7.3 },
    { name: 'Planning',           value: 7.1 },
  ],
};

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const TEAM_COLORS = ['#1db88a','#4a8fa8','#a8f0d8','#7a9ab5','#3d6e85','#ccd9e0'];

function RadarChart({ attributes }) {
  const cx = 220, cy = 220, r = 155;
  const n = attributes.length;

  const angleFor = (i) => (i / n) * 2 * Math.PI - Math.PI / 2;

  const pointAt = (i, ratio) => {
    const angle = angleFor(i);
    return [cx + ratio * r * Math.cos(angle), cy + ratio * r * Math.sin(angle)];
  };

  const gridLevels = [
    { ratio: 0.33, label: '7.0' },
    { ratio: 0.67, label: '8.5' },
    { ratio: 1.00, label: '10' },
  ];

  const dataPath = attributes.map((a, i) => {
    const ratio = (a.value - 7) / 3;
    const [x, y] = pointAt(i, ratio);
    return `${i === 0 ? 'M' : 'L'}${x},${y}`;
  }).join(' ') + ' Z';

  return (
    <svg viewBox="0 0 440 440" width="100%" style={{ maxWidth: 440 }}>
      {/* Grid polygons */}
      {gridLevels.map(({ ratio, label }, gi) => {
        const path = attributes.map((_, i) => {
          const [x, y] = pointAt(i, ratio);
          return `${i === 0 ? 'M' : 'L'}${x},${y}`;
        }).join(' ') + ' Z';
        return (
          <g key={gi}>
            <path d={path} fill="none" stroke="#1a3a5c" strokeWidth="1" />
            {/* Label on right side */}
            <text
              x={cx + ratio * r + 6}
              y={cy}
              fontSize="9"
              fill="#3a5570"
              dominantBaseline="middle"
            >{label}</text>
          </g>
        );
      })}

      {/* Spokes */}
      {attributes.map((_, i) => {
        const [x, y] = pointAt(i, 1);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#1a3a5c" strokeWidth="1" />;
      })}

      {/* Data polygon */}
      <path d={dataPath} fill="rgba(29,184,138,0.12)" stroke="#1db88a" strokeWidth="2" />

      {/* Data dots + value labels */}
      {attributes.map((a, i) => {
        const ratio = (a.value - 7) / 3;
        const [dx, dy] = pointAt(i, ratio);
        const angle = angleFor(i);
        const labelOffset = 14;
        const lx = cx + (ratio * r + labelOffset) * Math.cos(angle);
        const ly = cy + (ratio * r + labelOffset) * Math.sin(angle);
        return (
          <g key={i}>
            <circle cx={dx} cy={dy} r="3" fill="#1db88a" />
            <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle"
              fontSize="8" fill="#1db88a" fontWeight="600">{a.value.toFixed(1)}</text>
          </g>
        );
      })}

      {/* Attribute name labels */}
      {attributes.map((a, i) => {
        const angle = angleFor(i);
        const labelR = r + 28;
        const lx = cx + labelR * Math.cos(angle);
        const ly = cy + labelR * Math.sin(angle);
        return (
          <text key={`lbl-${i}`} x={lx} y={ly} textAnchor="middle"
            dominantBaseline="middle" fontSize="8.5" fill="#7a9ab5"
            fontWeight="500">{a.name}</text>
        );
      })}
    </svg>
  );
}

function THIChart({ teams }) {
  const w = 680, h = 220, pad = { t: 16, r: 20, b: 32, l: 40 };
  const iw = w - pad.l - pad.r;
  const ih = h - pad.t - pad.b;
  const minV = 7.0, maxV = 10.0;
  const xScale = (i) => pad.l + (i / 11) * iw;
  const yScale = (v) => pad.t + ih - ((v - minV) / (maxV - minV)) * ih;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%">
      {[7.5, 8.0, 8.5, 9.0, 9.5].map(v => (
        <g key={v}>
          <line x1={pad.l} x2={w - pad.r} y1={yScale(v)} y2={yScale(v)} stroke="#1a3a5c" strokeWidth="0.5" strokeDasharray="4,3" />
          <text x={pad.l - 6} y={yScale(v)} textAnchor="end" dominantBaseline="middle" fontSize="9" fill="#7a9ab5">{v.toFixed(1)}</text>
        </g>
      ))}
      {MONTHS.map((m, i) => (
        <text key={m} x={xScale(i)} y={h - pad.b + 16} textAnchor="middle" fontSize="9" fill="#7a9ab5">{m}</text>
      ))}
      {teams.map((team, ti) => {
        const pts = team.thi.map((v, i) => `${xScale(i)},${yScale(v)}`).join(' ');
        return (
          <g key={team.name}>
            <polyline points={pts} fill="none" stroke={TEAM_COLORS[ti]} strokeWidth="1.8" />
            {team.thi.map((v, i) => (
              <circle key={i} cx={xScale(i)} cy={yScale(v)} r="2.5" fill={TEAM_COLORS[ti]} />
            ))}
          </g>
        );
      })}
    </svg>
  );
}

function ScoreBar({ value, color = '#1db88a' }) {
  const pct = ((value - 7) / 3) * 100;
  return (
    <div className="score-bar-wrap">
      <div className="score-bar-track">
        <div className="score-bar-fill" style={{ width: `${pct}%`, background: color }} />
      </div>
      <span className="score-bar-val" style={{ color }}>{value.toFixed(2)}</span>
    </div>
  );
}

const TABS = ['Talent Distribution', 'Team Culture', 'Manager Quality', 'Individual Profile'];

export default function Reports() {
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);

  const elevate = TALENT.filter(p => Math.min(p.l, p.m, p.ic) >= 8.5);
  const support = TALENT.filter(p => Math.min(p.l, p.m, p.ic) < 8.0);
  const top3 = [...PROFILE.attributes].sort((a, b) => b.value - a.value).slice(0, 3);
  const bot3 = [...PROFILE.attributes].sort((a, b) => a.value - b.value).slice(0, 3);

  return (
    <div className="reports-bg">
      <div className="reports-header">
        <div className="login-logo">
          <span className="logo-dot" />
          <span className="logo-text">Mind</span>
        </div>
        <div className="reports-header-right">
          <span className="reports-company">{COMPANY} · Sample Report</span>
          <button className="btn-ghost-sm" onClick={() => navigate('/assessment')}>← Back</button>
        </div>
      </div>

      <div className="reports-tabs">
        {TABS.map((t, i) => (
          <button key={t} className={`reports-tab ${tab === i ? 'active' : ''}`} onClick={() => setTab(i)}>{t}</button>
        ))}
      </div>

      <div className="reports-content">
        <div className="report-panel">

          {tab === 0 && (
            <>
              <div className="report-section-title">Talent Distribution</div>
              <p className="report-section-sub">Peer-reviewed scores across Leader, Manager and Independent Contributor dimensions</p>
              <div className="talent-grid">
                <div className="talent-col">
                  <div className="talent-col-header elevate">Who to elevate</div>
                  {elevate.map(p => (
                    <div className="talent-card" key={p.name}>
                      <div className="talent-name">{p.name}</div>
                      <div className="talent-team">{p.team}</div>
                      <div className="talent-scores">
                        <span>L <strong>{p.l.toFixed(2)}</strong></span>
                        <span>M <strong>{p.m.toFixed(2)}</strong></span>
                        <span>IC <strong>{p.ic.toFixed(2)}</strong></span>
                      </div>
                      <div className="talent-strengths">
                        {p.strengths.map(s => <span key={s} className="tag-green">{s}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
                <div className="talent-col">
                  <div className="talent-col-header support">Who needs support</div>
                  {support.map(p => (
                    <div className="talent-card" key={p.name}>
                      <div className="talent-name">{p.name}</div>
                      <div className="talent-team">{p.team}</div>
                      <div className="talent-scores">
                        <span>L <strong>{p.l.toFixed(2)}</strong></span>
                        <span>M <strong>{p.m.toFixed(2)}</strong></span>
                        <span>IC <strong>{p.ic.toFixed(2)}</strong></span>
                      </div>
                      <div className="talent-strengths">
                        {p.gaps.map(g => <span key={g} className="tag-red">{g}</span>)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {tab === 1 && (
            <>
              <div className="report-section-title">Team Culture & Health Index</div>
              <p className="report-section-sub">Monthly Team Health Index (THI) trends across all departments</p>
              <div className="thi-chart-wrap">
                <THIChart teams={TEAMS} />
                <div className="thi-legend">
                  {TEAMS.map((t, i) => (
                    <span key={t.name} className="thi-legend-item">
                      <span className="thi-legend-dot" style={{ background: TEAM_COLORS[i] }} />
                      {t.name}
                    </span>
                  ))}
                </div>
              </div>
              <div className="team-cards">
                {TEAMS.map((t, i) => (
                  <div className="team-card" key={t.name}>
                    <div className="team-card-name">{t.name}</div>
                    <div className="team-card-avg" style={{ color: TEAM_COLORS[i] }}>{t.avg.toFixed(1)} avg</div>
                    <div className="team-attr-row">
                      <span className="team-attr-label">Strengths</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{t.strengths.map(s => <span key={s} className="tag-green">{s}</span>)}</div>
                    </div>
                    <div className="team-attr-row">
                      <span className="team-attr-label">Develop</span>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{t.gaps.map(g => <span key={g} className="tag-red">{g}</span>)}</div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 2 && (
            <>
              <div className="report-section-title">Manager Quality Index</div>
              <p className="report-section-sub">Management dimension scores — early warning signals flagged</p>
              <div className="manager-list">
                {MANAGERS.sort((a, b) => b.score - a.score).map(m => (
                  <div className={`manager-row ${m.flag ? 'flagged' : ''}`} key={m.name}>
                    <div className="manager-info">
                      <div className="manager-name">{m.name}</div>
                      <div className="manager-team">{m.team}</div>
                    </div>
                    <div className="manager-bar">
                      <ScoreBar value={m.score} color={m.flag ? '#e05c5c' : '#1db88a'} />
                    </div>
                    <div className="manager-trend">
                      {m.trend === 'up'   && <span className="trend-up">↑ Improving</span>}
                      {m.trend === 'down' && <span className="trend-down">↓ Declining</span>}
                      {m.trend === 'flat' && <span className="trend-flat">→ Stable</span>}
                    </div>
                    {m.flag && <div className="manager-flag">⚠ Needs attention</div>}
                  </div>
                ))}
              </div>
            </>
          )}

          {tab === 3 && (
            <>
              <div className="report-section-title">Individual Talent Profile</div>
              <p className="report-section-sub">Deep dive — {PROFILE.name}, {PROFILE.team}</p>
              <div className="profile-top">
                <div className="profile-scores">
                  {[['Leader', PROFILE.l], ['Manager', PROFILE.m], ['Ind. Contributor', PROFILE.ic]].map(([label, val]) => (
                    <div className="profile-score-card" key={label}>
                      <div className="profile-score-label">{label}</div>
                      <div className="profile-score-val">{val.toFixed(2)}</div>
                      <ScoreBar value={val} />
                    </div>
                  ))}
                  <div className="profile-score-card accent-card">
                    <div className="profile-score-label">Overall Percentile</div>
                    <div className="profile-score-val accent">Top {100 - PROFILE.percentile}%</div>
                  </div>
                </div>
                <div className="profile-radar">
                  <div className="radar-title">Attribute Radar — Scale 7 to 10</div>
                  <RadarChart attributes={PROFILE.attributes} />
                  <div className="radar-scale-note">Inner ring = 7.0 · Mid = 8.5 · Outer = 10</div>
                </div>
              </div>
              <div className="profile-breakdown">
                <div className="breakdown-col">
                  <div className="breakdown-title strength-title">Top 3 strengths</div>
                  {top3.map(a => (
                    <div className="breakdown-row" key={a.name}>
                      <span className="breakdown-name">{a.name}</span>
                      <ScoreBar value={a.value} color="#1db88a" />
                    </div>
                  ))}
                </div>
                <div className="breakdown-col">
                  <div className="breakdown-title gap-title">3 Development areas</div>
                  {bot3.map(a => (
                    <div className="breakdown-row" key={a.name}>
                      <span className="breakdown-name">{a.name}</span>
                      <ScoreBar value={a.value} color="#e05c5c" />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}
