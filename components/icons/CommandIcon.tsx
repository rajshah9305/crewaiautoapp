import React from 'react';

const CommandIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" opacity="0.2"/>
      <path fillRule="evenodd" d="M4.75 8a.75.75 0 000 1.5h10.5a.75.75 0 000-1.5H4.75zM4.75 12a.75.75 0 000 1.5h6.5a.75.75 0 000-1.5h-6.5z" clipRule="evenodd" />
    </svg>
);

export default CommandIcon;
