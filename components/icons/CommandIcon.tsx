import React from 'react';

const CommandIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path fillRule="evenodd" d="M2 10a8 8 0 1116 0 8 8 0 01-16 0z" clipRule="evenodd" opacity="0.3"/>
      <path d="M6.22 8.22a.75.75 0 011.06 0l2.22 2.22-2.22 2.22a.75.75 0 11-1.06-1.06L7.94 10 6.22 8.78a.75.75 0 010-1.06zM11.25 7.75a.75.75 0 01.75.75v3a.75.75 0 01-1.5 0v-3a.75.75 0 01.75-.75z" />
    </svg>
);

export default CommandIcon;