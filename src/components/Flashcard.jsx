import React, { useState } from 'react';
import './Flashcard.css';

const LABELS = ['', 'Very Low', 'Low', 'Below Average', 'Average', 'Above Average', 'Good', 'Strong', 'Very Strong', 'Excellent', 'Exceptional'];

export default function Flashcard({ question, onResponse }) {
  const [value, setValue] = useState(5);
  const [flipped, setFlipped] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (submitted) return;
    setSubmitted(true);
    setFlipped(true);
    setTimeout(() => {
      onResponse(question.question_id, value);
    }, 280);
  };

  const getAccentColor = (val) => {
    if (val <= 2) return '#e05c5c';
    if (val <= 4) return '#e0a05c';
    if (val <= 6) return '#7a9ab5';
    if (val <= 8) return '#1db88a';
    return '#a8f0d8';
  };

  const accent = getAccentColor(value);

  return (
    <div className="fc-scene">
      <div className={`fc-card ${flipped ? 'fc-flipped' : ''}`}>
        {/* Front */}
        <div className="fc-face fc-front">
          <div className="fc-attribute" style={{ color: accent }}>
            {question.question_text}
          </div>

          <div className="fc-value-display">
            <span className="fc-number" style={{ color: accent }}>{value}</span>
            <span className="fc-label">{LABELS[value]}</span>
          </div>

          <div className="fc-slider-wrap">
            <input
              type="range"
              min={1}
              max={10}
              step={1}
              value={value}
              onChange={(e) => setValue(Number(e.target.value))}
              className="fc-slider"
              style={{ '--accent': accent }}
            />
            <div className="fc-slider-ends">
              <span>1</span>
              <span>10</span>
            </div>
          </div>

          <button
            className="fc-submit"
            onClick={handleSubmit}
            disabled={submitted}
            style={{ background: accent }}
          >
            Next →
          </button>
        </div>

        {/* Back */}
        <div className="fc-face fc-back">
          <div className="fc-saving">Saving...</div>
        </div>
      </div>
    </div>
  );
}
