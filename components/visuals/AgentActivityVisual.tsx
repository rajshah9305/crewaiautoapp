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
        return <WritingVisual text="Strategizing content..." />;
      case 'Technical Writer':
        return <WritingVisual text="Drafting content..." />;
      case 'Code Generator':
        return <CodeVisual />;
      case 'Reviewer Agent':
        return <WritingVisual text="Reviewing output..." />;
      default:
        return (
           <div className="flex items-center gap-3 p-3">
             <SparklesIcon className="h-5 w-5 text-secondary animate-pulse" />
             <span className="text-sm font-semibold text-secondary">Processing...</span>
           </div>
        );
    }
  };

  return (
    <div className="bg-surface-light/50 border border-border rounded-lg mb-4 animate-fadeIn overflow-hidden">
      {getVisualForAgent()}
    </div>
  );
};

export default AgentActivityVisual;