import React from 'react';
import CodeVisual from './CodeVisual';
import ResearchVisual from './ResearchVisual';
import WritingVisual from './WritingVisual';
import SparklesIcon from '../icons/SparklesIcon';

const AgentActivityVisual: React.FC<{ agent: string, liveText?: string, liveCode?: string, streamingText?: string }> = ({ agent, liveText, liveCode, streamingText }) => {
  const getVisualForAgent = () => {
    switch (agent) {
      case 'Research Agent':
        return <ResearchVisual streamingText={streamingText || ''} />;
      case 'Content Strategist':
        return <WritingVisual title="Plotting Strategy..." liveText={liveText || ''} />;
      case 'Technical Writer':
        return <WritingVisual title="Transcribing Data..." liveText={liveText || ''} />;
      case 'Code Generator':
        return <CodeVisual liveCode={liveCode || ''} />;
      case 'Reviewer Agent':
        return <WritingVisual title="Verifying Output..." liveText={liveText || ''} />;
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