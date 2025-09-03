import React from 'react';

const LiveCodeBlock: React.FC<{ code: string; language: string }> = ({ code, language }) => {
    return (
        <div className="relative my-2">
            <div className="text-xs text-secondary bg-background px-2 py-0.5 rounded-t-md border-b border-border">{language || 'code'}</div>
            <pre className="bg-background p-2 rounded-b-md border border-t-0 border-border text-sm whitespace-pre-wrap break-words font-mono">
                <code className="text-text-primary">{code}</code>
            </pre>
        </div>
    );
};


const LiveMarkdownRenderer: React.FC<{ content: string }> = ({ content }) => {
    // Split by code blocks, keeping the delimiters
    const parts = content.split(/(```(?:\w+\n)?[\s\S]*?```)/g);

    return (
        <div className="text-xs leading-relaxed">
            {parts.map((part, index) => {
                if (!part) return null;
                
                const codeMatch = part.match(/```(?:\w+\n)?([\s\S]*?)```/);

                if (codeMatch) {
                    const code = codeMatch[1] || '';
                    const langMatch = part.match(/```(\w+)/);
                    const language = langMatch ? langMatch[1] : '';
                    return <LiveCodeBlock key={index} code={code} language={language} />;
                } else {
                    const html = part
                        .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-text-primary">$1</strong>')
                        .replace(/\n/g, '<br />');
                    return <span key={index} dangerouslySetInnerHTML={{ __html: html }} />;
                }
            })}
        </div>
    );
};

export default LiveMarkdownRenderer;
