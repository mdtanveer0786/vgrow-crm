import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Calendar, Clock, MapPin, Search } from 'lucide-react';
import { Card, Button, Input } from '../components/ui';

export default function EventsPage() {
  const context = useAppContext();
  const {
      activeTab, events, handleAddEvent
  } = context;

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !date || !time) return;
    
    // Call standard handleAddEvent context helper
    await handleAddEvent({ title, date, time });
    setTitle('');
    setDate('');
    setTime('');
    setShowForm(false);
  };

  const filteredEvents = events.filter(ev => 
    (ev.title || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'events' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Calendar className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Events & Meeting Calendar
              </h2>
              <p className="page-desc">Schedule client onboarding demos, team sales reviews, and check-in timelines.</p>
            </div>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>+ Schedule Event</Button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Scheduled Events</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{events.length} Meetings</h4>
              </div>
              <Calendar className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
          </div>

          {showForm ? (
            <Card padding="24px" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  Schedule New Event
                </h3>
                
                <div className="form-field">
                  <Input 
                    label="Event Description Title *"
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Discovery Call with Saksham" 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-field">
                    <Input 
                      label="Event Date *"
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <Input 
                      label="Event Time Slot *"
                      type="text" 
                      value={time}
                      onChange={(e) => setTime(e.target.value)}
                      placeholder="e.g. 10:30 AM" 
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">Confirm Event</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Your Events Calendar</h3>
                <div style={{ width: '240px' }}>
                  <Input 
                    type="text" 
                    leftIcon={<Search className="w-3.5 h-3.5" />}
                    placeholder="Search events..." 
                    style={{ fontSize: '12px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredEvents.length > 0 ? (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
                  {filteredEvents.map(ev => (
                    <Card key={ev.id} padding="16px" style={{ display: 'flex', flexDirection: 'column', gap: '8px', border: '1px solid var(--border-color)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-indigo)', fontWeight: '700' }}>
                        <Calendar className="w-4 h-4" />
                        <span>{ev.date ? new Date(ev.date).toLocaleDateString('en-IN') : 'No Date'}</span>
                      </div>
                      <h4 style={{ color: 'var(--text-primary)', fontSize: '13px', fontWeight: '800' }}>{ev.title}</h4>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-secondary)', fontSize: '11px' }}>
                        <Clock className="w-3.5 h-3.5" />
                        <span>{ev.time}</span>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No scheduled events.</div>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}

