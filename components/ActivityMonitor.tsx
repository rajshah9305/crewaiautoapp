import React, { useState, useEffect } from 'react';
import { Task, LogEntry } from '../types';
import CodeVisual from './visuals/CodeVisual';
import ResearchVisual from './visuals/ResearchVisual';
import WritingVisual from './visuals/WritingVisual';
import { AGENT_AVATARS } from './agent-config';
import DotIcon from './icons/DotIcon';
import CubeIcon from './icons/CubeIcon';
import LiveMarkdownRenderer from './LiveMarkdownRenderer';

// A map to get the correct visual component for an agent.
const AGENT_VISUALS: { [key: string]: React.FC<any> } = {
  'Data Archaeologist': ResearchVisual,
  'Narrative Architect': (props) => <WritingVisual {...props} title="Strategy Formulation..." />,
  'Protocol Scribe': (props) => <WritingVisual {...props} title="Report Composition..." />,
  'Synth-Code Engineer': CodeVisual,
  'Chief Verifier': (props) => <WritingVisual {...props} title="Final Review..." />,
};

const extractContentForVisual = (agent: string, streamingText: string): { [key: string]: any } => {
    if (agent === 'Synth-Code Engineer') {
        const codeBlocks = streamingText.match(/```(?:\w+\n)?([\s\S]*?)```/g) || [];
        const code = codeBlocks.map(block => block.replace(/```(?:\w+\n)?/, '').replace(/```/, '')).join('\n\n');
        return { liveCode: code };
    }
    if (['Protocol Scribe', 'Narrative Architect', 'Chief Verifier'].includes(agent)) {
        const cleanText = streamingText.replace(/\*\*(Thinking|Action)(?:\s\(.*?\))?:\*\*/g, '').trim();
        return { liveText: cleanText };
    }
    if (agent === 'Data Archaeologist') {
        return { streamingText };
    }
    return {};
}

const ResourceMeter: React.FC<{ label: string, value: number, color: string }> = ({ label, value, color }) => (
    <div className="flex-1">
        <div className="flex justify-between items-center mb-0.5">
            <span className="text-xs font-semibold" style={{ color }}>{label}</span>
            <span className="font-mono text-xs text-text-secondary">{value.toFixed(0)}%</span>
        </div>
        <div className="w-full bg-black/30 rounded-full h-1.5 overflow-hidden">
            <div 
                className="h-full rounded-full transition-all duration-300" 
                style={{ width: `${value}%`, backgroundColor: color }}
            />
        </div>
    </div>
);

const AgentCard: React.FC<{ task: Task; streamingLog: LogEntry | undefined }> = ({ task, streamingLog }) => {
    const AgentVisual = AGENT_VISUALS[task.agent] || null;
    const AgentIcon = AGENT_AVATARS[task.agent] || DotIcon;
    const streamingContent = streamingLog?.content || '';
    const visualProps = extractContentForVisual(task.agent, streamingContent);
    const [resources, setResources] = useState({ cpu: 10, cognition: 10, network: 10 });
    
    useEffect(() => {
        if (!streamingLog) return;
        
        const decay = (prev: number) => Math.max(10, prev * 0.95);
        
        const update = () => {
            const content = streamingLog?.content || '';
            let cpu = 10, cognition = 10, network = 10;
            
            if (/(compute|calculat|process|generat|code)/i.test(content)) cpu = Math.min(100, 40 + Math.random() * 60);
            if (/(analyz|think|strateg|reason|plan)/i.test(content)) cognition = Math.min(100, 40 + Math.random() * 60);
            if (/(network|fetch|search|request|web)/i.test(content)) network = Math.min(100, 40 + Math.random() * 60);

            setResources(prev => ({
                cpu: cpu > 10 ? cpu : decay(prev.cpu),
                cognition: cognition > 10 ? cognition : decay(prev.cognition),
                network: network > 10 ? network : decay(prev.network),
            }));
        };

        const interval = setInterval(update, 300);
        return () => clearInterval(interval);
    }, [streamingLog]);


    return (
        <div className="bg-surface/80 backdrop-blur-sm border border-border rounded-xl shadow-lg overflow-hidden animate-fadeInUp">
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
            
            <div className="flex flex-col lg:flex-row bg-background">
                <div className="lg:flex-[3] lg:min-w-0 border-b lg:border-b-0 lg:border-r border-border p-3">
                     {AgentVisual ? (
                        <div className="h-full min-h-[250px] bg-surface rounded-md border border-border overflow-hidden">
                           <AgentVisual {...visualProps} />
                        </div>
                    ) : <div className="h-full min-h-[250px] bg-surface rounded-md border border-border"/>}
                </div>
                <div className="lg:flex-[2] lg:min-w-0 text-sm font-mono text-text-secondary relative flex flex-col p-3">
                    <div className="relative flex-1 flex flex-col bg-black/40 rounded-md border border-border p-3 overflow-hidden min-h-[250px]">
                        <p className="font-sans font-semibold text-xs text-text-secondary uppercase tracking-wider mb-2 flex-shrink-0">Live Log Stream</p>
                        <div className="overflow-y-auto pr-2 flex-1 animate-crt-flicker">
                            <LiveMarkdownRenderer content={streamingContent} />
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/60 to-transparent pointer-events-none" />
                    </div>
                </div>
            </div>
            
            <div className="p-4 bg-background/50 border-t border-border flex items-center gap-4">
                <ResourceMeter label="CPU" value={resources.cpu} color="var(--cpu-color)" />
                <ResourceMeter label="Cognition" value={resources.cognition} color="var(--cognition-color)" />
                <ResourceMeter label="Network" value={resources.network} color="var(--network-color)" />
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
             <div className="flex flex-col items-center justify-center h-full text-center p-4 animate-fadeInUp text-text-secondary w-full max-w-lg mx-auto">
                <div className="relative w-48 h-48 flex items-center justify-center mb-6">
                    <svg className="absolute w-full h-full" viewBox="0 0 100 100">
                        <defs>
                            <linearGradient id="grad-orbit" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" style={{stopColor: 'var(--primary-color)', stopOpacity: 0}} />
                            <stop offset="100%" style={{stopColor: 'var(--primary-color)', stopOpacity: 1}} />
                            </linearGradient>
                        </defs>
                        <circle cx="50" cy="50" r="40" fill="none" stroke="var(--border-color)" strokeWidth="0.5" strokeDasharray="2 2" />
                        <circle cx="50" cy="50" r="40" fill="none" stroke="url(#grad-orbit)" strokeWidth="1.5" strokeDasharray="50 200" strokeLinecap="round">
                            <animateTransform
                                attributeName="transform"
                                type="rotate"
                                from="0 50 50"
                                to="360 50 50"
                                dur="10s"
                                repeatCount="indefinite"
                            />
                        </circle>
                    </svg>
                    <CubeIcon className="h-12 w-12 text-primary opacity-80 animate-pulse" style={{ animationDelay: '0.5s', animationDuration: '2s' }}/>
                </div>
                <h2 className="text-lg font-semibold text-text-primary">Standing By</h2>
                <p>Awaiting next available task in the execution queue.</p>
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