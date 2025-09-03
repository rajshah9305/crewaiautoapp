import React from 'react';
import { Task, LogEntry } from '../types';
import CodeVisual from './visuals/CodeVisual';
import ResearchVisual from './visuals/ResearchVisual';
import WritingVisual from './visuals/WritingVisual';
import SparklesIcon from './icons/SparklesIcon';
import { AGENT_AVATARS } from './agent-config';
import DotIcon from './icons/DotIcon';
import Loader from './Loader';

// A map to get the correct visual component for an agent.
const AGENT_VISUALS: { [key: string]: React.FC<any> } = {
  'Research Agent': ResearchVisual,
  'Content Strategist': () => <WritingVisual text="Plotting Strategy..." />,
  'Technical Writer': () => <WritingVisual text="Transcribing Data..." />,
  'Code Generator': CodeVisual,
  'Reviewer Agent': () => <WritingVisual text="Verifying Output..." />,
};

const AgentCard: React.FC<{ task: Task; streamingLog: LogEntry | undefined }> = ({ task, streamingLog }) => {
    const AgentVisual = AGENT_VISUALS[task.agent] || null;
    const AgentIcon = AGENT_AVATARS[task.agent] || DotIcon;

    return (
        <div className="bg-surface border border-border rounded-xl shadow-md overflow-hidden animate-fadeInUp">
            <div className="p-4 border-b border-border bg-background/50">
                <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center border border-border">
                        <AgentIcon className="h-5 w-5 text-secondary" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-text-primary">{task.agent}</h3>
                        <p className="text-sm text-text-secondary truncate" title={task.title}>Executing: {task.title}</p>
                    </div>
                </div>
            </div>
            <div className="grid md:grid-cols-2">
                <div className="p-4 bg-background border-b md:border-b-0 md:border-r border-border">
                    {AgentVisual ? <AgentVisual /> : (
                        <div className="flex items-center justify-center h-full gap-3 p-3">
                            <SparklesIcon className="h-6 w-6 text-secondary"/>
                            <span className="text-sm font-medium text-secondary">Processing...</span>
                        </div>
                    )}
                </div>
                <div className="p-4 text-sm font-mono text-text-secondary bg-surface min-h-[160px] relative">
                    <p className="font-sans font-semibold text-xs text-text-secondary uppercase tracking-wider mb-2">Live Log Stream</p>
                    <pre className="whitespace-pre-wrap break-words h-full text-text-secondary/90">
                        {streamingLog?.content || <span className="text-text-secondary/60">Awaiting agent output...</span>}
                        <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
                    </pre>
                </div>
            </div>
        </div>
    );
};


interface ActivityMonitorProps {
    tasks: Task[];
    logEntries: LogEntry[];
}

const ActivityMonitor: React.FC<ActivityMonitorProps> = ({ tasks, logEntries }) => {
    const activeTasks = tasks.filter(t => t.status === 'in-progress');
    
    const findStreamingLogForAgent = (agent: string): LogEntry | undefined => {
        return logEntries.slice().reverse().find(log => log.agent === agent && log.isStreaming);
    };

    if (activeTasks.length === 0) {
        return (
             <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fadeInUp text-text-secondary">
                <div className="p-4 bg-surface rounded-full border border-border mb-4">
                    <Loader />
                </div>
                <h2 className="text-lg font-semibold text-text-primary">Executing Mission</h2>
                <p>Standing by for next available task...</p>
            </div>
        )
    }

    return (
        <div className="h-full w-full overflow-y-auto">
            <div className="w-full max-w-4xl mx-auto space-y-6 p-4 animate-fadeInUp">
                 <h2 className="text-2xl font-bold text-text-primary text-center">
                    Live Crew Activity
                </h2>
                {activeTasks.map(task => (
                    <AgentCard key={task.id} task={task} streamingLog={findStreamingLogForAgent(task.agent)} />
                ))}
            </div>
        </div>
    );
};

export default ActivityMonitor;