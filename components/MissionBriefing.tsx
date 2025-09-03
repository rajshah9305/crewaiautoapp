import React from 'react';
import { AppState } from '../types';
import CrewAILogo from './icons/CrewAILogo';
import ControlPanel from './ControlPanel';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import PlanningVisual from './PlanningVisual';

interface MissionBriefingProps {
    onSendMessage: (message: string) => void;
    onLoadPlan: () => void;
    hasSavedPlan: boolean;
    isLoading: boolean;
    appState: AppState;
    inputValue: string;
    onInputChange: (value: string) => void;
}

const MissionBriefing: React.FC<MissionBriefingProps> = ({ 
    onSendMessage, onLoadPlan, hasSavedPlan, isLoading, appState, inputValue, onInputChange 
}) => {
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

    if (appState === 'PLANNING') {
        return (
            <div className="flex flex-col h-full w-full max-w-5xl mx-auto justify-center">
                <PlanningVisual />
            </div>
        );
    }
    
    const isIdle = appState === 'IDLE' || appState === 'AWAITING_APPROVAL';

    return (
        <div className="flex flex-col h-full w-full max-w-5xl mx-auto justify-center">
            <div className="flex flex-col items-center justify-center text-center p-4 animate-fadeInUp">
                <CrewAILogo className="h-24 w-24 text-primary opacity-80" />
                <h1 className="text-4xl font-bold text-text-primary mt-6 tracking-tight">
                    Define Your Mission
                </h1>
                <p className="mt-3 text-text-secondary max-w-md">
                  State your objective below. Select a template or press <kbd className="font-sans bg-surface border border-border rounded px-1.5 py-0.5 text-xs shadow-sm">⌘K</kbd> for more options.
                </p>
            </div>
            <div className="mt-8">
                {isIdle && (
                    <ControlPanel 
                        onSelectTemplate={(prompt) => onInputChange(prompt)}
                        onLoadPlan={onLoadPlan}
                        hasSavedPlan={hasSavedPlan}
                        isLoading={isLoading}
                    />
                )}
                <div className="relative mt-2 group">
                    <textarea
                        id="mission-goal-input"
                        value={inputValue}
                        onChange={(e) => onInputChange(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={isIdle ? "Example: 'Create a marketing campaign for a new space-themed video game...'" : "Mission in progress..."}
                        className="w-full bg-surface border-2 border-border rounded-xl p-4 pr-20 resize-none focus:outline-none focus:ring-0 focus:border-border placeholder-text-secondary/80 text-base transition-all duration-200 shadow-md group-focus-within:border-primary/50 group-focus-within:shadow-lg group-focus-within:shadow-primary/20"
                        rows={3}
                        disabled={!isIdle || isLoading}
                    />
                    <button 
                        onClick={handleSend}
                        disabled={!isIdle || isLoading || !inputValue.trim()}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 p-3 rounded-lg bg-cta text-black disabled:opacity-50 disabled:cursor-not-allowed hover:bg-amber-500 transition-all active:scale-90 shadow-lg disabled:shadow-none hover:shadow-primary/40"
                        aria-label="Deploy Crew"
                    >
                        <PaperAirplaneIcon className="h-6 w-6" />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MissionBriefing;