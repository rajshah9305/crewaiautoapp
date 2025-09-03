import React from 'react';

const ReviewIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
      <path d="M10 12.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z" opacity="0.2" />
      <path fillRule="evenodd" d="M.664 10.59a1.651 1.651 0 010-1.18l.88-1.473a1.651 1.651 0 012.86-.37l.838 1.396a1.651 1.651 0 010 1.18l-.838 1.396a1.651 1.651 0 01-2.86-.37l-.88-1.473zM15.936 10.59a1.651 1.651 0 010-1.18l.88-1.473a1.651 1.651 0 012.86-.37l.838 1.396a1.651 1.651 0 010 1.18l-.838 1.396a1.651 1.651 0 01-2.86-.37l-.88-1.473z" clipRule="evenodd" />
    </svg>
);

export default ReviewIcon;
