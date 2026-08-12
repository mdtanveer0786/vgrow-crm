import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  options: { value: string; label: string }[];
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, options, className = '', style = {}, ...props }, ref) => {
    return (
      <div className="form-field" style={{ width: '100%' }}>
        {label && <label className="form-label">{label}</label>}
        <div style={{ position: 'relative', width: '100%' }}>
          <select
            ref={ref}
            className={`form-input ${className}`}
            style={{
              borderColor: error ? 'var(--semantic-danger)' : undefined,
              ...style
            }}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>
        {error && <span style={{ fontSize: '10px', color: 'var(--semantic-danger)', marginTop: '4px', fontWeight: '600' }}>{error}</span>}
      </div>
    );
  }
);

Select.displayName = 'Select';
