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

  return (
    <div style={{ maxWidth: '860px', margin: '30px auto', padding: '0 20px', fontFamily: 'inherit', color: '#f3f4f6' }}>
      
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '22px' }}>
        <button
          onClick={() => navigate('/dashboard')}
          style={{
            background: 'rgba(181, 23, 158, 0.08)',
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
          ← Back to Dashboard
        </button>
        <span style={{ fontSize: '13px', color: THEME.primary, fontWeight: '800', letterSpacing: '0.05em' }}>
          Ask Satark AI
        </span>
      </div>

      {/* Main Chat Box */}
      <div style={{
        backgroundColor: THEME.bgGlass,
        border: `2px solid ${THEME.primary}`,
        boxShadow: `0 0 25px -2px ${THEME.glow}`,
        borderRadius: '20px',
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
                    backgroundColor: 'rgba(181, 23, 158, 0.2)',
                    border: `1px solid ${THEME.border}`,
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
                    backgroundColor: isBot ? 'rgba(255, 255, 255, 0.04)' : THEME.primary,
                    color: '#ffffff',
                    padding: '14px 18px',
                    borderRadius: isBot ? '4px 16px 16px 16px' : '16px 4px 16px 16px',
                    fontSize: '14.5px',
                    lineHeight: '1.55',
                    border: isBot ? `1px solid ${THEME.border}` : 'none',
                    boxShadow: !isBot ? `0 0 15px -3px ${THEME.glow}` : 'none',
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
                backgroundColor: 'rgba(181, 23, 158, 0.2)',
                border: `1px solid ${THEME.border}`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '15px'
              }}>
                🛡️
              </div>
              <div style={{
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                padding: '12px 18px',
                borderRadius: '4px 16px 16px 16px',
                color: '#94a3b8',
                fontSize: '14px',
                border: `1px solid ${THEME.border}`
              }}>
                Satark AI is retrieving verified NDMA guidelines...
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Suggestion Chips */}
        <div style={{ padding: '10px 20px', display: 'flex', gap: '8px', overflowX: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: 'rgba(0, 0, 0, 0.3)' }}>
          {QUICK_PROMPTS.map((prompt, i) => (
            <button
              key={i}
              onClick={() => handleSend(prompt)}
              style={{
                whiteSpace: 'nowrap',
                backgroundColor: 'rgba(181, 23, 158, 0.1)',
                border: `1px solid ${THEME.border}`,
                color: '#e2e8f0',
                padding: '6px 14px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              {prompt}
            </button>
          ))}
        </div>

        {/* Input Bar */}
        <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255, 255, 255, 0.06)', backgroundColor: 'rgba(13, 20, 38, 0.95)', display: 'flex', gap: '12px' }}>
          <input
            type="text"
            placeholder="Ask anything about earthquake, fire, flood, or helpline numbers..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{
              flex: 1,
              backgroundColor: 'rgba(255, 255, 255, 0.04)',
              border: '1.5px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '10px',
              padding: '12px 16px',
              color: '#ffffff',
              fontSize: '14px',
              outline: 'none',
            }}
          />
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || loading}
            style={{
              backgroundColor: THEME.primary,
              color: '#ffffff',
              border: 'none',
              borderRadius: '10px',
              padding: '0 22px',
              fontWeight: '800',
              cursor: !input.trim() || loading ? 'not-allowed' : 'pointer',
              opacity: !input.trim() || loading ? 0.6 : 1,
              boxShadow: `0 0 15px ${THEME.glow}`,
            }}
          >
            Send →
          </button>
        </div>
      </div>
    </div>
  );
}