import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FriendRating.css';

const API = process.env.REACT_APP_API_URL;

export default function FriendRating() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`${API}/social/rate/${token}`)
      .then(res => setData(res.data))
      .catch(err => setError(err.response?.data?.error || 'Invalid or expired link'))
      .finally(() => setLoading(false));
  }, [token]);

  const currentQuestion = data?.questions[currentIndex];
  const progress = data ? Math.round((currentIndex / data.questions.length) * 100) : 0;

  const handleNext = () => {
    const newResponses = [...responses, {
      question_id: currentQuestion.question_id,
      response_value: rating
    }];
    setResponses(newResponses);
    setRating(5);

    if (currentIndex < data.questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      handleSubmit(newResponses);
    }
  };

  const handleSubmit = async (finalResponses) => {
    setSubmitting(true);
    try {
      await axios.post(`${API}/social/rate/${token}/submit`, { responses: finalResponses });
      setDone(true);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return (
    <div className="fr-bg">
      <p style={{ color: 'rgba(255,255,255,0.4)' }}>Loading...</p>
    </div>
  );

  if (error) return (
    <div className="fr-bg">
      <div className="fr-card">
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: '#e05c5c', marginBottom: '0.75rem' }}>{error}</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>This link may have expired or already been used.</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="fr-bg">
      <div className="fr-card">
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎉</div>
        <h1 className="fr-done-title">Thank you!</h1>
        <p className="fr-done-sub">Your rating for <strong>{data?.ratee?.user_name}</strong> has been submitted. They'll be notified once enough people have rated them.</p>
        <p className="fr-done-cta">Want to know how your friends see you?</p>
        <button className="fr-try-btn" onClick={() => navigate('/discover')}>
          Try Mind for yourself →
        </button>
      </div>
    </div>
  );

  return (
    <div className="fr-bg">
      <div className="fr-wrapper">
        <div className="fr-header">
          <div className="fr-logo">
            <span className="fr-logo-dot" />
            <span className="fr-logo-text">Mind</span>
            <span className="fr-logo-tag">for You</span>
          </div>
          <div className="fr-rating-label">Rating <strong>{data?.ratee?.user_name}</strong></div>
        </div>

        <div className="fr-progress-wrap">
          <div className="fr-progress-info">
            <span>{currentIndex + 1} of {data?.questions.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="fr-progress-bar">
            <div className="fr-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="fr-card">
          <div className="fr-question">{currentQuestion?.question_text}</div>
          <div className="fr-rating-wrap">
            <div className="fr-rating-labels">
              <span>Low</span>
              <span>High</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={rating}
              onChange={e => setRating(parseInt(e.target.value))}
              className="fr-slider"
            />
            <div className="fr-rating-value" style={{ color: rating >= 8 ? '#ef9f27' : rating >= 5 ? '#1db88a' : '#7a9ab5' }}>
              {rating}
            </div>
          </div>
          <button
            className="fr-next-btn"
            onClick={handleNext}
            disabled={submitting}
          >
            {submitting ? 'Submitting...' : currentIndex < data.questions.length - 1 ? 'Next →' : 'Submit rating →'}
          </button>
        </div>

        <p className="fr-anon-note">🔒 Your rating is anonymous. {data?.ratee?.user_name} will only see their overall profile.</p>
      </div>
    </div>
  );
}
