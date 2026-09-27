import { useNavigate } from 'react-router-dom';
import './ModulePlaceholder.css';

// Shared shell for the four module pages until each gets real content/logic.
export default function ModulePlaceholder({ title, note }) {
  const navigate = useNavigate();
  return (
    <div className="placeholder">
      <button className="placeholder__back" onClick={() => navigate('/dashboard')}>
        ← Dashboard
      </button>
      <h1>{title}</h1>
      <p>{note}</p>
    </div>
  );
}
