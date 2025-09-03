import React, { useEffect, useRef } from 'react';
import { LogEntry, AppState } from '../types';
import { marked } from 'marked';
import { AGENT_AVATARS } from './agent-config';
import AgentActivityVisual from './visuals/AgentActivityVisual';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import CogIcon from './icons/CogIcon';
import CrewAILogo from './icons/CrewAILogo';
import ControlPanel from './ControlPanel';

interface ChatInterfaceProps {
    logEntries: LogEntry[];
    onSendMessage: (message: string) => void;
    onLoadPlan: () => void;
    hasSavedPlan: boolean;
    isLoading: boolean;
    appState: AppState;
    inputValue: string;
    onInputChange: (value: string) => void;
}

// Configure marked for customized rendering
marked.use({
  renderer: {
    code(token) {
      return `<pre class="bg-background/50 p-3 my-2 rounded-md border border-border/50 text-sm whitespace-pre-wrap break-words"><code class="language-${token.lang}">${token.text}</code></pre>`;
    },
    heading(token) {
        return `<h${token.depth} class="text-text-primary font-bold mt-4 mb-2 pb-1 border-b border-border/50">${token.text}</h${token.depth}>`;
    },
    strong(text) {
        return `<strong class="text-primary font-semibold">${text}</strong>`;
    },
    // FIX: The 'list' renderer for 'marked' receives a single token object,
    // not separate 'body' and 'ordered' arguments.
    list(token) {
        const tag = token.ordered ? 'ol' : 'ul';
        const className = token.ordered ? 'list-decimal' : 'list-disc';
        return `<${tag} class="${className} pl-6 space-y-1">${token.body}</${tag}>`;
    }
  }
});


const ChatMessage: React.FC<{ entry: LogEntry }> = ({ entry }) => {
    const AgentIcon = AGENT_AVATARS[entry.agent] || CogIcon;
    const isUser = entry.type === 'user';

    const parseContent = (content: string) => {
        if (isUser) {
            // For user messages, just wrap in a p tag and handle newlines.
            return `<p>${content.replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g, '<br>')}</p>`;
        }
        return marked.parse(content, { gfm: true, breaks: true }) as string;
    };

    return (
        <div className={`flex items-start gap-4 animate-fadeIn py-4 ${isUser ? 'flex-row-reverse' : ''}`} style={{ animationDuration: '0.3s' }}>
            <div className={`w-8 h-8 flex-shrink-0 bg-surface-light rounded-full flex items-center justify-center border border-border/50 mt-1 shadow-sm ${isUser ? 'bg-primary/20 border-primary/50' : ''}`}>
                <AgentIcon className={`h-5 w-5 ${isUser ? 'text-primary' : 'text-text-secondary'}`} />
            </div>
            <div className={`flex-1 min-w-0 rounded-lg p-3 border border-transparent transition-colors hover:border-border/30 ${isUser ? 'bg-primary/10' : 'bg-surface/80'}`}>
                <div className={`flex items-center flex-wrap gap-x-3 gap-y-1 ${isUser ? 'flex-row-reverse' : ''}`}>
                    <span className="font-semibold text-text-primary">{entry.agent}</span>
                    <span className="text-text-secondary text-xs">{`[${entry.timestamp}]`}</span>
                </div>
                <div className="mt-2 text-text-primary/90 leading-relaxed prose prose-sm md:prose-base prose-invert max-w-none">
                    {entry.isStreaming && <AgentActivityVisual agent={entry.agent} />}
                    <div dangerouslySetInnerHTML={{ __html: parseContent(entry.content) }} />
                </div>
            </div>
        </div>
    );
};

const ChatInterface: React.FC<ChatInterfaceProps> = ({ logEntries, onSendMessage, onLoadPlan, hasSavedPlan, isLoading, appState, inputValue, onInputChange }) => {
    const endOfLogsRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        endOfLogsRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logEntries]);

    const handleSend = () => {
        if (inputValue.trim() && !isLoading && appState === 'IDLE') {
            onSendMessage(inputValue);
        }
    };
    
    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
          e.preventDefault();
          handleSend();
        }
    };

    const handleSelectTemplate = (prompt: string) => {
        onInputChange(prompt);
        // Focus the textarea after a template is selected.
        document.getElementById('mission-goal-input')?.focus();
    }
    
    const isIdle = appState === 'IDLE';

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto">
            <div className="flex-1 overflow-y-auto pr-2 -mr-2">
                {logEntries.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                        <CrewAILogo className="h-16 w-16 text-primary" style={{ filter: 'drop-shadow(0 0 15px var(--primary-color))'}} />
                        <h1 className="text-5xl font-black font-sans tracking-wider text-text-primary uppercase mt-4" style={{ textShadow: '0 0 15px var(--glow-color-primary), 0 0 5px var(--glow-color-primary)'}}>
                            CrewAI
                        </h1>
                        <p className="text-lg text-secondary tracking-[0.2em] font-mono mt-2" style={{ textShadow: '0 0 8px var(--glow-color-secondary)'}}>MISSION CONTROL</p>
                        <p className="mt-6 text-text-secondary">State your mission directive below, or press <kbd className="font-sans bg-surface-light border border-border/50 rounded px-1.5 py-0.5 text-xs">Ctrl+K</kbd> for commands.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-border/20 px-2">
                        {logEntries.map((entry) => <ChatMessage key={entry.id} entry={entry} />)}
                    </div>
                )}
                 <div ref={endOfLogsRef} />
            </div>
            <div className="mt-auto pt-4 bg-background/80 backdrop-blur-md">
                {isIdle && (
                    <ControlPanel 
                        onSelectTemplate={handleSelectTemplate}
                        onLoadPlan={onLoadPlan}
                        hasSavedPlan={hasSavedPlan}
                        isLoading={isLoading}
                    />
                )}
                <div className="relative mt-4">
                    <textarea
                        id="mission-goal-input"
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isIdle ? "e.g., Plot a course to the Andromeda galaxy..." : "Mission in progress... awaiting agent response."}
                        className="w-full bg-surface/90 backdrop-blur-sm border border-border rounded-lg p-4 pr-16 resize-none focus:outline-none focus:ring-2 focus:ring-primary placeholder-text-secondary/60 font-mono text-base"
                        rows={2}
                        disabled={!isIdle || isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!isIdle || isLoading || !inputValue.trim()}
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-primary text-background disabled:opacity-50 disabled:cursor-not-allowed hover:scale-110 transition-transform active:scale-95"
                        aria-label="Send message"
                    >
                        <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatInterface;