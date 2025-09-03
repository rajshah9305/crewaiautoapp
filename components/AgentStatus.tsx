import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import CheckCircleIcon from './icons/CheckCircleIcon';
import TimerIcon from './icons/TimerIcon';
import SparklesIcon from './icons/SparklesIcon';
import XIcon from './icons/XIcon';
import Loader from './Loader';

interface AgentStatusProps {
  state: AppState;
  startTime: number | null;
  error?: string | null;
}

const AgentStatus: React.FC<AgentStatusProps> = ({ state, startTime }) => {
  const [elapsedTime, setElapsedTime] = useState('00:00:00');

  useEffect(() => {
    if (!startTime) {
        setElapsedTime('00:00:00');
        return;
    }

    const interval = setInterval(() => {
        if (state === 'FINISHED' || state === 'ERROR') {
            clearInterval(interval);
            return;
        }
      const now = Date.now();
      const difference = now - startTime;
      const hours = Math.floor(difference / 3600000);
      const minutes = Math.floor((difference % 3600000) / 60000);
      const seconds = Math.floor((difference % 60000) / 1000);
      setElapsedTime(`${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, state]);


  const getStatusInfo = () => {
    switch (state) {
      case 'IDLE': return null;
      case 'PLANNING': return { text: 'Planning Mission...', color: 'text-text-primary', icon: <Loader /> };
      case 'AWAITING_APPROVAL': return { text: 'Plan Ready for Review', color: 'text-primary', icon: <SparklesIcon/> };
      case 'EXECUTING': return { text: 'Executing...', color: 'text-text-primary', icon: <Loader /> };
      case 'FINALIZING': return { text: 'Finalizing...', color: 'text-primary', icon: <Loader /> };
      case 'FINISHED': return { text: 'Mission Complete', color: 'text-success', icon: <CheckCircleIcon /> };
      case 'ERROR': return { text: 'Mission Failed', color: 'text-error', icon: <XIcon /> };
      default: return { text: 'Standby', color: 'text-secondary', icon: <SparklesIcon/> };
    }
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo) return null;

  const { text, color, icon } = statusInfo;
  
  return (
    <div className={`flex items-center justify-center gap-2 transition-all duration-300`}>
        <div className="flex items-center gap-2">
            <div className={`h-5 w-5 ${state === 'PLANNING' || state === 'EXECUTING' || state === 'FINALIZING' ? 'text-primary' : color}`}>
                {React.cloneElement(icon, { className: 'h-full w-full' })}
            </div>
            <p className={`font-sans text-sm font-medium ${color}`}>{text}</p>
        </div>
        {startTime && (
             <div className="hidden sm:flex items-center gap-2 text-text-secondary border-l border-border/50 pl-2">
                <TimerIcon className="h-5 w-5"/>
                <span className="font-mono text-sm">{elapsedTime}</span>
             </div>
        )}
    </div>
  );
};

export default AgentStatus;