import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Sparkles } from 'lucide-react';
import { Button, Input } from '../../ui';
import { ActionableMessage, CopilotMessage } from './ActionableMessage';
import { useAppContext } from '../../../context/AppContext';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const { authHeaders } = useAppContext();
  const [messages, setMessages] = useState<CopilotMessage[]>([{
    id: '1',
    sender: 'ai',
    text: "Hi! I'm your vGrow AI Sales Copilot. I can analyze your pipeline, suggest who to follow up with, and draft emails for you. What would you like to do today?",
    timestamp: new Date().toISOString()
  }]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim()) return;
    
    const userMsg: CopilotMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsTyping(true);

    try {
      const res = await fetch('/api/ai/copilot', {
        method: 'POST',
        headers: authHeaders(),
        body: JSON.stringify({ query: userMsg.text })
      });
      
      const data = await res.json();
      
      const aiMsg: CopilotMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: data.reply,
        actionPayload: data.actions && data.actions.length > 0 ? data.actions[0] : undefined,
        timestamp: new Date().toISOString()
      };
      
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: "I'm having trouble connecting to the intelligence engine right now.",
        timestamp: new Date().toISOString()
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const executeAction = async (type: string, data: any) => {
    // In a real implementation, this would dispatch to the respective store/API
    console.log('Executing AI Action:', type, data);
    alert(`Executed: ${type}`);
  };

  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0, right: 0, bottom: 0,
      width: '400px',
      background: 'var(--bg-primary)',
      borderLeft: '1px solid var(--border-color)',
      boxShadow: 'var(--shadow-glass)',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 1000,
      transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
      transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
    }}>
      {/* Header */}
      <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-secondary)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-purple) 100%)', padding: '6px', borderRadius: '8px' }}>
            <Sparkles size={16} color="white" />
          </div>
          <h3 style={{ fontSize: '16px', fontWeight: '800' }}>AI Sales Copilot</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={onClose}><X size={16} /></Button>
      </div>

      {/* Chat Area */}
      <div ref={scrollRef} style={{ flex: 1, overflowY: 'auto', padding: '24px 16px', display: 'flex', flexDirection: 'column' }}>
        {messages.map(msg => (
          <ActionableMessage key={msg.id} message={msg} onExecuteAction={executeAction} />
        ))}
        {isTyping && (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '8px 0' }}>
            <Sparkles size={12} className="animate-pulse" /> Copilot is thinking...
          </div>
        )}
      </div>

      {/* Input Area */}
      <div style={{ padding: '16px', borderTop: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}>
        <div style={{ position: 'relative', display: 'flex', gap: '8px' }}>
          <Input 
            placeholder="Ask AI to find leads, draft emails, or analyze pipeline..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            style={{ paddingRight: '40px', borderRadius: '24px' }}
          />
          <Button 
            variant="primary" 
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            style={{ borderRadius: '50%', width: '40px', height: '40px', padding: 0, flexShrink: 0, display: 'flex', justifyContent: 'center', alignItems: 'center' }}
          >
            <Send size={16} />
          </Button>
        </div>
        <div style={{ display: 'flex', gap: '8px', marginTop: '12px', overflowX: 'auto', paddingBottom: '4px' }} className="no-scrollbar">
          <span onClick={() => setInput("Who should I follow up with today?")} style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Who to follow up with?</span>
          <span onClick={() => setInput("Draft an email for recent leads")} style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Draft email for leads</span>
          <span onClick={() => setInput("Summarize my pipeline")} style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--bg-secondary)', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap' }}>Pipeline summary</span>
          <span onClick={async () => {
            const phoneNumber = prompt("Enter phone number to call (e.g. +1234567890):");
            if (!phoneNumber) return;
            try {
              const res = await fetch('/api/voice/outbound', {
                method: 'POST',
                headers: { ...authHeaders(), 'Content-Type': 'application/json' },
                body: JSON.stringify({ to: phoneNumber })
              });
              const data = await res.json();
              if (data.success) {
                alert('Call initiated!');
              } else {
                alert('Failed to initiate call: ' + data.message);
              }
            } catch (err) {
              alert('Error initiating call');
            }
          }} style={{ fontSize: '11px', padding: '4px 10px', background: 'var(--accent-indigo)', color: 'white', borderRadius: '12px', cursor: 'pointer', whiteSpace: 'nowrap', display: 'flex', alignItems: 'center', gap: '4px' }}>📞 Call Lead</span>
        </div>
      </div>
    </div>
  );
};
