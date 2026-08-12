import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  MessageSquare, Send, Bot, CheckCheck, Phone, Video,
  Info, Search, Filter, Sparkles, HelpCircle
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';
export default function WhatsappPage() {
  const { activeTab, authFetch, API_BASE, communications, realtimeWhatsAppMessages } = useAppContext();

  const [activeChat, setActiveChat] = useState(null);
  const [inputText, setInputText] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [aiAutoReply, setAiAutoReply] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState('');

  // Local India-first business messaging templates
  const templatesList = [
    { code: 'welcome_lead', label: 'Welcome Intro (Discovery)', text: 'Namaste! Thanks for connecting with VGrow CRM. We would love to discuss how our AI operating system can help scale your sales pipeline. Let us know a convenient time to sync up.' },
    { code: 'payment_reminder', label: 'Outstanding Payment Alert', text: 'Dear Client, this is a friendly update regarding your outstanding invoice. You can pay securely using Razorpay/UPI payment links. Let us know if you need any assistance.' },
    { code: 'gst_estimate_shared', label: 'GST Quotation Shared', text: 'Hi! We have shared the formal sales estimate. The proposal includes a breakdown of base taxable values and CGST+SGST slabs. Please review and let us know your feedback.' }
  ];

  // Build chats from real communications data (WhatsApp type)
  const whatsappComms = communications.filter(c => c.type === 'WhatsApp');
  const chats = whatsappComms.length > 0
    ? whatsappComms.map(c => ({
        id: c.id,
        name: c.contactName || c.direction || 'Unknown',
        phone: c.phone || '',
        unread: 0,
        lastMsg: c.description || c.title || '',
        time: c.createdAt ? new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '',
        status: c.status || 'sent'
      }))
    : [];

  const [messages, setMessages] = useState({});

  useEffect(() => {
    if (realtimeWhatsAppMessages && realtimeWhatsAppMessages.length > 0) {
      const latestMsg = realtimeWhatsAppMessages[realtimeWhatsAppMessages.length - 1];
      // Match by phone or a fallback ID
      const targetChat = chats.find(c => c.phone === latestMsg.phone || c.id === latestMsg.chatId) || activeChat;
      const chatId = targetChat ? targetChat.id : (latestMsg.chatId || latestMsg.phone || 'unknown');
      
      setMessages(prev => {
        const chatMsgs = prev[chatId] || [];
        // Prevent duplicate appending
        if (chatMsgs.find(m => m.id === (latestMsg.id || latestMsg.text))) return prev;
        
        return {
          ...prev,
          [chatId]: [...chatMsgs, {
            id: latestMsg.id || latestMsg.text,
            text: latestMsg.text,
            sender: 'client',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
          }]
        };
      });
    }
  }, [realtimeWhatsAppMessages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeChat) return;

    const chatMsgs = messages[activeChat.id] || [];
    const newMsg = {
      id: chatMsgs.length + 1,
      text: inputText,
      sender: 'agent',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages({
      ...messages,
      [activeChat.id]: [...chatMsgs, newMsg]
    });
    setInputText('');
    setSelectedTemplate('');
  };

  const handleApplyTemplate = (tplText) => {
    setInputText(tplText);
  };

  return (
    <>
      {activeTab === 'whatsapp' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '20px', height: 'calc(100vh - 120px)' }}>
          
          {/* Header Stats */}
          <div className="page-header" style={{ flexShrink: 0 }}>
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <MessageSquare className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                WhatsApp API Hub
              </h2>
              <p className="page-desc">Official WhatsApp Business API templates, logs, and automated AI quick-replies.</p>
            </div>
          </div>

          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Unread Inbound Conversations</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{chats.filter(c => c.unread > 0).length}</h4>
              </div>
              <MessageSquare className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
            <Card style={{ padding: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>WhatsApp AI Agent Status</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: aiAutoReply ? 'var(--accent-emerald)' : 'var(--accent-rose)' }}>
                  {aiAutoReply ? 'Active Auto-Pilot' : 'Manual Copilot'}
                </h4>
              </div>
              <Button 
                variant="primary"
                onClick={() => setAiAutoReply(!aiAutoReply)} 
                style={{ padding: '6px 12px', fontSize: '11px', background: aiAutoReply ? 'var(--accent-rose)' : 'var(--accent-indigo)' }}
              >
                Toggle AI
              </Button>
            </Card>
          </div>

          {/* Main workspace */}
          <Card style={{ 
            display: 'flex', flex: 1, padding: 0, overflow: 'hidden', 
            borderRadius: '16px', minHeight: '400px',
            background: 'var(--bg-card)', 
            border: '1px solid rgba(255, 255, 255, 0.1)',
            boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.1)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)'
          }}>
            {chats.length === 0 ? (
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '40px', textAlign: 'center', gap: '20px' }}>
                <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: '50%' }}>
                  <MessageSquare className="w-12 h-12 text-indigo-400" />
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '800', color: 'var(--text-primary)' }}>Connect WhatsApp Business API</h3>
                  <p style={{ fontSize: '13px', color: 'var(--text-secondary)', maxWidth: '400px', margin: '8px auto 0' }}>
                    Link your Meta WhatsApp Business Account to send templates, automate alerts, and chat with clients in real-time.
                  </p>
                </div>
                <Card style={{ padding: '20px', width: '100%', maxWidth: '480px', display: 'flex', flexDirection: 'column', gap: '12px', textAlign: 'left' }}>
                  <Input label="Meta Phone Number ID" placeholder="e.g. 109827364523910" style={{ fontSize: '12px' }} />
                  <Input type="password" label="System User Access Token" placeholder="EAABw..." style={{ fontSize: '12px' }} />
                  <Button variant="primary" style={{ width: '100%', marginTop: '8px' }} onClick={() => alert('WhatsApp configuration options updated. Configure environment variables in backend to complete setup.')}>
                    Save API Configuration
                  </Button>
                </Card>
              </div>
            ) : (
              <>
                {/* Chats List Pane */}
                <div style={{ 
                  width: '320px', 
                  borderRight: '1px solid var(--border-color)', 
                  display: 'flex', flexDirection: 'column',
                  background: 'var(--bg-card)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ padding: '16px', display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-color)' }}>
                    <div style={{ flex: 1 }}>
                      <Input
                        type="text"
                        placeholder="Search chats..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        leftIcon={<Search style={{ width: '14px', height: '14px' }} />}
                        style={{ fontSize: '12px', height: '34px' }}
                      />
                    </div>
                    <Button variant="secondary" style={{ padding: '8px' }}><Filter className="w-4 h-4" /></Button>
                  </div>

                  <div style={{ flex: 1, overflowY: 'auto' }}>
                    {chats.filter(c => c.name.toLowerCase().includes(searchQuery.toLowerCase())).map(chat => (
                      <div
                        key={chat.id}
                        onClick={() => setActiveChat(chat)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          padding: '12px 16px',
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          background: activeChat?.id === chat.id ? 'rgba(21, 107, 244, 0.08)' : 'transparent',
                          transition: 'background 0.2s'
                        }}
                      >
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold', fontSize: '14px' }}>
                          {chat.name[0]}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{chat.name}</span>
                            <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{chat.time}</span>
                          </div>
                          <p style={{ fontSize: '11px', color: 'var(--text-secondary)', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', marginTop: '2px' }}>
                            {chat.lastMsg}
                          </p>
                        </div>
                        {chat.unread > 0 && (
                          <Badge variant="indigo">{chat.unread}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Chats Thread Window */}
                {activeChat ? (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.1)', position: 'relative' }}>
                    {/* Thread Header */}
                    <div style={{ 
                      padding: '16px 24px', 
                      background: 'var(--bg-secondary)', 
                      backdropFilter: 'blur(8px)',
                      borderBottom: '1px solid var(--border-color)', 
                      display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                      position: 'sticky', top: 0, zIndex: 10
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 'bold' }}>
                          {activeChat.name[0]}
                        </div>
                        <div>
                          <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{activeChat.name}</h4>
                          <p style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{activeChat.phone}</p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <Button variant="secondary" style={{ padding: '6px' }}><Phone className="w-4 h-4" /></Button>
                        <Button variant="secondary" style={{ padding: '6px' }}><Video className="w-4 h-4" /></Button>
                        <Button variant="secondary" style={{ padding: '6px' }}><Info className="w-4 h-4" /></Button>
                      </div>
                    </div>

                    {/* Message List */}
                    <div style={{ flex: 1, padding: '24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {(messages[activeChat.id] || []).map(msg => (
                        <div
                          key={msg.id}
                          style={{
                            display: 'flex',
                            justifyContent: msg.sender === 'agent' ? 'flex-end' : 'flex-start'
                          }}
                        >
                          <div
                            style={{
                              maxWidth: '75%',
                              padding: '12px 16px',
                              borderRadius: msg.sender === 'agent' ? '16px 16px 4px 16px' : '16px 16px 16px 4px',
                              background: msg.sender === 'agent' 
                                ? 'linear-gradient(135deg, var(--accent-indigo) 0%, #4f46e5 100%)' 
                                : 'rgba(255, 255, 255, 0.05)',
                              backdropFilter: msg.sender === 'agent' ? 'none' : 'blur(10px)',
                              color: msg.sender === 'agent' ? 'white' : 'var(--text-primary)',
                              border: msg.sender === 'agent' ? 'none' : '1px solid rgba(255,255,255,0.1)',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                            }}
                          >
                            <p style={{ fontSize: '12px', lineHeight: '1.4' }}>{msg.text}</p>
                            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '4px', marginTop: '4px' }}>
                              <span style={{ fontSize: '9px', color: msg.sender === 'agent' ? 'rgba(255,255,255,0.7)' : 'var(--text-secondary)' }}>{msg.time}</span>
                              {msg.sender === 'agent' && <CheckCheck className="w-3 h-3 text-emerald-300" />}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Quick Templates bar */}
                    <div style={{ 
                      padding: '12px 24px', 
                      borderTop: '1px solid rgba(255,255,255,0.05)', 
                      background: 'rgba(0,0,0,0.2)', 
                      backdropFilter: 'blur(10px)',
                      display: 'flex', gap: '8px', overflowX: 'auto', alignItems: 'center' 
                    }}>
                      <span style={{ fontSize: '12px', color: 'var(--text-muted)', whiteSpace: 'nowrap', fontWeight: '500' }}>API Templates:</span>
                      {templatesList.map(tpl => (
                        <Button 
                          variant="secondary"
                          key={tpl.code} 
                          onClick={() => handleApplyTemplate(tpl.text)}
                          style={{ padding: '4px 10px', fontSize: '10px', whiteSpace: 'nowrap' }}
                        >
                          {tpl.label}
                        </Button>
                      ))}
                    </div>

                    {/* Thread Composer */}
                    <div style={{ 
                      padding: '20px 24px', 
                      borderTop: '1px solid rgba(255,255,255,0.05)', 
                      background: 'var(--bg-secondary)', 
                      backdropFilter: 'blur(10px)',
                      display: 'flex', gap: '16px', alignItems: 'center' 
                    }}>
                      <div style={{ flex: 1 }}>
                        <Input
                          type="text"
                          placeholder="Type a message or select template above..."
                          value={inputText}
                          onChange={(e) => setInputText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          style={{ height: '40px' }}
                        />
                      </div>
                      <Button variant="primary" onClick={handleSendMessage} style={{ padding: '10px 18px' }}>
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)', gap: '12px' }}>
                    <MessageSquare className="w-12 h-12 opacity-40" />
                    <p style={{ fontSize: '13px' }}>Select a chat thread to start messaging</p>
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      )}
    </>
  );
}
