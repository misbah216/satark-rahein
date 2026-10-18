import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendChatMessage } from '../api.js';

const THEME = {
  primary: '#b5179e',
  glow: 'rgba(181, 23, 158, 0.45)',
  bgGlass: 'rgba(13, 20, 38, 0.85)',
  border: 'rgba(181, 23, 158, 0.35)',
};

const QUICK_PROMPTS = [
  'What should I do during an Earthquake?',
  'Explain the Fire PASS rule',
  'What are campus emergency numbers?',
  'How to handle flash flood on campus?',
];

export default function ChatbotPage() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! I am Satark AI, your safety and disaster preparedness guide. How can I assist you with emergency protocols today?'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim() || loading) return;

    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const data = await sendChatMessage(query);
      setMessages((prev) => [...prev, { sender: 'bot', text: data.reply }]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'Sorry, I had trouble processing that request. Please verify your connection or ask again.' }
      ]);
    } finally {
      setLoading(false);
    }
  };

  {/* Top Theme Configuration matching Ask Satark AI Card (#e5e1f0 / #9e92bc) */}
const THEME = {
  primary: '#4338ca',           // Deep Indigo for primary send button & active highlights
  secondary: '#9e92bc',         // Soft Lavender accent border
  bgGlass: '#e5e1f0',           // AI Card Soft Lavender Light Background
  border: '#9e92bc',
  glow: 'rgba(158, 146, 188, 0.45)',
  textDark: '#1e293b',          // Crisp Dark Header/Text
  textMuted: '#475569',
};

return (
  <div style={{ maxWidth: '860px', margin: '30px auto', padding: '0 20px', fontFamily: 'inherit', color: '#F1F7D4' }}>
    
    {/* Top Header */}
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
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
          transition: 'all 0.2s ease',
        }}
      >
        ← Back to Dashboard
      </button>
      <span style={{ fontSize: '13px', color: '#F1F7D4', fontWeight: '800', letterSpacing: '0.06em', background: 'rgba(158, 146, 188, 0.3)', padding: '5px 14px', borderRadius: '20px' }}>
        🔮 Ask Satark AI
      </span>
    </div>

    {/* Main Chat Box */}
    <div style={{
      backgroundColor: '#e5e1f0',
      border: `2px solid #9e92bc`,
      boxShadow: `0 12px 32px -8px rgba(0, 0, 0, 0.3)`,
      borderRadius: '24px',
      display: 'flex',
      flexDirection: 'column',
      height: '620px',
      overflow: 'hidden'
    }}>
      
      {/* Chat History */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {messages.map((m, idx) => {
          const isBot = m.sender === 'bot';
          return (
            <div
              key={idx}
              style={{
                alignSelf: isBot ? 'flex-start' : 'flex-end',
                maxWidth: '82%',
                display: 'flex',
                gap: '10px',
                alignItems: 'flex-start'
              }}
            >
              {isBot && (
                <div style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '10px',
                  backgroundColor: 'rgba(67, 56, 202, 0.15)',
                  border: `1.5px solid #9e92bc`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '15px',
                  flexShrink: 0
                }}>
                  🛡️
                </div>
              )}
              <div
                style={{
                  backgroundColor: isBot ? '#ffffff' : '#1e293b',
                  color: isBot ? '#1e293b' : '#F1F7D4',
                  padding: '14px 18px',
                  borderRadius: isBot ? '4px 18px 18px 18px' : '18px 4px 18px 18px',
                  fontSize: '14.5px',
                  lineHeight: '1.55',
                  fontWeight: isBot ? '500' : '600',
                  border: isBot ? '1.5px solid #cbd5e1' : 'none',
                  boxShadow: isBot ? '0 4px 12px rgba(0,0,0,0.05)' : '0 4px 14px rgba(30, 41, 59, 0.25)',
                }}
              >
                {m.text}
              </div>
            </div>
          );
        })}

        {loading && (
          <div style={{ alignSelf: 'flex-start', display: 'flex', gap: '10px', alignItems: 'center' }}>
            <div style={{
              width: '34px',
              height: '34px',
              borderRadius: '10px',
              backgroundColor: 'rgba(67, 56, 202, 0.15)',
              border: `1.5px solid #9e92bc`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '15px'
            }}>
              🛡️
            </div>
            <div style={{
              backgroundColor: '#ffffff',
              padding: '12px 18px',
              borderRadius: '4px 16px 16px 16px',
              color: '#475569',
              fontSize: '14px',
              fontWeight: '600',
              border: '1.5px solid #cbd5e1',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
              Satark AI is retrieving verified NDMA guidelines...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Suggestion Chips */}
      <div style={{ 
        padding: '10px 20px', 
        display: 'flex', 
        gap: '8px', 
        overflowX: 'auto', 
        borderTop: '1.5px solid rgba(158, 146, 188, 0.25)', 
        backgroundColor: '#f3f1f8' 
      }}>
        {QUICK_PROMPTS.map((prompt, i) => (
          <button
            key={i}
            onClick={() => handleSend(prompt)}
            style={{
              whiteSpace: 'nowrap',
              backgroundColor: '#ffffff',
              border: `1.5px solid #cbd5e1`,
              color: '#1e293b',
              padding: '6px 14px',
              borderRadius: '20px',
              fontSize: '12px',
              fontWeight: '700',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
              transition: 'all 0.15s ease'
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Bar */}
      <div style={{ 
        padding: '16px 20px', 
        borderTop: '1.5px solid rgba(158, 146, 188, 0.25)', 
        backgroundColor: '#ffffff', 
        display: 'flex', 
        gap: '12px' 
      }}>
        <input
          type="text"
          placeholder="Ask anything about earthquake, fire, flood, or helpline numbers..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          style={{
            flex: 1,
            backgroundColor: '#f8fafc',
            border: '1.5px solid #cbd5e1',
            borderRadius: '12px',
            padding: '12px 16px',
            color: '#1e293b',
            fontSize: '14px',
            fontWeight: '600',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        />
        <button
          onClick={() => handleSend()}
          disabled={!input.trim() || loading}
          style={{
            backgroundColor: '#1e293b',
            color: '#F1F7D4',
            border: 'none',
            borderRadius: '12px',
            padding: '0 24px',
            fontWeight: '800',
            fontSize: '14px',
            cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
            opacity: !input.trim() || loading ? 0.6 : 1,
            boxShadow: '0 4px 14px rgba(30, 41, 59, 0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          Send →
        </button>
      </div>
    </div>
  </div>
);
}