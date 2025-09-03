import React from 'react';

const CrewAILogo: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className} 
    style={style}
  >
    <path 
      d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" 
      stroke="currentColor" 
      strokeWidth="1" 
      strokeLinejoin="round" 
    />
  </svg>
);

export default CrewAILogo;
