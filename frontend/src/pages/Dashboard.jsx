import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const MODULES = [
  {
    id: 'drills',
    title: 'Virtual Evacuation Drills',
    desc: 'Step-by-step simulated drills for fire, earthquake and flood scenarios — practice the right response before it matters.',
    to: '/drills',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M14 6h5v28h-5" />
        <path d="M19 20h14l-5-5m5 5l-5 5" />
        <circle cx="16.5" cy="9" r="2.6" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'quiz',
    title: 'Preparedness Quizzes',
    desc: 'Short quizzes on disaster awareness and response, with weak-area tracking so students know what to revisit.',
    to: '/quiz',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M13 15a7 7 0 1 1 9 6.7c-1.6.5-2 1.6-2 3.3" />
        <circle cx="20" cy="30.5" r="1.2" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'games',
    title: 'Awareness Games',
    desc: 'Light interactive games that build disaster-preparedness habits and reinforce what the drills and quizzes teach.',
    to: '/games',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <rect x="6" y="15" width="28" height="14" rx="7" />
        <path d="M14 19v6M11 22h6" />
        <circle cx="26" cy="20" r="1.4" fill="currentColor" stroke="none" />
        <circle cx="30" cy="24" r="1.4" fill="currentColor" stroke="none" />
      </svg>
    ),
  },
  {
    id: 'chatbot',
    title: 'Ask Satark AI',
    desc: 'An AI chat assistant for quick questions on safety procedures, drill steps or anything preparedness-related.',
    to: '/chatbot',
    icon: (
      <svg viewBox="0 0 40 40" aria-hidden="true">
        <path d="M8 12h24v14H18l-6 5v-5H8z" />
        <path d="M14 18h12M14 22h8" />
      </svg>
    ),
  },
];

export default function Dashboard() {
  const navigate = useNavigate();
  const raw = localStorage.getItem('sr_user');
  const user = raw ? JSON.parse(raw) : null;

  const handleLogout = () => {
    localStorage.removeItem('sr_token');
    localStorage.removeItem('sr_user');
    navigate('/auth');
  };

  return (
    <div className="home">
      <header className="home__header">
        <span className="home__logo">Satark Rahein</span>
        <div className="home__account">
          {user && <span className="home__role">{user.role}</span>}
          <button className="home__logout" onClick={handleLogout}>
            Log out
          </button>
        </div>
      </header>

      <section className="home__greeting">
        <h1>Welcome back{user?.fullName ? `, ${user.fullName.split(' ')[0]}` : ''}.</h1>
        <p>Pick up where you left off, or start a new module below.</p>
      </section>

      <section className="home__grid">
        {MODULES.map((m) => (
          <article key={m.id} className="module-card" onClick={() => navigate(m.to)}>
            <div className="module-card__icon">{m.icon}</div>
            <h2>{m.title}</h2>
            <p>{m.desc}</p>
            <span className="module-card__cta">Open →</span>
          </article>
        ))}
      </section>
    </div>
  );
}
