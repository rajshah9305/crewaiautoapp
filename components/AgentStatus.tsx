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
      case 'PLANNING': return { text: 'PLANNING', color: 'text-primary', icon: <Loader /> };
      case 'AWAITING_APPROVAL': return { text: 'AWAITING...', color: 'text-accent', icon: <SparklesIcon/> };
      case 'EXECUTING': return { text: 'EXECUTING', color: 'text-primary', icon: <Loader /> };
      case 'FINALIZING': return { text: 'FINALIZING', color: 'text-accent', icon: <Loader /> };
      case 'FINISHED': return { text: 'COMPLETE', color: 'text-success', icon: <CheckCircleIcon /> };
      case 'ERROR': return { text: 'FAILED', color: 'text-error', icon: <XIcon /> };
      default: return { text: 'STANDBY', color: 'text-text-secondary', icon: <SparklesIcon/> };
    }
  };

  const statusInfo = getStatusInfo();

  if (!statusInfo) return null;

  const { text, color, icon } = statusInfo;
  
  return (
    <div className={`bg-surface/80 backdrop-blur-sm border border-border rounded-md px-3 sm:px-4 py-2 flex items-center justify-center gap-3 sm:gap-4 shadow-sm transition-all duration-500`}>
        <div className="flex items-center gap-2 sm:gap-3">
            <div className={`h-6 w-6 ${color}`}>
                {React.cloneElement(icon, { className: 'h-full w-full' })}
            </div>
            <p className={`font-sans text-sm sm:text-base font-semibold tracking-wider ${color}`}>{text}</p>
        </div>
        {startTime && (
             <div className="flex items-center gap-2 text-text-secondary border-l border-border/50 pl-3 sm:pl-4">
                <TimerIcon className="h-5 w-5"/>
                <span className="font-mono text-base sm:text-lg">{elapsedTime}</span>
             </div>
        )}
    </div>
  );
};

export default AgentStatus;