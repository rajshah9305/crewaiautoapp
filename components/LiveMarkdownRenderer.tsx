import React from 'react';

const LiveCodeBlock: React.FC<{ code: string, language: string }> = ({ code, language }) => {
    const highlightedCode = code
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/(const|let|var|function|return|import|from|export|default|async|await|new|if|else|for|while|switch|case|break|continue)/g, '<span class="text-cta">$1</span>')
        .replace(/(\'|\"|\`)(.*?)(\'|\"|\`)/g, '<span class="text-primary">$1$2$3</span>') // Using primary for strings
        .replace(/(\(|\)|\{|\}|\[|\])/g, '<span class="text-text-secondary">$1</span>')
        .replace(/(\/\/.*|\/\*[\s\S]*?\*\/)/g, '<span class="text-text-secondary/70">$1</span>'); // Using secondary for comments

    return (
        <div className="my-2 rounded-md border border-border bg-background/50 text-xs">
            <div className="px-2 py-0.5 bg-surface text-text-secondary rounded-t-md">{language || 'code'}</div>
            <pre className="p-2 whitespace-pre-wrap break-words font-mono">
                <code dangerouslySetInnerHTML={{ __html: highlightedCode }} />
            </pre>
        </div>
    );
};


const LiveMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split content by the main delimiters, keeping them in the array
    const sections = content.split(/(\*\*Thinking:\*\*|\*\*Action:\*\*)/g);

    return (
        <div className="text-sm leading-relaxed">
            {sections.map((section, index) => {
                if (section === '**Thinking:**' || section === '**Action:**') {
                    return <strong key={index} className="font-semibold text-text-primary block mt-2 mb-1">{section.replace(/\*\*/g, '')}</strong>;
                }

                if (!section.trim()) return null;
                
                // Content part. Check the previous part to determine type.
                const prevSection = sections[index - 1];
                const isThought = prevSection === '**Thinking:**';

                // Process this section for code blocks
                const parts = section.split(/(```(?:[\w-]*\n)?[\s\S]*?```)/g);

                return (
                    <div key={index} className={isThought ? 'animate-pulse-text' : ''}>
                        {parts.map((part, partIndex) => {
                            if (part.startsWith('```')) {
                                const code = part.replace(/```(?:[\w-]*\n)?/, '').replace(/```\s*$/, '');
                                const langMatch = part.match(/```([\w-]*)/);
                                const language = langMatch ? langMatch[1] : '';
                                return <LiveCodeBlock key={partIndex} code={code} language={language} />;
                            } else {
                                // Simple markdown for the rest
                                const html = part
                                    .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>') // Basic list item
                                    .replace(/(\n)/g, '<br />');
                                return <span key={partIndex} dangerouslySetInnerHTML={{ __html: html }} />;
                            }
                        })}
                    </div>
                );
            })}
        </div>
    );
};

export default LiveMarkdownRenderer;