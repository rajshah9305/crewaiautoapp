import React, { useState, useEffect, useRef } from 'react';
import WriteIcon from '../icons/WriteIcon';

const WritingVisual: React.FC<{ liveText: string; title: string }> = ({ liveText, title }) => {
  const [displayedText, setDisplayedText] = useState('');
  const textEndRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Basic typing animation effect
    let i = displayedText.length;
    if (i < liveText.length) {
      const typingSpeed = 30; // Slower for writing
      const timer = setTimeout(() => {
        setDisplayedText(liveText.substring(0, i + Math.floor(Math.random() * 3) + 1));
      }, Math.random() * typingSpeed);
      return () => clearTimeout(timer);
    }
  }, [liveText, displayedText]);

  useEffect(() => {
    textEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedText]);


  return (
    <div className="p-3 font-sans text-xs h-full flex flex-col">
      <div className="flex items-center gap-2 text-text-secondary mb-2 flex-shrink-0">
        <WriteIcon className="w-4 h-4" />
        <span className="font-semibold">{title}</span>
      </div>
      <div className="space-y-2 p-3 bg-background border border-border rounded-md flex-1 overflow-auto">
         <div className="text-text-secondary leading-relaxed">
            {displayedText}
            <span className="inline-block w-0.5 h-3 bg-primary ml-0.5 animate-blink" ref={textEndRef}></span>
         </div>
      </div>
    </div>
  );
};

export default WritingVisual;