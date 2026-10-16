import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="landing">
      <div className="landing__radar" aria-hidden="true">
        <span className="ring ring--1" />
        <span className="ring ring--2" />
        <span className="ring ring--3" />
      </div>

      <svg className="landing__icon landing__icon--flame" viewBox="0 0 64 64" aria-hidden="true">
        <path d="M32 4c4 10-6 14-6 22 0 6 4 10 10 10s10-5 10-12c6 6 8 14 8 20 0 12-10 22-22 22S10 46 10 34c0-14 12-20 22-30z" />
      </svg>
      <svg className="landing__icon landing__icon--wave" viewBox="0 0 100 40" aria-hidden="true">
        <path d="M0 24c8-10 17-10 25 0s17 10 25 0 17-10 25 0 17 10 25 0" />
        <path d="M0 34c8-10 17-10 25 0s17 10 25 0 17-10 25 0 17 10 25 0" />
      </svg>
      <svg className="landing__icon landing__icon--crack" viewBox="0 0 60 60" aria-hidden="true">
        <path d="M6 6l14 12-6 8 16 10-4 10 20 14M18 40l10-6M40 18l-8 8" />
      </svg>

      <main className="landing__content">
        <h1 className="landing__title">
          सतर्क <span>रहें</span>
        </h1>
        <p className="landing__sub">SATARK RAHEIN</p>
        
        <button className="landing__cta" onClick={() => navigate('/auth')}>
          Enter Platform
        </button>
      </main>

      
    </div>
  );
}
