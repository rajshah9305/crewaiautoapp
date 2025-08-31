import React from 'react';
import TypingAnimation from './TypingAnimation';
import CodeIcon from '../icons/CodeIcon';

const CodeVisual: React.FC = () => {
  return (
    <div className="p-4 font-mono text-sm bg-background/50 rounded-lg">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-border">
        <div className="flex items-center gap-2 text-text-secondary">
          <CodeIcon className="w-5 h-5 text-secondary" />
          <span>Generating Code...</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full bg-red-500"></span>
          <span className="w-3 h-3 rounded-full bg-yellow-500"></span>
          <span className="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
      </div>
      <div className="text-left">
        <p>
          <span className="text-purple-400">import</span>{" "}
          <span className="text-text-primary">React</span>{" "}
          <span className="text-purple-400">from</span>{" "}
          <span className="text-green-400">'react'</span>;
        </p>
        <p className="mt-2">
          <span className="text-blue-400">const</span>{" "}
          <span className="text-yellow-300">NewComponent</span> = () =&gt; {"{"}
        </p>
        <p className="pl-4">
          <span className="text-purple-400">return</span> (
        </p>
        <p className="pl-8">
          <span className="text-gray-500">&lt;</span>
          <span className="text-red-400">div</span>
          <span className="text-gray-500">&gt;</span>
          <TypingAnimation />
        </p>
        <p className="pl-4">)
        </p>
        <p>{"}"};</p>
      </div>
    </div>
  );
};

export default CodeVisual;
