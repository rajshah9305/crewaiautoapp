import React from 'react';
import TypingAnimation from './TypingAnimation';
import WriteIcon from '../icons/WriteIcon';

interface WritingVisualProps {
    text: string;
}

const WritingVisual: React.FC<WritingVisualProps> = ({ text }) => {
  return (
    <div className="p-4 font-sans text-sm bg-background/50 rounded-lg">
      <div className="flex items-center gap-2 text-text-secondary mb-3">
        <WriteIcon className="w-5 h-5 text-secondary" />
        <span>{text}</span>
      </div>
      <div className="text-left text-text-primary/80 space-y-1">
        <div className="w-full h-2 bg-text-secondary/20 rounded-full animate-pulse"></div>
        <div className="w-10/12 h-2 bg-text-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
        <div className="w-11/12 h-2 bg-text-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
        <div className="flex items-center">
            <div className="w-1/2 h-2 bg-text-secondary/20 rounded-full animate-pulse" style={{ animationDelay: '0.6s' }}></div>
            <TypingAnimation />
        </div>
      </div>
    </div>
  );
};

export default WritingVisual;
