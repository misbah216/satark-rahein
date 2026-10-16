import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const THEME = {
  primary: '#ff8c00',
  glow: 'rgba(255, 140, 0, 0.45)',
  bgGlass: 'rgba(13, 20, 38, 0.85)',
  border: 'rgba(255, 140, 0, 0.35)',
};

const DRILL_SCENARIOS = [
  {
    id: 'fire-lab',
    title: 'Chemistry Lab Chemical Fire',
    hazard: 'Fire Hazard',
    startingRoom: '2nd Floor Chemistry Lab',
    difficulty: 'Medium',
    brief: 'A beaker of flammable solvent tips over on an active hot plate, triggering a dense chemical fire in the 2nd floor science wing.',
    steps: [
      {
        stepIndex: 1,
        situation: 'Dense black smoke starts spreading near the lab door, and the fire alarm sounds. What is your immediate primary move?',
        options: [
          {
            text: 'Gather personal bags, laptop, and coats before moving out',
            isCorrect: false,
            feedback: 'Wrong. Evacuation must be instantaneous; delaying to save belongings causes smoke inhalation fatalities.'
          },
          {
            text: 'Drop low to crawl beneath the rising smoke towards the secondary emergency fire exit',
            isCorrect: true,
            feedback: 'Correct! Smoke and toxic fumes collect near the ceiling. Staying below 2 feet provides cooler, breathable air.'
          },
          {
            text: 'Run upright towards the central passenger elevator',
            isCorrect: false,
            feedback: 'Wrong. Never take an elevator during a building fire; power failure can trap you inside a smoke-filled shaft.'
          }
        ]
      },
      {
        stepIndex: 2,
        situation: 'You reach the emergency stairwell door. Before pushing it open, what safety protocol must you execute?',
        options: [
          {
            text: 'Touch the door handle and upper panel with the back of your hand to test for heat',
            isCorrect: true,
            feedback: 'Correct! Using the back of your hand prevents reflex grabbing if the metal is burning hot, indicating fire on the other side.'
          },
          {
            text: 'Kick the door open forcefully to rush out quickly',
            isCorrect: false,
            feedback: 'Wrong. Opening an active door to an intense fire can create a lethal backdraft or flashover.'
          },
          {
            text: 'Lock the door behind you so the fire does not enter the stairwell',
            isCorrect: false,
            feedback: 'Wrong. Exit routes and doors must remain unlocked to avoid trapping others behind you.'
          }
        ]
      },
      {
        stepIndex: 3,
        situation: 'The door feels cool and you enter the stairwell. You make it to the ground level exit. Where should you assemble?',
        options: [
          {
            text: 'Stand directly under the laboratory external balcony to record footage',
            isCorrect: false,
            feedback: 'Wrong. Glass window panes frequently burst outward under extreme heat, causing severe lacerations.'
          },
          {
            text: 'Proceed directly to the designated Open Campus Assembly Ground and report to your drill marshal',
            isCorrect: true,
            feedback: 'Correct! Safe staging at the designated assembly point ensures headcounts can be completed swiftly by safety wardens.'
          }
        ]
      }
    ]
  },
  {
    id: 'earthquake-auditorium',
    title: 'Severe Earthquake Tremors in Classroom',
    hazard: 'Earthquake Hazard',
    startingRoom: '3rd Floor Lecture Hall',
    difficulty: 'Easy',
    brief: 'Vigorous horizontal shaking begins during a lecture. Ceiling fixtures and plaster fragments begin falling.',
    steps: [
      {
        stepIndex: 1,
        situation: 'The floor shakes violently, making running almost impossible. What is the standard life-safety stance?',
        options: [
          {
            text: 'Drop, Cover under sturdy study benches, and Hold On firmly to the table legs',
            isCorrect: true,
            feedback: 'Correct! The Drop, Cover, and Hold On posture protects vital organs and head from falling structural debris.'
          },
          {
            text: 'Rush in a crowd towards the narrow exit doorway immediately',
            isCorrect: false,
            feedback: 'Wrong. Crowd stampedes and falling corridor tiles cause more injuries during tremors than structural collapse.'
          },
          {
            text: 'Stand near the glass facade to look outside for safety vehicles',
            isCorrect: false,
            feedback: 'Wrong. High shear stress shatters architectural glass panes immediately during seismic waves.'
          }
        ]
      },
      {
        stepIndex: 2,
        situation: 'The primary tremor stops after 40 seconds. An announcement signals structural evacuation before aftershocks arrive. How should the class descend?',
        options: [
          {
            text: 'Descend single-file along the inner wall of the primary reinforced stairwell',
            isCorrect: true,
            feedback: 'Correct! Inner structural stair walls bear load best and allow orderly descent without crowding railings.'
          },
          {
            text: 'Jump from the first-floor terrace landing onto soft hedges',
            isCorrect: false,
            feedback: 'Wrong. Jumping from heights leads to fractures and incapacitation.'
          }
        ]
      },
      {
        stepIndex: 3,
        situation: 'Once outside on the perimeter roadway, a live power line is dangling across the lawn. What is the protocol?',
        options: [
          {
            text: 'Attempt to move the cable using a dry branch or umbrella',
            isCorrect: false,
            feedback: 'Wrong. High-voltage utility lines can arc through wood or conductive materials. Keep at least 10 meters distance.'
          },
          {
            text: 'Maintain at least a 35-foot perimeter, alert wardens, and shuffle away without lifting your feet',
            isCorrect: true,
            feedback: 'Correct! Shuffling with feet close together minimizes ground voltage differentials that cause electrocution.'
          }
        ]
      }
    ]
  }
];

