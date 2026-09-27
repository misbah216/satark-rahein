import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import Dashboard from './pages/Dashboard.jsx';
import DrillsPage from './pages/DrillsPage.jsx';
import QuizPage from './pages/QuizPage.jsx';
import GamesPage from './pages/GamesPage.jsx';
import ChatbotPage from './pages/ChatbotPage.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/drills" element={<DrillsPage />} />
      <Route path="/quiz" element={<QuizPage />} />
      <Route path="/games" element={<GamesPage />} />
      <Route path="/chatbot" element={<ChatbotPage />} />
    </Routes>
  );
}
