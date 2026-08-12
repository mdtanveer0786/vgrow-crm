import React, { useState, useRef, useEffect } from 'react';
import { useAppContext } from '../../context/AppContext';
import { Sparkles, X, Send, Bot } from 'lucide-react';

export default function KaranChat() {
  const { showKaranPanel, setShowKaranPanel } = useAppContext();
  const [messages, setMessages] = useState([
    {
      id: '1',
      sender: 'bot',
      text: "Hello! I am Karan, your VGrow AI Copilot. ⚡\n\nI have real-time access to your workspace. I can help you analyze leads, draft emails, check tickets, or summarize activities. What can I do for you today?",
      createdAt: new Date()
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  if (!showKaranPanel) return null;

  const handleSend = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim()) return;

    // Add user message
    const userMsg = {
      id: Date.now().toString(),
      sender: 'user',
      text,
      createdAt: new Date()
    };
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      // Direct call to VGrow backend AI Endpoint
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/ai/copilot', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ query: text })
      });
      const data = await res.json();
      
      const botMsg = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        text: data.reply || "I encountered an error querying the model server database.",
        createdAt: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = {
        id: (Date.now() + 2).toString(),
        sender: 'bot',
        text: "Connection failed. Please check backend port status.",
        createdAt: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  const quickActions = [
    { label: "Summarize Leads", icon: "📊", query: "Summarize my leads status" },
    { label: "Draft Follow-up", icon: "✉️", query: "Draft a follow-up email" },
    { label: "Recent Activities", icon: "🕒", query: "Check recent activity logs" }
  ];

  return (
    <div 
      className="glass-panel"
      style={{
        position: 'fixed',
        right: '24px',
        top: '80px',
        bottom: '24px',
        width: '380px',
        display: 'flex',
        flexDirection: 'column',
        zIndex: 999,
        padding: 0,
        overflow: 'hidden',
        border: '1px solid var(--border-color)',
        boxShadow: '0 20px 50px rgba(0, 0, 0, 0.4)',
        animation: 'slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
      }}
    >
      {/* Header */}
      <div style={{
        padding: '16px 20px',
        borderBottom: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        background: 'var(--bg-secondary)',
        flexShrink: 0
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{
            width: '28px',
            height: '28px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-purple) 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white'
          }}>
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          <div>
            <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)', margin: 0 }}>Karan</h4>
            <span style={{ fontSize: '9px', color: 'var(--accent-emerald)', fontWeight: '700' }}>● AI Copilot Online</span>
          </div>
        </div>
        <button 
          onClick={() => setShowKaranPanel(false)}
          style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: '4px' }}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Chat Messages */}
      <div style={{
        flexGrow: 1,
        overflowY: 'auto',
        padding: '20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
        background: 'var(--bg-primary)'
      }}>
        {messages.map((msg) => {
          const isBot = msg.sender === 'bot';
          return (
            <div 
              key={msg.id}
              style={{
                display: 'flex',
                gap: '8px',
                alignSelf: isBot ? 'flex-start' : 'flex-end',
                maxWidth: '85%'
              }}
            >
              {isBot && (
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  background: 'rgba(99, 102, 241, 0.1)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--accent-indigo)',
                  flexShrink: 0
                }}>
                  <Bot className="w-3 h-3" />
                </div>
              )}
              <div style={{
                background: isBot ? 'var(--bg-secondary)' : 'var(--accent-indigo)',
                color: isBot ? 'var(--text-primary)' : 'white',
                padding: '10px 14px',
                borderRadius: isBot ? '0 12px 12px 12px' : '12px 0 12px 12px',
                border: isBot ? '1px solid var(--border-color)' : 'none',
                fontSize: '12px',
                lineHeight: '1.5',
                whiteSpace: 'pre-wrap'
              }}>
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div style={{ display: 'flex', gap: '8px', alignSelf: 'flex-start' }}>
            <div style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              background: 'rgba(99, 102, 241, 0.1)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--accent-indigo)',
              flexShrink: 0
            }}>
              <Bot className="w-3 h-3" />
            </div>
            <div className="typing-indicator" style={{
              background: 'var(--bg-secondary)',
              padding: '10px 16px',
              borderRadius: '0 12px 12px 12px',
              border: '1px solid var(--border-color)',
              fontSize: '12px',
              color: 'var(--text-secondary)'
            }}>
              Karan is analyzing...
            </div>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Quick Actions Panel */}
      <div style={{
        padding: '12px 16px 8px 16px',
        background: 'var(--bg-secondary)',
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        flexShrink: 0
      }}>
        {quickActions.map((action, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(action.query)}
            style={{
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: '16px',
              padding: '6px 12px',
              fontSize: '10px',
              fontWeight: '600',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              transition: 'all 0.2s ease'
            }}
          >
            <span>{action.icon}</span>
            <span>{action.label}</span>
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form 
        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
        style={{
          padding: '12px 16px 16px 16px',
          background: 'var(--bg-secondary)',
          display: 'flex',
          gap: '8px',
          alignItems: 'center',
          flexShrink: 0
        }}
      >
        <input 
          type="text"
          placeholder="Ask Karan anything..."
          className="form-input"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          style={{ flexGrow: 1, padding: '8px 12px', fontSize: '12px', borderRadius: '18px' }}
        />
        <button 
          type="submit" 
          className="btn-primary"
          style={{ 
            borderRadius: '50%', 
            width: '32px', 
            height: '32px', 
            padding: 0, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexShrink: 0 
          }}
        >
          <Send className="w-3.5 h-3.5" />
        </button>
      </form>
    </div>
  );
}
