import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
  padding?: string;
}

export const Card = ({ children, className = '', padding = 'var(--space-6)', style, ...props }: CardProps) => {
  return (
    <div 
      className={`card-panel ${className}`} 
      style={{ padding, background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', ...style }}
      {...props}
    >
      {children}
    </div>
  );
};

export const CardHeader = ({ title, subtitle, action, className = '' }: { title: React.ReactNode, subtitle?: React.ReactNode, action?: React.ReactNode, className?: string }) => {
  return (
    <div className={`flex-between ${className}`} style={{ marginBottom: 'var(--space-6)' }}>
      <div>
        <h3 style={{ fontSize: '15px', fontWeight: '800', color: 'var(--text-primary)' }}>{title}</h3>
        {subtitle && <p style={{ fontSize: '11px', color: 'var(--text-secondary)', marginTop: 'var(--space-1)' }}>{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
};

