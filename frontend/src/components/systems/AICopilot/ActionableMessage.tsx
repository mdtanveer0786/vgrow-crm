import React from 'react';
import { Bot, User, CheckCircle, Mail, Phone, Calendar } from 'lucide-react';
import { Button, Card, Textarea } from '../../ui';

export interface CopilotMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actionPayload?: {
    type: 'draft_message' | 'create_task' | 'suggested_leads' | 'schedule_meeting';
    data: any;
  };
  timestamp: string;
}

interface ActionableMessageProps {
  message: CopilotMessage;
  onExecuteAction: (type: string, data: any) => void;
}

export const ActionableMessage: React.FC<ActionableMessageProps> = ({ message, onExecuteAction }) => {
  const isAi = message.sender === 'ai';

  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '16px' }}>
      <div style={{
        width: '32px', height: '32px', borderRadius: '50%',
        background: isAi ? 'linear-gradient(135deg, var(--accent-indigo) 0%, var(--accent-purple) 100%)' : 'var(--bg-card)',
        border: isAi ? 'none' : '1px solid var(--border-color)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {isAi ? <Bot size={16} color="white" /> : <User size={16} color="var(--text-secondary)" />}
      </div>
      
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <div style={{
          background: isAi ? 'var(--bg-card)' : 'var(--accent-indigo)',
          color: isAi ? 'var(--text-primary)' : 'white',
          padding: '12px 16px',
          borderRadius: '12px',
          border: isAi ? '1px solid var(--border-color)' : 'none',
          fontSize: '14px',
          lineHeight: '1.5',
          boxShadow: isAi ? 'var(--shadow-sm)' : 'var(--shadow-md)',
          alignSelf: isAi ? 'flex-start' : 'flex-end',
          maxWidth: '85%'
        }}>
          {message.text}
        </div>
        
        {/* Render Rich Action UI Payloads */}
        {message.actionPayload && isAi && (
          <div style={{ marginTop: '8px', width: '100%' }}>
            {message.actionPayload.type === 'draft_message' && (
              <Card padding="var(--space-4)">
                <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={14} color="var(--accent-indigo)" /> Email Draft
                </h4>
                <Textarea 
                  defaultValue={message.actionPayload.data.body} 
                  style={{ minHeight: '120px', marginBottom: '12px', fontSize: '13px' }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                  <Button variant="ghost" size="sm">Discard</Button>
                  <Button variant="primary" size="sm" onClick={() => onExecuteAction('send_email', message.actionPayload?.data)}>
                    Send to {message.actionPayload.data.leadName}
                  </Button>
                </div>
              </Card>
            )}

            {message.actionPayload.type === 'suggested_leads' && (
              <Card padding="var(--space-4)">
                <h4 style={{ fontSize: '12px', fontWeight: '700', marginBottom: '12px', color: 'var(--text-muted)' }}>PRIORITY LEADS</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {message.actionPayload.data.leads.map((lead: any) => (
                    <div key={lead.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px', background: 'var(--bg-secondary)', borderRadius: 'var(--radius-md)' }}>
                      <div>
                        <p style={{ fontSize: '14px', fontWeight: '700' }}>{lead.name}</p>
                        <p style={{ fontSize: '11px', color: 'var(--text-muted)' }}>Score: {lead.score} • Value: {lead.value}</p>
                      </div>
                      <Button variant="primary" size="sm" onClick={() => onExecuteAction('call_lead', lead.id)}>
                        <Phone size={12} style={{ marginRight: '4px' }} /> Call
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}

            {message.actionPayload.type === 'create_task' && (
              <Card padding="var(--space-4)" style={{ background: 'rgba(16, 185, 129, 0.05)', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                  <CheckCircle size={20} color="var(--semantic-success)" />
                  <div>
                    <h4 style={{ fontSize: '14px', fontWeight: '700', color: 'var(--text-primary)' }}>Task Scheduled</h4>
                    <p style={{ fontSize: '12px', color: 'var(--text-secondary)' }}>{message.actionPayload.data.description}</p>
                    <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px' }}>Due: {message.actionPayload.data.dueDate}</p>
                  </div>
                </div>
              </Card>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
