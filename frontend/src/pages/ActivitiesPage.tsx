import React, { useState } from 'react';
import { Card, Button, Badge, Input } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import { 
  MessageSquare, Mail, Phone, FileText,
  Clock, Search
} from 'lucide-react';

export default function ActivitiesPage() {
  const { activeTab, activities, handleAddActivity } = useAppContext();

  const [showForm, setShowForm] = useState(false);
  const [type, setType] = useState('Call');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [direction, setDirection] = useState('outbound');
  const [status, setStatus] = useState('Completed');
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;
    
    await handleAddActivity({
      type,
      title,
      description,
      direction,
      status
    });

    setTitle('');
    setDescription('');
    setDirection('outbound');
    setStatus('Completed');
    setShowForm(false);
  };

  const getIcon = (typeStr: string) => {
    switch (typeStr) {
      case 'WhatsApp':
        return <MessageSquare className="w-4 h-4 text-green-400" />;
      case 'Email':
        return <Mail className="w-4 h-4 text-blue-400" />;
      case 'Call':
        return <Phone className="w-4 h-4 text-purple-400" />;
      default:
        return <FileText className="w-4 h-4 text-amber-400" />;
    }
  };

  const filteredActivities = activities
    .filter(act => {
      const matchType = filterType === 'All' || act.type === filterType;
      const matchSearch = 
        act.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        act.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchType && matchSearch;
    });

  return (
    <>
      {activeTab === 'activities' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          <div className="page-header">
            <div>
              <h2 className="page-title">Activities Log</h2>
              <p className="page-desc">Chronological feed of all client communications and internal notes.</p>
            </div>
            <Button variant="primary" onClick={() => setShowForm(true)}>+ Log Activity</Button>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px', alignItems: 'start' }}>
            
            {/* Left side: Log Activity Form or Category Quick Filters */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              {showForm ? (
                <Card>
                  <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', padding: '20px' }}>
                    <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800' }}>Log New Activity</h3>
                    
                    <div className="form-field">
                      <label className="form-label">Activity Type</label>
                      <select className="form-input" value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="Call">Call Log</option>
                        <option value="WhatsApp">WhatsApp</option>
                        <option value="Email">Email Sync</option>
                        <option value="Note">Internal Note</option>
                      </select>
                    </div>

                    <Input 
                      label="Title *"
                      type="text" 
                      placeholder="e.g. Discovery Call with client" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />

                    <div className="form-field">
                      <label className="form-label">Description *</label>
                      <textarea 
                        className="form-input" 
                        placeholder="Details of what was discussed..." 
                        style={{ height: '80px', resize: 'none' }}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-field">
                      <label className="form-label">Direction</label>
                      <select className="form-input" value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="outbound">Outbound</option>
                        <option value="inbound">Inbound</option>
                      </select>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                      <Button variant="primary" type="submit">Save Log</Button>
                      <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                    </div>
                  </form>
                </Card>
              ) : (
                <Card style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h3 style={{ color: 'var(--text-primary)', fontSize: '14px', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '8px' }}>Activity Filter</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['All', 'Call', 'WhatsApp', 'Email', 'Note'].map(t => (
                      <Button 
                        key={t}
                        onClick={() => setFilterType(t)}
                        variant="secondary"
                        style={{ 
                          width: '100%', 
                          textAlign: 'left', 
                          justifyContent: 'flex-start',
                          background: filterType === t ? 'rgba(99,102,241,0.06)' : 'none',
                          border: filterType === t ? '1px solid var(--accent-indigo)' : '1px solid transparent'
                        }}
                      >
                        {t === 'All' ? 'All Activities' : `${t}s`}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            {/* Right side: Timeline Flow */}
            <Card style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
              
              <Input 
                leftIcon={<Search className="w-4 h-4" />}
                type="text" 
                placeholder="Search logs description or titles..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />

              {filteredActivities.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', position: 'relative', paddingLeft: '24px', borderLeft: '2px solid var(--border-color)', marginLeft: '12px', marginTop: '8px' }}>
                  {filteredActivities.map((act) => (
                    <div key={act.id} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      
                      {/* Timeline Node Point */}
                      <div style={{ 
                        position: 'absolute', 
                        left: '-36px', 
                        top: '4px', 
                        width: '24px', 
                        height: '24px', 
                        borderRadius: '50%', 
                        background: 'var(--bg-primary)', 
                        border: '2px solid var(--border-color)', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        zIndex: 2
                      }}>
                        {getIcon(act.type)}
                      </div>

                      <div className="flex-between">
                        <span style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{act.title}</span>
                        <span style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>{act.direction}</span>
                      </div>
                      
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                        {act.description}
                      </p>

                      <div style={{ display: 'flex', gap: '6px', alignItems: 'center', marginTop: '4px' }}>
                        <Badge variant="emerald" style={{ fontSize: '9px' }}>{act.status || 'Completed'}</Badge>
                        <span style={{ fontSize: '9px', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <Clock className="w-3 h-3" />
                          {act.createdAt ? new Date(act.createdAt).toLocaleDateString() : 'Just now'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '40px 0' }}>No activity records found matching filters.</div>
              )}
            </Card>

          </div>

        </div>
      )}
    </>
  );
}

