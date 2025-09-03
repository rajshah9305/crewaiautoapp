import React, { useState } from 'react';
import CopyIcon from './icons/CopyIcon';
import CheckIcon from './icons/CheckIcon';

interface CodeBlockProps {
    language?: string;
    code: string;
}

const CodeBlock: React.FC<CodeBlockProps> = ({ language, code }) => {
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
        <div className="my-4 rounded-lg border border-border bg-background shadow-md overflow-hidden">
            <div className="flex justify-between items-center px-4 py-2 bg-surface text-xs border-b border-border">
                <span className="font-sans font-semibold text-text-secondary uppercase tracking-wider">{language || 'CODE'}</span>
                <button
                    onClick={handleCopy}
                    className="flex items-center gap-1.5 text-secondary hover:text-text-primary transition-colors text-xs font-semibold"
                    aria-label={isCopied ? 'Copied to clipboard' : 'Copy code'}
                >
                    {isCopied ? (
                         <>
                            <CheckIcon className="h-4 w-4 text-success" />
                            <span className="text-success">Copied!</span>
                         </>
                    ) : (
                        <>
                            <CopyIcon className="h-4 w-4" />
                            <span>Copy</span>
                        </>
                    )}
                </button>
            </div>
            <div className="p-4 text-sm overflow-x-auto">
                <pre className="whitespace-pre-wrap break-words font-mono">
                    <code className="text-text-primary">{code.trim()}</code>
                </pre>
            </div>
        </div>
    );
};

export default CodeBlock;