import React from 'react';

const WriteIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
        <path d="M2.695 14.763l-1.262 3.154a.5.5 0 00.65.65l3.155-1.262a4 4 0 001.343-.885L17.5 5.5a2.121 2.121 0 00-3-3L3.58 13.42a4 4 0 00-.885 1.343z" opacity="0.2"/>
        <path d="M16 2.5a.5.5 0 00-1 0V3h-1.5a.5.5 0 000 1H15v1.5a.5.5 0 001 0V4h1.5a.5.5 0 000-1H16V2.5zM13 5a.5.5 0 00-1 0V6H9.5a.5.5 0 000 1H12v2.5a.5.5 0 001 0V7h2.5a.5.5 0 000-1H13V5z" />
    </svg>
);

export default WriteIcon;
