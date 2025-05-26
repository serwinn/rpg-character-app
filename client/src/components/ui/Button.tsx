import { ButtonHTMLAttributes, forwardRef } from 'react';
import { twMerge } from 'tailwind-merge';
import { Loader2 } from 'lucide-react';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(({
  children,
  className,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  fullWidth = false,
  disabled,
  ...props
}, ref) => {
  // Base classes
  const baseClasses = 'font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 inline-flex items-center justify-center';
  
  // Size classes
  const sizeClasses = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2',
    lg: 'px-6 py-3 text-lg',
  };
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-red-900 text-amber-50 hover:bg-red-800 focus:ring-red-700',
    secondary: 'bg-amber-200 text-stone-800 hover:bg-amber-300 focus:ring-amber-400',
    ghost: 'bg-transparent text-stone-800 hover:bg-amber-100 focus:ring-amber-200',
    outline: 'bg-transparent text-stone-800 border border-amber-300 hover:bg-amber-100 focus:ring-amber-300',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
  };
  
  // Combined classes
  const classes = twMerge(
    baseClasses,
    sizeClasses[size],
    variantClasses[variant],
    fullWidth ? 'w-full' : '',
    (disabled || isLoading) ? 'opacity-70 cursor-not-allowed' : '',
    className
  );
  
  return (
    <button
      ref={ref}
      className={classes}
      disabled={disabled || isLoading}
      {...props}
      aria-busy={isLoading ? "true" : undefined}
    >
      {isLoading && (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-label="Ładowanie..." />
      )}
      {children}
    </button>
  );
});

Button.displayName = 'Button';

export default Button;