import React from 'react';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'amber' | 'indigo' | 'rose' | 'emerald' | 'default';
  children: React.ReactNode;
}

export const Badge = ({ variant = 'default', children, className = '', ...props }: BadgeProps) => {
  const getColors = () => {
    switch (variant) {
      case 'amber': return { color: 'var(--accent-amber)', bg: 'rgba(245, 158, 11, 0.1)', border: 'rgba(245, 158, 11, 0.2)' };
      case 'indigo': return { color: 'var(--accent-indigo)', bg: 'rgba(99, 102, 241, 0.1)', border: 'rgba(99, 102, 241, 0.2)' };
      case 'rose': return { color: 'var(--accent-rose)', bg: 'rgba(244, 63, 94, 0.1)', border: 'rgba(244, 63, 94, 0.2)' };
      case 'emerald': return { color: 'var(--accent-emerald)', bg: 'rgba(16, 185, 129, 0.1)', border: 'rgba(16, 185, 129, 0.2)' };
      default: return { color: 'var(--text-secondary)', bg: 'rgba(100, 116, 139, 0.1)', border: 'rgba(100, 116, 139, 0.2)' };
    }
  };

  const colors = getColors();

  return (
    <span 
      className={`badge ${className}`}
      style={{
        color: colors.color,
        background: colors.bg,
        border: `1px solid ${colors.border}`,
        fontSize: '10px',
        fontWeight: '700',
        padding: '2px 8px',
        borderRadius: 'var(--radius-sm)',
        textTransform: 'uppercase',
        letterSpacing: '0.5px'
      }}
      {...props}
    >
      {children}
    </span>
  );
};
