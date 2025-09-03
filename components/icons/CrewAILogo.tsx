import React from 'react';

const CrewAILogo: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 20 20" 
    fill="currentColor" 
    className={className} 
    style={style}
  >
    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16z" clipRule="evenodd" opacity="0.2"/>
    <path d="M9.422 2.302a.75.75 0 011.156 0l2.356 3.992a.75.75 0 00.678.43l4.42-.01a.75.75 0 01.528 1.25l-3.21 2.92a.75.75 0 00-.261.76l1.22 4.303a.75.75 0 01-1.11.832L12.01 13.91a.75.75 0 00-.868 0l-3.86 2.45a.75.75 0 01-1.11-.832l1.22-4.303a.75.75 0 00-.261-.76l-3.21-2.92a.75.75 0 01.528-1.25l4.42.01a.75.75 0 00.678-.43L9.422 2.302z" />
  </svg>
);

export default CrewAILogo;
