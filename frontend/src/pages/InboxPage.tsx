import React, { useState, useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { MessageSquare, Mail, Search, Send, Phone, Activity } from 'lucide-react';

export default function InboxPage() {
  const { activeTab, communications, leads, handleAddCommunication } = useAppContext();
  const [selectedContact, setSelectedContact] = useState<any>(null);
  const [messageText, setMessageText] = useState('');
  const [conversations, setConversations] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Group communications into conversation threads by contact name/email/phone
  useEffect(() => {
    const contactMap: Record<string, any> = {};

    // 1. Populate with leads if available
    (leads || []).forEach((lead: any) => {
      const name = `${lead.firstName || ''} ${lead.lastName || ''}`.trim() || lead.name || 'Unknown Contact';
      contactMap[name] = {
        name,
        email: lead.email || '',
        phone: lead.phone || '',
        channel: 'WhatsApp',
        messages: []
      };
    });

    // 2. Group communications (WhatsApp and Email) into their threads
    (communications || []).forEach((comm: any) => {
      if (comm.type === 'WhatsApp' || comm.type === 'Email') {
        let matchedContact = null;
        for (const name of Object.keys(contactMap)) {
          if (
            (comm.subject && comm.subject.toLowerCase().includes(name.toLowerCase())) || 
            (comm.content && comm.content.toLowerCase().includes(name.toLowerCase()))
          ) {
            matchedContact = name;
            break;
          }
        }

        const contactName = matchedContact;
        if (contactName) {
          contactMap[contactName].messages.push({
            id: comm.id,
            text: comm.content,
            direction: comm.direction,
            channel: comm.type,
            createdAt: comm.createdAt
          });
        } else {
          // If communication doesn't match an existing lead, extract name or subject dynamically
          const dynName = comm.subject 
            ? comm.subject.replace(/^(Inbound|Outbound)\s+(WhatsApp|Email)\s*(Inquiry\s*)?(from|to)?\s*/i, '').trim() || 'General Inquiry'
            : 'General Inquiry';
          
          if (!contactMap[dynName]) {
            contactMap[dynName] = {
              name: dynName,
              email: comm.email || '',
              phone: comm.phone || '',
              channel: comm.type || 'WhatsApp',
              messages: []
            };
          }
          contactMap[dynName].messages.push({
            id: comm.id,
            text: comm.content,
            direction: comm.direction,
            channel: comm.type,
            createdAt: comm.createdAt
          });
        }
      }
    });

    // 3. Sort messages chronologically for each contact
    Object.keys(contactMap).forEach(name => {
      contactMap[name].messages.sort((a: any, b: any) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
    });

    const conversationList: any[] = Object.values(contactMap);
    setConversations(conversationList);

    if (conversationList.length === 0) {
      setSelectedContact(null);
    } else if (!selectedContact) {
      setSelectedContact(conversationList[0]);
    } else {
      const updated = conversationList.find(c => c.name === (selectedContact as any).name);
      setSelectedContact(updated || conversationList[0]);
    }
  }, [communications, leads]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedContact) return;

    const commData = {
      type: selectedContact.channel || 'WhatsApp',
      subject: `Outbound ${selectedContact.channel} to ${selectedContact.name}`,
      content: messageText,
      direction: 'Outbound',
      status: 'Completed'
    };

    await handleAddCommunication(commData);
    setMessageText('');
  };

  // Webhook Simulator to trigger real-time incoming messages for testing
  const simulateInboundMessage = () => {
    if (!selectedContact) return;

    const responses = [
      "Sounds great! Please send over the onboarding files.",
      "Can you confirm if your server supports MySQL integrations?",
      "Perfect. I am checking the quote draft you sent.",
      "Thanks for the prompt response. Let's close the deal today!"
    ];
    
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];

    setTimeout(async () => {
      const inboundComm = {
        type: selectedContact.channel || 'WhatsApp',
        subject: `Inbound WhatsApp Inquiry from ${selectedContact.name}`,
        content: randomResponse,
        direction: 'Inbound',
        status: 'Completed'
      };
      await handleAddCommunication(inboundComm);
    }, 1500);
  };

  const filteredConversations = conversations.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {activeTab === 'inbox' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px', height: 'calc(100vh - 120px)', minHeight: '400px' }}>
          <div className="page-header" style={{ flexShrink: 0 }}>
            <div>
              <h2 className="page-title">Omnichannel Team Inbox</h2>
              <p className="page-desc">Consolidated real-time customer communication center.</p>
            </div>
            {selectedContact && (
              <div>
                <button 
                  onClick={simulateInboundMessage}
                  className="btn-secondary" 
                  style={{ background: 'var(--accent-indigo)', color: 'white', border: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <Activity className="w-3.5 h-3.5" />
                  Simulate Webhook Message
                </button>
              </div>
            )}
          </div>

          <div className="inbox-layout" style={{
            display: 'flex',
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            borderRadius: '12px',
            overflow: 'hidden',
            flexGrow: 1,
            height: '100%'
          }}>
            {/* Contacts Sidebar */}
            <div className="inbox-sidebar" style={{
              width: '100%',
              maxWidth: '320px',
              borderRight: '1px solid var(--border-color)',
              display: 'flex',
              flexDirection: 'column',
              height: '100%'
            }}>
              <div style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', position: 'relative' }}>
                <Search style={{ position: 'absolute', left: '24px', top: '26px', width: '14px', height: '14px', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  placeholder="Search chats..." 
                  className="form-input" 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{ width: '100%', paddingLeft: '36px', fontSize: '12px' }} 
                />
              </div>
              <div style={{ overflowY: 'auto', flexGrow: 1 }}>
                {filteredConversations.length > 0 ? (
                  filteredConversations.map((contact, idx) => {
                    const isSelected = selectedContact && selectedContact.name === contact.name;
                    const lastMessage = contact.messages[contact.messages.length - 1];
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedContact(contact)}
                        style={{ 
                          padding: '16px', 
                          background: isSelected ? 'rgba(99, 102, 241, 0.08)' : 'transparent', 
                          borderLeft: isSelected ? '3px solid var(--accent-indigo)' : '3px solid transparent', 
                          borderBottom: '1px solid var(--border-color)',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                      >
                        <div className="flex-between">
                          <span style={{ fontSize: '13px', fontWeight: '700', color: 'var(--text-primary)' }}>{contact.name}</span>
                          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>
                            {lastMessage && lastMessage.createdAt ? new Date(lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                          </span>
                        </div>
                        <p style={{ 
                          fontSize: '11px', 
                          color: 'var(--text-secondary)', 
                          marginTop: '6px', 
                          overflow: 'hidden', 
                          textOverflow: 'ellipsis', 
                          whiteSpace: 'nowrap' 
                        }}>
                          {lastMessage ? lastMessage.text : 'No messages yet'}
                        </p>
                        <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
                          <span className={`badge ${contact.channel === 'WhatsApp' ? 'badge-indigo' : 'badge-amber'}`} style={{ fontSize: '8px' }}>
                            {contact.channel}
                          </span>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div style={{ padding: '32px 16px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px' }}>
                    No conversations found
                  </div>
                )}
              </div>
            </div>

            {/* Chat Messages pane */}
            <div className="inbox-chat-view" style={{
              flexGrow: 1,
              display: 'flex',
              flexDirection: 'column',
              height: '100%',
              background: 'var(--bg-primary)'
            }}>
              {selectedContact ? (
                <>
                  {/* Chat Header */}
                  <div style={{ 
                    padding: '16px 24px', 
                    borderBottom: '1px solid var(--border-color)', 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    background: 'var(--bg-secondary)',
                    flexShrink: 0
                  }}>
                    <div>
                      <h4 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{selectedContact.name}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '2px' }}>
                        {selectedContact.email || 'No email'} {selectedContact.phone ? `| ${selectedContact.phone}` : ''}
                      </p>
                    </div>
                  </div>

                  {/* Chat Messages */}
                  <div className="chat-messages" style={{ 
                    flexGrow: 1, 
                    overflowY: 'auto', 
                    padding: '24px', 
                    display: 'flex', 
                    flexDirection: 'column', 
                    gap: '16px' 
                  }}>
                    {selectedContact.messages && selectedContact.messages.length > 0 ? (
                      selectedContact.messages.map((msg: any, idx: number) => {
                        const isOutbound = msg.direction === 'Outbound' || msg.direction === 'outbound';
                        return (
                          <div 
                            key={idx}
                            style={{
                              alignSelf: isOutbound ? 'flex-end' : 'flex-start',
                              maxWidth: '70%',
                              background: isOutbound ? 'var(--accent-indigo)' : 'var(--bg-secondary)',
                              color: isOutbound ? 'white' : 'var(--text-primary)',
                              padding: '12px 16px',
                              borderRadius: isOutbound ? '12px 12px 0 12px' : '12px 12px 12px 0',
                              border: isOutbound ? 'none' : '1px solid var(--border-color)',
                              boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                              display: 'flex',
                              flexDirection: 'column',
                              gap: '4px'
                            }}
                          >
                            <p style={{ fontSize: '13px', margin: 0, whiteSpace: 'pre-wrap', lineHeight: '1.4' }}>{msg.text}</p>
                            <span style={{ 
                              fontSize: '9px', 
                              color: isOutbound ? 'rgba(255,255,255,0.7)' : 'var(--text-muted)', 
                              alignSelf: 'flex-end' 
                            }}>
                              {msg.createdAt ? new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                            </span>
                          </div>
                        );
                      })
                    ) : (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '8px', color: 'var(--text-muted)' }}>
                        <MessageSquare className="w-10 h-10 opacity-40" />
                        <p style={{ fontSize: '14px', fontWeight: 600 }}>No message history with {selectedContact.name} yet</p>
                        <p style={{ fontSize: '12px' }}>Send a message below to start the conversation.</p>
                      </div>
                    )}
                  </div>

                  {/* Chat Input */}
                  <form 
                    onSubmit={handleSendMessage}
                    style={{ 
                      padding: '16px 24px', 
                      borderTop: '1px solid var(--border-color)', 
                      display: 'flex', 
                      gap: '12px',
                      background: 'var(--bg-secondary)',
                      alignItems: 'center',
                      flexShrink: 0
                    }}
                  >
                    <input 
                      type="text" 
                      placeholder={`Send a reply via ${selectedContact.channel}...`} 
                      className="form-input" 
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      style={{ flexGrow: 1, padding: '12px 16px', borderRadius: '24px' }} 
                    />
                    <button 
                      type="submit" 
                      className="btn-primary" 
                      style={{ 
                        borderRadius: '50%', 
                        width: '40px', 
                        height: '40px', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        padding: 0,
                        flexShrink: 0
                      }}
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                </>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexGrow: 1, gap: '12px', color: 'var(--text-muted)' }}>
                  <MessageSquare className="w-12 h-12 opacity-40" />
                  <p style={{ fontSize: '15px', fontWeight: 600 }}>No active conversation selected</p>
                  <p style={{ fontSize: '12px' }}>Select a contact or start a new message thread.</p>
                </div>
              )}
            </div>

            {/* AI Assistant Context Pane */}
            {selectedContact && (
              <div className="ai-assistant-pane" style={{ 
                width: '280px', 
                minWidth: 0,
                borderLeft: '1px solid var(--border-color)', 
                display: 'flex', 
                flexDirection: 'column', 
                background: 'var(--bg-secondary)',
                height: '100%',
                flexShrink: 0
              }}>
                <div className="ai-pane-header" style={{ padding: '16px', borderBottom: '1px solid var(--border-color)', fontWeight: '800', fontSize: '12px', color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Lead Inspector
                </div>
                <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '20px', overflowY: 'auto' }}>
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>{selectedContact.name}</h4>
                    <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: '4px' }}>Inquirer Lead Profile</p>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Channel</p>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-primary)', marginTop: '4px' }}>{selectedContact.channel} API Connected</p>
                    </div>

                    <div style={{ padding: '12px', background: 'var(--bg-primary)', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
                      <p style={{ fontSize: '9px', color: 'var(--text-muted)', fontWeight: '700', textTransform: 'uppercase' }}>Lead Temperature</p>
                      <p style={{ fontSize: '12px', fontWeight: '700', color: 'var(--accent-amber)', marginTop: '4px' }}>Warm Inquiry</p>
                    </div>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '12px', color: 'var(--text-secondary)' }}>
                    <p style={{ fontWeight: '700', color: 'var(--text-primary)' }}>Contact Detail:</p>
                    {selectedContact.phone ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Phone className="w-3.5 h-3.5" />
                        <span>{selectedContact.phone}</span>
                      </div>
                    ) : null}
                    {selectedContact.email ? (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <Mail className="w-3.5 h-3.5" />
                        <span style={{ wordBreak: 'break-all' }}>{selectedContact.email}</span>
                      </div>
                    ) : null}
                    {!selectedContact.phone && !selectedContact.email && (
                      <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>No additional contact details</span>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
