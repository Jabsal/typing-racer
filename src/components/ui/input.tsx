import React from 'react';

/**
 * A basic text input with a dark background and light text.  This
 * component forwards the ref to the underlying input element,
 * allowing parent components to programmatically focus the field.
 */
export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={`w-full px-3 py-2 rounded-md bg-gray-900 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 ${className}`}
        {...props}
      />
    );
  },
);

Input.displayName = 'Input';