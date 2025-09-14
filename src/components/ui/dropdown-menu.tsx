import React, { useState, useRef, useEffect } from 'react';

/**
 * A simple dropdown menu implementation.  The trigger displays a
 * menu when clicked and hides it when clicking outside.  It is not
 * as fully featured as shadcn/ui but provides sufficient
 * functionality for toggling advanced settings in the game.
 */
export const DropdownMenu: React.FC<{ children: React.ReactNode }> = ({ children }) => <div className="relative inline-block text-left">{children}</div>;

export const DropdownMenuTrigger = React.forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className = '', ...props }, ref) => (
  <button
    ref={ref}
    className={`px-4 py-2 rounded-md bg-gray-700 hover:bg-gray-600 focus:outline-none ${className}`}
    {...props}
  />
));

DropdownMenuTrigger.displayName = 'DropdownMenuTrigger';

export const DropdownMenuContent: React.FC<{
  className?: string;
  children: React.ReactNode;
}> = ({ className = '', children }) => {
  const [open, setOpen] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Toggle menu when trigger is clicked.
  const handleTriggerClick = () => setOpen((o) => !o);

  // Close the menu when clicking outside.
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        contentRef.current &&
        !contentRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <DropdownMenuTrigger ref={triggerRef} onClick={handleTriggerClick}>
        Advanced
      </DropdownMenuTrigger>
      {open && (
        <div
          ref={contentRef}
          className={`absolute right-0 mt-2 w-56 rounded-md bg-gray-800 shadow-lg z-50 ${className}`}
        >
          {children}
        </div>
      )}
    </>
  );
};

export const DropdownMenuItem: React.FC<{
  onSelect: () => void;
  children: React.ReactNode;
}> = ({ onSelect, children }) => (
  <div
    onClick={() => {
      onSelect();
    }}
    className="px-4 py-2 text-sm text-gray-200 cursor-pointer hover:bg-gray-700"
  >
    {children}
  </div>
);

export const DropdownMenuLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wide">
    {children}
  </div>
);

export const DropdownMenuSeparator: React.FC = () => <div className="h-px bg-gray-700 my-1" />;