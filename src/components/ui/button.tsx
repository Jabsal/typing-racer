import React from 'react';

/**
 * A simple button component used throughout the typing racer app.
 *
 * The component forwards native button attributes and applies a
 * consistent Tailwind style.  Additional classes can be supplied
 * via the `className` prop and will be merged with the defaults.
 */
export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({ className = '', ...props }) => {
  return (
    <button
      className={`px-4 py-2 rounded-md font-medium bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none ${className}`}
      {...props}
    />
  );
};

Button.displayName = 'Button';