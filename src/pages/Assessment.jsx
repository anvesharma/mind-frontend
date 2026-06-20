import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import Flashcard from '../components/Flashcard';
import './Assessment.css';

const STEPS = { HOME: 'home', RATEE: 'ratee', ASSESSMENT: 'assessment' };

const NovaButton = () => (
  <a
    href="https://www.discovermind.net/nova.html"
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
      border: '1px solid rgba(239,159,39,0.35)',
      background: 'rgba(239,159,39,0.07)',
      color: '#ef9f27',
      fontSize: '0.9rem',
      fontWeight: 500,
      textDecoration: 'none',
      cursor: 'pointer',
    }}
  >
    <span style={{ fontSize: '1rem' }}>✦</span>
    Ask Nova
  </a>
);

export default function Assessment() {
  const navigate = useNavigate();
  const location = useLocation();
  const mode = location.state?.mode || localStorage.getItem('mind_mode') || 'work';
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const [step, setStep] = useState(STEPS.HOME);
  const [rateeName, setRateeName] = useState('');
  const [ratee, setRatee] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    api.get('/questions').then((res) => setQuestions(res.data));
  }, []);

  const handleStartAssessment = async (e) => {
    e.preventDefault();
    if (!rateeName.trim()) return setError('Please enter a name');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/users/ratee', { name: rateeName.trim() });
      setRatee(res.data);
      const progress = await api.get(`/responses/progress/${res.data.user_id}`);
      if (progress.data) {
        if (progress.data.completed) {
          setLoading(false);
          return setError("You've already reviewed this person. Each person can only be reviewed once.");
        }
        const idx = questions.findIndex(q => q.question_id === progress.data.last_question_id);
        if (idx >= 0) setCurrentIndex(idx + 1);
      }
      setStep(STEPS.ASSESSMENT);
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (questionId, value) => {
    try {
      await api.post('/responses', {
        ratee_id: ratee.user_id,
        question_id: questionId,
        response_value: value,
      });
      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        await api.post('/responses/complete', { ratee_id: ratee.user_id });
        if (mode === 'personal') {
          navigate(`/personal-results/${ratee.user_id}`);
        } else {
          navigate(`/results/${ratee.user_id}`);
        }
      }
    } catch {
      setError('Failed to save response. Please try again.');
    }
  };

  if (step === STEPS.HOME) {
    return (
      <div className="assessment-bg">
        <div className="assessment-card">
          <div className="login-logo">
            <span className="logo-dot" />
            <span className="logo-text">Mind</span>
          </div>
          <h1 className="login-title">Welcome, {user.user_name}</h1>
          <p className="login-sub">What would you like to do?</p>

          {mode === 'personal' ? (
            <>
              <button className="btn-primary" style={{ marginBottom: 12 }} onClick={() => setStep(STEPS.RATEE)}>
                Try Mind for free →
              </button>
              <button className="btn-ghost" style={{ marginBottom: 12 }} onClick={() => navigate('/get-rated', { state: { rateeId: user.user_id } })}>
                Get your real Mind rating
              </button>
              <button className="btn-ghost" style={{ marginBottom: 12 }} onClick={() => navigate('/results-preview')}>
                Check out sample results report
              </button>
              <NovaButton />
            </>
          ) : (
            <>
              <button className="btn-primary" style={{ marginBottom: 12 }} onClick={() => setStep(STEPS.RATEE)}>
                Review someone →
              </button>
              <button className="btn-ghost" style={{ marginBottom: 12 }} onClick={() => navigate('/reports')}>
                View sample reports
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
              <a
                href="https://www.discovermind.net/nova.html"
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
                  border: '1px solid rgba(239,159,39,0.35)',
                  background: 'rgba(239,159,39,0.07)',
                  color: '#ef9f27',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                }}
              >
                <span style={{ fontSize: '1rem' }}>✦</span>
                Ask Nova
              </a>
            </>
          )}
        </div>
      </div>
    );
  }

  if (step === STEPS.RATEE) {
    return (
      <div className="assessment-bg">
        <div className="assessment-card">
          <div className="login-logo">
            <span className="logo-dot" />
            <span className="logo-text">Mind</span>
          </div>
          <h1 className="login-title">
            {mode === 'personal' ? 'Who are you rating?' : 'Who are you reviewing?'}
          </h1>
          <p className="login-sub">
            {mode === 'personal'
              ? "Enter the name of the person you're rating."
              : "Enter the name of the person you'd like to review."}
          </p>
          <form onSubmit={handleStartAssessment}>
            <div className="field">
              <label>Their name</label>
              <input
                type="text"
                placeholder="Enter their name"
                value={rateeName}
                onChange={(e) => setRateeName(e.target.value)}
                autoFocus
              />
            </div>
            {error && <p className="error">{error}</p>}
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? 'Starting...' : 'Start →'}
            </button>
            <button type="button" className="btn-ghost" style={{ marginTop: 10 }} onClick={() => setStep(STEPS.HOME)}>
              ← Back
            </button>
          </form>
        </div>
      </div>
    );
  }

  if (!questions.length) return null;

  const currentQuestion = questions[currentIndex];
  const progress = Math.round((currentIndex / questions.length) * 100);

  return (
    <div className="assessment-bg">
      <div className="assessment-wrapper">
        <div className="assessment-header">
          <div className="login-logo">
            <span className="logo-dot" />
            <span className="logo-text">Mind</span>
          </div>
          <span className="ratee-label">Reviewing: <strong>{ratee?.user_name}</strong></span>
        </div>
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-count">{currentIndex + 1} of {questions.length}</span>
            <span className="progress-pct">{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
        {error && <p className="error" style={{ textAlign: 'center', marginBottom: 16 }}>{error}</p>}
        <Flashcard
          key={currentQuestion.question_id}
          question={currentQuestion}
          onResponse={handleResponse}
        />
      </div>
    </div>
  );
}
