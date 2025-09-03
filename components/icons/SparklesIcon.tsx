import React from 'react';

const SparklesIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path d="M10 2.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM3.5 10a.5.5 0 00-2 0v2a.5.5 0 001 0v-2a.5.5 0 00-1-1.5zM10 15.5a.5.5 0 01.5.5v2a.5.5 0 01-1 0v-2a.5.5 0 01.5-.5zM17.5 10a.5.5 0 00-1 0v1a.5.5 0 001 0v-1zM4.22 4.22a.5.5 0 01.707 0l1.414 1.414a.5.5 0 01-.707.707L4.22 4.927a.5.5 0 010-.707zM14.242 14.242a.5.5 0 01.707 0l1.415 1.415a.5.5 0 01-.707.707l-1.415-1.415a.5.5 0 010-.707z" opacity=".3"/>
    <path d="M5.636 14.242a.5.5 0 010-.707l1.415-1.415a.5.5 0 01.707.707L6.343 14.95a.5.5 0 01-.707 0zM15.657 4.927a.5.5 0 010 .707l-1.415 1.415a.5.5 0 11-.707-.707l1.415-1.415a.5.5 0 01.707 0z" />
  </svg>
);

export default SparklesIcon;