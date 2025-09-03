import React from 'react';

const WriteIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" opacity="0.3"/>
        <path d="M16.5 2.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
        <path d="M12.5 6.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
    </svg>
);

export default WriteIcon;