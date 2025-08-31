import React from 'react';

const BlinkingCursor: React.FC = () => {
  return (
    <span className="inline-block bg-text-primary w-0.5 h-4 ml-1 animate-pulse" style={{ animation: 'blink 1s step-end infinite' }}></span>
  );
};

// Add keyframes for the blinking animation to your global CSS or a style tag if needed
const styles = `
@keyframes blink {
  from, to { opacity: 1 }
  50% { opacity: 0 }
}
`;

const TypingAnimation: React.FC = () => {
    return (
        <>
            <style>{styles}</style>
            <BlinkingCursor />
        </>
    )
}

export default TypingAnimation;