import React from 'react';

const DotIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <circle cx="10" cy="10" r="5" opacity="0.3" />
    <circle cx="10" cy="10" r="2.5" />
  </svg>
);

export default DotIcon;