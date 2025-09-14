import React from 'react';

/**
 * A simple toggle switch.  The `checked` prop controls the state
 * externally, while `onCheckedChange` notifies parents of state
 * changes.  Styling matches the rest of the application.  This
 * component does not support keyboard access for brevity.
 */
export interface SwitchProps {
  checked: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
}

export const Switch: React.FC<SwitchProps> = ({ checked, onCheckedChange, className = '' }) => {
  return (
    <button
      onClick={() => onCheckedChange?.(!checked)}
      className={`relative w-10 h-6 flex items-center rounded-full transition-colors duration-200 ${
        checked ? 'bg-blue-600' : 'bg-gray-600'
      } ${className}`}
    >
      <span
        className={`inline-block w-4 h-4 rounded-full bg-white transform transition-transform duration-200 ${
          checked ? 'translate-x-4' : 'translate-x-1'
        }`}
      />
    </button>
  );
};