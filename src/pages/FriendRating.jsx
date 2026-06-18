import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './FriendRating.css';

const API = process.env.REACT_APP_API_URL;

const ATTRIBUTE_DESCRIPTIONS = {
  "Courage":            "Willingness to take difficult positions, speak up under pressure, and act despite uncertainty.",
  "Vision":             "Ability to see beyond the immediate and articulate a compelling direction for the future.",
  "Adaptability":       "Adjusts effectively to new information, changing conditions, and unexpected challenges.",
  "Listening":          "Gives full attention, seeks to understand before responding, and retains what's shared.",
  "Resilience":         "Recovers from setbacks, maintains effectiveness under pressure, and keeps perspective.",
  "Humility":           "Acknowledges limits, credits others, and remains open to being wrong.",
  "Communication":      "Conveys ideas clearly and adjusts their style to the audience and context.",
  "Ethical Behaviour":  "Makes decisions guided by fairness and principle, not just convenience or gain.",
  "Creativity":         "Generates original ideas and approaches problems from unexpected angles.",
  "Empathy":            "Understands others' perspectives and factors them into decisions and responses.",
  "Execution":          "Follows through on commitments reliably and delivers results.",
  "Confidence":         "Projects assurance in their abilities without crossing into arrogance.",
  "Self Awareness":     "Knows their own strengths, blind spots, and how they come across to others.",
  "Ownership":          "Takes full responsibility for outcomes — not just the parts they can control.",
  "Negotiation":        "Finds mutually workable solutions while holding their ground where it matters.",
  "Trustworthiness":    "Does what they say they will do. People rely on them without needing to check in.",
  "Critical Thinking":  "Questions assumptions, weighs competing explanations, and avoids jumping to conclusions.",
  "Storytelling":       "Frames ideas as narratives that stick and move people to act.",
  "Curiosity":          "Asks deeper questions and actively seeks out things they don't yet understand.",
  "Problem Solving":    "Breaks down complex problems and finds practical paths through them.",
  "Planning":           "Thinks ahead, anticipates obstacles, and organises resources before they're needed.",
  "Consistency":        "Shows up the same way over time — reliable in character and in output.",
  "Accountability":     "Creates a culture where standards are held and follow-through is expected — including of themselves.",
  "Judgement":          "Makes the right call in ambiguous, high-stakes situations where there's no obvious answer.",
  "Discipline":         "Maintains consistency in behaviour and effort, even without external accountability.",
  "Time Management":    "Uses their time deliberately and protects it from low-value activities.",
  "Coordination":       "Keeps people, timelines, and moving parts aligned with minimal friction.",
  "Strategic Thinking": "Connects day-to-day decisions to long-term goals and broader organisational priorities.",
  "Decision Making":    "Makes clear calls in ambiguous situations and stands behind them.",
  "Influence":          "Shifts thinking and behaviour in others through credibility and persuasion, not authority.",
  "Inspiration":        "Elevates the motivation and sense of purpose of the people around them.",
  "Coaching":           "Develops others by asking better questions, not just giving better answers.",
  "Collaboration":      "Works willingly and effectively with others toward a shared goal.",
};

function Flashcard({ question, onResponse, rateeName }) {
  const [selected, setSelected] = useState(null);
  const [animating, setAnimating] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    setSelected(null);
    setLeaving(false);
    setAnimating(false);
  }, [question]);

  const description = ATTRIBUTE_DESCRIPTIONS[question?.question_text] || null;

  function handleSelect(val) {
    if (animating) return;
    setSelected(val);
    setAnimating(true);
    setLeaving(true);
    setTimeout(() => {
      onResponse(question.question_id, val);
    }, 380);
  }

  const tileClass = (val) => {
    if (val === selected) return "fc-tile fc-tile--selected";
    if (val <= 3)         return "fc-tile fc-tile--low";
    return "fc-tile";
  };

  return (
    <div className={`fc-wrap${leaving ? " fc-wrap--leaving" : ""}`}>
      <div className="fc-card">
        <div className="fc-eyebrow">Rate {rateeName}</div>
        <div className="fc-attr">{question?.question_text}</div>
        {description && <div className="fc-desc">{description}</div>}
      </div>

      <div className="fc-rate-label">How would you rate them?</div>

      <div className="fc-tiles">
        {[1,2,3,4,5,6,7,8,9,10].map(val => (
          <button
            key={val}
            className={tileClass(val)}
            onClick={() => handleSelect(val)}
            aria-label={`Rate ${val} out of 10`}
            disabled={animating}
          >
            {val}
          </button>
        ))}
      </div>

      <div className="fc-range-labels">
        <span>Needs work</span>
        <span>Exceptional</span>
      </div>

      <div className="fc-hint">
        {selected ? "Moving to next question…" : "Tap a number to rate and continue"}
      </div>
    </div>
  );
}

export default function FriendRating() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [responses, setResponses] = useState([]);
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

  const handleResponse = (questionId, value) => {
    const newResponses = [...responses, { question_id: questionId, response_value: value }];
    setResponses(newResponses);

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
      <div className="fr-card-shell">
        <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>⚠️</div>
        <h2 style={{ color: '#e05c5c', marginBottom: '0.75rem' }}>{error}</h2>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem' }}>This link may have expired or already been used.</p>
      </div>
    </div>
  );

  if (done) return (
    <div className="fr-bg">
      <div className="fr-card-shell">
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

  if (!data?.questions?.length) return null;

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
            <span>{currentIndex + 1} of {data.questions.length}</span>
            <span>{progress}%</span>
          </div>
          <div className="fr-progress-bar">
            <div className="fr-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        {submitting ? (
          <div className="fr-card-shell">
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Submitting your rating...</p>
          </div>
        ) : (
          <Flashcard
            key={currentQuestion.question_id}
            question={currentQuestion}
            onResponse={handleResponse}
            rateeName={data?.ratee?.user_name}
          />
        )}

        <p className="fr-anon-note">🔒 Your rating is anonymous. {data?.ratee?.user_name} will only see their overall profile.</p>
      </div>
    </div>
  );
}
