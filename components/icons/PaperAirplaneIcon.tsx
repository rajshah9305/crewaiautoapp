import React from 'react';

const PaperAirplaneIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.54l4.223-1.516a.75.75 0 01.922.922l-1.516 4.223a.75.75 0 00.54.95l4.95 1.414a.75.75 0 00.95-.826l-2.29-8.019a.75.75 0 00-.922-.702l-8.02 2.29z" opacity="0.2" />
    <path d="M16.92 15.93a.75.75 0 01-1.06 1.06l-4.95-4.95a.75.75 0 011.06-1.06l4.95 4.95z" />
  </svg>
);

export default PaperAirplaneIcon;
