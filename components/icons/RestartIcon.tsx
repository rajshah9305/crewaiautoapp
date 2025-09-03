import React from 'react';

const RestartIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M10 2.5a7.5 7.5 0 015.646 12.459.75.75 0 00-1.292-.751A6 6 0 105.19 14.808a.75.75 0 00-1.292.75A7.5 7.5 0 0110 2.5z" opacity="0.3" />
      <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
    </svg>
);

export default RestartIcon;