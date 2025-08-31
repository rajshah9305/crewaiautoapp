import React, { useEffect, useRef } from 'react';
import { LogEntry } from '../types';
import { marked } from 'marked';
import { AGENT_AVATARS } from './agent-config';
import AgentActivityVisual from './visuals/AgentActivityVisual';
import CogIcon from './icons/CogIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import ReviewIcon from './icons/ReviewIcon';

interface LogStreamProps {
  logEntries: LogEntry[];
}

const LogContentParser: React.FC<{ content: string }> = ({ content }) => {
    const parts = content.split(/\n?(?=\*\*(?:Thinking|Action|Observation):\*\*)/g).filter(p => p.trim());

    const getPartVisuals = (partTitle: string) => {
        switch (partTitle) {
            case 'Thinking':
                return { icon: <CogIcon className="h-5 w-5 text-purple-400" />, color: 'text-purple-400', borderColor: 'border-purple-400/50' };
            case 'Action':
                return { icon: <PaperAirplaneIcon className="h-5 w-5 text-primary" />, color: 'text-primary', borderColor: 'border-primary/50' };
            case 'Observation':
                return { icon: <ReviewIcon className="h-5 w-5 text-secondary" />, color: 'text-secondary', borderColor: 'border-secondary/50' };
            default:
                return { icon: null, color: 'text-text-primary', borderColor: 'border-transparent' };
        }
    };

    if (parts.length === 0 && content.trim()) {
        const contentHtml = marked.parse(content, { gfm: true, breaks: true }) as string;
        return <div className="prose prose-sm prose-invert max-w-none text-text-primary" dangerouslySetInnerHTML={{ __html: contentHtml }} />;
    }

    return (
        <div className="space-y-4">
            {parts.map((part, index) => {
                const titleMatch = part.match(/\*\*(Thinking|Action|Observation):\*\*/);
                const partTitle = titleMatch ? titleMatch[1] : '';
                const partContent = part.replace(/\*\*(?:Thinking|Action|Observation):\*\*/, '').trim();
                const contentHtml = marked.parse(partContent, { gfm: true, breaks: true }) as string;
                const { color, borderColor } = getPartVisuals(partTitle);

                if (!partTitle) {
                     return <div key={index} className="prose prose-sm prose-invert max-w-none text-text-primary" dangerouslySetInnerHTML={{ __html: marked.parse(part) as string }} />;
                }

                return (
                    <div key={index} className={`pl-4 border-l-4 ${borderColor}`}>
                        <strong className={`font-semibold ${color}`}>{partTitle}:</strong>
                        <div
                            className="prose prose-sm prose-invert text-text-primary leading-relaxed max-w-none"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                        />
                    </div>
                );
            })}
        </div>
    );
};


const LogStream: React.FC<LogStreamProps> = ({ logEntries }) => {
  const endOfLogsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logEntries]);

  return (
    <div className="bg-surface/80 border border-border rounded-xl p-4 flex-1 flex flex-col h-full animate-fadeIn backdrop-blur-lg">
      <div className="flex-1 overflow-y-auto pr-4 -mr-4 font-mono text-sm space-y-6">
        {logEntries.map((entry) => {
            const AgentIcon = AGENT_AVATARS[entry.agent] || CogIcon;
            return (
              <div key={entry.id} className="flex items-start gap-4 animate-fadeIn" style={{ animationDuration: '0.3s' }}>
                <div className="w-8 h-8 flex-shrink-0 bg-surface-light rounded-full flex items-center justify-center border border-border mt-1">
                    <AgentIcon className="h-5 w-5 text-text-secondary" />
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-text-primary">{entry.agent}</span>
                       <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                        entry.type === 'system' ? 'bg-gray-700 text-gray-300' : 
                        entry.type === 'error' ? 'bg-error/70 text-white' :
                        'bg-indigo-900/50 text-indigo-300'
                      }`}>
                        {entry.type}
                      </span>
                       <span className="text-text-secondary text-xs">{`[${entry.timestamp}]`}</span>
                    </div>
                    <div className="mt-2">
                        {entry.isStreaming && <AgentActivityVisual agent={entry.agent} />}
                        <LogContentParser content={entry.content} />
                    </div>
                </div>
              </div>
            )
        })}
        <div ref={endOfLogsRef} />
      </div>
    </div>
  );
};

export default LogStream;