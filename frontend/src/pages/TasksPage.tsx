import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { CheckSquare, Calendar, AlertCircle, Plus, Search, ClipboardList } from 'lucide-react';
import { Card, Button, Badge, Input, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui';

export default function TasksPage() {
  const context = useAppContext();
  const {
      activeTab, tasks, handleAddTask
  } = context;

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [status, setStatus] = useState('Pending');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    
    // Call standard handleAddTask context handler
    await handleAddTask({ title, dueDate, priority, status });
    setTitle('');
    setDueDate('');
    setPriority('Medium');
    setStatus('Pending');
    setShowForm(false);
  };

  const filteredTasks = tasks.filter(t => 
    t.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'tasks' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckSquare className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Tasks & Team Queue
              </h2>
              <p className="page-desc">Track sales actions, calendar deadlines, and client follow-up checksheets.</p>
            </div>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>+ Add Task</Button>
            )}
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Pending Tasks</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-amber)' }}>
                  {tasks.filter(t => t.status !== 'Completed').length} Pending
                </h4>
              </div>
              <ClipboardList className="w-8 h-8 text-amber-400 opacity-80" />
            </Card>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Completed (Total)</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px', color: 'var(--accent-emerald)' }}>
                  {tasks.filter(t => t.status === 'Completed').length} Done
                </h4>
              </div>
              <Calendar className="w-8 h-8 text-emerald-400 opacity-80" />
            </Card>
          </div>

          {showForm ? (
            <Card padding="24px" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  New Workspace Task
                </h3>
                
                <div className="form-field">
                  <Input 
                    label="Task Title *"
                    type="text" 
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Call Amit Kumar to review GST invoice details" 
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-field">
                    <Input 
                      label="Due Date *"
                      type="date" 
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-field">
                    <label className="form-label">Priority Slab</label>
                    <select 
                      className="form-input" 
                      value={priority}
                      onChange={(e) => setPriority(e.target.value)}
                    >
                      <option value="Low">Low</option>
                      <option value="Medium">Medium (Default)</option>
                      <option value="High">High / Urgent</option>
                    </select>
                  </div>
                </div>

                <div className="form-field">
                  <label className="form-label">Workflow Status</label>
                  <select 
                    className="form-input" 
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">Save Workspace Task</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Your Tasks List</h3>
                <div style={{ width: '240px' }}>
                  <Input 
                    type="text" 
                    leftIcon={<Search className="w-3.5 h-3.5" />}
                    placeholder="Search tasks..." 
                    style={{ fontSize: '12px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredTasks.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableHeader>Task Description</TableHeader>
                    <TableHeader>Due Date</TableHeader>
                    <TableHeader>Priority</TableHeader>
                    <TableHeader>Workflow Status</TableHeader>
                  </TableHead>
                  <TableBody>
                    {filteredTasks.map(t => (
                      <TableRow key={t.id}>
                        <TableCell><span style={{ fontWeight: '700' }}>{t.title}</span></TableCell>
                        <TableCell>{t.dueDate ? new Date(t.dueDate).toLocaleDateString('en-IN') : 'No Date'}</TableCell>
                        <TableCell>
                          <Badge variant={
                            t.priority === 'High' ? 'rose' : 
                            t.priority === 'Medium' ? 'amber' : 'default'
                          }>
                            {t.priority}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            t.status === 'Completed' ? 'emerald' : 
                            t.status === 'In Progress' ? 'indigo' : 'default'
                          }>
                            {t.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No tasks assigned yet.</div>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}

