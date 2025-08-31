import React from 'react';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import ResearchIcon from './icons/ResearchIcon';
import WriteIcon from './icons/WriteIcon';
import CodeIcon from './icons/CodeIcon';
import Loader from './Loader';

interface GoalInputProps {
  goal: string;
  setGoal: (goal: string) => void;
  onDeploy: () => void;
  isLoading: boolean;
}

const templates = [
    { title: "Market Research", prompt: "Conduct a comprehensive market analysis for a new vegan protein powder, identifying key competitors, target demographics, and potential marketing channels.", icon: <ResearchIcon className="h-6 w-6 text-secondary" /> },
    { title: "Blog Post", prompt: "Write a 1000-word SEO-optimized blog post about the benefits of remote work for small businesses, including actionable tips and expert quotes.", icon: <WriteIcon className="h-6 w-6 text-secondary" /> },
    { title: "Code a Component", prompt: "Generate a responsive React component for a pricing page with three tiers, using Tailwind CSS for styling. Include a toggle for monthly/annual pricing.", icon: <CodeIcon className="h-6 w-6 text-secondary" /> },
];

const GoalInput: React.FC<GoalInputProps> = ({ goal, setGoal, onDeploy, isLoading }) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading) {
        onDeploy();
      }
    }
  };
  
  return (
    <div 
        className="w-full max-w-4xl mx-auto animate-fadeIn transition-all duration-500"
        style={{ animationDelay: '100ms' }}
    >
      <div className="bg-surface border border-border rounded-xl p-4 shadow-2xl backdrop-blur-lg">
        <div className="relative">
          <textarea
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g., Develop a marketing strategy for a new SaaS product..."
            className="w-full bg-background border border-border rounded-lg p-4 pr-40 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary/80 placeholder-text-secondary font-sans transition-all duration-300"
            rows={3}
            disabled={isLoading}
          />
          <button
            onClick={onDeploy}
            disabled={isLoading || !goal.trim()}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-gradient-to-br from-primary to-secondary text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 w-32 h-14 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-primary/50 active:animate-buttonPress"
          >
            {isLoading ? <Loader /> : (
                <>
                    <PaperAirplaneIcon className="h-5 w-5" />
                    <span className="font-semibold">Deploy</span>
                </>
            )}
          </button>
        </div>
      </div>
       <div className="flex flex-col items-center justify-center gap-4 mt-8 animate-fadeIn" style={{ animationDelay: '200ms' }}>
            <span className="text-text-secondary font-medium">Or start with a template</span>
            <div className="flex items-center gap-4 mt-2">
                {templates.map(template => (
                    <button
                        key={template.title}
                        onClick={() => setGoal(template.prompt)}
                        disabled={isLoading}
                        className="group relative bg-surface border border-border p-4 rounded-lg text-sm text-text-primary hover:border-primary/80 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex flex-col items-center gap-2 w-40 h-32 justify-center overflow-hidden active:animate-buttonPress hover:scale-105"
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-secondary/20 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
                        <div className="relative z-10 flex flex-col items-center gap-2">
                           {template.icon}
                           <span className="font-semibold text-center mt-2">{template.title}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};

export default GoalInput;