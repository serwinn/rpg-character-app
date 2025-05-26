import { forwardRef, InputHTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(({
  className,
  error,
  fullWidth = false,
  ...props
}, ref) => {
  return (
    <div className={`${fullWidth ? 'w-full' : ''}`}>
      <input
        className={twMerge(
          'px-3 py-2 bg-amber-50 border border-amber-300 rounded-md focus:outline-none focus:ring-2 focus:ring-amber-500',
          error ? 'border-red-500 focus:ring-red-500' : '',
          fullWidth ? 'w-full' : '',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600">{error === 'This field is required' ? 'To pole jest wymagane' : error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;