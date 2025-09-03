import React from 'react';

const ContentIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <rect width="14" height="14" x="3" y="3" rx="2" opacity="0.3" />
      <path d="M3 4.75A.75.75 0 013.75 4h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 4.75zM3 9.75A.75.75 0 013.75 9h12.5a.75.75 0 010 1.5H3.75A.75.75 0 013 9.75zM3.75 14a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5H3.75z" />
    </svg>
);

export default ContentIcon;