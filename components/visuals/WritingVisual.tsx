import React from 'react';
import WriteIcon from '../icons/WriteIcon';

const styles = `
@keyframes blink {
  50% { opacity: 0; }
}
.blinking-cursor {
  animation: blink 1s step-end infinite;
}

.line-draw {
  transform-origin: left;
  animation: draw 1.5s ease-out forwards;
}
@keyframes draw {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
`;

const WritingVisual: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className="p-4 font-mono text-xs">
      <style>{styles}</style>
      <div className="flex items-center gap-2 text-text-secondary mb-3">
        <WriteIcon className="w-4 h-4" />
        <span className="font-semibold">{text}</span>
      </div>
      <div className="space-y-2 p-2 bg-background border border-border rounded-md h-20">
         <div className="h-2 bg-gray-700 rounded-sm w-[90%] line-draw" style={{ animationDelay: '0s' }} />
         <div className="h-2 bg-gray-700 rounded-sm w-[75%]" style={{ animationDelay: '0.2s' }}/>
         <div className="flex items-center">
            <div className="h-2 bg-gray-700 rounded-sm w-[50%] line-draw" style={{ animationDelay: '0.4s' }} />
            <div className="w-0.5 h-3 bg-text-primary ml-1 blinking-cursor" />
         </div>
         <div className="h-2 bg-gray-700 rounded-sm w-[80%]" style={{ animationDelay: '0.6s' }}/>
      </div>
    </div>
  );
};

export default WritingVisual;