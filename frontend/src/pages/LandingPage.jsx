import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

export default function LandingPage() {
  const navigate = useNavigate();
  const token = localStorage.getItem('sr_token');

  return (
    <div className="landing-container">
      {/* Background Dots */}
      <div className="landing-grid-bg" />

      {/* 🚨 3-Layer Concentric Red Warning Waves */}
      <div className="radar-pulse-ring" />
      <div className="radar-pulse-ring-2" />
      <div className="radar-pulse-ring-3" />

      {/* Top Bar */}
      <header className="landing-top-bar">
        

        
      </header>

      {/* Center Screen: Warning Chip + Giant Pulsing Hindi Title */}
      <main className="landing-hero-center">
        

        {/* Bada-Bada Hindi Title with Red Warning Motion */}
        <h1 className="landing-big-hindi-title">
          सतर्क रहें
        </h1>

        

        {/* Action Buttons */}
        <div className="landing-cta-group">
          <button
            className="landing-btn-primary"
            onClick={() => navigate(token ? '/dashboard' : '/auth')}
          >
            {token ? 'Dashboard me jayein →' : 'Enter platform →'}
          </button>

         
        </div>
      </main>

      
      <div style={{ zIndex: 10, height: '10px' }} />
    </div>
  );
}