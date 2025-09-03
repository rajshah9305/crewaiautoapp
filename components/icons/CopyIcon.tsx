import React from 'react';

const CopyIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M7 3.5A1.5 1.5 0 018.5 2h5.25a.75.75 0 010 1.5H8.5A1.5 1.5 0 017 2V1.5z" opacity="0.2"/>
      <path d="M6.5 3.5v11a.5.5 0 00.5.5h7a.5.5 0 00.5-.5v-11a.5.5 0 00-.5-.5h-7a.5.5 0 00-.5.5z" opacity="0.2"/>
      <path d="M6.5 2A1.5 1.5 0 005 3.5v11A1.5 1.5 0 006.5 16h8a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0014.5 2h-8zM6.5 3.5a.5.5 0 01.5-.5h7a.5.5 0 01.5.5v11a.5.5 0 01-.5.5h-7a.5.5 0 01-.5-.5v-11z" />
    </svg>
);

export default CopyIcon;
