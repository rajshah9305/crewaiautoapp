import React from 'react';

const BlinkingCursor: React.FC = () => {
  return (
    <span className="inline-block bg-text-primary w-0.5 h-4 ml-1 blink-cursor"></span>
  );
};

// Add keyframes for the blinking animation to your global CSS or a style tag if needed
const styles = `
@keyframes blink {
  from, to { opacity: 1 }
  50% { opacity: 0 }
}
.blink-cursor {
  animation: blink 1s step-end infinite;
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
