import React from 'react';

const UploadIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width="24" 
        height="24" 
        viewBox="0 0 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="1.5" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className} 
        style={style}
    >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17 12 12 7 7 12" />
        <line x1="12" y1="7" x2="12" y2="21" />
    </svg>
);

export default UploadIcon;