export default function DrillsPage() {
  const navigate = useNavigate();
  const [activeDrill, setActiveDrill] = useState(null);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [drillCompleted, setDrillCompleted] = useState(false);
  const [mistakesCount, setMistakesCount] = useState(0);

  const startDrill = (drill) => {
    setActiveDrill(drill);
    setCurrentStepIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setDrillCompleted(false);
    setMistakesCount(0);
  };

  const handleSelectOption = (opt) => {
    if (isAnswered) return;
    setSelectedOption(opt);
    setIsAnswered(true);
    if (!opt.isCorrect) setMistakesCount((prev) => prev + 1);
  };

  const handleNextStep = () => {
    if (currentStepIndex < activeDrill.steps.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setDrillCompleted(true);
    }
  };

  const resetToDirectory = () => {
    setActiveDrill(null);
    setDrillCompleted(false);
  };

  return (
    <div style={{ maxWidth: '900px', margin: '30px auto', padding: '0 20px', fontFamily: 'inherit', color: '#f3f4f6' }}>
      
      {/* Back Button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <button
          onClick={() => (activeDrill ? resetToDirectory() : navigate('/dashboard'))}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255, 140, 0, 0.08)',
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
          {activeDrill ? '← Exit Current Drill' : '← Back to Dashboard'}
        </button>

        {activeDrill && (
          <span style={{ fontSize: '12px', color: THEME.primary, textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: '700' }}>
            {activeDrill.hazard} • {activeDrill.startingRoom}
          </span>
        )}
      </div>

      {!activeDrill ? (
        /* Scenario Directory */
        <div>
          <div style={{ textAlign: 'center', marginBottom: '36px' }}>
            <h1 style={{ fontSize: '32px', fontWeight: '800', color: '#ffffff', margin: 0 }}>
              Virtual Evacuation Drills
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px' }}>
              Select a scenario to practice real-time emergency decision routes.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '22px' }}>
            {DRILL_SCENARIOS.map((drill) => (
              <div
                key={drill.id}
                style={{
                  backgroundColor: THEME.bgGlass,
                  border: `2px solid ${THEME.primary}`,
                  boxShadow: `0 0 20px -3px ${THEME.glow}`,
                  borderRadius: '18px',
                  padding: '26px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{
                      backgroundColor: 'rgba(255, 140, 0, 0.15)',
                      color: THEME.primary,
                      fontSize: '11px',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontWeight: '700',
                      border: `1px solid ${THEME.border}`,
                    }}>
                      {drill.hazard}
                    </span>
                    <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                      Level: {drill.difficulty}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '20px', color: '#ffffff', margin: '0 0 10px 0', fontWeight: '800' }}>
                    {drill.title}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#94a3b8', lineHeight: '1.6', margin: '0 0 20px 0' }}>
                    {drill.brief}
                  </p>
                </div>

                <button
                  onClick={() => startDrill(drill)}
                  style={{
                    width: '100%',
                    padding: '12px 0',
                    backgroundColor: THEME.primary,
                    color: '#070c18',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '800',
                    fontSize: '14px',
                    cursor: 'pointer',
                    boxShadow: `0 0 15px ${THEME.glow}`,
                  }}
                >
                  Start Simulation Drill →
                </button>
              </div>
            ))}
          </div>
        </div>
      ) : !drillCompleted ? (
        /* Active Drill */
        <div style={{
          backgroundColor: THEME.bgGlass,
          border: `2px solid ${THEME.primary}`,
          boxShadow: `0 0 25px -2px ${THEME.glow}`,
          borderRadius: '20px',
          padding: '32px',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', fontSize: '13px', color: '#94a3b8' }}>
            <span>Checkpoint {currentStepIndex + 1} of {activeDrill.steps.length}</span>
            <span>Errors: <strong style={{ color: mistakesCount > 0 ? '#f87171' : '#34d399' }}>{mistakesCount}</strong></span>
          </div>

          <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.08)', height: '6px', borderRadius: '3px', marginBottom: '28px', overflow: 'hidden' }}>
            <div style={{
              width: `${((currentStepIndex + 1) / activeDrill.steps.length) * 100}%`,
              backgroundColor: THEME.primary,
              boxShadow: `0 0 10px ${THEME.primary}`,
              height: '100%',
              transition: 'width 0.3s ease',
            }} />
          </div>

          <h2 style={{ fontSize: '19px', fontWeight: '700', color: '#ffffff', lineHeight: '1.5', marginBottom: '24px' }}>
            {activeDrill.steps[currentStepIndex].situation}
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activeDrill.steps[currentStepIndex].options.map((opt, idx) => {
              const isChosen = selectedOption === opt;
              let borderCol = 'rgba(255, 255, 255, 0.1)';
              let bgCol = 'rgba(255, 255, 255, 0.02)';

              if (isAnswered) {
                if (opt.isCorrect) {
                  borderCol = '#10b981';
                  bgCol = 'rgba(16, 185, 129, 0.15)';
                } else if (isChosen && !opt.isCorrect) {
                  borderCol = '#ef4444';
                  bgCol = 'rgba(239, 68, 68, 0.15)';
                }
              }

              return (
                <button
                  key={idx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    textAlign: 'left',
                    padding: '16px 20px',
                    borderRadius: '12px',
                    border: `1.5px solid ${borderCol}`,
                    backgroundColor: bgCol,
                    color: '#f3f4f6',
                    cursor: isAnswered ? 'default' : 'pointer',
                    fontSize: '15px',
                    lineHeight: '1.4',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '12px',
                  }}
                >
                  <span style={{
                    width: '26px',
                    height: '26px',
                    borderRadius: '50%',
                    backgroundColor: isChosen ? THEME.primary : 'rgba(255, 255, 255, 0.08)',
                    color: isChosen ? '#070c18' : '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '12px',
                    fontWeight: '800',
                    flexShrink: 0,
                  }}>
                    {idx + 1}
                  </span>
                  <span>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {isAnswered && (
            <div style={{ marginTop: '28px', paddingTop: '20px', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
              <div style={{
                padding: '14px 18px',
                borderRadius: '10px',
                backgroundColor: selectedOption.isCorrect ? 'rgba(16, 185, 129, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                border: `1px solid ${selectedOption.isCorrect ? '#10b981' : '#ef4444'}`,
                marginBottom: '20px',
                fontSize: '14px',
                lineHeight: '1.5',
              }}>
                <strong style={{ color: selectedOption.isCorrect ? '#34d399' : '#f87171' }}>
                  {selectedOption.isCorrect ? 'Protocol Followed: ' : 'Critical Hazard: '}
                </strong>
                <span style={{ color: '#d1d5db' }}>{selectedOption.feedback}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  onClick={handleNextStep}
                  style={{
                    padding: '12px 24px',
                    backgroundColor: THEME.primary,
                    color: '#070c18',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: '800',
                    cursor: 'pointer',
                    fontSize: '14px',
                    boxShadow: `0 0 15px ${THEME.glow}`,
                  }}
                >
                  {currentStepIndex < activeDrill.steps.length - 1 ? 'Proceed to Next Checkpoint →' : 'Complete Evacuation Drill ✓'}
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        /* Completed Screen */
        <div style={{
          backgroundColor: THEME.bgGlass,
          border: `2px solid ${THEME.primary}`,
          boxShadow: `0 0 30px -2px ${THEME.glow}`,
          borderRadius: '20px',
          padding: '40px 28px',
          textAlign: 'center',
        }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>
            {mistakesCount === 0 ? '🏆' : '🛡️'}
          </div>
          <h2 style={{ fontSize: '26px', color: '#ffffff', margin: 0, fontWeight: '800' }}>
            Evacuation Successful!
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '15px', marginTop: '8px' }}>
            You have safely cleared <strong>{activeDrill.title}</strong>.
          </p>

          <div style={{
            display: 'inline-block',
            backgroundColor: 'rgba(255, 140, 0, 0.08)',
            border: `1px solid ${THEME.border}`,
            borderRadius: '12px',
            padding: '16px 32px',
            margin: '24px 0',
          }}>
            <span style={{ fontSize: '12px', color: THEME.primary, fontWeight: '700', letterSpacing: '0.05em' }}>
              EVACUATION EVALUATION
            </span>
            <div style={{ fontSize: '20px', fontWeight: '800', color: mistakesCount === 0 ? '#34d399' : '#fb923c', marginTop: '6px' }}>
              {mistakesCount === 0 ? 'Zero Safety Violations (Flawless)' : `${mistakesCount} Dangerous Action(s) Noted`}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={() => startDrill(activeDrill)}
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
              Replay Drill
            </button>
            <button
              onClick={resetToDirectory}
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
              Back to Directory
            </button>
          </div>
        </div>
      )}
    </div>
  );
}