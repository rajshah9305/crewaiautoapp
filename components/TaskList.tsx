import React, { useState, useEffect, useMemo } from 'react';
import { AppState, Task, TaskStatus } from '../types';
import { AGENT_ROLES } from '../constants';
import { AGENT_AVATARS } from './agent-config';

import CheckCircleIcon from './icons/CheckCircleIcon';
import SparklesIcon from './icons/SparklesIcon';
import DotIcon from './icons/DotIcon';
import XIcon from './icons/XIcon';
import RestartIcon from './icons/RestartIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import AddIcon from './icons/AddIcon';
import SaveIcon from './icons/SaveIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import TaskListIcon from './icons/TaskListIcon';

interface TaskListProps {
  tasks: Task[];
  appState: AppState;
  currentTaskIndex: number;
  onApprove: () => void;
  onReset: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
  onClose: () => void;
  onRetryTask: (taskId: string) => void;
  onSavePlan: () => void;
}

type AgentWithTasks = {
  name: string;
  tasks: Task[];
  icon: React.FC<{ className?: string }>;
}

const TaskStatusIcon: React.FC<{ status: TaskStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-4 w-4 text-success" style={{filter: 'drop-shadow(0 0 4px var(--glow-color-success))'}}/>;
    case 'in-progress':
      return <SparklesIcon className="h-4 w-4 text-primary animate-pulse" style={{filter: 'drop-shadow(0 0 4px var(--glow-color-primary))'}}/>;
    case 'pending':
      return <DotIcon className="h-4 w-4 text-text-secondary opacity-50" />;
    case 'error':
      return <XIcon className="h-4 w-4 text-error" style={{filter: 'drop-shadow(0 0 4px var(--glow-color-error))'}}/>;
    default:
      return <DotIcon className="h-4 w-4 text-text-secondary opacity-50" />;
  }
};

