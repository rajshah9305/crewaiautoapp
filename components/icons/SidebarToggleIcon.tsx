import React from 'react';

const SidebarToggleIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className = "h-6 w-6 text-text-secondary", style }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      style={style}
      fill="none"
      viewBox="0 0 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  );
};

export default SidebarToggleIcon;
