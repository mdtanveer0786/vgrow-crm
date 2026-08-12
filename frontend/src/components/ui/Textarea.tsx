import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className = '', style = {}, ...props }, ref) => {
    return (
      <div className="form-field" style={{ width: '100%' }}>
        {label && <label className="form-label">{label}</label>}
        <div style={{ position: 'relative', width: '100%' }}>
          <textarea
            ref={ref}
            className={`form-input ${className}`}
            style={{
              borderColor: error ? 'var(--semantic-danger)' : undefined,
              minHeight: '80px',
              resize: 'vertical',
              ...style
            }}
            {...props}
          />
        </div>
        {error && <span style={{ fontSize: '10px', color: 'var(--semantic-danger)', marginTop: '4px', fontWeight: '600' }}>{error}</span>}
      </div>
    );
  }
);

Textarea.displayName = 'Textarea';
