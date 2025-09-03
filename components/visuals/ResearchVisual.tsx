import React from 'react';
import ResearchIcon from '../icons/ResearchIcon';

const styles = `
.planet-base {
  fill: url(#planet-gradient);
  filter: drop-shadow(0 0 15px var(--glow-color-secondary));
}
.ring {
  fill: none;
  stroke: var(--primary-color);
  stroke-width: 0.75;
  opacity: 0.7;
  transform-origin: center;
}
.scanner-arc {
  fill: var(--accent-color);
  opacity: 0.2;
  transform-origin: center;
  animation: sweep 4s ease-in-out infinite;
}
.data-blip {
  fill: var(--success-color);
  animation: blink 1.5s infinite;
}
@keyframes rotate {
  from { transform: rotate3d(0.5, 0.8, 0, 0deg); }
  to { transform: rotate3d(0.5, 0.8, 0, 360deg); }
}
@keyframes sweep {
  0% { transform: rotate(0deg) scaleY(0); }
  50% { transform: rotate(180deg) scaleY(1); }
  100% { transform: rotate(360deg) scaleY(0); }
}
@keyframes blink {
  0%, 100% { opacity: 0; }
  50% { opacity: 1; }
}
`

const ResearchVisual: React.FC = () => {
    return (
        <div className="p-3 font-mono">
            <style>{styles}</style>
            <div className="flex items-center gap-2 text-text-secondary mb-2 text-xs uppercase">
                <ResearchIcon className="w-4 h-4 text-secondary" />
                <span>Scanning Sector...</span>
            </div>
            <div className="w-full h-20 flex items-center justify-center bg-black/30 overflow-hidden border border-border/50 rounded-md">
                <svg viewBox="-50 -50 100 100">
                    <defs>
                        <radialGradient id="planet-gradient" cx="25%" cy="25%">
                            <stop offset="0%" stopColor="var(--secondary-color)" />
                            <stop offset="100%" stopColor="var(--surface-color)" />
                        </radialGradient>
                    </defs>
                    <g style={{ animation: 'rotate 20s linear infinite' }}>
                      <circle className="planet-base" cx="0" cy="0" r="30" />
                      {/* Rings */}
                      <ellipse className="ring" cx="0" cy="0" rx="40" ry="15" transform="rotate(20)" />
                      <ellipse className="ring" cx="0" cy="0" rx="35" ry="10" transform="rotate(-30)"/>
                      {/* Data Points */}
                      <circle className="data-blip" cx="-10" cy="-15" r="1.5" style={{ animationDelay: '0.5s' }}/>
                      <circle className="data-blip" cx="20" cy="10" r="1" style={{ animationDelay: '1s' }}/>
                      <circle className="data-blip" cx="5" cy="22" r="1.2" style={{ animationDelay: '1.5s' }}/>
                    </g>
                     <path className="scanner-arc" d="M 0 0 L 45 0 A 45 45 0 0 1 31.82 31.82 z" />
                </svg>
            </div>
        </div>
    );
};

export default ResearchVisual;