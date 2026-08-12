import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Mail, Sparkles, Send, CheckCircle2, Bot, Sliders, Settings2, RefreshCw } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { Input } from '../components/ui/Input';

export default function AiInboxPage() {
  const { activeTab, authFetch, API_BASE, communications } = useAppContext();
  const [selectedMail, setSelectedMail] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [showToast, setShowToast] = useState(false);
  
  // Advanced AI Hyperparameters for customization
  const [creativity, setCreativity] = useState(0.7); // temperature
  const [tone, setTone] = useState('Professional');

  // Build emails list from real communications data (Email type)
  const emails = communications.filter(c => c.type === 'Email');

  const handleGenerateReply = async (email) => {
    setIsGenerating(true);
    setDraftText('');
    try {
      const res = await authFetch(`${API_BASE}/ai/draft-reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ emailBody: email.description || email.title || '', tone, creativity })
      });
      const data = await res.json();
      setDraftText(data.reply || data.draft || 'AI could not generate a reply at this time.');
    } catch (err) {
      console.error('Failed to generate AI reply:', err);
      setDraftText('Failed to generate reply. Please check your AI configuration.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSendDraft = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
    setSelectedMail(null);
    setDraftText('');
  };

  return (
    <>
      {activeTab === 'ai-inbox' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: '100%' }}>
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Sparkles className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                AI Copilot Inbox
              </h2>
              <p className="page-desc">Automated email replies, campaign drafting, and model tuning.</p>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', flexGrow: 1 }}>
            
            {/* Left side: Emails list */}
            <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Incoming Mail Actions</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {emails.length === 0 && (
                  <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '12px', padding: '20px 0' }}>No AI inbox items. Connect your email integration to start receiving suggestions.</p>
                )}
                {emails.map(mail => (
                  <div 
                    key={mail.id} 
                    onClick={() => { setSelectedMail(mail); setDraftText(''); }}
                    style={{ 
                      padding: '16px', 
                      background: selectedMail?.id === mail.id ? 'rgba(99,102,241,0.06)' : 'rgba(255,255,255,0.01)', 
                      border: selectedMail?.id === mail.id ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)', 
                      borderRadius: '8px', 
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{mail.contactName || mail.direction || 'Email'}</span>
                      <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{mail.createdAt ? new Date(mail.createdAt).toLocaleDateString() : ''}</span>
                    </div>
                    <h4 style={{ fontSize: '12px', color: 'var(--text-secondary)', fontWeight: '600' }}>{mail.title || 'No Subject'}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>
                      {mail.description || ''}
                    </p>
                  </div>
                ))}
              </div>
            </Card>

            {/* Right side: AI Generator & Parameter Tuner */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              {/* Parameters panel */}
              <Card style={{ padding: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <h4 style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Settings2 className="w-4 h-4 text-indigo-400" />
                  AI Generation Parameters
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: '10px' }}>Creativity (Temp: {creativity})</label>
                    <input 
                      type="range" 
                      min="0.1" 
                      max="1.0" 
                      step="0.1" 
                      value={creativity}
                      onChange={(e) => setCreativity(parseFloat(e.target.value))}
                      style={{ width: '100%', height: '6px', accentColor: 'var(--accent-indigo)' }}
                    />
                  </div>
                  <div className="form-field">
                    <label className="form-label" style={{ fontSize: '10px' }}>Response Tone</label>
                    <select 
                      className="form-input" 
                      value={tone}
                      onChange={(e) => setTone(e.target.value)}
                      style={{ padding: '4px 8px', fontSize: '11px', height: '28px' }}
                    >
                      <option value="Professional">Professional</option>
                      <option value="Friendly">Friendly</option>
                      <option value="Urgent/Sales">Urgent Follow-up</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Composition block */}
              <Card style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '16px', flexGrow: 1 }}>
                {selectedMail ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', height: '100%' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Suggested Auto-Draft</h3>
                        <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Drafting response to <strong>{selectedMail.sender}</strong></p>
                      </div>
                      <Bot className="w-5 h-5 text-indigo-400" />
                    </div>
                    
                    <Button 
                      variant="primary"
                      onClick={() => handleGenerateReply(selectedMail)}
                      style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                      disabled={isGenerating}
                    >
                      <Sparkles className="w-4 h-4" />
                      {isGenerating ? 'AI is drafting response...' : 'Generate AI Auto-Reply'}
                    </Button>

                    {draftText && (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', flexGrow: 1 }}>
                        <textarea
                          className="form-input"
                          style={{ width: '100%', height: '180px', fontFamily: 'monospace', fontSize: '12px', resize: 'none', background: 'rgba(0,0,0,0.2)' }}
                          value={draftText}
                          onChange={(e) => setDraftText(e.target.value)}
                        />
                        <Button 
                          variant="primary"
                          onClick={handleSendDraft}
                          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', background: 'var(--accent-emerald)' }}
                        >
                          <Send className="w-4 h-4" />
                          Send AI Response
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-secondary)', textAlign: 'center', gap: '12px', padding: '40px 0' }}>
                    <Mail className="w-12 h-12" style={{ color: 'var(--border-color)' }} />
                    <p style={{ fontSize: '12px' }}>Select an incoming email from the left sidebar to generate smart AI responses instantly.</p>
                  </div>
                )}
              </Card>
            </div>

          </div>

          {/* Toast Notification */}
          {showToast && (
            <div style={{ position: 'fixed', bottom: '24px', right: '24px', background: 'var(--accent-emerald)', color: 'white', padding: '12px 24px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.2)', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 1000 }}>
              <CheckCircle2 className="w-5 h-5" />
              <span style={{ fontSize: '12px', fontWeight: '800' }}>AI Response Sent Successfully!</span>
            </div>
          )}
        </div>
      )}
    </>
  );
}
