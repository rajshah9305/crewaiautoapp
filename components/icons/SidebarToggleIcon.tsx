import React from 'react';

const SidebarToggleIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className = "h-6 w-6 text-text-secondary", style }) => {
  return (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={style}
    >
        <line x1="4" y1="12" x2="20" y2="12" />
        <line x1="4" y1="6" x2="20" y2="6" />
        <line x1="4" y1="18" x2="20" y2="18" />
    </svg>
  );
};

export default SidebarToggleIcon;
