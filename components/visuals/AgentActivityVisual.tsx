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
        return <WritingVisual text="Plotting Strategy..." />;
      case 'Technical Writer':
        return <WritingVisual text="Transcribing Data..." />;
      case 'Code Generator':
        return <CodeVisual />;
      case 'Reviewer Agent':
        return <WritingVisual text="Verifying Output..." />;
      default:
        return (
           <div className="flex items-center gap-3 p-3">
             <SparklesIcon className="h-5 w-5 text-secondary"/>
             <span className="text-sm font-medium text-secondary">Executing...</span>
           </div>
        );
    }
  };

  return (
    <div className="bg-surface rounded-lg mb-2 overflow-hidden border border-border">
      {getVisualForAgent()}
    </div>
  );
};

export default AgentActivityVisual;