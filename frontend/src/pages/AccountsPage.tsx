import React, { useState } from 'react';
import { Card, Button, Input, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui';
import { useAppContext } from '../context/AppContext';
import { Search, Building, Globe } from 'lucide-react';

export default function AccountsPage() {
  const { activeTab, accounts, handleAddAccount } = useAppContext();
  
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState('');
  const [industry, setIndustry] = useState('Technology');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    await handleAddAccount({ name, industry, website, email, phone });
    setName('');
    setWebsite('');
    setEmail('');
    setPhone('');
    setShowForm(false);
  };

  const filteredAccounts = accounts.filter(acc => 
    acc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.industry || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (acc.website || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'accounts' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="page-header">
            <div>
              <h2 className="page-title">Accounts Directory</h2>
              <p className="page-desc">Manage customer companies and partnerships.</p>
            </div>
            <Button variant="primary" onClick={() => setShowForm(true)}>+ Add Account</Button>
          </div>

          {showForm ? (
            <Card>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '500px' }}>
                <h3 style={{ color: 'var(--text-primary)', fontWeight: '800' }}>New Account</h3>
                
                <Input 
                  label="Company Name *" 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Acme Corporation" 
                  required
                />

                <div className="form-field">
                  <label className="form-label">Industry</label>
                  <select 
                    className="form-input" 
                    value={industry}
                    onChange={(e) => setIndustry(e.target.value)}
                  >
                    <option value="Technology">Technology</option>
                    <option value="Finance">Finance</option>
                    <option value="Healthcare">Healthcare</option>
                    <option value="Retail">Retail</option>
                    <option value="Lifestyle">Lifestyle</option>
                    <option value="Logistics">Logistics</option>
                  </select>
                </div>

                <Input 
                  label="Website" 
                  type="text" 
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="e.g. www.acme.com" 
                />

                <Input 
                  label="Email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. contact@acme.com" 
                />

                <Input 
                  label="Phone" 
                  type="text" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +1 555-0199" 
                />

                <div style={{ display: 'flex', gap: '8px', marginTop: '8px' }}>
                  <Button variant="primary" type="submit">Save Account</Button>
                  <Button variant="secondary" type="button" onClick={() => setShowForm(false)}>Cancel</Button>
                </div>
              </form>
            </Card>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ maxWidth: '400px' }}>
                <Input 
                  leftIcon={<Search className="w-4 h-4" />}
                  type="text" 
                  placeholder="Search accounts..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <Card style={{ padding: '20px' }}>
                {filteredAccounts.length > 0 ? (
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableHeader>Company Name</TableHeader>
                        <TableHeader>Industry</TableHeader>
                        <TableHeader>Website</TableHeader>
                        <TableHeader>Email</TableHeader>
                        <TableHeader>Phone</TableHeader>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredAccounts.map(acc => (
                        <TableRow key={acc.id}>
                          <TableCell style={{ color: 'var(--text-primary)', fontWeight: '700' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <Building className="w-4 h-4" style={{ color: 'var(--accent-indigo)' }} />
                              {acc.name}
                            </div>
                          </TableCell>
                          <TableCell>{acc.industry}</TableCell>
                          <TableCell>
                            <a href={acc.website.startsWith('http') ? acc.website : `https://${acc.website}`} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-indigo)', display: 'flex', alignItems: 'center', gap: '4px', textDecoration: 'none' }}>
                              <Globe className="w-3.5 h-3.5" />
                              {acc.website}
                            </a>
                          </TableCell>
                          <TableCell>{acc.email}</TableCell>
                          <TableCell>{acc.phone}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '20px' }}>No accounts matched.</div>
                )}
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}

