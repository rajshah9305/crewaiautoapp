import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeBlockProps {
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ code }) => {
    const [isCopied, setIsCopied] = useState(false);

    /**
     * Copies the code content to the user's clipboard and provides visual feedback.
     */
    const handleCopy = () => {
        if (!code) return;
        navigator.clipboard.writeText(code.trim());
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500); // Reset after 2.5 seconds
    };

    return (
        <div className="relative my-2 group">
            <pre className="bg-background p-3 pr-12 rounded-md border border-border text-sm whitespace-pre-wrap break-words font-mono">
                <code className="text-text-primary">{code.trim()}</code>
            </pre>
            <button
                onClick={handleCopy}
                className="absolute top-2 right-2 p-1.5 rounded-md text-secondary bg-surface border border-border opacity-0 group-hover:opacity-100 focus:opacity-100 transition-opacity"
                aria-label={isCopied ? 'Copied to clipboard' : 'Copy code'}
            >
                {isCopied ? (
                    <CheckIcon className="h-4 w-4 text-success" />
                ) : (
                    <CopyIcon className="h-4 w-4" />
                )}
            </button>
        </div>
    );
};

export default CodeBlock;