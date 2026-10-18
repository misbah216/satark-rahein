import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchQuizByCategory, submitQuizAnswers } from '../api.js';

const THEME = {
  primary: '#00b4d8',
  glow: 'rgba(0, 180, 216, 0.45)',
  bgGlass: 'rgba(13, 20, 38, 0.85)',
  border: 'rgba(0, 180, 216, 0.35)',
};

const CATEGORIES = [
  'Earthquake Safety',
  'Fire Safety',
  'Flood Preparedness',
  'Cyclone & Storms',
];

export default function QuizPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[0]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCategoryQuestions(selectedCategory);
  }, [selectedCategory]);

  const loadCategoryQuestions = async (category) => {
    setLoading(true);
    setError('');
    setResult(null);
    setCurrentIndex(0);
    setSelectedAnswers({});
    try {
      const res = await fetchQuizByCategory(category);
      setQuestions(res.data || []);
    } catch (err) {
      setError(err.message || 'Unable to load questions');
    } finally {
      setLoading(false);
    }
  };

  const handleOptionSelect = (questionId, optionIndex) => {
    if (result) return;
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = async () => {
    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, selectedOptionIndex]) => ({
        questionId,
        selectedOptionIndex,
      })
    );

    if (formattedAnswers.length === 0) {
      setError('Please select at least one answer before submitting.');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      const payload = {
        category: selectedCategory,
        answers: formattedAnswers,
      };
      const response = await submitQuizAnswers(payload);
      setResult(response);
    } catch (err) {
      setError(err.message || 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  };

  const currentQ = questions[currentIndex];
{/* Top Theme Configuration matching Quiz Card (#def2e5 / #9FCBAD) */}
const THEME = {
  primary: '#1b644d',           // Deep Sage Green for active states & primary CTA
  secondary: '#9FCBAD',         // Soft Sage accent border
  bgGlass: '#def2e5',           // Quiz Card Light Mint Background
  border: '#9FCBAD',
  glow: 'rgba(159, 203, 173, 0.45)',
  textDark: '#1e293b',          // Crisp Dark Header/Text
  textMuted: '#475569',
};

return (
  <div style={{ maxWidth: '860px', margin: '30px auto', padding: '0 20px', fontFamily: 'inherit', color: '#F1F7D4' }}>
    
    {/* Back Button */}
    <div style={{ marginBottom: '24px' }}>
      <button
        onClick={() => navigate('/dashboard')}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          background: 'rgba(241, 247, 212, 0.15)',
          border: '1.5px solid #F1F7D4',
          color: '#F1F7D4',
          padding: '8px 16px',
          borderRadius: '10px',
          cursor: 'pointer',
          fontSize: '13px',
          fontWeight: '700',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
          transition: 'all 0.2s ease',
        }}
      >
        ← Back to Dashboard
      </button>
    </div>

    {/* Header */}
    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
      <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#F1F7D4', margin: 0 }}>
        Preparedness Quizzes
      </h1>
      <p style={{ color: '#d5dde8', fontSize: '15px', marginTop: '8px' }}>
        Evaluate emergency readiness for real-life disaster scenarios.
      </p>
    </div>

    {/* Category Pills */}
    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
      {CATEGORIES.map((cat) => {
        const isActive = selectedCategory === cat;
        return (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '9px 20px',
              borderRadius: '24px',
              border: isActive ? `2px solid #9FCBAD` : '1.5px solid rgba(241, 247, 212, 0.25)',
              backgroundColor: isActive ? '#def2e5' : 'rgba(241, 247, 212, 0.08)',
              color: isActive ? '#1b644d' : '#F1F7D4',
              cursor: 'pointer',
              fontWeight: '800',
              fontSize: '13.5px',
              boxShadow: isActive ? '0 4px 16px rgba(159, 203, 173, 0.35)' : 'none',
              transition: 'all 0.2s ease',
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>

    {error && (
      <div style={{ backgroundColor: '#fee2e2', border: '1.5px solid #f87171', color: '#b91c1c', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px', fontWeight: '700' }}>
        {error}
      </div>
    )}

    {loading ? (
      <div style={{ textAlign: 'center', padding: '50px 0', color: '#d5dde8', fontWeight: '600' }}>Loading scenario questions...</div>
    ) : questions.length === 0 ? (
      <div style={{ textAlign: 'center', padding: '50px 0', color: '#d5dde8', fontWeight: '600' }}>No drill questions available for this module.</div>
    ) : !result ? (
      /* Active Quiz Screen */
      <div style={{
        backgroundColor: '#def2e5',
        border: '2px solid #9FCBAD',
        boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.3)',
        borderRadius: '24px',
        padding: '34px 32px',
        color: '#1e293b',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', color: '#475569', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: '700' }}>
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span style={{ color: '#1b644d', fontWeight: '800' }}>Difficulty: {currentQ.difficulty}</span>
        </div>

        <h2 style={{ fontSize: '21px', fontWeight: '800', color: '#1e293b', lineHeight: '1.45', marginBottom: '26px' }}>
          {currentQ.questionText}
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {currentQ.options.map((opt, idx) => {
            const isSelected = selectedAnswers[currentQ._id] === idx;
            return (
              <button
                key={idx}
                onClick={() => handleOptionSelect(currentQ._id, idx)}
                style={{
                  textAlign: 'left',
                  padding: '16px 20px',
                  borderRadius: '12px',
                  border: isSelected ? '2px solid #1b644d' : '1.5px solid #cbd5e1',
                  backgroundColor: isSelected ? '#bbf7d0' : '#ffffff',
                  color: isSelected ? '#14532d' : '#1e293b',
                  cursor: 'pointer',
                  fontSize: '14.5px',
                  lineHeight: '1.4',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  boxShadow: isSelected ? '0 4px 14px rgba(27, 100, 77, 0.2)' : '0 2px 6px rgba(0,0,0,0.03)',
                  transition: 'all 0.15s ease',
                }}
              >
                <span style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: isSelected ? '#1b644d' : 'rgba(30, 41, 59, 0.08)',
                  color: isSelected ? '#ffffff' : '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: '800',
                  flexShrink: 0,
                }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span style={{ marginTop: '2px' }}>{opt}</span>
              </button>
            );
          })}
        </div>

        {/* Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1.5px solid rgba(27, 100, 77, 0.15)' }}>
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            style={{
              padding: '10px 20px',
              borderRadius: '10px',
              border: '1.5px solid #cbd5e1',
              backgroundColor: '#ffffff',
              color: currentIndex === 0 ? '#94a3b8' : '#1e293b',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '700',
            }}
          >
            ← Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              onClick={handleNext}
              style={{
                padding: '11px 26px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#1b644d',
                color: '#ffffff',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(27, 100, 77, 0.3)',
              }}
            >
              Next →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              style={{
                padding: '11px 26px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#1b644d',
                color: '#ffffff',
                cursor: submitting ? 'not-allowed' : 'pointer',
                fontWeight: '800',
                fontSize: '14px',
                boxShadow: '0 4px 16px rgba(27, 100, 77, 0.35)',
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Drill ✓'}
            </button>
          )}
        </div>
      </div>
    ) : (
      /* Results View */
      <div style={{
        backgroundColor: '#def2e5',
        border: '2px solid #9FCBAD',
        boxShadow: '0 12px 32px -8px rgba(0, 0, 0, 0.3)',
        borderRadius: '24px',
        padding: '36px',
        color: '#1e293b',
      }}>
        <div style={{ textAlign: 'center', borderBottom: '1.5px solid rgba(27, 100, 77, 0.15)', paddingBottom: '26px', marginBottom: '28px' }}>
          <h2 style={{ fontSize: '28px', color: '#1e293b', margin: 0, fontWeight: '800' }}>Drill Completed!</h2>
          <p style={{ fontSize: '18px', color: '#475569', marginTop: '10px', fontWeight: '600' }}>
            Your Score: <strong style={{ color: '#1b644d' }}>{result.score}</strong> / {result.totalQuestions} ({result.percentage}%)
          </p>
          <p style={{ color: '#1b644d', fontWeight: '800', fontSize: '15px', marginTop: '4px' }}>
            +{result.earnedPoints} Points Earned • Total Points: {result.totalScore}
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '18px' }}>
            <button
              onClick={() => loadCategoryQuestions(selectedCategory)}
              style={{
                padding: '11px 24px',
                borderRadius: '10px',
                backgroundColor: '#1b644d',
                color: '#ffffff',
                border: 'none',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(27, 100, 77, 0.3)',
              }}
            >
              Retake Drill
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '11px 24px',
                borderRadius: '10px',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                border: '1.5px solid #cbd5e1',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Go to Dashboard
            </button>
          </div>
        </div>

        <h3 style={{ fontSize: '19px', color: '#1e293b', marginBottom: '18px', fontWeight: '800' }}>Detailed Protocol Analysis</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {result.review?.map((rev, idx) => (
            <div
              key={idx}
              style={{
                padding: '20px',
                borderRadius: '14px',
                backgroundColor: rev.isCorrect ? '#ffffff' : '#fff5f5',
                border: `1.5px solid ${rev.isCorrect ? '#86efac' : '#fca5a5'}`,
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
              }}
            >
              <p style={{ fontSize: '15.5px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0' }}>
                {idx + 1}. {rev.questionText}
              </p>

              <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                <span style={{ color: '#64748b', fontWeight: '600' }}>Your Selection: </span>
                <strong style={{ color: rev.isCorrect ? '#166534' : '#b91c1c' }}>
                  {rev.options[rev.selectedOptionIndex] || 'Not answered'}
                </strong>{' '}
                <span>{rev.isCorrect ? '✅' : '❌'}</span>
              </div>

              {!rev.isCorrect && (
                <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Standard Protocol: </span>
                  <strong style={{ color: '#166534' }}>
                    {rev.options[rev.correctAnswerIndex]}
                  </strong>
                </div>
              )}

              <div style={{ marginTop: '12px', fontSize: '13px', color: '#334155', backgroundColor: 'rgba(27, 100, 77, 0.08)', border: '1px solid rgba(27, 100, 77, 0.15)', padding: '12px 14px', borderRadius: '10px', lineHeight: '1.5' }}>
                <span style={{ color: '#1b644d', fontWeight: '800' }}>Protocol Guideline: </span>
                {rev.explanation}
              </div>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);
}