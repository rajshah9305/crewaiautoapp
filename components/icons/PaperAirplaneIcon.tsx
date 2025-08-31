import React from 'react';

const PaperAirplaneIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9.2-9.2a2 2 0 00-2.8-2.8L12 13.8V4.5a.5.5 0 00-1 0v9.3L3.6 7a2 2 0 00-2.8 2.8L12 19z" />
  </svg>
);

export default PaperAirplaneIcon;