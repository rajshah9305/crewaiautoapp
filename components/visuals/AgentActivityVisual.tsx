import React from 'react';
import CodeVisual from './CodeVisual';
import ResearchVisual from './ResearchVisual';
import WritingVisual from './WritingVisual';
import SparklesIcon from '../icons/SparklesIcon';

const AgentActivityVisual: React.FC<{ agent: string }> = ({ agent }) => {
  const getVisualForAgent = () => {
    switch (agent) {
      case 'Research Agent':
        return <ResearchVisual />;
      case 'Content Strategist':
        return <WritingVisual text="PLOTTING STRATEGY..." />;
      case 'Technical Writer':
        return <WritingVisual text="TRANSCRIBING DATA..." />;
      case 'Code Generator':
        return <CodeVisual />;
      case 'Reviewer Agent':
        return <WritingVisual text="VERIFYING OUTPUT..." />;
      default:
        return (
           <div className="flex items-center gap-3 p-3 font-mono">
             <SparklesIcon className="h-5 w-5 text-secondary animate-subtle-glow" style={{ filter: `drop-shadow(0 0 5px currentColor)` }}/>
             <span className="text-sm font-semibold text-secondary uppercase">Executing Directive...</span>
           </div>
        );
    }
  };

  return (
    <div className="bg-black/20 rounded-lg mb-4 overflow-hidden border border-border/30 shadow-inner">
      {getVisualForAgent()}
    </div>
  );
};

export default AgentActivityVisual;