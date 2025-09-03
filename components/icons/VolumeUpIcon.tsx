import React from 'react';

const VolumeUpIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path d="M7 4a1 1 0 000 2v8a1 1 0 100 2h1a1 1 0 100-2V6a1 1 0 100-2H7z" opacity="0.2"/>
    <path d="M13.492 3.42a.75.75 0 01.375 1.026l-.001.002-2.5 5.5a.75.75 0 01-1.378-.624l2.5-5.5a.75.75 0 011.004-.404z" />
    <path d="M15.5 5.75a.75.75 0 01.21 1.04l-3.5 6.5a.75.75 0 01-1.28-.58l3.5-6.5a.75.75 0 011.07-.46z" />
  </svg>
);

export default VolumeUpIcon;
