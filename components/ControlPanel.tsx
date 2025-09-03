import React from 'react';
import StellarCartographyIcon from './icons/StellarCartographyIcon';
import CaptainsLogIcon from './icons/CaptainsLogIcon';
import NavComputerIcon from './icons/NavComputerIcon';
import SaveIcon from './icons/SaveIcon';

interface ControlPanelProps {
  onSelectTemplate: (prompt: string) => void;
  onLoadPlan: () => void;
  hasSavedPlan: boolean;
  isLoading: boolean;
}

const templates = [
    { title: "Stellar Cartography", prompt: "Conduct a comprehensive analysis of the Kepler-186 system, identifying key planetary characteristics, potential for habitability, and routes for exploration.", icon: <StellarCartographyIcon /> },
    { title: "Captain's Log", prompt: "Write a 1000-word Captain's Log entry detailing the discovery of a new sentient species on planet LV-426, focusing on first contact protocols and cultural observations.", icon: <CaptainsLogIcon /> },
    { title: "Nav-Computer Module", prompt: "Generate a responsive React component for a starship's navigation console, displaying orbital trajectories and warp jump calculations. Use a futuristic UI design.", icon: <NavComputerIcon /> },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ onSelectTemplate, onLoadPlan, hasSavedPlan, isLoading }) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-3 p-4 bg-surface/50 rounded-lg border border-border/30">
        <span className="text-text-secondary font-mono tracking-widest text-sm uppercase">&gt; Mission Profiles:</span>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            {templates.map(template => (
                <button
                    key={template.title}
                    onClick={() => onSelectTemplate(template.prompt)}
                    disabled={isLoading}
                    className="group bg-surface/70 backdrop-blur-md border border-border/50 p-3 rounded-lg text-text-primary hover:border-accent hover:bg-surface-light transition-all duration-300 disabled:opacity-50 flex items-center gap-3 w-full text-left shadow-md"
                >
                    {React.cloneElement(template.icon, { className: `h-8 w-8 text-secondary group-hover:text-accent transition-colors duration-300 flex-shrink-0` })}
                    <div className="flex flex-col">
                        <span className="font-semibold font-sans">{template.title}</span>
                        <span className="text-xs text-text-secondary">Load Profile</span>
                    </div>
                </button>
            ))}
        </div>
        {hasSavedPlan && (
            <button
                onClick={onLoadPlan}
                disabled={isLoading}
                className="group mt-2 w-full bg-surface/70 backdrop-blur-md border border-dashed border-accent/80 p-3 rounded-lg text-accent hover:border-accent hover:bg-accent/10 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-3"
            >
                <SaveIcon className="h-5 w-5"/>
                <span className="font-semibold font-sans uppercase">Load Last Mission Plan from Archives</span>
            </button>
        )}
    </div>
  );
};

export default ControlPanel;