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
    { title: "Market Analysis", prompt: "Conduct a comprehensive analysis of the electric vehicle market, identifying key players, market trends, and future growth opportunities.", icon: <StellarCartographyIcon /> },
    { title: "Blog Post", prompt: "Write a 1000-word blog post about the benefits of remote work, focusing on productivity, work-life balance, and talent acquisition.", icon: <CaptainsLogIcon /> },
    { title: "React Component", prompt: "Generate a responsive React component for a multi-step form with validation, using Tailwind CSS for styling.", icon: <NavComputerIcon /> },
];

const ControlPanel: React.FC<ControlPanelProps> = ({ onSelectTemplate, onLoadPlan, hasSavedPlan, isLoading }) => {
  return (
    <div className="w-full flex flex-col items-start justify-center gap-3 mb-2 animate-fadeInUp">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full">
            {templates.map(template => (
                <button
                    key={template.title}
                    onClick={() => onSelectTemplate(template.prompt)}
                    disabled={isLoading}
                    className="group bg-surface border border-border p-4 rounded-lg text-text-primary hover:border-accent hover:bg-background hover:shadow-md transition-all duration-200 disabled:opacity-50 flex items-center gap-4 w-full text-left"
                >
                    <div className="flex-shrink-0 bg-background p-2 rounded-md border border-border shadow-sm">
                        {React.cloneElement(template.icon, { className: `h-6 w-6 text-secondary group-hover:text-accent transition-colors duration-200` })}
                    </div>
                    <div className="flex flex-col">
                        <span className="font-semibold">{template.title}</span>
                        <span className="text-xs text-text-secondary">Select Template</span>
                    </div>
                </button>
            ))}
        </div>
        {hasSavedPlan && (
            <button
                onClick={onLoadPlan}
                disabled={isLoading}
                className="group mt-2 w-full bg-primary-light/10 border border-dashed border-primary/50 p-3 rounded-lg text-primary hover:border-primary hover:bg-primary-light/20 transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-3"
            >
                <SaveIcon className="h-5 w-5"/>
                <span className="font-semibold">Load Saved Mission Plan</span>
            </button>
        )}
    </div>
  );
};

export default ControlPanel;