import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../api';
import Flashcard from '../components/Flashcard';
import './Assessment.css';

const STEPS = { HOME: 'home', RATEE: 'ratee', ASSESSMENT: 'assessment' };

const TrialSignupButton = ({ style = {} }) => {
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
        marginBottom: 12, padding: '14px 18px', borderRadius: 12,
        border: '1px solid rgba(29,184,138,0.4)', background: 'rgba(29,184,138,0.1)',
        color: '#1db88a', fontSize: '0.9rem', fontWeight: 600, textAlign: 'center',
        lineHeight: 1.5, ...style,
      }}>
        ✓ Thank you for signing up!<br />
        <span style={{ fontWeight: 400, color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem' }}>
          We'll reach out to you shortly.
        </span>
      </div>
    );
  }

  if (status === 'needEmail') {
    return (
      <div style={{ marginBottom: 12, display: 'flex', flexDirection: 'column', gap: 8, ...style }}>
        <div style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.6)', textAlign: 'center' }}>
          Enter your details and we'll set up your free trial.
        </div>
        <input
          type="text" placeholder="Your name" value={name}
          onChange={(e) => setName(e.target.value)}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(29,184,138,0.3)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.95rem' }}
        />
        <input
          type="email" placeholder="Your work email" value={email}
          onChange={(e) => setEmail(e.target.value)} autoFocus
          onKeyDown={(e) => e.key === 'Enter' && handleEmailSubmit()}
          style={{ padding: '12px 14px', borderRadius: 10, border: '1px solid rgba(29,184,138,0.3)', background: 'rgba(255,255,255,0.04)', color: '#fff', fontSize: '0.95rem' }}
        />
        <button
          onClick={handleEmailSubmit}
          style={{ padding: '13px 20px', borderRadius: 12, border: 'none', background: '#1db88a', color: '#050810', fontSize: '1rem', fontWeight: 700, fontFamily: 'Inter, sans-serif', cursor: 'pointer' }}
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
        width: '100%', marginBottom: 12, padding: '14px 20px', borderRadius: 12,
        border: 'none', background: '#1db88a', color: '#050810',
        fontSize: '1rem', fontWeight: 700, fontFamily: 'Inter, sans-serif',
        cursor: status === 'loading' ? 'default' : 'pointer', ...style,
      }}
    >
      {status === 'loading' ? 'Signing up…'
        : status === 'error' ? 'Try again'
        : 'Sign up for free trial →'}
    </button>
  );
};

const FeedbackButton = ({ theme = 'teal' }) => (
  <a
    href="mailto:nova@discovermind.net?subject=Mind%20Feedback&body=Here's%20my%20feedback%20on%20Mind:%0D%0A%0D%0A"
    style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
      marginBottom: 12, padding: '12px 20px', borderRadius: 12,
      border: `1px solid ${theme === 'amber' ? 'rgba(239,159,39,0.3)' : 'rgba(29,184,138,0.3)'}`,
      background: 'transparent', color: theme === 'amber' ? '#ef9f27' : '#1db88a',
      fontSize: '0.95rem', fontWeight: 600, fontFamily: 'DM Sans, sans-serif',
      textDecoration: 'none', cursor: 'pointer',
    }}
  >
    💬 Share feedback
  </a>
);

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
  // `questions` holds only what is still UNANSWERED for this (rater, ratee)
  // pair. `alreadyAnswered` is how many were completed on earlier visits, and
  // `totalQuestions` is the full bank — both are needed for the progress bar.
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alreadyAnswered, setAlreadyAnswered] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [resumed, setResumed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const goToResults = (rateeId) => {
    navigate(mode === 'personal' ? `/personal-results/${rateeId}` : `/results/${rateeId}`);
  };

  const handleStartAssessment = async (e) => {
    e.preventDefault();
    if (!rateeName.trim()) return setError('Please enter a name');
    setError('');
    setLoading(true);
    try {
      const res = await api.post('/users/ratee', { name: rateeName.trim() });
      setRatee(res.data);

      // Fetch the bank and the resume state together. The bank comes back in a
      // fresh random order every time, so resume works by REMOVING answered
      // question ids — never by jumping to a saved position, which would point
      // at a different question under the new shuffle.
      const [questionsRes, progressRes] = await Promise.all([
        api.get('/questions'),
        api.get(`/responses/progress/${res.data.user_id}`),
      ]);

      const bank = questionsRes.data || [];
      const answeredIds = new Set(progressRes.data?.answered_question_ids || []);
      const remaining = bank.filter((q) => !answeredIds.has(q.question_id));

      setTotalQuestions(bank.length);
      setAlreadyAnswered(answeredIds.size);
      setResumed(answeredIds.size > 0 && remaining.length > 0);
      setCurrentIndex(0);

      // Every question already answered: nothing to resume, go straight to
      // results rather than showing an empty assessment.
      if (!remaining.length) {
        await api.post('/responses/complete', { ratee_id: res.data.user_id });
        goToResults(res.data.user_id);
        return;
      }

      setQuestions(remaining);
      setStep(STEPS.ASSESSMENT);
    } catch (err) {
      if (err.response?.status === 429) {
        setError('Too many requests right now. Please wait a minute and try again.');
      } else {
        setError('Something went wrong. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // A 429 means the per-IP rate limit was hit, not that anything is broken.
  // Wait it out and retry rather than stranding the rater mid-assessment.
  const saveResponse = async (questionId, value, attempt = 0) => {
    try {
      await api.post('/responses', {
        ratee_id: ratee.user_id,
        question_id: questionId,
        response_value: value,
      });
      setError('');
    } catch (err) {
      if (err.response?.status === 429 && attempt < 3) {
        const retryAfter = Number(err.response.headers?.['retry-after']) || 5;
        setError(`Too many requests — retrying in ${retryAfter}s. Your answers are saved.`);
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        return saveResponse(questionId, value, attempt + 1);
      }
      throw err;
    }
  };

  const handleResponse = async (questionId, value) => {
    try {
      // Saved one answer at a time, so an abandoned assessment is always
      // resumable from exactly where it stopped.
      await saveResponse(questionId, value);

      if (currentIndex < questions.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else {
        await api.post('/responses/complete', { ratee_id: ratee.user_id });
        goToResults(ratee.user_id);
      }
    } catch (err) {
      if (err.response?.status === 429) {
        setError(
          'Too many requests right now. Everything you have answered is saved — ' +
            'wait a minute, then reopen this review to carry on.'
        );
      } else {
        setError('Failed to save response. Please try again.');
      }
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
              <FeedbackButton theme="amber" />
            </>
          ) : (
            <>
              <button className="btn-ghost" style={{ marginBottom: 12 }} onClick={() => setStep(STEPS.RATEE)}>
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
              <FeedbackButton theme="teal" />
              <TrialSignupButton />
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

  // Count against the full bank, not just this sitting, so a resumed rater
  // sees "24 of 33" rather than restarting the counter at 1.
  const answeredSoFar = alreadyAnswered + currentIndex;
  const progress = totalQuestions
    ? Math.round((answeredSoFar / totalQuestions) * 100)
    : 0;

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
        {resumed && (
          <p
            style={{
              textAlign: 'center',
              marginBottom: 12,
              fontSize: '0.85rem',
              color: 'rgba(255,255,255,0.55)',
            }}
          >
            Picking up where you left off — {alreadyAnswered} of {totalQuestions} already answered.
          </p>
        )}
        <div className="progress-section">
          <div className="progress-info">
            <span className="progress-count">{answeredSoFar + 1} of {totalQuestions}</span>
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
