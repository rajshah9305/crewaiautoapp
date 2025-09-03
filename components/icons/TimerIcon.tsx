import React from 'react';

const TimerIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" opacity="0.3"/>
    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v6.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2z" clipRule="evenodd" />
    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.25 5a.75.75 0 00-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 000-1.5h-3.25V5z" />
  </svg>
);

export default TimerIcon;