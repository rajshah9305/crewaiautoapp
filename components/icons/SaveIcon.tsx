import React from 'react';

const SaveIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M3 3.5A1.5 1.5 0 014.5 2h6.879a1.5 1.5 0 011.06.44l4.122 4.12A1.5 1.5 0 0117 7.622V16.5a1.5 1.5 0 01-1.5 1.5h-11A1.5 1.5 0 013 16.5v-13z" opacity="0.3"/>
      <path d="M8 13.5a1.5 1.5 0 001.5 1.5h1a1.5 1.5 0 001.5-1.5v-3A1.5 1.5 0 0010.5 9h-1A1.5 1.5 0 008 10.5v3z" />
      <path d="M12.5 2.5a.5.5 0 01.5.5v3a.5.5 0 01-.5.5h-5a.5.5 0 01-.5-.5v-3a.5.5 0 01.5-.5h5z" />
    </svg>
);

export default SaveIcon;