import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, leftIcon, className = '', style = {}, ...props }, ref) => {
    return (
      <div className="form-field" style={{ width: '100%' }}>
        {label && <label className="form-label">{label}</label>}
        <div style={{ position: 'relative', width: '100%' }}>
          {leftIcon && (
            <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}>
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            className={`form-input ${className}`}
            style={{
              paddingLeft: leftIcon ? '36px' : '14px',
              borderColor: error ? 'var(--accent-rose)' : undefined,
              ...style
            }}
            {...props}
          />
        </div>
        {error && <span style={{ fontSize: '10px', color: 'var(--accent-rose)', marginTop: '4px', fontWeight: '600' }}>{error}</span>}
      </div>
    );
  }
);

Input.displayName = 'Input';
