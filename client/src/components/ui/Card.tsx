import { forwardRef, HTMLAttributes } from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'outline';
}

const Card = forwardRef<HTMLDivElement, CardProps>(({ 
  className, 
  variant = 'default',
  ...props 
}, ref) => {
  const baseClasses = 'rounded-lg shadow-md overflow-hidden';
  
  const variantClasses = {
    default: 'bg-amber-50 bg-opacity-95 border border-amber-200',
    outline: 'bg-transparent border border-amber-300',
  };
  
  return (
    <div
      ref={ref}
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        className
      )}
      {...props}
    />
  );
});

Card.displayName = 'Card';

const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ 
  className, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={twMerge('p-6 border-b border-amber-200', className)}
    {...props}
  />
));

CardHeader.displayName = 'CardHeader';

const CardTitle = forwardRef<HTMLHeadingElement, HTMLAttributes<HTMLHeadingElement>>(({ 
  className, 
  ...props 
}, ref) => (
  <h3
    ref={ref}
    className={twMerge('text-xl font-semibold font-cinzel text-stone-800', className)}
    {...props}
  />
));

CardTitle.displayName = 'CardTitle';

const CardDescription = forwardRef<HTMLParagraphElement, HTMLAttributes<HTMLParagraphElement>>(({ 
  className, 
  ...props 
}, ref) => (
  <p
    ref={ref}
    className={twMerge('text-sm text-stone-600 mt-1', className)}
    {...props}
  />
));

CardDescription.displayName = 'CardDescription';

const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ 
  className, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={twMerge('p-6', className)}
    {...props}
  />
));

CardContent.displayName = 'CardContent';

const CardFooter = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ 
  className, 
  ...props 
}, ref) => (
  <div
    ref={ref}
    className={twMerge('p-6 pt-0 flex items-center', className)}
    {...props}
  />
));

CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };