import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, Send, User, ShieldCheck, Search, SearchIcon, Filter } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';

export default function ChatPage() {
  const { activeTab } = useAppContext();
  const [messages, setMessages] = useState([
    { id: 1, sender: 'Pawan Tiwari', text: 'Hey, I had some questions regarding the billing invoice', time: '10:02 AM', isMe: false },
    { id: 2, sender: 'System Agent', text: 'Sure! I can help you with invoice queries.', time: '10:03 AM', isMe: true }
  ]);
  const [inputText, setInputText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);
  const { API_BASE, authFetch } = useAppContext();

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    
    const userMsg = {
      id: Date.now(),
      sender: 'Me',
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isMe: true
    };
    
    setMessages(prev => [...prev, userMsg]);
    setInputText('');
    setIsTyping(true);

    try {
      const res = await authFetch(`${API_BASE}/ai/copilot`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: userMsg.text })
      });
      const data = await res.json();
      
      const replyMsg = {
        id: Date.now() + 1,
        sender: 'AI Copilot',
        text: data.reply || 'I am unable to process that right now.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      };
      setMessages(prev => [...prev, replyMsg]);
    } catch (err) {
      console.error('Failed to get AI response', err);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        sender: 'System',
        text: 'Error connecting to AI Copilot service.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isMe: false
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {activeTab === 'chat' && (
        <div className="animate-fade-in" style={{ display: 'flex', height: 'calc(100vh - 120px)', minHeight: '400px', gap: '20px' }}>
          
          {/* Chat Threads Sidebar */}
          <Card padding="16px" style={{ width: '280px', minWidth: 0, flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Chat Channels</h3>
            
            {/* Search Box */}
            <div style={{ position: 'relative' }}>
              <Search className="w-4 h-4" style={{ position: 'absolute', left: '8px', top: '8px', color: 'var(--text-secondary)' }} />
              <input 
                type="text" 
                placeholder="Search threads..." 
                className="form-input" 
                style={{ paddingLeft: '26px', fontSize: '11px', height: '28px' }}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', overflowY: 'auto', flexGrow: 1 }}>
              {['Pawan Tiwari'].filter(n => n.toLowerCase().includes(searchTerm.toLowerCase())).map(n => (
                <div key={n} style={{ padding: '12px', background: 'rgba(21, 107, 244, 0.08)', border: '1px solid var(--accent-indigo)', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '12px' }}>
                    {n.split(' ').map(p => p[0]).join('')}
                  </div>
                  <div>
                    <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{n}</h4>
                    <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Active now</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Main Chat Area */}
          <Card padding="16px" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Pawan Tiwari</h3>
                <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>Customer Live Chat Feed</span>
              </div>
              <Badge variant="emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '10px' }}>
                <ShieldCheck className="w-3.5 h-3.5" />
                Secure
              </Badge>
            </div>

            {/* Message History */}
            <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {messages.map(msg => (
                <div 
                  key={msg.id}
                  style={{ 
                    alignSelf: msg.isMe ? 'flex-end' : 'flex-start',
                    maxWidth: '70%',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: msg.isMe ? 'var(--accent-indigo)' : 'rgba(255,255,255,0.03)',
                    color: msg.isMe ? 'white' : 'var(--text-primary)',
                    border: msg.isMe ? 'none' : '1px solid var(--border-color)'
                  }}
                >
                  <p style={{ fontSize: '12px', margin: 0 }}>{msg.text}</p>
                  <span style={{ fontSize: '8px', opacity: 0.6, display: 'block', textAlign: 'right', marginTop: '4px' }}>{msg.time}</span>
                </div>
              ))}
              {isTyping && (
                <div style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.03)', padding: '10px 14px', borderRadius: '12px', border: '1px solid var(--border-color)', color: 'var(--text-secondary)', fontSize: '12px' }}>
                  AI is typing...
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Composer */}
            <form onSubmit={handleSendMessage} style={{ display: 'flex', gap: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '12px' }}>
              <input 
                type="text" 
                className="form-input" 
                placeholder="Type your message here..."
                style={{ flexGrow: 1 }}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button variant="primary" type="submit" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Send className="w-4 h-4" />
                Send
              </Button>
            </form>
          </Card>

        </div>
      )}
    </>
  );
}
