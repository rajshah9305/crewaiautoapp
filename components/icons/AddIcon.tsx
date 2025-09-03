import React from 'react';

const AddIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" opacity="0.2" />
    <path d="M10.75 9.25V5a.75.75 0 00-1.5 0v4.25H5a.75.75 0 000 1.5h4.25V15a.75.75 0 001.5 0v-4.25H15a.75.75 0 000-1.5h-4.25z" />
  </svg>
);

export default AddIcon;
