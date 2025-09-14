import React from 'react';

/**
 * A horizontal progress bar.  The `value` prop is a percentage
 * between 0 and 100.  The outer bar sets the size and colour of
 * the track, while the inner bar indicates completion.
 */
export const Progress: React.FC<{ value: number; className?: string }> = ({ value, className = '' }) => {
  const clamped = Math.min(100, Math.max(0, value));
  return (
    <div className={`w-full h-3 bg-gray-700 rounded-full overflow-hidden ${className}`}>
      <div
        className="h-full bg-blue-500 transition-all duration-200"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
};