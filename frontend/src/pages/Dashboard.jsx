import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, getActiveBroadcast } from '../api.js';
import './Dashboard.css';

const MODULES = [
  {
    id: 'drills',
    title: 'Virtual Evacuation Drills',
    desc: 'Step-by-step simulated drills for fire, earthquake and flood scenarios.',
    to: '/drills',
    neonColor: '#ff8c00', // Neon Orange
    neonGlow: 'rgba(255, 140, 0, 0.55)',
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
    neonColor: '#00b4d8', // Electric Blue
    neonGlow: 'rgba(0, 180, 216, 0.55)',
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
    neonColor: '#10b981', // Neon Emerald
    neonGlow: 'rgba(16, 185, 129, 0.55)',
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
    neonColor: '#b5179e', // Neon Purple / Magenta
    neonGlow: 'rgba(181, 23, 158, 0.55)',
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
        console.error('Could not refresh profile stats:', err.message);
      }

      try {
        const bRes = await getActiveBroadcast();
        if (bRes?.broadcast) {
          setBroadcast(bRes.broadcast);
        }
      } catch (err) {
        // Broadcast silent fail if not admin
      }
    }
    loadData();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    navigate('/auth');
  };

  // Gamification: Badge Calculation
  const getBadge = (score = 0) => {
    if (score >= 100) return { title: 'Campus Warden', color: '#10b981', min: 100, next: 'Max Rank' };
    if (score >= 40) return { title: 'Emergency Ready', color: '#00b4d8', min: 40, next: 'Campus Warden (100 pts)' };
    return { title: 'Trainee Scout', color: '#ff8c00', min: 0, next: 'Emergency Ready (40 pts)' };
  };

  const badge = getBadge(user?.totalScore || 0);

  // Weak area finder from history
  const getWeakArea = () => {
    if (!user?.quizHistory || user.quizHistory.length === 0) return null;
    const lowAttempt = [...user.quizHistory].reverse().find((h) => h.percentage < 60);
    return lowAttempt ? lowAttempt.category : null;
  };

  const weakArea = getWeakArea();
  const isCertified = (user?.totalScore || 0) >= 50;

  return (
    <div className="home">
      {/* Top Navbar */}
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
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1.5px solid #f59e0b',
                color: '#f59e0b',
                padding: '6px 14px',
                borderRadius: '8px',
                fontSize: '12px',
                fontWeight: '800',
                cursor: 'pointer',
                boxShadow: '0 0 12px rgba(245, 158, 11, 0.35)',
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

      {/* 🚨 Live Emergency Broadcast Banner (Agar notice available ho) */}
      {broadcast && broadcast.message && (
        <div style={{
          backgroundColor: broadcast.severity === 'emergency' ? 'rgba(239, 68, 68, 0.15)' : 'rgba(245, 158, 11, 0.12)',
          border: `1.5px solid ${broadcast.severity === 'emergency' ? '#ef4444' : '#f59e0b'}`,
          borderRadius: '16px',
          padding: '14px 20px',
          marginBottom: '26px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '14px',
          boxShadow: `0 0 20px -5px ${broadcast.severity === 'emergency' ? 'rgba(239, 68, 68, 0.4)' : 'rgba(245, 158, 11, 0.3)'}`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '22px' }}>{broadcast.severity === 'emergency' ? '🚨' : '📢'}</span>
            <div>
              <strong style={{ color: broadcast.severity === 'emergency' ? '#f87171' : '#fbbf24', fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                INSTITUTE NOTICE: {broadcast.title}
              </strong>
              <p style={{ margin: '2px 0 0 0', color: '#e2e8f0', fontSize: '13.5px' }}>
                {broadcast.message}
              </p>
            </div>
          </div>
          <span style={{ fontSize: '11px', color: '#94a3b8', whiteSpace: 'nowrap' }}>
            Live Broadcast
          </span>
        </div>
      )}

      {/* Hero Header with Location Priority Pill */}
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
            padding: '6px 14px',
            borderRadius: '30px',
            background: 'rgba(255, 140, 0, 0.1)',
            border: '1px solid rgba(255, 140, 0, 0.3)',
            color: '#ff8c00',
            fontSize: '12px',
            fontWeight: '700',
          }}>
            📍 Priority Zone: Seismic Zone IV & Urban Fire Safety
          </div>
        </div>

        <div className="home__greeting-box">
          <h1>Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.</h1>
          <p>
            ID / Section: <strong style={{ color: '#fff' }}>{user?.roleField || 'Registered Student'}</strong> • Complete location drills to unlock your Safety Certificate.
          </p>
        </div>
      </section>

      {/* 📊 Student Preparedness Snapshot (Progress & Badge Bar) */}
      <section style={{
        backgroundColor: 'rgba(13, 20, 38, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '20px',
        padding: '22px 28px',
        marginBottom: '32px',
        display: 'grid',
        gridTemplateColumns: '1.2fr 1fr 1fr',
        gap: '20px',
        alignItems: 'center',
      }}>
        {/* Readiness Meter */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px' }}>
            <span style={{ color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Safety Readiness Score</span>
            <strong style={{ color: '#00b4d8' }}>{user?.totalScore || 0} pts (Target: 100)</strong>
          </div>
          <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.06)', height: '8px', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{
              width: `${Math.min(100, ((user?.totalScore || 0) / 100) * 100)}%`,
              backgroundColor: '#00b4d8',
              boxShadow: '0 0 10px #00b4d8',
              height: '100%',
              transition: 'width 0.4s ease',
            }} />
          </div>
          <span style={{ fontSize: '11px', color: '#64748b', marginTop: '6px', display: 'block' }}>
            Next Rank: {badge.next}
          </span>
        </div>

        {/* Badge & Total Drills */}
        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.06)', paddingLeft: '20px' }}>
          <span style={{ fontSize: '11px', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase' }}>Current Rank</span>
          <div style={{ fontSize: '18px', fontWeight: '800', color: badge.color, marginTop: '4px' }}>
            🎖️ {badge.title}
          </div>
          <span style={{ fontSize: '12px', color: '#cbd5e1' }}>
            {user?.quizzesCompleted || 0} drills passed
          </span>
        </div>

        {/* Certificate / Weak Area Alert */}
        <div style={{ borderLeft: '1px solid rgba(255, 255, 255, 0.06)', paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {weakArea && (
            <div style={{ fontSize: '12px', color: '#f87171', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>⚠️</span>
              <span>Needs Practice: <strong>{weakArea}</strong></span>
            </div>
          )}

          <button
            onClick={() => isCertified && setShowCertModal(true)}
            style={{
              padding: '8px 16px',
              borderRadius: '8px',
              border: isCertified ? '1.5px solid #10b981' : '1px solid rgba(255, 255, 255, 0.1)',
              backgroundColor: isCertified ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
              color: isCertified ? '#34d399' : '#64748b',
              cursor: isCertified ? 'pointer' : 'not-allowed',
              fontWeight: '700',
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

      {/* Exact 2x2 Glowing Cards Grid */}
      <section className="home__grid">
        {MODULES.map((m) => (
          <article
            key={m.id}
            className="neon-card"
            style={{
              '--neon-color': m.neonColor,
              '--neon-glow': m.neonGlow,
            }}
            onClick={() => navigate(m.to)}
          >
            <div className="neon-card__bg-ambient" />
            <div className="neon-card__wave" />

            <div className="neon-card__content">
              <h2>{m.title}</h2>
              <p>{m.desc}</p>
              <span className="neon-card__cta">
                Launch Module <span>→</span>
              </span>
            </div>

            <div className="neon-card__icon-box">
              {m.icon}
            </div>
          </article>
        ))}
      </section>

      {/* Recent Activity Table */}
      {user?.quizHistory && user.quizHistory.length > 0 && (
        <section className="history-section">
          <div className="history-header">
            <h2>Recent Simulation Attempts</h2>
            <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
              Showing last {Math.min(user.quizHistory.length, 5)} attempts
            </span>
          </div>

          <div className="history-table-wrapper">
            <table className="history-table">
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
                      <td style={{ fontWeight: '700', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span style={{
                          width: '7px',
                          height: '7px',
                          borderRadius: '50%',
                          backgroundColor: isPassed ? '#10b981' : '#ef4444',
                          boxShadow: `0 0 8px ${isPassed ? '#10b981' : '#ef4444'}`
                        }} />
                        {h.category}
                      </td>
                      <td>{h.score} / {h.totalQuestions}</td>
                      <td>
                        <span
                          className="accuracy-chip"
                          style={{
                            backgroundColor: isPassed ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                            color: isPassed ? '#34d399' : '#f87171',
                            border: `1px solid ${isPassed ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                          }}
                        >
                          {h.percentage}%
                        </span>
                      </td>
                      <td style={{ color: '#64748b' }}>
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

      {/* 🎓 Certificate Modal (Popup) */}
      {showCertModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px',
        }}>
          <div style={{
            backgroundColor: '#0a0f1d',
            border: '2px solid #10b981',
            borderRadius: '24px',
            padding: '36px',
            maxWidth: '560px',
            width: '100%',
            textAlign: 'center',
            boxShadow: '0 0 40px rgba(16, 185, 129, 0.3)',
            position: 'relative',
          }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>🛡️</div>
            <span style={{ fontSize: '11px', color: '#10b981', fontWeight: '800', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
              SATARK RAHEIN • CERTIFICATE OF PREPAREDNESS
            </span>
            <h2 style={{ fontSize: '24px', color: '#fff', margin: '10px 0 6px 0', fontWeight: '800' }}>
              Campus Safety Compliance
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '14px', lineHeight: '1.6', margin: '0 0 20px 0' }}>
              This certifies that <strong style={{ color: '#fff' }}>{user?.fullName}</strong> ({user?.roleField || 'Student'}) has successfully completed certified evacuation drills and disaster simulations with a readiness score of <strong style={{ color: '#10b981' }}>{user?.totalScore} pts</strong>.
            </p>

            <div style={{ backgroundColor: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '12px', fontSize: '12px', color: '#cbd5e1', marginBottom: '24px' }}>
              Verified under National Disaster Management Life-Safety Protocols • Date: {new Date().toLocaleDateString()}
            </div>

            <button
              onClick={() => setShowCertModal(false)}
              style={{
                padding: '10px 24px',
                backgroundColor: '#10b981',
                color: '#070c18',
                border: 'none',
                borderRadius: '10px',
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