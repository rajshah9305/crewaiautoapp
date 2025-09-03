import React from 'react';
import TypingAnimation from './TypingAnimation';
import WriteIcon from '../icons/WriteIcon';

const styles = `
.stream-line {
  stroke: var(--secondary-color);
  opacity: 0.5;
  stroke-dasharray: 200;
  stroke-dashoffset: 200;
  animation: draw-line 2s ease-out forwards;
}
.data-particle {
  fill: var(--accent-color);
  animation: fade-in-out 2s ease-in-out forwards;
}
.resolved-line {
    background-color: var(--secondary-color);
    box-shadow: 0 0 8px var(--glow-color-secondary);
    height: 2px;
    border-radius: 1px;
    animation: fill-line 1s ease-out forwards;
}
@keyframes draw-line {
    to { stroke-dashoffset: 0; }
}
@keyframes fade-in-out {
    0% { opacity: 0; }
    50% { opacity: 1; }
    100% { opacity: 0; }
}
@keyframes fill-line {
    from { width: 0%; }
    to { width: 100%; }
}
`;

const WritingVisual: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="p-4 font-mono text-xs">
      <style>{styles}</style>
      <div className="flex items-center gap-2 text-text-secondary mb-3 uppercase">
        <WriteIcon className="w-4 h-4 text-secondary" />
        <span>{text}</span>
      </div>
      <div className="flex h-16">
        <div className="w-1/3 flex items-center justify-center">
            <svg viewBox="0 0 50 100" className="h-full">
                {/* 3 incoming streams */}
                <path d="M 0 10 C 25 10, 25 40, 50 50" fill="none" className="stream-line" style={{ animationDelay: '0s' }} />
                <path d="M 0 50 C 25 50, 25 50, 50 50" fill="none" className="stream-line" style={{ animationDelay: '0.2s' }} />
                <path d="M 0 90 C 25 90, 25 60, 50 50" fill="none" className="stream-line" style={{ animationDelay: '0.4s' }} />
                {/* Particles at source */}
                <circle cx="0" cy="10" r="2" className="data-particle" style={{ animationDelay: '0s' }} />
                <circle cx="0" cy="50" r="2" className="data-particle" style={{ animationDelay: '0.2s' }} />
                <circle cx="0" cy="90" r="2" className="data-particle" style={{ animationDelay: '0.4s' }} />
            </svg>
        </div>
        <div className="w-2/3 flex flex-col justify-center space-y-4 pl-4 border-l-2 border-primary" style={{ boxShadow: '-5px 0 15px -5px var(--glow-color-primary)' }}>
             <div className="resolved-line w-[90%]" style={{ animationDelay: '0.5s' }} />
             <div className="resolved-line w-[75%]" style={{ animationDelay: '0.8s' }} />
             <div className="flex items-center">
                <div className="resolved-line w-[50%]" style={{ animationDelay: '1.1s' }} />
                <TypingAnimation />
             </div>
        </div>
      </div>
    </div>
  );
};

export default WritingVisual;