import React from 'react';
import { marked } from 'marked';
import CheckCircleIcon from './icons/CheckCircleIcon';
import CopyIcon from './icons/CopyIcon';
import DownloadIcon from './icons/DownloadIcon';

interface FinalOutputProps {
  output: string | null;
}

const FinalOutput: React.FC<FinalOutputProps> = ({ output }) => {
  if (!output) {
    return (
      <div className="bg-surface border border-border rounded-xl p-4 w-full h-full flex flex-col items-center justify-center backdrop-blur-lg">
          <CheckCircleIcon className="h-12 w-12 text-text-secondary/50 mb-4" />
          <p className="text-text-secondary">Final Output will appear here...</p>
      </div>
    );
  }

  const parseOutput = () => {
     const rawHtml = marked.parse(output, { gfm: true, breaks: true });
     return { __html: rawHtml as string };
  };

  const handleCopy = () => {
      navigator.clipboard.writeText(output).catch(err => console.error('Failed to copy text: ', err));
  };
  
  const handleDownload = () => {
      const blob = new Blob([output], { type: 'text/markdown;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'crewai-output.md';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
  };

  return (
    <div className="bg-surface/80 border border-border rounded-xl p-4 w-full flex flex-col animate-fadeIn backdrop-blur-lg h-full">
       <div className="flex items-center justify-between mb-4 border-b border-border pb-3">
            <div className="flex items-center gap-3 text-text-primary">
                <CheckCircleIcon className="h-6 w-6 text-success" />
                <h2 className="text-xl font-bold">Final Output</h2>
            </div>
            <div className="flex items-center gap-2">
                <button onClick={handleCopy} className="p-2 rounded-md hover:bg-border transition-colors" aria-label="Copy to clipboard" data-tooltip="Copy to clipboard">
                    <CopyIcon className="h-5 w-5 text-text-secondary" />
                </button>
                <button onClick={handleDownload} className="p-2 rounded-md hover:bg-border transition-colors" aria-label="Download as Markdown" data-tooltip="Download as Markdown">
                    <DownloadIcon className="h-5 w-5 text-text-secondary" />
                </button>
            </div>
        </div>
       <div className="flex-1 overflow-y-auto prose prose-invert text-text-primary pr-4 -mr-4 max-w-none">
        <div dangerouslySetInnerHTML={parseOutput()} />
       </div>
    </div>
  );
};

export default FinalOutput;