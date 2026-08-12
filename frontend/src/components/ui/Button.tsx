import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = '', variant = 'primary', size = 'md', leftIcon, rightIcon, isLoading, children, ...props }, ref) => {
    
    // Mapping our custom classes
    const variantClasses = {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      destructive: 'btn-destructive',
    };

    return (
      <button
        ref={ref}
        className={`${variantClasses[variant]} ${className}`}
        style={{
          padding: size === 'sm' ? 'var(--space-2) var(--space-4)' : size === 'lg' ? 'var(--space-4) var(--space-6)' : 'var(--space-3) var(--space-5)',
          fontSize: size === 'sm' ? '13px' : size === 'lg' ? '15px' : '14px',
          borderRadius: size === 'sm' ? 'var(--radius-sm)' : size === 'lg' ? 'var(--radius-lg)' : 'var(--radius-md)',
          gap: 'var(--space-3)',
          minHeight: size === 'sm' ? '36px' : size === 'lg' ? '48px' : '44px', // Touch target sizes
          opacity: isLoading || props.disabled ? 0.7 : 1,
          cursor: isLoading || props.disabled ? 'not-allowed' : 'pointer'
        }}
        disabled={isLoading || props.disabled}
        aria-busy={isLoading}
        {...props}
      >
        {isLoading ? (
          <>
            <span className="sr-only">Loading...</span>
            <span style={{ width: '16px', height: '16px', borderRadius: '50%', border: '2px solid rgba(150,150,150,0.3)', borderTopColor: 'currentColor', animation: 'spin 1s linear infinite' }} />
          </>
        ) : leftIcon}
        {children}
        {!isLoading && rightIcon}
      </button>
    );
  }
);

Button.displayName = 'Button';
