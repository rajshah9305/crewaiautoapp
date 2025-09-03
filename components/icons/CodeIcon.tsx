import React from 'react';

const CodeIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v14.5a.75.75 0 01-1.5 0V2.75A.75.75 0 0110 2z" clipRule="evenodd" opacity="0.2" />
    <path fillRule="evenodd" d="M6.28 5.22a.75.75 0 010 1.06L3.56 9l2.72 2.72a.75.75 0 01-1.06 1.06L1.97 9.53a.75.75 0 010-1.06l3.25-3.25a.75.75 0 011.06 0zm7.44 0a.75.75 0 011.06 0l3.25 3.25a.75.75 0 010 1.06l-3.25 3.25a.75.75 0 01-1.06-1.06L16.44 9l-2.72-2.72a.75.75 0 010-1.06z" clipRule="evenodd" />
  </svg>
);

export default CodeIcon;
