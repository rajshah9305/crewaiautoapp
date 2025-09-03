import React, { useState, useEffect, useRef } from 'react';
import CodeIcon from '../icons/CodeIcon';

const syntaxHighlight = (code: string) => {
    return code
        .replace(/(const|let|var|function|return|import|from|export|default|async|await|new)/g, '<span style="color:#f77829;">$1</span>')
        .replace(/(\'|\"|\`)(.*?)(\'|\"|\`)/g, '<span style="color:#a5d6ff;">$1$2$3</span>')
        .replace(/(\(|\)|\{|\}|\[|\])/g, '<span style="color:#8b949e;">$1</span>')
        .replace(/(\/\/.*)/g, '<span style="color:#6a737d;">$1</span>');
};

const CodeVisual: React.FC<{ liveCode: string }> = ({ liveCode }) => {
  const [displayedCode, setDisplayedCode] = useState('');
  const codeEndRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    // Basic typing animation effect
    let i = displayedCode.length;
    const typingSpeed = 20; // ms per character
    if (i < liveCode.length) {
      const timer = setTimeout(() => {
        setDisplayedCode(liveCode.substring(0, i + 1));
      }, Math.random() * typingSpeed);
      return () => clearTimeout(timer);
    }
  }, [liveCode, displayedCode]);

  useEffect(() => {
    codeEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [displayedCode]);

  return (
    <div className="p-3 h-full flex flex-col">
      <div className="flex items-center gap-2 text-text-secondary mb-2 text-xs flex-shrink-0">
        <CodeIcon className="w-4 h-4" />
        <span className="font-semibold">Code Generation In-Progress</span>
      </div>
      <div className="w-full flex-1 p-2 bg-background overflow-auto border border-border rounded-md font-mono text-xs relative">
        <pre className="whitespace-pre-wrap">
          <code dangerouslySetInnerHTML={{ __html: syntaxHighlight(displayedCode) }} />
          <span className="inline-block w-1.5 h-3.5 bg-primary ml-0.5 animate-blink" ref={codeEndRef}></span>
        </pre>
      </div>
    </div>
  );
};

export default CodeVisual;