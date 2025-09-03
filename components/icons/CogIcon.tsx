import React from 'react';

const CogIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M10 3.75a2 2 0 100 4 2 2 0 000-4z" opacity="0.3"/>
      <path fillRule="evenodd" d="M10 2a.75.75 0 01.75.75v.518a7 7 0 014.232 1.342l.358-.62a.75.75 0 011.299.75l-.358.62a7 7 0 010 5.46l.358.62a.75.75 0 01-1.299.75l-.358-.62a7 7 0 01-4.232 1.342v.518a.75.75 0 01-1.5 0v-.518a7 7 0 01-4.232-1.342l-.358.62a.75.75 0 01-1.299-.75l.358-.62a7 7 0 010-5.46l-.358-.62a.75.75 0 011.299-.75l.358.62A7 7 0 019.25 3.268V2.75A.75.75 0 0110 2zM6.5 10a3.5 3.5 0 117 0 3.5 3.5 0 01-7 0z" clipRule="evenodd" />
    </svg>
);

export default CogIcon;