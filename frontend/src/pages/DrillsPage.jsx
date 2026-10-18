import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as api from '../api.js';

const THEME = {
  primary: '#255d69',           // Ocean Steel Blue
  secondary: '#6EADBC',
  bgCard: '#d7edf2',            // Ocean Cyan Light Pastel
  border: '#6EADBC',
  textDark: '#1e293b',
  textMuted: '#475569',
};

// Real life-or-death decision steps with lethal mistakes
const INTERACTIVE_DRILLS = [
  {
    id: 'fire-drill',
    category: 'Fire Safety',
    title: 'High-Rise Academic Block Fire Drill',
    severity: 'Code Red',
    estimatedTime: '3 mins',
    icon: '🔥',
    overview: 'Simulated 3rd-floor electrical fire with dense toxic smoke rapidly spreading into the main stairwell.',
    steps: [
      {
        step: 1,
        situation: 'Corridor fire alarm starts blaring loudly. What is your immediate first action?',
        options: [
          { text: 'Wait to pack your laptop, chargers, and heavy bags before moving.', isSafe: false, feedback: 'Deadly Delay! Fire and smoke double in volume every 30 seconds. Never delay evacuation for personal belongings.' },
          { text: 'Leave all heavy belongings behind instantly and alert classmates to evacuate.', isSafe: true, feedback: 'Correct Protocol! Immediate egress saves lives.' }
        ]
      },
      {
        step: 2,
        situation: 'You reach the corridor door. The metal door handle feels extremely hot to touch.',
        options: [
          { text: 'Push the door open quickly to run through the flames before it spreads.', isSafe: false, feedback: 'Fatal Flashover Trap! A hot door handle indicates active raging fire on the other side. Opening it feeds oxygen causing an explosive backdraft.' },
          { text: 'Keep door sealed, place cloth beneath crack, and head to alternate Secondary Exit B.', isSafe: true, feedback: 'Correct Protocol! Sealed doors buy crucial survival time against lethal smoke.' }
        ]
      },
      {
        step: 3,
        situation: 'The alternate escape hallway is filling with thick, stinging black smoke.',
        options: [
          { text: 'Drop onto hands and knees, keeping head 1-2 feet off the ground, crawling towards exit.', isSafe: true, feedback: 'Correct Protocol! Cooler, breathable oxygen remains along the lowest 2 feet.' },
          { text: 'Stand tall and sprint forward holding your breath.', isSafe: false, feedback: 'Lethal Smoke Inhalation! Hot toxic carbon monoxide rises to the ceiling; standing up causes sudden unconsciousness within 2 breaths.' }
        ]
      },
      {
        step: 4,
        situation: 'You reach the landing zone with both the passenger elevator and fire stairs open.',
        options: [
          { text: 'Take the fast express elevator down to Ground floor.', isSafe: false, feedback: 'Elevator Shaft Death Trap! Elevators frequently lose power, turning the metal carriage into a suffocating chimney furnace.' },
          { text: 'Take the fire-rated stairwell holding the wall handrails calmly.', isSafe: true, feedback: 'Correct Protocol! Pressurized stairwells provide continuous safe descent.' }
        ]
      },
      {
        step: 5,
        situation: 'You successfully exit the building into the open football ground.',
        options: [
          { text: 'Run back inside because you realize your phone is still on the desk.', isSafe: false, feedback: 'Extreme Hazard! More than 30% of fire casualties occur when occupants re-enter burning structures.' },
          { text: 'Assemble at the designated muster zone and report attendance to the floor safety marshal.', isSafe: true, feedback: 'Correct Protocol! Roll-call verification ensures firefighters do not risk lives searching for you.' }
        ]
      }
    ]
  },
  {
    id: 'earthquake-drill',
    category: 'Earthquake Safety',
    title: 'Seismic Tremor Response Drill (Zone IV/V)',
    severity: 'High Alert',
    estimatedTime: '2 mins',
    icon: '🏚️',
    overview: 'High magnitude tremors causing violent shaking, glass fracture, and heavy ceiling fixture collapse.',
    steps: [
      {
        step: 1,
        situation: 'Violent tremors suddenly shake the floor while you are in a 3rd-floor classroom.',
        options: [
          { text: 'Rush into the corridor immediately while ground is vibrating violently.', isSafe: false, feedback: 'Critical Hazard! Running during violent shaking causes falls, head trauma, and impacts from falling light fixtures.' },
          { text: 'Drop onto hands and knees immediately right where you are.', isSafe: true, feedback: 'Correct Protocol! Dropping low prevents you from being thrown to the floor.' }
        ]
      },
      {
        step: 2,
        situation: 'Ceiling plaster and glass fragments begin raining down around you.',
        options: [
          { text: 'Cover your head and torso under a heavy reinforced workbench or desk.', isSafe: true, feedback: 'Correct Protocol! Desk frames absorb falling structural loads.' },
          { text: 'Stand beside the large glass windows to observe ground damage.', isSafe: false, feedback: 'Severe Laceration Hazard! Windows shatter under seismic torsion into lethal flying shards.' }
        ]
      },
      {
        step: 3,
        situation: 'The desk begins sliding across the vibrating floor under intense shaking.',
        options: [
          { text: 'Hold on firmly to the legs of the desk with both hands and move with it.', isSafe: true, feedback: 'Correct Protocol! "Drop, Cover, and Hold On" maintains your shield.' },
          { text: 'Let go of the desk and stand up in the doorway frame.', isSafe: false, feedback: 'Outdated & Dangerous! Modern doorways are not load-bearing and unlatched doors crush fingers under tremors.' }
        ]
      },
      {
        step: 4,
        situation: 'Tremors cease after 50 seconds. It is time to evacuate the classroom.',
        options: [
          { text: 'Walk calmly down the central staircase, protecting your head with a book/bag.', isSafe: true, feedback: 'Correct Protocol! Protect vital cervical vertebrae while exiting.' },
          { text: 'Jump from the first floor balcony to reach the grass quickly.', isSafe: false, feedback: 'Severe Injury! Fractured limbs prevent rescue evacuation.' }
        ]
      },
      {
        step: 5,
        situation: 'You are outdoors in the campus quad. High-tension power cables are swaying above.',
        options: [
          { text: 'Stand under the power lines or near large brick boundary walls.', isSafe: false, feedback: 'Electrocution & Wall Collapse! Secondary aftershocks topple unreinforced masonry walls and snap power lines.' },
          { text: 'Move at least 50 meters away into open open ground, clear of wires and facades.', isSafe: true, feedback: 'Correct Protocol! Open ground is the only zero-hazard seismic zone.' }
        ]
      }
    ]
  }
];

