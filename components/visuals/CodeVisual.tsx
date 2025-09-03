import React from 'react';
import CodeIcon from '../icons/CodeIcon';

const styles = `
.code-line {
  fill: var(--surface-color);
  animation: fill-line 1s ease-in-out alternate infinite;
}
.code-line-2 { animation-delay: 0.2s; }
.code-line-3 { animation-delay: 0.4s; }
.code-line-4 { animation-delay: 0.6s; }

@keyframes fill-line {
  from { opacity: 0.3; width: 0%; }
  to { opacity: 1; width: 100%; }
}
`;

const CodeVisual: React.FC = () => {
  return (
    <div className="p-3">
      <style>{styles}</style>
      <div className="flex items-center gap-2 text-text-secondary mb-2 text-xs">
        <CodeIcon className="w-4 h-4" />
        <span className="font-semibold">Compiling...</span>
      </div>
      <div className="w-full p-2 h-24 flex items-center justify-center bg-background overflow-hidden border border-border rounded-md">
        <svg viewBox="0 0 100 60" width="100" height="60" className="w-full h-full">
            <rect x="5" y="5" width="90" height="50" rx="2" fill="var(--surface-color)" />

            <g transform="translate(15, 15)">
                <rect className="code-line" y="0" width="70" height="4" rx="2" />
                <rect className="code-line code-line-2" y="10" width="50" height="4" rx="2" />
                <rect className="code-line code-line-3" y="20" width="70" height="4" rx="2" />
                <rect className="code-line code-line-4" y="30" width="60" height="4" rx="2" />
            </g>
        </svg>
      </div>
    </div>
  );
};

export default CodeVisual;