import React from 'react';
import { marked } from 'marked';
import { LogEntry } from '../types';
import CodeBlock from './CodeBlock';
import DownloadIcon from './icons/DownloadIcon';
import CaptainsLogIcon from './icons/CaptainsLogIcon';

interface FinalReportProps {
    report: LogEntry;
}

const renderer = new marked.Renderer();
// FIX: The function signatures for the marked renderer have been updated to be compatible with a newer token-based API.
// The original API passed discrete arguments (e.g., text, level), while the newer API passes a single token object.
// We use `function` to get the correct `this` context for `this.parser`.
renderer.heading = function(text, level) {
    const sizes = ['text-3xl', 'text-2xl', 'text-xl', 'text-lg', 'text-base', 'text-sm'];
    return `<h${level} class="${sizes[level-1]} text-text-primary font-semibold mt-6 mb-2 pb-1 border-b border-border">${text}</h${level}>`;
};
renderer.strong = function(text) {
    return `<strong class="font-semibold text-text-primary">${text}</strong>`;
};
renderer.list = function(body, ordered) {
    const tag = ordered ? 'ol' : 'ul';
    const className = ordered ? 'list-decimal' : 'list-disc';
    return `<${tag} class="${className} pl-6 space-y-2 my-4">${body}</${tag}>`;
};
renderer.paragraph = function(text) {
    return `<p class="text-text-secondary leading-relaxed my-4">${text}</p>`;
};
renderer.codespan = function(code) {
    return `<code class="bg-surface px-1.5 py-1 rounded-md text-primary font-mono text-sm">${code}</code>`;
};


marked.setOptions({ renderer });


const FinalReport: React.FC<FinalReportProps> = ({ report }) => {

    const handleDownload = () => {
        const blob = new Blob([report.content], { type: 'text/markdown;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = 'crewai-mission-report.md';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const renderContent = () => {
        const parts = report.content.split(/(```(?:[\w-]*)\n[\s\S]*?\n```)/g);
        return parts.map((part, index) => {
            const codeMatch = part.match(/```(?:[\w-]*)\n([\s\S]*?)\n```/);
            if (codeMatch && codeMatch[1]) {
                return <CodeBlock key={index} code={codeMatch[1]} />;
            } else if (part.trim()) {
                try {
                    const parsedHtml = marked.parse(part, { gfm: true, breaks: true }) as string;
                    return <div key={index} dangerouslySetInnerHTML={{ __html: parsedHtml }} />;
                } catch (e) {
                    return <div key={index}><pre className="whitespace-pre-wrap font-sans">{part}</pre></div>;
                }
            }
            return null;
        });
    };

    return (
        <div className="h-full w-full max-w-4xl mx-auto flex flex-col animate-fadeInUp">
            <div className="p-4 sm:p-6 mb-4">
                 <h2 className="text-2xl font-bold text-text-primary text-center flex items-center justify-center gap-3">
                    <CaptainsLogIcon className="h-7 w-7 text-secondary"/>
                    Mission Report
                </h2>
            </div>

            <div className="flex-1 overflow-y-auto bg-surface border border-border rounded-xl p-4 sm:p-6">
                <div className="prose prose-sm md:prose-base max-w-none">
                    {renderContent()}
                </div>
            </div>

            <div className="mt-4 flex justify-center">
                <button 
                    onClick={handleDownload} 
                    className="flex items-center gap-2 text-sm font-semibold text-primary bg-primary-light px-4 py-2 rounded-md hover:bg-amber-200/20 transition-colors border border-primary/20"
                >
                    <DownloadIcon className="h-5 w-5" />
                    Download Report
                </button>
            </div>
        </div>
    );
};

export default FinalReport;