export default function DrillsPage() {
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [activeDrill, setActiveDrill] = useState(null);
  
  // Track choices: { [stepIndex]: selectedOptionIndex }
  const [userDecisions, setUserDecisions] = useState({});
  const [drillSummary, setDrillSummary] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const filteredDrills = selectedCategory === 'ALL'
    ? INTERACTIVE_DRILLS
    : INTERACTIVE_DRILLS.filter((d) => d.category === selectedCategory);

  const handleStartDrill = (drill) => {
    setActiveDrill(drill);
    setUserDecisions({});
    setDrillSummary(null);
  };

  const handleSelectOption = (stepIdx, optIdx) => {
    setUserDecisions((prev) => ({
      ...prev,
      [stepIdx]: optIdx
    }));
  };

  const handleEvaluateDrill = async () => {
    if (!activeDrill) return;
    const totalSteps = activeDrill.steps.length;
    const answeredSteps = Object.keys(userDecisions).length;

    if (answeredSteps < totalSteps) {
      alert(`Simulation incomplete! You must make a safety decision for all ${totalSteps} emergency situations.`);
      return;
    }

    setSubmitting(true);

    // Calculate score with negative marking
    let safeCount = 0;
    let mistakeCount = 0;
    let netPoints = 0;
    const reviewLog = [];

    activeDrill.steps.forEach((st, idx) => {
      const chosenOptIdx = userDecisions[idx];
      const chosenOption = st.options[chosenOptIdx];
      const safeOption = st.options.find((o) => o.isSafe);

      if (chosenOption.isSafe) {
        safeCount++;
        netPoints += 5; // +5 points for safe action
      } else {
        mistakeCount++;
        netPoints -= 10; // -10 points penalty for lethal mistake
      }

      reviewLog.push({
        step: st.step,
        situation: st.situation,
        userChoice: chosenOption.text,
        isSafe: chosenOption.isSafe,
        feedback: chosenOption.feedback,
        correctProcedure: safeOption.text
      });
    });

    const isPassed = mistakeCount === 0;

    // Backend sync
    const token = localStorage.getItem('sr_token');
    const payload = {
      category: activeDrill.category,
      score: safeCount,
      totalQuestions: totalSteps,
      percentage: Math.max(0, Math.round((safeCount / totalSteps) * 100)),
    };

    try {
      if (typeof api.recordQuizResult === 'function') {
        await api.recordQuizResult(payload);
      } else {
        await fetch('http://localhost:5000/api/quiz/result', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          body: JSON.stringify(payload),
        });
      }
    } catch (e) {}

    // Update local user score (Net score can increase or decrease based on mistakes)
    const rawUser = localStorage.getItem('sr_user');
    if (rawUser) {
      const u = JSON.parse(rawUser);
      u.totalScore = Math.max(0, (u.totalScore || 0) + netPoints);
      u.quizzesCompleted = (u.quizzesCompleted || 0) + 1;
      localStorage.setItem('sr_user', JSON.stringify(u));
    }

    setDrillSummary({
      title: activeDrill.title,
      category: activeDrill.category,
      safeCount,
      mistakeCount,
      netPoints,
      isPassed,
      reviewLog
    });

    setActiveDrill(null);
    setSubmitting(false);
  };

  return (
    <div style={{ maxWidth: '960px', margin: '30px auto', padding: '0 20px', fontFamily: 'inherit', color: '#F1F7D4' }}>
      
      {/* Top Header Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
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
          }}
        >
          ← Back to Dashboard
        </button>

        <span style={{ fontSize: '13px', color: '#F1F7D4', fontWeight: '800', letterSpacing: '0.06em', background: 'rgba(110, 173, 188, 0.28)', padding: '5px 14px', borderRadius: '20px', border: '1px solid #6EADBC' }}>
          🌊 Virtual Evacuation Drills
        </span>
      </div>

      {/* Main Title Header */}
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#F1F7D4', margin: 0 }}>
          Interactive Evacuation Drills
        </h1>
        <p style={{ color: '#d5dde8', fontSize: '15px', marginTop: '8px' }}>
          Simulated live hazard scenarios. <strong>Warning:</strong> Wrong survival choices trigger strict negative penalty points!
        </p>
      </div>

      {/* Category Filter Pills */}
      <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '32px' }}>
        {['ALL', 'Fire Safety', 'Earthquake Safety'].map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '9px 20px',
                borderRadius: '24px',
                border: isActive ? `2px solid #6EADBC` : '1.5px solid rgba(241, 247, 212, 0.25)',
                backgroundColor: isActive ? '#d7edf2' : 'rgba(241, 247, 212, 0.08)',
                color: isActive ? '#255d69' : '#F1F7D4',
                cursor: 'pointer',
                fontWeight: '800',
                fontSize: '13.5px',
                boxShadow: isActive ? '0 4px 16px rgba(110, 173, 188, 0.35)' : 'none',
              }}
            >
              {cat === 'ALL' ? 'All Drills' : cat}
            </button>
          );
        })}
      </div>

      {/* Drills Cards Grid */}
      {!drillSummary && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '40px' }}>
          {filteredDrills.map((drill) => (
            <div
              key={drill.id}
              style={{
                backgroundColor: '#d7edf2',
                border: `2px solid #6EADBC`,
                borderRadius: '24px',
                padding: '28px',
                color: '#1e293b',
                boxShadow: '0 12px 30px -8px rgba(0, 0, 0, 0.25)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <span style={{ fontSize: '11.5px', fontWeight: '800', color: '#255d69', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'rgba(37, 93, 105, 0.12)', padding: '4px 10px', borderRadius: '16px' }}>
                    {drill.category}
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: '800', color: '#b91c1c', background: '#fee2e2', padding: '3px 8px', borderRadius: '12px' }}>
                    -10 penalty per error
                  </span>
                </div>

                <div style={{ fontSize: '42px', marginBottom: '12px' }}>{drill.icon}</div>

                <h2 style={{ fontSize: '21px', fontWeight: '800', color: '#1e293b', margin: '0 0 10px 0' }}>
                  {drill.title}
                </h2>

                <p style={{ color: '#334155', fontSize: '13.5px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                  {drill.overview}
                </p>

                <div style={{ background: '#ffffff', padding: '12px 14px', borderRadius: '12px', border: '1px solid #cbd5e1', fontSize: '12.5px', color: '#475569', marginBottom: '22px' }}>
                  ⚖️ <strong>Scoring:</strong> +5 pts per correct procedure • <strong>-10 pts deduction</strong> for fatal traps.
                </div>
              </div>

              <button
                onClick={() => handleStartDrill(drill)}
                style={{
                  width: '100%',
                  padding: '13px 0',
                  backgroundColor: '#255d69',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  fontWeight: '800',
                  fontSize: '14px',
                  cursor: 'pointer',
                  boxShadow: '0 4px 14px rgba(37, 93, 105, 0.3)',
                }}
              >
                Launch Decision Simulation →
              </button>
            </div>
          ))}
        </div>
      )}

      {/* 🔴 ACTIVE DECISION DRILL MODAL */}
      {activeDrill && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(21, 24, 33, 0.88)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#d7edf2',
            border: `2px solid #6EADBC`,
            borderRadius: '26px',
            padding: '32px',
            maxWidth: '680px',
            width: '100%',
            color: '#1e293b',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            maxHeight: '90vh',
            overflowY: 'auto',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
              <div>
                <span style={{ fontSize: '11px', fontWeight: '800', color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                  Active Emergency Simulation • High Risk
                </span>
                <h2 style={{ fontSize: '24px', fontWeight: '800', margin: '4px 0 0 0', color: '#1e293b' }}>
                  {activeDrill.icon} {activeDrill.title}
                </h2>
              </div>
              <button
                onClick={() => setActiveDrill(null)}
                style={{ background: 'none', border: 'none', fontSize: '22px', fontWeight: '800', color: '#475569', cursor: 'pointer' }}
              >
                ✕
              </button>
            </div>

            <p style={{ color: '#475569', fontSize: '13.5px', margin: '0 0 20px 0' }}>
              Make split-second life-safety choices below. <em>Remember: Every wrong step penalizes your readiness score.</em>
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '26px' }}>
              {activeDrill.steps.map((st, sIdx) => {
                const selectedOpt = userDecisions[sIdx];
                return (
                  <div key={sIdx} style={{ background: '#ffffff', borderRadius: '16px', padding: '18px', border: '1.5px solid #cbd5e1' }}>
                    <div style={{ display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '10px' }}>
                      <span style={{ background: '#255d69', color: '#ffffff', borderRadius: '50%', width: '22px', height: '22px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', flexShrink: 0 }}>
                        {st.step}
                      </span>
                      <strong style={{ fontSize: '14.5px', color: '#1e293b' }}>
                        {st.situation}
                      </strong>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {st.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx;
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectOption(sIdx, oIdx)}
                            style={{
                              textAlign: 'left',
                              padding: '12px 14px',
                              borderRadius: '10px',
                              border: isChosen ? '2px solid #255d69' : '1.5px solid #e2e8f0',
                              backgroundColor: isChosen ? '#d7edf2' : '#f8fafc',
                              color: '#1e293b',
                              fontSize: '13.5px',
                              fontWeight: isChosen ? '700' : '500',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'flex-start',
                              gap: '10px',
                              transition: 'all 0.15s ease',
                            }}
                          >
                            <span style={{
                              width: '18px',
                              height: '18px',
                              borderRadius: '50%',
                              border: isChosen ? '5px solid #255d69' : '2px solid #94a3b8',
                              flexShrink: 0,
                              marginTop: '2px',
                              backgroundColor: '#ffffff'
                            }} />
                            <span>{opt.text}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleEvaluateDrill}
              disabled={submitting}
              style={{
                width: '100%',
                padding: '14px 0',
                backgroundColor: '#255d69',
                color: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                fontSize: '14px',
                cursor: submitting ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 14px rgba(37, 93, 105, 0.3)',
              }}
            >
              {submitting ? 'Analyzing Life-Safety Performance...' : 'Submit Drill For Evaluation →'}
            </button>
          </div>
        </div>
      )}

      {/* ⚠️ POST-DRILL FORENSIC DEBRIEF & PENALTY SUMMARY */}
      {drillSummary && (
        <div style={{
          backgroundColor: '#d7edf2',
          border: `2px solid ${drillSummary.isPassed ? '#10b981' : '#f87171'}`,
          borderRadius: '26px',
          padding: '36px 32px',
          color: '#1e293b',
          boxShadow: '0 16px 40px -8px rgba(0, 0, 0, 0.35)',
        }}>
          {/* Header Verdict */}
          <div style={{ textAlign: 'center', borderBottom: '2px solid rgba(37, 93, 105, 0.15)', paddingBottom: '24px', marginBottom: '28px' }}>
            <div style={{ fontSize: '54px', marginBottom: '8px' }}>
              {drillSummary.isPassed ? '🏆' : '🚨'}
            </div>
            <h2 style={{ fontSize: '28px', fontWeight: '800', color: drillSummary.isPassed ? '#166534' : '#991b1b', margin: '0 0 6px 0' }}>
              {drillSummary.isPassed ? 'Flawless Evacuation!' : 'Evacuation Failed: Critical Errors Identified!'}
            </h2>
            <p style={{ color: '#475569', fontSize: '15px', margin: '0 0 16px 0' }}>
              {drillSummary.title} • {drillSummary.safeCount} Safe Actions | <strong>{drillSummary.mistakeCount} Fatal Traps Encountered</strong>
            </p>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '14px', background: drillSummary.netPoints >= 0 ? '#bbf7d0' : '#fee2e2', padding: '10px 22px', borderRadius: '16px', border: `1.5px solid ${drillSummary.netPoints >= 0 ? '#86efac' : '#fca5a5'}` }}>
              <span style={{ fontSize: '13px', fontWeight: '800', textTransform: 'uppercase', color: drillSummary.netPoints >= 0 ? '#14532d' : '#991b1b' }}>
                Net Score Impact:
              </span>
              <strong style={{ fontSize: '22px', color: drillSummary.netPoints >= 0 ? '#166534' : '#b91c1c' }}>
                {drillSummary.netPoints >= 0 ? `+${drillSummary.netPoints}` : `${drillSummary.netPoints}`} Points
              </strong>
            </div>
          </div>

          {/* Forensic Breakdown: Kahan galti ki */}
          <h3 style={{ fontSize: '19px', fontWeight: '800', color: '#1e293b', margin: '0 0 18px 0' }}>
            Detailed Forensic Action Review:
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' }}>
            {drillSummary.reviewLog.map((r, i) => (
              <div
                key={i}
                style={{
                  backgroundColor: r.isSafe ? '#ffffff' : '#fff5f5',
                  border: `1.5px solid ${r.isSafe ? '#86efac' : '#f87171'}`,
                  borderRadius: '16px',
                  padding: '18px 20px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                  <strong style={{ fontSize: '14.5px', color: '#1e293b' }}>
                    Step {r.step}: {r.situation}
                  </strong>
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '800',
                    padding: '3px 10px',
                    borderRadius: '12px',
                    backgroundColor: r.isSafe ? '#dcfce7' : '#fee2e2',
                    color: r.isSafe ? '#166534' : '#b91c1c',
                    border: `1px solid ${r.isSafe ? '#86efac' : '#fca5a5'}`
                  }}>
                    {r.isSafe ? '+5 Points (Safe)' : '-10 Penalty (Lethal Trap)'}
                  </span>
                </div>

                <div style={{ fontSize: '13.5px', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b', fontWeight: '600' }}>Your Action: </span>
                  <strong style={{ color: r.isSafe ? '#166534' : '#b91c1c' }}>{r.userChoice}</strong>{' '}
                  <span>{r.isSafe ? '✅' : '❌'}</span>
                </div>

                {!r.isSafe && (
                  <div style={{ fontSize: '13.5px', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b', fontWeight: '600' }}>Standard Safety Protocol: </span>
                    <strong style={{ color: '#166534' }}>{r.correctProcedure}</strong>
                  </div>
                )}

                <div style={{ marginTop: '8px', fontSize: '13px', lineHeight: '1.5', color: r.isSafe ? '#166534' : '#991b1b', background: r.isSafe ? 'rgba(22, 101, 52, 0.06)' : 'rgba(185, 28, 28, 0.08)', padding: '10px 14px', borderRadius: '10px' }}>
                  <strong>Safety Consequence:</strong> {r.feedback}
                </div>
              </div>
            ))}
          </div>

          {/* Action CTAs */}
          <div style={{ display: 'flex', gap: '14px', justifyContent: 'center' }}>
            <button
              onClick={() => {
                setDrillSummary(null);
                setUserDecisions({});
              }}
              style={{
                padding: '12px 26px',
                borderRadius: '10px',
                border: 'none',
                backgroundColor: '#255d69',
                color: '#ffffff',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '14px',
                boxShadow: '0 4px 14px rgba(37, 93, 105, 0.3)',
              }}
            >
              Retake Drill to Recover Points ↻
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              style={{
                padding: '12px 26px',
                borderRadius: '10px',
                border: '1.5px solid #cbd5e1',
                backgroundColor: '#ffffff',
                color: '#1e293b',
                fontWeight: '700',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Return to Dashboard
            </button>
          </div>
        </div>
      )}

    </div>
  );
}