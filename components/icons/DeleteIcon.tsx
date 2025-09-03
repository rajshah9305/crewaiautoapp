import React from 'react';

const DeleteIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
        <rect width="12" height="12" x="4" y="6" rx="2" opacity="0.3" />
        <path d="M10 9a1 1 0 100-2 1 1 0 000 2zm-2 1a1 1 0 112 0 1 1 0 01-2 0zm4 0a1 1 0 112 0 1 1 0 01-2 0z" />
        <path fillRule="evenodd" d="M5.5 5.5A.5.5 0 016 5h8a.5.5 0 010 1H6a.5.5 0 01-.5-.5z" clipRule="evenodd" />
        <path fillRule="evenodd" d="M6 3.5A1.5 1.5 0 017.5 2h5A1.5 1.5 0 0114 3.5v1.5a.5.5 0 01-1 0V4a.5.5 0 00-.5-.5h-5a.5.5 0 00-.5.5v1a.5.5 0 01-1 0v-1.5z" clipRule="evenodd" />
    </svg>
);

export default DeleteIcon;