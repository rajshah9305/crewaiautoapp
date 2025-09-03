import React from 'react';

const GraphIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
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
        <circle cx="5" cy="6" r="3" />
        <path d="M5 9v6" />
        <circle cx="5" cy="18" r="3" />
        <path d="M12 3v18" />
        <circle cx="19" cy="6" r="3" />
        <path d="M19 9v6" />
        <circle cx="19" cy="18" r="3" />
    </svg>
);

export default GraphIcon;
