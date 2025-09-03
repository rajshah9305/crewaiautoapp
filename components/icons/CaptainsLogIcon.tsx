import React from 'react';

const CaptainsLogIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6z" clipRule="evenodd" opacity="0.2" />
    <path d="M8 12a1 1 0 11-2 0 1 1 0 012 0zm2.5-1a.5.5 0 000-1h-1a.5.5 0 000 1h1zM10 10a.5.5 0 01.5-.5h1a.5.5 0 010 1h-1A.5.5 0 0110 10zM8.5 7a.5.5 0 000 1h4a.5.5 0 000-1h-4z" />
  </svg>
);

export default CaptainsLogIcon;
