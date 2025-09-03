import React from 'react';

const CubeIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M4 4.5A1.5 1.5 0 015.5 3h9A1.5 1.5 0 0116 4.5v9a1.5 1.5 0 01-1.5 1.5h-9A1.5 1.5 0 014 13.5v-9z" opacity=".3"/>
      <path d="M6.22 8.72a.75.75 0 011.06 0l2.22 2.22 2.22-2.22a.75.75 0 111.06 1.06l-2.22 2.22-2.22 2.22a.75.75 0 11-1.06-1.06l2.22-2.22-2.22-2.22a.75.75 0 010-1.06z" opacity=".3"/>
      <path d="M5.5 4a.5.5 0 00-.5.5v9a.5.5 0 00.5.5h9a.5.5 0 00.5-.5v-9a.5.5 0 00-.5-.5h-9z" />
    </svg>
);

export default CubeIcon;