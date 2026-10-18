import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getActiveBroadcast } from '../api.js';
import './Dashboard.css';

// Light pastel boxes with dark text:
const MODULES = [
  {
    id: 'drills',
    title: 'Virtual Evacuation Drills',
    desc: 'Step-by-step simulated drills for fire, earthquake and flood scenarios.',
    to: '/drills',
    bgColor: '#d7edf2', // Ocean Cyan Pastel
    borderColor: '#6EADBC',
    glowColor: 'rgba(110, 173, 188, 0.45)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="5" r="2.5" />
        <path d="M10 22v-5l-2-2.5V11a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v4l-2 2v5" />
        <path d="M6 13l2-2" />
        <path d="M16 11l2 2" />
      </svg>
    ),
  },
  {
    id: 'quiz',
    title: 'Preparedness Quizzes',
    desc: 'Short quizzes on disaster awareness and response with protocol tracking.',
    to: '/quiz',
    bgColor: '#def2e5', // Soft Sage Mint Pastel
    borderColor: '#9FCBAD',
    glowColor: 'rgba(159, 203, 173, 0.45)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
        <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
        <path d="M9 14l2 2 4-4" />
      </svg>
    ),
  },
  {
    id: 'games',
    title: 'Awareness Games',
    desc: 'Light interactive games that build split-second emergency habits.',
    to: '/games',
    bgColor: '#fef5dc', // Warm Buttery Cream Pastel
    borderColor: '#e8c973',
    glowColor: 'rgba(232, 201, 115, 0.5)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="2" y="6" width="20" height="12" rx="3" />
        <path d="M6 12h4m-2-2v4" />
        <circle cx="16" cy="10" r="1" fill="currentColor" />
        <circle cx="18" cy="13" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    id: 'chatbot',
    title: 'Ask Satark AI',
    desc: 'Gemini AI assistant for safety procedures, drill steps and helplines.',
    to: '/chatbot',
    bgColor: '#e5e1f0', // Soft Lavender-Slate Tint
    borderColor: '#9e92bc',
    glowColor: 'rgba(158, 146, 188, 0.45)',
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="10" rx="2" />
        <circle cx="8.5" cy="16" r="1.5" fill="currentColor" />
        <circle cx="15.5" cy="16" r="1.5" fill="currentColor" />
        <path d="M12 2v4" />
        <path d="M8 7h8" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('sr_user');
  const initialUser = raw ? JSON.parse(raw) : null;

  const [user, setUser] = useState(initialUser);
  const [broadcast, setBroadcast] = useState(null);
  const [showCertModal, setShowCertModal] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const res = await getCurrentUser();
        if (res?.user) {
          setUser(res.user);
          localStorage.setItem('sr_user', JSON.stringify(res.user));
        }
      } catch (err) {
        console.error('Could not refresh stats:', err.message);
      }

      try {
        const bRes = await getActiveBroadcast();
        if (bRes?.broadcast) {
          setBroadcast(bRes.broadcast);
        }
      } catch (err) {}
    }
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    navigate('/auth');
  };

  const getBadge = (score = 0) => {
    if (score >= 100) return { title: 'Campus Warden', color: '#1b644d', next: 'Max Rank' };
    if (score >= 40) return { title: 'Emergency Ready', color: '#255d69', next: 'Campus Warden (100 pts)' };
    return { title: 'Trainee Scout', color: '#544c1d', next: 'Emergency Ready (40 pts)' };
  };

  const badge = getBadge(user?.totalScore || 0);

  const getWeakArea = () => {
    if (!user?.quizHistory || user.quizHistory.length === 0) return null;
    const lowAttempt = [...user.quizHistory].reverse().find((h) => h.percentage < 60);
    return lowAttempt ? lowAttempt.category : null;
  };

  const weakArea = getWeakArea();
  const isCertified = (user?.totalScore || 0) >= 50;

  return (
    <div className="home">
      {/* Top Header */}
      <header className="home__header">
        <div className="home__brand">
          <div className="home__brand-icon">🛡️</div>
          <span className="home__logo">Satark Rahein</span>
        </div>
        <div className="home__account">
          {user && user.role === 'admin' && (
            <button
              onClick={() => navigate('/admin')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: '#F1F7D4',
                border: '1.5px solid #F1F7D4',
                color: '#262137',
                padding: '7px 16px',
                borderRadius: '8px',
                fontSize: '12.5px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
              }}
            >
              ⚙️ Admin Portal
            </button>
          )}

          {user && <span className="home__role">{user.role}</span>}
          <button className="home__logout" onClick={handleLogout}>
            Sign Out
          </button>
        </div>
      </header>

      {/* Live Campus Notice (Light Box) */}
      {broadcast && broadcast.message && (
        <div style={{
          backgroundColor: '#F1F7D4',
          border: '2px solid #6EADBC',
          borderRadius: '18px',
          padding: '16px 22px',
          marginBottom: '28px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: '0 8px 24px -5px rgba(0,0,0,0.3)',
          color: '#262137',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '26px' }}>📢</span>
            <div>
              <strong style={{ color: '#262137', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                INSTITUTE NOTICE: {broadcast.title}
              </strong>
              <p style={{ margin: '3px 0 0 0', color: '#4A4466', fontSize: '13.5px', fontWeight: '500' }}>
                {broadcast.message}
              </p>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#255d69', fontWeight: '800', background: 'rgba(110,173,188,0.25)', padding: '5px 12px', borderRadius: '20px', whiteSpace: 'nowrap' }}>
            LIVE NOTICE
          </span>
        </div>
      )}

      {/* Hero Header */}
      <section className="home__hero">
        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div className="campus-status-pill">
            <span className="status-dot"></span>
            Campus Monitoring Active
          </div>

          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 16px',
            borderRadius: '30px',
            background: 'rgba(110, 173, 188, 0.2)',
            border: '1.5px solid #6EADBC',
            color: '#6EADBC',
            fontSize: '12px',
            fontWeight: '800',
          }}>
            📍 Priority Zone: Seismic Zone IV & Fire Safety
          </div>
        </div>

        <div className="home__greeting-box">
          <h1>Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.</h1>
          <p>
            ID / Section: <strong style={{ color: '#F1F7D4' }}>{user?.roleField || 'Registered Student'}</strong> • Complete location drills to unlock your Safety Certificate.
          </p>
        </div>
      </section>

      {/* 📊 Light Snapshot Panel with Dark Text */}
      <section className="light-snapshot-panel">
        {/* Readiness Meter */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
            <span style={{ color: '#4A4466', fontWeight: '800', textTransform: 'uppercase' }}>Readiness Score</span>
            <strong style={{ color: '#255d69', fontSize: '13px' }}>{user?.totalScore || 0} pts (Target: 100)</strong>
          </div>
          <div style={{ width: '100%', backgroundColor: 'rgba(74, 68, 102, 0.15)', height: '10px', borderRadius: '6px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, ((user?.totalScore || 0) / 100) * 100)}%`,
              backgroundColor: '#6EADBC',
              height: '100%',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: '#5c557c', marginTop: '6px', display: 'block', fontWeight: '600' }}>
            Next Rank: {badge.next}
          </span>
        </div>

        {/* Current Rank Badge */}
        <div style={{ borderLeft: '2px solid rgba(74, 68, 102, 0.15)', paddingLeft: '24px' }}>
          <span style={{ fontSize: '11px', color: '#4A4466', fontWeight: '800', textTransform: 'uppercase' }}>Current Rank</span>
          <div style={{ fontSize: '20px', fontWeight: '800', color: badge.color, marginTop: '4px' }}>
            🎖️ {badge.title}
          </div>
          <span style={{ fontSize: '12.5px', color: '#5c557c', fontWeight: '600' }}>
            {user?.quizzesCompleted || 0} drills passed
          </span>
        </div>

        {/* Certificate Button / Weak Area Alert */}
        <div style={{ borderLeft: '2px solid rgba(74, 68, 102, 0.15)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weakArea && (
            <div style={{ fontSize: '12.5px', color: '#991b1b', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠️</span>
              <span>Needs Practice: <strong>{weakArea}</strong></span>
            </div>
          )}

          <button
            onClick={() => isCertified && setShowCertModal(true)}
            style={{
              padding: '10px 18px',
              borderRadius: '10px',
              border: isCertified ? '2px solid #1b644d' : '1px solid rgba(74, 68, 102, 0.25)',
              backgroundColor: isCertified ? '#ddf1e4' : 'rgba(74, 68, 102, 0.08)',
              color: isCertified ? '#1b644d' : '#5c557c',
              cursor: isCertified ? 'pointer' : 'not-allowed',
              fontWeight: '800',
              fontSize: '12.5px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
            }}
          >
            {isCertified ? '🎓 View Safety Certificate' : '🔒 Earn 50 pts to Unlock Certificate'}
          </button>
        </div>
      </section>

      {/* 2x2 Glowing Light Cards Grid */}
      <section className="home__grid">
        {MODULES.map((m) => (
          <article
            key={m.id}
            className="light-pastel-card"
            style={{
              '--card-bg': m.bgColor,
              '--card-border': m.borderColor,
              '--card-glow': m.glowColor,
            }}
            onClick={() => navigate(m.to)}
          >
            <div className="light-pastel-card__content">
              <h2>{m.title}</h2>
              <p>{m.desc}</p>
              <span className="light-pastel-card__cta">
                Launch Module <span>→</span>
              </span>
            </div>

            <div className="light-pastel-card__icon-box">
              {m.icon}
            </div>
          </article>
        ))}
      </section>

      {/* Light Recent Activity Table with Dark Text */}
      {user?.quizHistory && user.quizHistory.length > 0 && (
        <section className="history-section-light">
          <div className="history-header-light">
            <h2>Recent Simulation Attempts</h2>
            <span style={{ fontSize: '13px', color: '#4A4466', fontWeight: '700' }}>
              Showing last {Math.min(user.quizHistory.length, 5)} attempts
            </span>
          </div>

          <div className="history-table-wrapper">
            <table className="history-table-light">
              <thead>
                <tr>
                  <th>Emergency Module</th>
                  <th>Points Secured</th>
                  <th>Simulation Accuracy</th>
                  <th>Date Recorded</th>
                </tr>
              </thead>
              <tbody>
                {[...user.quizHistory].reverse().slice(0, 5).map((h, i) => {
                  const isPassed = h.percentage >= 60;
                  return (
                    <tr key={i}>
                      <td style={{ fontWeight: '800', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '9px',
                          height: '9px',
                          borderRadius: '50%',
                          backgroundColor: isPassed ? '#1b644d' : '#991b1b',
                        }} />
                        {h.category}
                      </td>
                      <td style={{ fontWeight: '700' }}>{h.score} / {h.totalQuestions}</td>
                      <td>
                        <span
                          style={{
                            padding: '4px 12px',
                            borderRadius: '8px',
                            fontSize: '12px',
                            fontWeight: '800',
                            backgroundColor: isPassed ? '#ddf1e4' : '#fee2e2',
                            color: isPassed ? '#1b644d' : '#991b1b',
                            border: `1.5px solid ${isPassed ? '#9FCBAD' : '#fca5a5'}`,
                          }}
                        >
                          {h.percentage}%
                        </span>
                      </td>
                      <td style={{ color: '#5c557c', fontWeight: '600' }}>
                        {new Date(h.completedAt).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Certificate Modal */}
      {showCertModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(27, 23, 38, 0.85)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#F1F7D4',
            border: '3px solid #9FCBAD',
            borderRadius: '26px',
            padding: '38px',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 20px 50px rgba(0,0,0,0.5)',
            color: '#262137',
          }}>
            <div style={{ fontSize: '50px', marginBottom: '12px' }}>🛡️</div>
            <span style={{ fontSize: '11px', color: '#1b644d', fontWeight: '800', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              SATARK RAHEIN • CERTIFICATE OF PREPAREDNESS
            </span>
            <h2 style={{ fontSize: '26px', color: '#262137', margin: '10px 0 6px 0', fontWeight: '800' }}>
              Campus Safety Compliance
            </h2>
            <p style={{ color: '#4A4466', fontSize: '14.5px', lineHeight: '1.6', margin: '0 0 20px 0', fontWeight: '500' }}>
              This certifies that <strong style={{ color: '#262137' }}>{user?.fullName}</strong> ({user?.roleField || 'Student'}) has successfully completed certified evacuation drills and disaster simulations with a readiness score of <strong style={{ color: '#1b644d' }}>{user?.totalScore} pts</strong>.
            </p>

            <button
              onClick={() => setShowCertModal(false)}
              style={{
                padding: '12px 28px',
                backgroundColor: '#262137',
                color: '#F1F7D4',
                border: 'none',
                borderRadius: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Close Certificate
            </button>
          </div>
        </div>
      )}
    </div>
  );
}