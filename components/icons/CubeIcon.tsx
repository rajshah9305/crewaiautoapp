import React from 'react';

const CubeIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M10 2.5a.75.75 0 01.75.75v13.5a.75.75 0 01-1.5 0V3.25a.75.75 0 01.75-.75z" opacity="0.2" />
      <path d="M3.25 5a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75zM3.25 15a.75.75 0 01.75-.75h12.5a.75.75 0 010 1.5H4a.75.75 0 01-.75-.75z" opacity="0.2" />
      <path fillRule="evenodd" d="M5 10a.75.75 0 01.75-.75h8.5a.75.75 0 010 1.5H5.75A.75.75 0 015 10z" clipRule="evenodd" />
      <path fillRule="evenodd" d="M2 5.25a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75zm0 9.5a.75.75 0 01.75-.75h14.5a.75.75 0 010 1.5H2.75a.75.75 0 01-.75-.75z" clipRule="evenodd" />
    </svg>
);

export default CubeIcon;
