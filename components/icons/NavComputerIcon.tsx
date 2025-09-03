import React from 'react';

const NavComputerIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M3.5 4.5A1.5 1.5 0 015 3h10a1.5 1.5 0 011.5 1.5v7A1.5 1.5 0 0115 13H5a1.5 1.5 0 01-1.5-1.5v-7z" opacity="0.3"/>
      <path d="M5.75 6a.75.75 0 00-1.5 0v2.5a.75.75 0 001.5 0V6zM8.25 6a.75.75 0 00-1.5 0v6.5a.75.75 0 001.5 0V6zM11.25 6a.75.75 0 00-1.5 0v3.5a.75.75 0 001.5 0V6zM14.25 6a.75.75 0 00-1.5 0v5.5a.75.75 0 001.5 0V6z" />
      <path d="M3.5 15.5a.5.5 0 01.5-.5h12a.5.5 0 010 1h-12a.5.5 0 01-.5-.5z" />
    </svg>
);

export default NavComputerIcon;