import React from 'react';

const PaperAirplaneIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path d="M3.105 2.289a.75.75 0 00-.826.95l1.414 4.949a.75.75 0 00.95.54l4.223-1.516a.75.75 0 01.922.922l-1.516 4.223a.75.75 0 00.54.95l4.95 1.414a.75.75 0 00.95-.826L17.25 4.5a.75.75 0 00-.922-.702l-13.223-1.509z" opacity=".3"/>
    <path d="M18 2a.75.75 0 00-1.023-.683l-14.25 4a.75.75 0 00.023 1.423l14.25-4A.75.75 0 0018 2zm-1.147 12.317a.75.75 0 01-1.06 1.06l-4.243-4.242a.75.75 0 111.06-1.06l4.243 4.242z" />
  </svg>
);

export default PaperAirplaneIcon;