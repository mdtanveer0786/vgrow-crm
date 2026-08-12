import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, Search, Download, Upload, UserPlus } from 'lucide-react';
import { Card, Button, Badge, Input, Table, TableHead, TableHeader, TableBody, TableRow, TableCell } from '../components/ui';

export default function EmployeesPage() {
  const context = useAppContext();
  const {
      activeTab, employees, handleExportCSV, handleImportCSV, setShowAddEmployeeModal, setSelectedEmployee
  } = context;
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEmployees = employees.filter(emp =>
    `${emp.firstName || ''} ${emp.lastName || ''}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (emp.email || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      {activeTab === 'employees' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* Header */}
          <div className="page-header">
            <div>
              <h2 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Users className="w-5 h-5" style={{ color: 'var(--accent-indigo)' }} />
                Employees Directory & Team Access
              </h2>
              <p className="page-desc">Manage organization staff members, system access roles, and contact info.</p>
            </div>
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              <Button variant="secondary" onClick={() => handleExportCSV(employees, 'employees.csv')} leftIcon={<Download className="w-4 h-4" />}>
                Export CSV
              </Button>
              <label className="btn-secondary" style={{ cursor: 'pointer', margin: 0, display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                <Upload className="w-4 h-4" /> Import CSV
                <input type="file" accept=".csv" onChange={(e) => handleImportCSV(e, 'employees')} style={{ display: 'none' }} />
              </label>
              <Button variant="primary" onClick={() => setShowAddEmployeeModal(true)} leftIcon={<UserPlus className="w-4 h-4" />}>
                Add Employee
              </Button>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="dashboard-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', flexShrink: 0 }}>
            <Card padding="16px" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>Total Employees</p>
                <h4 style={{ fontSize: '24px', fontWeight: '800', marginTop: '6px' }}>{employees.length} Members</h4>
              </div>
              <Users className="w-8 h-8 text-indigo-400 opacity-80" />
            </Card>
          </div>

          {/* Directory Panel */}
          <Card padding="20px" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
              <h3 style={{ fontSize: '14px', fontWeight: '800', color: 'var(--text-primary)' }}>Team Register Directory</h3>
              <div style={{ width: '240px' }}>
                <Input 
                  type="text" 
                  leftIcon={<Search className="w-3.5 h-3.5" />}
                  placeholder="Search team by name or email..." 
                  style={{ fontSize: '12px' }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHead>
                <TableHeader>Employee Name</TableHeader>
                <TableHeader>Email Address</TableHeader>
                <TableHeader>Contact Phone</TableHeader>
                <TableHeader>System Access Role</TableHeader>
                <TableHeader>Status State</TableHeader>
              </TableHead>
              <TableBody>
                {filteredEmployees.map((emp) => (
                  <TableRow key={emp.id} onClick={() => setSelectedEmployee(emp)}>
                    <TableCell><span style={{ color: 'var(--text-primary)', fontWeight: '700' }}>{emp.name || `${emp.firstName || ''} ${emp.lastName || ''}`.trim()}</span></TableCell>
                    <TableCell>{emp.email}</TableCell>
                    <TableCell>{emp.phone || '+91 98765 00000'}</TableCell>
                    <TableCell>
                      <Badge variant="indigo">{emp.role}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant="emerald">{emp.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredEmployees.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
                      No staff registered. Click "+ Add Employee" to create new.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </Card>

        </div>
      )}
    </>
  );
}

