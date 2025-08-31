import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import TimerIcon from './icons/TimerIcon';
import SparklesIcon from './icons/SparklesIcon';
import XIcon from './icons/XIcon';

interface AgentStatusProps {
  state: AppState;
  startTime: number | null;
  error?: string | null;
}

const AgentStatus: React.FC<AgentStatusProps> = ({ state, startTime, error }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00');

  useEffect(() => {
    if (!startTime) {
        setElapsedTime('00:00');
        return;
    }

    const interval = setInterval(() => {
        if (state === 'FINISHED' || state === 'ERROR') {
            clearInterval(interval);
            return;
        }
      const now = Date.now();
      const difference = now - startTime;
      const minutes = Math.floor(difference / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      setElapsedTime(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, state]);


  const getStatusInfo = () => {
    switch (state) {
      case 'IDLE': return null;
      case 'PLANNING': return { text: 'Planning...', color: 'text-yellow-400', glowColor: 'shadow-yellow-400/50' };
      case 'AWAITING_APPROVAL': return { text: 'Awaiting Approval', color: 'text-purple-400', glowColor: 'shadow-purple-400/50' };
      case 'EXECUTING': return { text: 'Executing...', color: 'text-primary', glowColor: 'shadow-primary/50' };
      case 'FINALIZING': return { text: 'Finalizing...', color: 'text-secondary', glowColor: 'shadow-secondary/50' };
      case 'FINISHED': return { text: 'Finished', color: 'text-success', glowColor: 'shadow-success/50' };
      case 'ERROR': return { text: 'Error', color: 'text-error', glowColor: 'shadow-error/50' };
      default: return { text: 'Standby', color: 'text-text-secondary', glowColor: 'shadow-gray-500/50' };
    }
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo) return null;

  const { text, color, glowColor } = statusInfo;
  
  const iconMap: { [key in AppState]?: React.ReactElement } = {
      PLANNING: <SparklesIcon className="animate-pulse"/>,
      AWAITING_APPROVAL: <SparklesIcon/>,
      EXECUTING: <SparklesIcon className="animate-pulse"/>,
      FINALIZING: <SparklesIcon className="animate-pulse"/>,
      FINISHED: <CheckCircleIcon />,
      ERROR: <XIcon />,
  }
  const icon = iconMap[state] || <SparklesIcon />;

  return (
    <div className={`bg-surface border border-border rounded-full p-2 px-4 flex items-center justify-center gap-6 backdrop-blur-lg shadow-lg ${glowColor} transition-all duration-500`}>
        <div className="flex items-center gap-2">
            <div className={`h-5 w-5 ${color}`}>
                {React.cloneElement(icon, { className: 'h-full w-full' })}
            </div>
            <p className={`font-mono text-md ${color}`}>{text}</p>
        </div>
        {startTime && (
             <div className="flex items-center gap-2 text-text-secondary">
                <TimerIcon className="h-5 w-5"/>
                <span className="font-mono text-md">{elapsedTime}</span>
             </div>
        )}
    </div>
  );
};

export default AgentStatus;