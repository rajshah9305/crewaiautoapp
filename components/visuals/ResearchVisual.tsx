import React, { useMemo } from 'react';
import ResearchIcon from '../icons/ResearchIcon';

const styles = `
.node {
  animation: pulse-node 2s ease-in-out infinite;
}
.node-1 { animation-delay: 0s; }
.node-2 { animation-delay: 0.2s; }
.node-3 { animation-delay: 0.4s; }
.node-4 { animation-delay: 0.6s; }
.node-5 { animation-delay: 0.8s; }

.link {
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw-link 2s ease-in-out infinite;
}
.link-1 { animation-delay: 0.1s; }
.link-2 { animation-delay: 0.3s; }
.link-3 { animation-delay: 0.5s; }
.link-4 { animation-delay: 0.7s; }

.keyword-text {
    font-size: 6px;
    font-family: 'Roboto Mono', monospace;
    fill: var(--text-secondary-color);
    opacity: 0;
    animation: fade-in-out 4s ease-in-out infinite;
}
.keyword-1 { animation-delay: 0.5s; }
.keyword-2 { animation-delay: 1.5s; }
.keyword-3 { animation-delay: 2.5s; }
.keyword-4 { animation-delay: 3.5s; }


@keyframes pulse-node {
  0%, 100% { r: 3; opacity: 0.5; }
  50% { r: 4; opacity: 1; }
}

@keyframes draw-link {
  0% { stroke-dashoffset: 100; }
  50% { stroke-dashoffset: 0; }
  100% { stroke-dashoffset: -100; }
}

@keyframes fade-in-out {
    0%, 100% { opacity: 0; }
    50% { opacity: 0.9; }
}
`;

const commonWords = new Set(['the', 'a', 'in', 'is', 'to', 'of', 'and', 'for', 'i', 'action', 'thinking']);

const ResearchVisual: React.FC<{ streamingText: string }> = ({ streamingText }) => {
    const keywords = useMemo(() => {
        const words = streamingText.toLowerCase().replace(/[^\w\s]/g, '').split(/\s+/);
        const uniqueWords = [...new Set(words)];
        return uniqueWords.filter(word => word.length > 3 && !commonWords.has(word)).slice(-4);
    }, [streamingText]);

    return (
        <div className="p-3 h-full flex flex-col">
            <style>{styles}</style>
            <div className="flex items-center gap-2 text-text-secondary mb-2 text-xs flex-shrink-0">
                <ResearchIcon className="w-4 h-4" />
                <span className="font-semibold">Analyzing Data...</span>
            </div>
            <div className="w-full flex-1 flex items-center justify-center bg-background overflow-hidden border border-border rounded-md">
                <svg viewBox="0 0 100 60">
                    <g fill="var(--primary-color)" stroke="var(--primary-color)" strokeWidth="0.5">
                        {/* Links */}
                        <line x1="20" y1="30" x2="50" y2="15" className="link link-1" />
                        <line x1="20" y1="30" x2="50" y2="45" className="link link-2" />
                        <line x1="50" y1="15" x2="80" y2="30" className="link link-3" />
                        <line x1="50" y1="45" x2="80" y2="30" className="link link-4" />
                        <line x1="50" y1="15" x2="50" y2="45" className="link link-1" />
                        
                        {/* Nodes */}
                        <circle cx="20" cy="30" r="3" className="node node-1" />
                        <circle cx="50" cy="15" r="3" className="node node-2" />
                        <circle cx="50" cy="45" r="3" className="node node-3" />
                        <circle cx="80" cy="30" r="3" className="node node-4" />
                    </g>
                     <g>
                        {keywords[0] && <text x="22" y="25" className="keyword-text keyword-1">{keywords[0]}</text>}
                        {keywords[1] && <text x="52" y="10" className="keyword-text keyword-2">{keywords[1]}</text>}
                        {keywords[2] && <text x="52" y="50" className="keyword-text keyword-3">{keywords[2]}</text>}
                        {keywords[3] && <text x="82" y="25" className="keyword-text keyword-4">{keywords[3]}</text>}
                    </g>
                </svg>
            </div>
        </div>
    );
};

export default ResearchVisual;