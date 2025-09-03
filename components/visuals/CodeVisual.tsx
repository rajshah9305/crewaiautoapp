import React from 'react';
import CodeIcon from '../icons/CodeIcon';

const styles = `
.circuit-bg {
  fill: none;
  stroke: var(--border-color);
  stroke-width: 0.5;
  opacity: 0.3;
}
.conduit-path {
  fill: none;
  stroke: var(--secondary-color);
  stroke-width: 1;
  opacity: 0.5;
}
.energy-particle {
  fill: var(--accent-color);
  stroke: var(--text-primary-color);
  stroke-width: 0.5;
  filter: drop-shadow(0 0 5px var(--accent-color));
}
`;

const CodeVisual: React.FC = () => {
  const paths = [
    { d: "M 10 10 L 40 10 L 40 30 L 70 30", dur: "3s" },
    { d: "M 10 70 L 40 70 L 40 50 L 70 50", dur: "3.5s" },
    { d: "M 190 40 L 160 40 L 160 20 L 130 20", dur: "4s" },
    { d: "M 10 40 L 100 40 L 100 60 L 130 60", dur: "4.5s" },
    { d: "M 190 70 L 160 70 L 160, 50 L 130 50", dur: "5s" },
  ];

  return (
    <div className="p-3 font-mono">
      <style>{styles}</style>
      <div className="flex items-center gap-2 text-text-secondary mb-2 text-xs uppercase">
        <CodeIcon className="w-4 h-4 text-secondary" />
        <span>Compiling Logic Matrix...</span>
      </div>
      <div className="w-full h-20 flex items-center justify-center bg-black/30 overflow-hidden border border-border/50 rounded-md">
        <svg viewBox="0 0 200 80" width="200" height="80">
          <defs>
            <pattern id="circuit-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 10 L 10 10 L 10 0 M 10 20 L 10 10 L 20 10" className="circuit-bg" />
            </pattern>
          </defs>
          <rect width="200" height="80" fill="url(#circuit-pattern)" />
          
          {paths.map((p, i) => (
            <g key={i}>
              <path d={p.d} className="conduit-path" />
              <circle r="2" className="energy-particle">
                <animateMotion
                  dur={p.dur}
                  repeatCount="indefinite"
                  path={p.d}
                  begin={`${i * 0.5}s`}
                />
              </circle>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
};

export default CodeVisual;