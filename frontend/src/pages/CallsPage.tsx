import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import {
  PhoneCall, Phone, Square, Mic, Search, Bot
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';

export default function CallsPage() {
  const { activeTab, authFetch, API_BASE } = useAppContext();

  const [activeCall, setActiveCall] = useState(null);
  const [isCalling, setIsCalling] = useState(false);
  const [callDuration, setCallDuration] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [callTimer, setCallTimer] = useState(null);
  const [dialerName, setDialerName] = useState('');
  const [dialerPhone, setDialerPhone] = useState('');
  const [callLogs, setCallLogs] = useState([]);
  const [loadingList, setLoadingList] = useState(false);
  const [summarizingId, setSummarizingId] = useState(null);

  const fetchCalls = async () => {
    setLoadingList(true);
    try {
      const res = await authFetch(`${API_BASE}/calls`);
      setCallLogs(await res.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoadingList(false);
    }
  };

  React.useEffect(() => {
    if (activeTab === 'calls') {
      fetchCalls();
    }
  }, [activeTab]);

  const startOutboundCall = (contact) => {
    setIsCalling(true);
    setActiveCall(contact);
    setCallDuration(0);
    const interval = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
    setCallTimer(interval);
  };

  const endActiveCall = async () => {
    if (callTimer) clearInterval(callTimer);
    setIsCalling(false);

    try {
      await authFetch(`${API_BASE}/calls`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: activeCall?.name || 'Quick Call',
          duration: callDuration
        })
      });
      fetchCalls();
    } catch (e) {
      console.error(e);
    }

    setActiveCall(null);
    setDialerName('');
    setDialerPhone('');
  };

  const formatTime = (secs) => {
    const mins = Math.floor(secs / 60);
    const remainingSecs = secs % 60;
    return `${String(mins).padStart(2, '0')}:${String(remainingSecs).padStart(2, '0')}`;
  };

  const filteredLogs = callLogs.filter(l =>
    l.clientName ? l.clientName.toLowerCase().includes(searchQuery.toLowerCase()) : false
  );

  return (
    <>
      {activeTab === 'calls' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <PhoneCall className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Calls Hub & Cloud Dialer
              </h2>
              <p className="page-desc">Launch calls, stream recording backups, and analyze conversations in real-time.</p>
            </div>
          </div>

          {/* Core Layout Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' }}>
            
            {/* Dialer Pane */}
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                Premium Cloud Dialer
              </h3>

              {isCalling && activeCall ? (
                <div style={{ background: 'rgba(21, 107, 244, 0.05)', border: '1px solid var(--accent-indigo)', borderRadius: '12px', padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', textAlign: 'center' }}>
                  <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Mic className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 style={{ fontSize: '16px', fontWeight: '800', color: 'var(--text-primary)' }}>{activeCall.name}</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)', marginTop: '4px' }}>Calling {activeCall.phone || activeCall.name}...</p>
                  </div>
                  <div style={{ fontSize: '24px', fontWeight: '800', fontFamily: 'monospace', color: 'var(--accent-indigo)' }}>
                    {formatTime(callDuration)}
                  </div>
                  <div style={{ display: 'flex', gap: '12px', width: '100%' }}>
                    <Button onClick={endActiveCall} variant="primary" style={{ flex: 1, background: 'var(--accent-rose)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                      <Square className="w-4 h-4 fill-white" />
                      Disconnect
                    </Button>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>Launch an instant outbound call through integrated WebRTC VoIP Gateway.</p>
                  <Input 
                    label="Recipient Name"
                    type="text" 
                    placeholder="e.g. Pankaj Kumar" 
                    value={dialerName}
                    onChange={(e) => setDialerName(e.target.value)}
                  />
                  <Input 
                    label="Phone Number"
                    type="text" 
                    placeholder="e.g. +91 98765 00000" 
                    value={dialerPhone}
                    onChange={(e) => setDialerPhone(e.target.value)}
                  />
                  <Button 
                    onClick={() => {
                      const name = dialerName || 'Quick Call';
                      const phone = dialerPhone || '+91 98765 00000';
                      startOutboundCall({ name, phone });
                    }} 
                    variant="primary" 
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
                  >
                    <Phone className="w-4 h-4" />
                    Place Call
                  </Button>
                </div>
              )}
            </Card>

            {/* Logs List Pane */}
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Conversation Logs</h3>
                <div style={{ position: 'relative', width: '180px' }}>
                  <Search style={{ position: 'absolute', left: '8px', top: '8px', width: '12px', height: '12px', color: 'var(--text-muted)' }} />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    className="form-input"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{ paddingLeft: '26px', fontSize: '11px', height: '28px' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', maxHeight: '350px', overflowY: 'auto' }}>
                {loadingList ? (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '24px 0' }}>
                    Loading call logs...
                  </div>
                ) : filteredLogs.length > 0 ? (
                  filteredLogs.map(log => (
                    <div key={log.id} style={{ padding: '12px', background: 'rgba(255,255,255,0.01)', border: '1px solid var(--border-color)', borderRadius: '8px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '800', color: 'var(--text-primary)' }}>{log.clientName}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                          {new Date(log.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--text-secondary)' }}>
                        <span>Duration: {log.duration}s</span>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={async () => {
                            setSummarizingId(log.id);
                            try {
                              const res = await authFetch(`${API_BASE}/calls/${log.id}/summarize`, { method: 'POST' });
                              const data = await res.json();
                              alert(data.summary);
                              fetchCalls();
                            } catch (e) {
                              console.error(e);
                            } finally {
                              setSummarizingId(null);
                            }
                          }}
                          style={{ padding: '2px 8px', fontSize: '10px' }}
                          disabled={summarizingId === log.id}
                        >
                          {summarizingId === log.id ? 'Summarizing...' : 'AI Summarize'}
                        </Button>
                      </div>
                      {log.summary && (
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', background: 'rgba(21, 107, 244, 0.08)', padding: '8px 12px', borderRadius: '4px', fontSize: '10px', color: 'var(--accent-indigo)', lineHeight: '1.4' }}>
                          <Bot className="w-3.5 h-3.5" style={{ flexShrink: 0, marginTop: '2px' }} />
                          <div>
                            <strong>AI Summary:</strong>
                            <p style={{ margin: '4px 0 0 0', whiteSpace: 'pre-wrap' }}>{log.summary}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div style={{ textAlign: 'center', fontSize: '12px', color: 'var(--text-muted)', padding: '24px 0' }}>
                    {callLogs.length === 0
                      ? 'No call logs available. Place a call above to start!'
                      : 'No call logs matching your search.'}
                  </div>
                )}
              </div>
            </Card>

          </div>

        </div>
      )}
    </>
  );
}
