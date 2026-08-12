import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, Check, Plus, Search } from 'lucide-react';
import { Card, Button, Badge, Input, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui';

export default function RolesPage() {
  const { activeTab, roles, handleAddRole } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Available permission options
  const permissionOptions = ['Dashboard', 'Analytics', 'Leads', 'Deals', 'Contacts', 'Invoices', 'Reports', 'Settings'];
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const handleTogglePermission = (perm: string) => {
    if (selectedPermissions.includes(perm)) {
      setSelectedPermissions(selectedPermissions.filter(p => p !== perm));
    } else {
      setSelectedPermissions([...selectedPermissions, perm]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    
    await handleAddRole({
      name,
      description,
      permissions: JSON.stringify(selectedPermissions)
    });
    
    setName('');
    setDescription('');
    setSelectedPermissions([]);
    setShowForm(false);
  };

  const filteredRoles = roles.filter(role =>
    (role.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (role.description || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'roles' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <ShieldCheck className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Role-Based Access Control (RBAC)
              </h2>
              <p className="page-desc">Define custom team roles and set fine-grained module permission constraints.</p>
            </div>
            {!showForm && (
              <Button variant="primary" onClick={() => setShowForm(true)}>+ Add Custom Role</Button>
            )}
          </div>

          {showForm ? (
            <Card padding="24px" style={{ maxWidth: '600px' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                  New Custom Role
                </h3>
                
                <div className="form-field">
                  <Input 
                    label="Role Title *"
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Sales Executive" 
                    required
                  />
                </div>

                <div className="form-field">
                  <Input 
                    label="Access Description"
                    type="text" 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="e.g. Manage team workflows and edit invoices" 
                  />
                </div>

                <div className="form-field">
                  <label className="form-label" style={{ marginBottom: '8px', display: 'block' }}>Permissions Scopes</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' }}>
                    {permissionOptions.map(perm => {
                      const active = selectedPermissions.includes(perm);
                      return (
                        <div 
                          key={perm}
                          onClick={() => handleTogglePermission(perm)}
                          style={{ 
                            padding: '10px', 
                            background: active ? 'rgba(21, 107, 244, 0.08)' : 'rgba(255,255,255,0.01)', 
                            border: active ? '1px solid var(--accent-indigo)' : '1px solid var(--border-color)', 
                            borderRadius: '6px', 
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            fontSize: '12px',
                            color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                            transition: 'all 0.2s'
                          }}
                        >
                          <div style={{ width: '14px', height: '14px', borderRadius: '3px', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'var(--accent-indigo)' : 'none' }}>
                            {active && <Check className="w-3 h-3" style={{ color: 'white' }} />}
                          </div>
                          {perm}
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button type="submit" variant="primary">Save Custom Role</Button>
                  <Button type="button" variant="secondary" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Active Role Templates</h3>
                <div style={{ width: '240px' }}>
                  <Input 
                    type="text" 
                    leftIcon={<Search className="w-3.5 h-3.5" />}
                    placeholder="Search roles..." 
                    style={{ fontSize: '12px' }}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>

              {filteredRoles.length > 0 ? (
                <Table>
                  <TableHead>
                    <TableHeader>Role Title</TableHeader>
                    <TableHeader>Description</TableHeader>
                    <TableHeader>Access Scopes</TableHeader>
                  </TableHead>
                  <TableBody>
                    {filteredRoles.map(role => {
                      let scopes: string[] = [];
                      try {
                        scopes = typeof role.permissions === 'string' ? JSON.parse(role.permissions || '[]') : (role.permissions || []);
                      } catch (err) {
                        scopes = [];
                      }
                      return (
                        <TableRow key={role.id}>
                          <TableCell>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-primary)', fontWeight: '700' }}>
                              <ShieldCheck className="w-4 h-4" style={{ color: 'var(--accent-rose)' }} />
                              {role.name}
                            </div>
                          </TableCell>
                          <TableCell>{role.description}</TableCell>
                          <TableCell>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                              {scopes.map(s => (
                                <Badge key={s} variant="indigo" style={{ fontSize: '9px' }}>{s}</Badge>
                              ))}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No roles defined yet.</div>
              )}
            </Card>
          )}
        </div>
      )}
    </>
  );
}

