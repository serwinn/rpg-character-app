import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface FormFieldProps {
  label: ReactNode;
  htmlFor: string;
  error?: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
}

const FormField = ({
  label,
  htmlFor,
  error,
  hint,
  required = false,
  children,
  className,
}: FormFieldProps) => {
  return (
    <div className={twMerge('mb-4', className)}>
      <label 
        htmlFor={htmlFor} 
        className="block text-sm font-medium text-stone-700 mb-1"
      >
        {label}
        {required && <span className="text-red-600 ml-1">*</span>}
      </label>
      
      {children}
      
      {hint && !error && (
        <p className="mt-1 text-sm text-stone-500">{hint}</p>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error === 'This field is required' ? 'To pole jest wymagane' : error}</p>
      )}
    </div>
  );
};

export default FormField;