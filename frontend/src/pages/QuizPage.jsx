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

  return (
    <div style={{ maxWidth: '860px', margin: '30px auto', padding: '0 20px', fontFamily: 'inherit', color: '#f3f4f6' }}>
      
      {/* Back Button */}
      <div style={{ marginBottom: '24px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(0, 180, 216, 0.08)',
            border: `1.5px solid ${THEME.border}`,
            color: THEME.primary,
            padding: '8px 16px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            boxShadow: `0 0 12px -2px ${THEME.glow}`,
          }}
        >
          ← Back to Dashboard
        </button>
      </div>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
          Preparedness Quizzes
        </h1>
        <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px' }}>
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
                border: isActive ? `2px solid ${THEME.primary}` : '1px solid rgba(255, 255, 255, 0.08)',
                backgroundColor: isActive ? 'rgba(0, 180, 216, 0.15)' : 'rgba(13, 20, 38, 0.6)',
                color: isActive ? THEME.primary : '#94a3b8',
                cursor: 'pointer',
                fontWeight: isActive ? '700' : '500',
                fontSize: '13.5px',
                boxShadow: isActive ? `0 0 16px -2px ${THEME.glow}` : 'none',
                transition: 'all 0.2s ease',
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {error && (
        <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)', border: '1px solid #ef4444', color: '#fca5a5', padding: '12px 16px', borderRadius: '10px', marginBottom: '20px', fontSize: '14px' }}>
          {error}
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>Loading scenario questions...</div>
      ) : questions.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px 0', color: '#94a3b8' }}>No drill questions available for this module.</div>
      ) : !result ? (
        /* Active Quiz Screen */
        <div style={{
          backgroundColor: THEME.bgGlass,
          border: `2px solid ${THEME.primary}`,
          boxShadow: `0 0 25px -2px ${THEME.glow}`,
          borderRadius: '20px',
          padding: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '18px', color: '#94a3b8', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span style={{ color: THEME.primary, fontWeight: '700' }}>Difficulty: {currentQ.difficulty}</span>
          </div>

          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#ffffff', lineHeight: '1.5', marginBottom: '26px' }}>
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
                    border: isSelected ? `2px solid ${THEME.primary}` : '1.5px solid rgba(255, 255, 255, 0.08)',
                    backgroundColor: isSelected ? 'rgba(0, 180, 216, 0.15)' : 'rgba(255, 255, 255, 0.02)',
                    color: isSelected ? '#ffffff' : '#e2e8f0',
                    cursor: 'pointer',
                    fontSize: '15px',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                    boxShadow: isSelected ? `0 0 15px -3px ${THEME.glow}` : 'none',
                  }}
                >
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isSelected ? THEME.primary : 'rgba(255, 255, 255, 0.08)',
                    color: isSelected ? '#070c18' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '800',
                    flexShrink: 0,
                  }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <button
              onClick={handlePrev}
              disabled={currentIndex === 0}
              style={{
                padding: '10px 20px',
                borderRadius: '10px',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                color: currentIndex === 0 ? '#475569' : '#e2e8f0',
                cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                fontSize: '14px',
                fontWeight: '600',
              }}
            >
              ← Previous
            </button>

            {currentIndex < questions.length - 1 ? (
              <button
                onClick={handleNext}
                style={{
                  padding: '10px 24px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: THEME.primary,
                  color: '#070c18',
                  cursor: 'pointer',
                  fontWeight: '800',
                  fontSize: '14px',
                  boxShadow: `0 0 15px ${THEME.glow}`,
                }}
              >
                Next →
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={submitting}
                style={{
                  padding: '10px 26px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#10b981',
                  color: '#070c18',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  fontWeight: '800',
                  fontSize: '14px',
                  boxShadow: '0 0 15px rgba(16, 185, 129, 0.4)',
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
          backgroundColor: THEME.bgGlass,
          border: `2px solid ${THEME.primary}`,
          boxShadow: `0 0 30px -2px ${THEME.glow}`,
          borderRadius: '20px',
          padding: '36px',
        }}>
          <div style={{ textAlign: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.08)', paddingBottom: '26px', marginBottom: '28px' }}>
            <h2 style={{ fontSize: '28px', color: '#ffffff', margin: 0, fontWeight: '800' }}>Drill Completed!</h2>
            <p style={{ fontSize: '18px', color: '#94a3b8', marginTop: '10px' }}>
              Your Score: <strong style={{ color: THEME.primary }}>{result.score}</strong> / {result.totalQuestions} ({result.percentage}%)
            </p>
            <p style={{ color: '#34d399', fontWeight: '700', fontSize: '15px', marginTop: '4px' }}>
              +{result.earnedPoints} Points Earned • Total Points: {result.totalScore}
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '18px' }}>
              <button
                onClick={() => loadCategoryQuestions(selectedCategory)}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: THEME.primary,
                  color: '#070c18',
                  border: 'none',
                  fontWeight: '800',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Retake Drill
              </button>
              <button
                onClick={() => navigate('/dashboard')}
                style={{
                  padding: '10px 22px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  color: '#fff',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '14px',
                }}
              >
                Go to Dashboard
              </button>
            </div>
          </div>

          <h3 style={{ fontSize: '18px', color: '#ffffff', marginBottom: '18px', fontWeight: '800' }}>Detailed Protocol Analysis</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {result.review?.map((rev, idx) => (
              <div
                key={idx}
                style={{
                  padding: '20px',
                  borderRadius: '12px',
                  backgroundColor: rev.isCorrect ? 'rgba(16, 185, 129, 0.08)' : 'rgba(239, 68, 68, 0.08)',
                  border: `1.5px solid ${rev.isCorrect ? '#10b981' : '#ef4444'}`,
                }}
              >
                <p style={{ fontSize: '16px', fontWeight: '700', color: '#ffffff', margin: '0 0 10px 0' }}>
                  {idx + 1}. {rev.questionText}
                </p>

                <div style={{ fontSize: '14px', marginBottom: '6px' }}>
                  <span style={{ color: '#94a3b8' }}>Your Selection: </span>
                  <strong style={{ color: rev.isCorrect ? '#34d399' : '#f87171' }}>
                    {rev.options[rev.selectedOptionIndex] || 'Not answered'}
                  </strong>{' '}
                  <span>{rev.isCorrect ? '✅' : '❌'}</span>
                </div>

                {!rev.isCorrect && (
                  <div style={{ fontSize: '14px', marginBottom: '10px' }}>
                    <span style={{ color: '#94a3b8' }}>Standard Protocol: </span>
                    <strong style={{ color: '#34d399' }}>
                      {rev.options[rev.correctAnswerIndex]}
                    </strong>
                  </div>
                )}

                <div style={{ marginTop: '12px', fontSize: '13px', color: '#cbd5e1', backgroundColor: 'rgba(0, 0, 0, 0.3)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '12px 14px', borderRadius: '8px', lineHeight: '1.5' }}>
                  <span style={{ color: THEME.primary, fontWeight: '700' }}>Protocol Guideline: </span>
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