const PreflightCheck: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const checks = ["VERIFYING AGENT PROTOCOLS", "CALIBRATING TASK VECTORS", "SYNCHRONIZING HEURISTICS", "SPOOLING UP COGNITIVE DRIVES"];
    const [currentCheck, setCurrentCheck] = useState(0);

    useEffect(() => {
        if (currentCheck >= checks.length) {
            const timer = setTimeout(onComplete, 300);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCurrentCheck(c => c + 1);
        }, 500);
        return () => clearTimeout(timer);
    }, [currentCheck, checks.length, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center h-full p-4">
            <h3 className="text-lg font-semibold text-accent mb-4 uppercase tracking-widest">Pre-Flight Check</h3>
            <div className="space-y-2 w-full text-left font-mono text-sm">
                {checks.map((check, index) => (
                    <div key={check} className={`flex items-center gap-2 transition-opacity duration-300 ${index <= currentCheck ? 'opacity-100' : 'opacity-30'}`}>
                        {index < currentCheck ? <CheckCircleIcon className="h-4 w-4 text-success"/> : <SparklesIcon className="h-4 w-4 text-accent animate-pulse"/>}
                        <span>{check}...</span>
                        {index < currentCheck && <span className="text-success ml-auto">OK</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};


const TaskList: React.FC<TaskListProps> = ({ tasks, appState, currentTaskIndex, onApprove, onReset, onUpdateTask, onDeleteTask, onAddTask, onClose, onRetryTask, onSavePlan }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});
  const [isApproving, setIsApproving] = useState(false);

  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const isPlanEditable = appState === 'AWAITING_APPROVAL';

  const agents = useMemo(() => {
    const agentMap: { [key: string]: AgentWithTasks } = {};
    tasks.forEach(task => {
        if (!agentMap[task.agent]) {
            agentMap[task.agent] = {
                name: task.agent,
                tasks: [],
                icon: AGENT_AVATARS[task.agent] || DotIcon
            };
        }
        agentMap[task.agent].tasks.push(task);
    });
    return Object.values(agentMap);
  }, [tasks]);

  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditedTask(task);
  };

  const handleCancel = () => {
    setEditingTaskId(null);
    setEditedTask({});
  };

  const handleSave = () => {
    if (editingTaskId) {
      onUpdateTask(editedTask as Task);
      handleCancel();
    }
  };

  const handleApprove = () => {
      setIsApproving(true);
  };

  return (
    <div className="bg-surface/80 backdrop-blur-lg border-r border-border/50 p-4 w-full h-full flex flex-col transition-all duration-300 shadow-lg rounded-r-lg">
      <div className="flex items-center justify-between mb-2 pb-3 border-b border-border/50">
        <h2 className="text-xl font-bold flex items-center gap-3 font-sans"><TaskListIcon className="h-6 w-6 text-secondary"/> Crew Roster</h2>
        <button onClick={onClose} aria-label="Close Roster" className="p-1 rounded-full hover:bg-surface-light md:hidden">
            <XIcon className="h-6 w-6 text-text-secondary"/>
        </button>
      </div>
      
      <div className="w-full bg-background/50 rounded-full h-1.5 my-3 border border-border/20 p-0.5 overflow-hidden">
          <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out', boxShadow: '0 0 8px var(--glow-color-primary)' }}></div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-2 relative">
        {isApproving ? <PreflightCheck onComplete={onApprove} /> : (
            <ul className="space-y-4">
            {agents.map((agent) => {
                const isAnyTaskActive = agent.tasks.some(t => t.status === 'in-progress');
                
                const getAgentStatus = (agent: AgentWithTasks): { text: string; color: string; icon: React.ReactElement } => {
                    if (agent.tasks.some(t => t.status === 'in-progress')) {
                        return { text: 'THINKING', color: 'text-primary', icon: <SparklesIcon className="h-3 w-3 animate-pulse" /> };
                    }
                    if (agent.tasks.some(t => t.status === 'error')) {
                        return { text: 'ERROR', color: 'text-error', icon: <XIcon className="h-3 w-3" /> };
                    }
                    const allCompleted = agent.tasks.length > 0 && agent.tasks.every(t => t.status === 'completed');
                    if (allCompleted) {
                        return { text: 'IDLE', color: 'text-success', icon: <CheckCircleIcon className="h-3 w-3" /> };
                    }
                    return { text: 'IDLE', color: 'text-text-secondary opacity-70', icon: <DotIcon className="h-3 w-3" /> };
                };
                const agentStatus = getAgentStatus(agent);

                return (
                    <li key={agent.name} className={`bg-background/40 border border-border/30 rounded-lg p-3 transition-all duration-300 ${isAnyTaskActive ? 'border-primary/80 animate-pulse-bg' : ''} ${agent.tasks.some(t => t.status === 'error') ? '!border-error/80' : ''}`}>
                        <div className="flex items-center gap-3 mb-2">
                           <agent.icon className="h-6 w-6 text-secondary" />
                           <h3 className="font-semibold font-sans text-text-primary flex-1 truncate" title={agent.name}>{agent.name}</h3>
                           <div title={`Agent status: ${agentStatus.text}`} className={`flex items-center gap-1.5 text-xs font-mono uppercase tracking-wider px-2 py-0.5 rounded-full bg-black/20 ${agentStatus.color} border border-current/30 transition-colors`}>
                                {agentStatus.icon}
                                <span>{agentStatus.text}</span>
                            </div>
                        </div>
                        <ul className="space-y-1 pl-4 border-l-2 border-border/50">
                            {agent.tasks.map(task => {
                                const isEditing = editingTaskId === task.id;
                                if (isEditing) {
                                    return (
                                        <li key={task.id} className="flex flex-col gap-2 p-2 bg-surface-light ring-1 ring-primary rounded-md">
                                            <input 
                                                type="text" 
                                                value={editedTask.title} 
                                                onChange={e => setEditedTask({...editedTask, title: e.target.value})} 
                                                className="bg-background border border-border rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm"
                                                placeholder="Waypoint Title"
                                            />
                                            <textarea 
                                                value={editedTask.description} 
                                                onChange={e => setEditedTask({...editedTask, description: e.target.value})} 
                                                className="bg-background border border-border rounded-md px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary font-mono text-sm resize-y"
                                                rows={3}
                                                placeholder="Waypoint Description..."
                                            />
                                            <select value={editedTask.agent} onChange={e => setEditedTask({...editedTask, agent: e.target.value})} className="bg-background border border-border rounded-md px-2 py-1 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary font-mono">
                                                {AGENT_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                            </select>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <button aria-label="Cancel Edit" onClick={handleCancel} className="p-1.5 rounded-md hover:bg-border transition-colors"><XIcon className="h-4 w-4 text-text-secondary"/></button>
                                                <button aria-label="Save Waypoint" onClick={handleSave} className="p-1.5 rounded-md hover:bg-border transition-colors"><SaveIcon className="h-4 w-4 text-primary"/></button>
                                            </div>
                                        </li>
                                    )
                                }
                                return (
                                    <li key={task.id} className="group/task flex flex-col text-sm p-1.5 rounded-md hover:bg-surface-light">
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="mt-1 flex-shrink-0"><TaskStatusIcon status={task.status} /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-text-primary font-medium">{task.title}</p>
                                                <p className="text-text-secondary/70 text-xs">{task.description}</p>
                                            </div>
                                            <div className="flex items-center gap-0 opacity-0 group-hover/task:opacity-100 transition-opacity">
                                                {isPlanEditable && (
                                                    <>
                                                        <button aria-label="Edit Waypoint" onClick={() => handleEdit(task)} className="p-1 rounded-md hover:bg-border"><EditIcon className="h-4 w-4"/></button>
                                                        <button aria-label="Delete Waypoint" onClick={() => onDeleteTask(task.id)} className="p-1 rounded-md hover:bg-border"><DeleteIcon className="h-4 w-4 text-error/80"/></button>
                                                    </>
                                                )}
                                                {task.status === 'error' && (
                                                     <button aria-label="Retry Waypoint" onClick={() => onRetryTask(task.id)} className="p-1 rounded-md hover:bg-border"><RestartIcon className="h-4 w-4 text-accent"/></button>
                                                )}
                                            </div>
                                        </div>
                                        {task.status === 'error' && task.error && (
                                            <div className="ml-7 mt-1 text-xs text-error/90 bg-error/10 p-2 rounded-md border border-error/20">
                                                <strong>Agent Failure:</strong> {task.error.length > 100 ? `${task.error.substring(0,100)}...` : task.error}
                                            </div>
                                        )}
                                    </li>
                                )
                            })}
                        </ul>
                    </li>
                )
            })}
          </ul>
        )}
      </div>
      {isPlanEditable && !isApproving && (
          <div className="mt-4 pt-4 border-t border-border/50 flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={onAddTask} className="w-full bg-surface/50 border border-dashed border-border/50 font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors group active:scale-95">
                    <AddIcon className="h-5 w-5" />
                    <span>Add</span>
                </button>
                 <button onClick={onSavePlan} className="w-full bg-surface/50 border border-dashed border-border/50 font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:border-accent hover:text-accent transition-colors group active:scale-95">
                    <SaveIcon className="h-5 w-5" />
                    <span>Save</span>
                </button>
              </div>
              <button onClick={handleApprove} className="w-full flex items-center justify-center gap-2 bg-success/80 text-white uppercase font-bold text-lg py-3 px-4 rounded-md transition-all duration-300 border-2 border-success/90 hover:bg-success hover:shadow-[0_0_20px_var(--glow-color-success)] active:scale-95">
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>CONFIRM & LAUNCH</span>
              </button>
               <button onClick={onReset} className="w-full flex items-center justify-center gap-2 bg-error/80 text-white uppercase font-bold text-sm py-2 px-4 rounded-md transition-all duration-300 border border-error/90 hover:bg-error hover:shadow-[0_0_15px_var(--glow-color-error)] active:scale-95">
                  <RestartIcon className="h-4 w-4" />
                  <span>ABORT MISSION</span>
              </button>
          </div>
        )}
    </div>
  );
};

export default TaskList;
