import React from 'react';

interface TableProps extends React.HTMLAttributes<HTMLTableElement> {
  children: React.ReactNode;
  className?: string;
}

export const Table = ({ children, className = '', style, ...props }: TableProps) => {
  return (
    <div className={`data-table-container ${className}`} style={{ borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)', overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
      <table className="data-table" style={{ width: '100%', minWidth: '600px', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px', ...style }} {...props}>
        {children}
      </table>
    </div>
  );
};

export const TableHead = ({ children, style, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return (
    <thead style={style} {...props}>
      <tr style={{ background: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-color)' }}>
        {children}
      </tr>
    </thead>
  );
};

export const TableHeader = ({ children, className = '', style, ...props }: React.ThHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <th scope="col" className={className} style={{ padding: '12px 16px', fontSize: '11px', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px', ...style }} {...props}>
      {children}
    </th>
  );
};

export const TableBody = ({ children, ...props }: React.HTMLAttributes<HTMLTableSectionElement>) => {
  return <tbody {...props}>{children}</tbody>;
};

export const TableRow = ({ children, onClick, className = '', style, ...props }: React.HTMLAttributes<HTMLTableRowElement>) => {
  return (
    <tr 
      onClick={onClick}
      className={`${className} ${onClick ? 'table-row-clickable' : ''}`}
      style={{ 
        borderBottom: '1px solid var(--border-subtle)', 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'background 0.15s ease',
        ...style
      }}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e as any);
        }
      }}
      {...props}
    >
      {children}
    </tr>
  );
};

export const TableCell = ({ children, className = '', style, ...props }: React.TdHTMLAttributes<HTMLTableCellElement>) => {
  return (
    <td className={className} style={{ padding: '14px 16px', color: 'var(--text-secondary)', ...style }} {...props}>
      {children}
    </td>
  );
};

