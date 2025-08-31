import React from 'react';
import ResearchIcon from '../icons/ResearchIcon';

const ResearchVisual: React.FC = () => {
    const nodes = Array.from({ length: 10 }, (_, i) => ({
        id: i,
        cx: `${10 + Math.random() * 80}%`,
        cy: `${10 + Math.random() * 80}%`,
        r: `${Math.random() * 4 + 2}`,
        delay: `${Math.random() * 2}s`,
    }));

    const lines = nodes.slice(1).map((node, i) => ({
        id: `l-${i}`,
        x1: nodes[i].cx,
        y1: nodes[i].cy,
        x2: node.cx,
        y2: node.cy,
        delay: `${Math.random() * 2}s`,
    }));

    return (
        <div className="p-3">
            <div className="flex items-center gap-2 text-text-secondary mb-2">
                <ResearchIcon className="w-5 h-5 text-secondary" />
                <span>Analyzing Information...</span>
            </div>
            <div className="relative w-full h-32">
                <svg width="100%" height="100%" className="overflow-visible">
                    <defs>
                        <style>
                            {`
                                .node { animation: nodePulse 2s ease-in-out infinite alternate; }
                                .line { stroke-dasharray: 200; stroke-dashoffset: 200; animation: drawLine 3s ease-out forwards; }
                                @keyframes nodePulse { 0% { r: 2; opacity: 0.5; } 100% { r: 5; opacity: 1; } }
                                @keyframes drawLine { to { stroke-dashoffset: 0; } }
                            `}
                        </style>
                    </defs>
                    {lines.map(l => (
                         <line
                            key={l.id} x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2}
                            stroke="rgba(0, 245, 212, 0.3)"
                            strokeWidth="1"
                            className="line"
                            style={{ animationDelay: l.delay }}
                        />
                    ))}
                    {nodes.map(n => (
                        <circle
                            key={n.id} cx={n.cx} cy={n.cy} r={n.r}
                            fill="rgba(240, 33, 181, 0.8)"
                            stroke="rgba(240, 33, 181, 1)"
                            strokeWidth="1"
                            className="node"
                            style={{ animationDelay: n.delay }}
                        />
                    ))}
                </svg>
            </div>
        </div>
    );
};

export default ResearchVisual;
