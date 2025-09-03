import React from 'react';

const GraphIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M10 3.5a1.5 1.5 0 011.5 1.5v1.5a.75.75 0 001.5 0V5A3 3 0 0010 2a3 3 0 00-3 3v1.5a.75.75 0 001.5 0V5a1.5 1.5 0 011.5-1.5zM3.25 10a1.5 1.5 0 011.5-1.5h1.5a.75.75 0 000-1.5H4.75A3 3 0 001.75 10a3 3 0 003 3h1.5a.75.75 0 000-1.5H4.75a1.5 1.5 0 01-1.5-1.5z" opacity="0.3"/>
      <path d="M10 16.5a1.5 1.5 0 01-1.5-1.5V13.5a.75.75 0 00-1.5 0V15a3 3 0 003 3a3 3 0 003-3v-1.5a.75.75 0 00-1.5 0V15a1.5 1.5 0 01-1.5 1.5zM16.75 10a1.5 1.5 0 01-1.5 1.5h-1.5a.75.75 0 000 1.5h1.5a3 3 0 003-3a3 3 0 00-3-3h-1.5a.75.75 0 000 1.5h1.5a1.5 1.5 0 011.5 1.5z" />
    </svg>
);

export default GraphIcon;