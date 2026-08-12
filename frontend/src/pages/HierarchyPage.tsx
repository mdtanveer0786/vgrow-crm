import React from 'react';
import { useAppContext } from '../context/AppContext';
import { ShieldCheck, UserCheck, Users, ChevronRight, User } from 'lucide-react';
import { Card, Badge } from '../components/ui';

export default function HierarchyPage() {
  const { activeTab, employees } = useAppContext();

  // Map employees to hierarchy roles
  const orgRoles = employees.map((member: any) => ({
    role: member.role || 'Staff Member',
    name: `${member.firstName || ''} ${member.lastName || ''}`.trim() || member.name || 'Team Member',
    email: member.email,
    level: member.role || 'Staff',
    color: member.role === 'Admin' ? 'var(--accent-rose)' : member.role === 'Manager' ? 'var(--accent-indigo)' : 'var(--accent-emerald)'
  }));

  return (
    <>
      {activeTab === 'hierarchy' && (
        <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <div className="page-header">
            <div>
              <h2 className="page-title">Workspace Hierarchy</h2>
              <p className="page-desc">Visualize organization structure, reporting managers and system access levels.</p>
            </div>
          </div>

          <Card padding="24px" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <h3 style={{ color: 'var(--text-primary)', fontSize: '15px', fontWeight: '800', marginBottom: '16px' }}>Team Organization Chart</h3>
            
            {orgRoles.length === 0 ? (
              <p style={{ color: 'var(--text-secondary)', fontSize: '13px' }}>No team members added yet. Add employees in the Employees workspace to build your hierarchy.</p>
            ) : (
              orgRoles.map((member, index) => (
                <React.Fragment key={index}>
                  <Card 
                    padding="16px" 
                    style={{ 
                      width: '100%', 
                      maxWidth: '320px', 
                      borderLeft: `4px solid ${member.color}`, 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: '12px' 
                    }}
                  >
                    <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <User className="w-5 h-5" style={{ color: member.color }} />
                    </div>
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: '800', color: 'var(--text-primary)' }}>{member.name}</h4>
                      <p style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>{member.role}</p>
                      <Badge 
                        variant={member.role === 'Admin' ? 'rose' : member.role === 'Manager' ? 'indigo' : 'emerald'} 
                        style={{ fontSize: '9px', marginTop: '4px', display: 'inline-block' }}
                      >
                        {member.level}
                      </Badge>
                    </div>
                  </Card>
                  {index < orgRoles.length - 1 && (
                    <div style={{ width: '2px', height: '32px', background: 'var(--border-color)', position: 'relative' }}>
                      <div style={{ position: 'absolute', bottom: '-4px', left: '-3px', width: '8px', height: '8px', borderRadius: '50%', background: 'var(--accent-indigo)' }}></div>
                    </div>
                  )}
                </React.Fragment>
              ))
            )}
          </Card>

        </div>
      )}
    </>
  );
}

