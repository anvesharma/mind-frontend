import { useState, useEffect } from "react";
import "./Flashcard.css";

const ATTRIBUTE_DESCRIPTIONS = {
  "Accountability":    "Creates a culture where standards are held and follow-through is expected — including of themselves.",
  "Adaptability":      "Adjusts effectively to new information, changing conditions, and unexpected challenges.",
  "Coaching":          "Develops others by asking better questions, not just giving better answers.",
  "Collaboration":     "Works effectively with others toward shared goals, contributing and supporting in equal measure.",
  "Communication":     "Conveys ideas clearly and adjusts their style to the audience and context.",
  "Confidence":        "Projects assurance in their abilities without crossing into arrogance.",
  "Consistency":       "Shows up the same way over time — reliable in character and in output.",
  "Coordination":      "Keeps people, timelines, and moving parts aligned with minimal friction.",
  "Courage":           "Willingness to take difficult positions, speak up under pressure, and act despite uncertainty.",
  "Creativity":        "Generates original ideas and approaches problems from unexpected angles.",
  "Critical Thinking": "Questions assumptions, weighs competing explanations, and avoids jumping to conclusions.",
  "Curiosity":         "Asks deeper questions and actively seeks out things they don't yet understand.",
  "Decision Making":   "Makes clear calls in ambiguous situations and stands behind them.",
  "Discipline":        "Maintains consistency in behaviour and effort, even without external accountability.",
  "Empathy":           "Understands and shares the feelings of others, and uses that understanding to guide how they engage.",
  "Ethical Behaviour": "Makes decisions guided by fairness and principle, not just convenience or gain.",
  "Execution":         "Follows through on commitments reliably and delivers results.",
  "Humility":          "Acknowledges limits, credits others, and remains open to being wrong.",
  "Influence":         "Shifts thinking and behaviour in others through credibility and persuasion, not authority.",
  "Inspiration":       "Elevates the motivation and sense of purpose of the people around them.",
  "Judgement":         "Makes sound decisions by weighing context, consequences, and competing priorities with care.",
  "Listening":         "Gives full attention, seeks to understand before responding, and retains what's shared.",
  "Negotiation":       "Finds mutually workable solutions while holding their ground where it matters.",
  "Ownership":         "Takes full responsibility for outcomes — not just the parts they can control.",
  "Planning":          "Thinks ahead, anticipates obstacles, and organises resources before they're needed.",
  "Problem Solving":   "Breaks down complex problems and finds practical paths through them.",
  "Resilience":        "Recovers from setbacks, maintains effectiveness under pressure, and keeps perspective.",
  "Self Awareness":    "Understands their own strengths, blind spots, and impact on others with honesty and clarity.",
  "Storytelling":      "Frames ideas as narratives that stick and move people to act.",
  "Strategic Thinking":"Connects day-to-day decisions to long-term goals and broader organisational priorities.",
  "Time Management":   "Uses their time deliberately and protects it from low-value activities.",
  "Trustworthiness":   "Does what they say they will do. People rely on them without needing to check in.",
  "Vision":            "Ability to see beyond the immediate and articulate a compelling direction for the future.",
};

export default function Flashcard({ question, onResponse }) {
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
        <div className="fc-eyebrow">Rate this person</div>
        <div className="fc-attr">{question?.question_text}</div>
        {description && (
          <div className="fc-desc">{description}</div>
        )}
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
