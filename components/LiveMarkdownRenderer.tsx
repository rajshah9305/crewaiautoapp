import React from 'react';

const LiveCodeBlock: React.FC<{ code: string, language: string }> = ({ code, language }) => (
    <div className="my-2 rounded-md border border-border bg-background/50 text-xs">
        <div className="px-2 py-0.5 bg-surface text-text-secondary rounded-t-md">{language || 'code'}</div>
        <pre className="p-2 whitespace-pre-wrap break-words font-mono text-text-primary">{code}</pre>
    </div>
);

const LiveMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split by code blocks, keeping the delimiters
    const parts = content.split(/(```(?:[\w-]*\n)?[\s\S]*?```)/g);

    return (
        <div className="text-sm leading-relaxed">
            {parts.map((part, index) => {
                if (!part) return null;
                
                if (part.startsWith('```')) {
                     const code = part.replace(/```(?:[\w-]*\n)?/, '').replace(/```\s*$/, '');
                     const langMatch = part.match(/```([\w-]*)/);
                     const language = langMatch ? langMatch[1] : '';
                    return <LiveCodeBlock key={index} code={code} language={language} />;
                } else {
                    const html = part
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
                        .replace(/^\* (.*$)/gm, '<li class="ml-4 list-disc">$1</li>') // Basic list item
                        .replace(/(\n)/g, '<br />');
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                }
            })}
        </div>
    );
};

export default LiveMarkdownRenderer;