import React from 'react';

const NavComputerIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M3.5 4.5A1.5 1.5 0 015 3h10a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0115 13H5a1.5 1.5 0 01-1.5-1.5v-7z" opacity="0.2"/>
      <path d="M10.03 13.03a.75.75 0 010 1.06l-2.25 2.25a.75.75 0 01-1.06 0l-2.25-2.25a.75.75 0 111.06-1.06L7 14.44V13.5a.75.75 0 01.75-.75h4.5a.75.75 0 010 1.5H8.53l1.5-1.5zM15.5 14.75a.75.75 0 00-1.5 0v1.5h-1a.75.75 0 000 1.5h1.5a.75.75 0 000-1.5h-1v-1.5z" />
    </svg>
);

export default NavComputerIcon;
