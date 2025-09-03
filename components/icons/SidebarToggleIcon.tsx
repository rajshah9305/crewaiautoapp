import React from 'react';

const SidebarToggleIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className = "h-6 w-6 text-text-secondary", style }) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <rect width="14" height="14" x="3" y="3" rx="2" opacity="0.3" />
      <path d="M2 4.75A.75.75 0 012.75 4h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 4.75zM2 9.75A.75.75 0 012.75 9h14.5a.75.75 0 010 1.5H2.75A.75.75 0 012 9.75zM2 14.75a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" />
    </svg>
  );
};

export default SidebarToggleIcon;