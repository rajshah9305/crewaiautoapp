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
import Loader from './Loader';
import LockIcon from './icons/LockIcon';

interface TaskListProps {
  tasks: Task[];
  appState: AppState;
  onApprove: () => void;
  onReset: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
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
      return <CheckCircleIcon className="h-5 w-5 text-success" />;
    case 'in-progress':
      return <SparklesIcon className="h-5 w-5 text-accent animate-pulse" />;
    case 'pending':
      return <DotIcon className="h-5 w-5 text-text-secondary opacity-40" />;
    case 'error':
      return <XIcon className="h-5 w-5 text-error" />;
    case 'blocked':
      return <LockIcon className="h-5 w-5 text-text-secondary opacity-50" />;
    default:
      return <DotIcon className="h-5 w-5 text-text-secondary opacity-40" />;
  }
};

const PreflightCheck: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
    const checks = ["Verifying Agent Protocols", "Calibrating Task Vectors", "Synchronizing Heuristics", "Engaging Crew"];
    const [currentCheck, setCurrentCheck] = useState(0);

    useEffect(() => {
        if (currentCheck >= checks.length) {
            const timer = setTimeout(onComplete, 500);
            return () => clearTimeout(timer);
        }

        const timer = setTimeout(() => {
            setCurrentCheck(c => c + 1);
        }, 450);
        return () => clearTimeout(timer);
    }, [currentCheck, checks.length, onComplete]);

    return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-text-primary">
            <h3 className="text-xl font-semibold text-primary mb-8">Pre-Launch Sequence</h3>
            <div className="space-y-4 w-full text-left text-sm">
                {checks.map((check, index) => (
                    <div key={check} className={`flex items-center gap-3 transition-all duration-300 ${index <= currentCheck ? 'opacity-100' : 'opacity-40'}`}>
                        <div className="w-5 h-5 flex-shrink-0 text-primary">
                          {index < currentCheck 
                              ? <CheckCircleIcon className="text-success"/> 
                              : <Loader />
                          }
                        </div>
                        <span className="font-medium flex-1">{check}...</span>
                        {index < currentCheck && <span className="text-success/80 ml-auto font-bold text-xs tracking-wider">NOMINAL</span>}
                    </div>
                ))}
            </div>
        </div>
    );
};


const TaskList: React.FC<TaskListProps> = ({ tasks, appState, onApprove, onUpdateTask, onDeleteTask, onAddTask, onRetryTask, onSavePlan }) => {
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
    <div className="bg-surface/80 backdrop-blur-md border border-border p-4 w-full h-full flex flex-col transition-all duration-300 shadow-lg rounded-lg animate-fadeInUp">
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-border">
        <h2 className="text-xl font-semibold flex items-center gap-3 text-text-primary"><TaskListIcon className="h-6 w-6 text-secondary"/> Crew Manifest</h2>
      </div>
      
      <div className="w-full bg-background rounded-full h-2 my-2 overflow-hidden border border-border">
          <div className="bg-primary h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
      </div>

      <div className="flex-1 overflow-y-auto pr-2 -mr-4 relative py-2">
        {isApproving ? <PreflightCheck onComplete={onApprove} /> : (
            <ul className="space-y-4">
            {agents.map((agent) => {
                const isAnyTaskActive = agent.tasks.some(t => t.status === 'in-progress');
                
                const getAgentStatus = (agent: AgentWithTasks): { text: string; color: string; dot: string } => {
                    if (agent.tasks.some(t => t.status === 'in-progress')) return { text: 'ACTIVE', color: 'text-accent', dot: 'bg-accent' };
                    if (agent.tasks.some(t => t.status === 'error')) return { text: 'ERROR', color: 'text-error', dot: 'bg-error' };
                    if (agent.tasks.length > 0 && agent.tasks.every(t => t.status === 'completed')) return { text: 'NOMINAL', color: 'text-success', dot: 'bg-success' };
                    if (agent.tasks.length > 0 && agent.tasks.every(t => t.status === 'completed' || t.status === 'blocked')) return { text: 'BLOCKED', color: 'text-text-secondary', dot: 'bg-gray-400' };
                    return { text: 'STANDBY', color: 'text-text-secondary', dot: 'bg-gray-400' };
                };
                const agentStatus = getAgentStatus(agent);

                return (
                    <li key={agent.name} className={`bg-background/50 border border-border rounded-lg p-3 transition-all duration-300 ${isAnyTaskActive ? 'border-accent shadow-glow' : ''} ${agent.tasks.some(t => t.status === 'error') ? '!border-error' : ''}`}>
                        <div className="flex items-center gap-3 mb-3">
                           <div className="w-8 h-8 rounded-full bg-surface flex items-center justify-center border border-border"><agent.icon className="h-5 w-5 text-secondary" /></div>
                           <h3 className="font-semibold text-text-primary flex-1 truncate" title={agent.name}>{agent.name}</h3>
                           <div title={`Agent status: ${agentStatus.text}`} className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${agentStatus.color} transition-colors`}>
                                <span className={`w-2 h-2 rounded-full ${agentStatus.dot} ${isAnyTaskActive ? 'animate-pulse' : ''}`}></span>
                                <span>{agentStatus.text}</span>
                            </div>
                        </div>
                        <ul className="space-y-1.5 pl-2 border-l-2 border-surface">
                            {agent.tasks.map(task => {
                                const isEditing = editingTaskId === task.id;
                                if (isEditing) {
                                    return (
                                        <li key={task.id} className="flex flex-col gap-2 p-3 bg-surface ring-2 ring-accent rounded-md ml-2">
                                            <input 
                                                type="text" 
                                                value={editedTask.title} 
                                                onChange={e => setEditedTask({...editedTask, title: e.target.value})} 
                                                className="bg-background border border-border rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-accent text-sm"
                                                placeholder="Task Title"
                                            />
                                            <textarea 
                                                value={editedTask.description} 
                                                onChange={e => setEditedTask({...editedTask, description: e.target.value})} 
                                                className="bg-background border border-border rounded-md px-2 py-1.5 w-full focus:outline-none focus:ring-2 focus:ring-accent text-sm resize-y"
                                                rows={3}
                                                placeholder="Task Description..."
                                            />
                                            <select value={editedTask.agent} onChange={e => setEditedTask({...editedTask, agent: e.target.value})} className="bg-background border border-border rounded-md px-2 py-1.5 w-full text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                                                {AGENT_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                                            </select>
                                            <div className="flex items-center justify-end gap-1 mt-1">
                                                <button aria-label="Cancel Edit" onClick={handleCancel} className="p-1.5 rounded-md hover:bg-border transition-colors"><XIcon className="h-5 w-5 text-text-secondary"/></button>
                                                <button aria-label="Save Task" onClick={handleSave} className="p-1.5 rounded-md hover:bg-border transition-colors"><SaveIcon className="h-5 w-5 text-accent"/></button>
                                            </div>
                                        </li>
                                    )
                                }
                                return (
                                    <li key={task.id} className="group/task flex flex-col text-sm p-1.5 rounded-md hover:bg-surface/50 ml-2">
                                        <div className="flex items-start gap-3 w-full">
                                            <div className="mt-0.5 flex-shrink-0"><TaskStatusIcon status={task.status} /></div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-text-primary font-medium">{task.title}</p>
                                                <p className="text-text-secondary text-xs">{task.description}</p>
                                            </div>
                                            <div className="flex items-center gap-0 opacity-0 group-hover/task:opacity-100 transition-opacity">
                                                {(isPlanEditable || task.status === 'error') && (
                                                    <button aria-label="Edit Task" onClick={() => handleEdit(task)} className="p-1 rounded-md hover:bg-border"><EditIcon className="h-4 w-4 text-secondary"/></button>
                                                )}
                                                {isPlanEditable && (
                                                    <button aria-label="Delete Task" onClick={() => onDeleteTask(task.id)} className="p-1 rounded-md hover:bg-border"><DeleteIcon className="h-4 w-4 text-error"/></button>
                                                )}
                                                {task.status === 'error' && (
                                                     <button aria-label="Retry Task" onClick={() => onRetryTask(task.id)} className="p-1 rounded-md hover:bg-border"><RestartIcon className="h-4 w-4 text-accent"/></button>
                                                )}
                                            </div>
                                        </div>
                                        {task.status === 'error' && task.error && (
                                            <div className="ml-8 mt-1.5 text-xs text-error bg-error/10 p-2 rounded-md border border-error/20">
                                                <strong>Error:</strong> {task.error.length > 100 ? `${task.error.substring(0,100)}...` : task.error}
                                            </div>
                                        )}
                                        {task.dependencies.length > 0 && (
                                            <div className="ml-8 mt-1.5 text-xs text-text-secondary/80">
                                                <span className="font-semibold">Depends on:</span> {task.dependencies.join(', ')}
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
          <div className="mt-auto pt-4 border-t border-border flex flex-col gap-3">
              <div className="grid grid-cols-2 gap-3">
                <button onClick={onAddTask} className="w-full bg-surface border border-border font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:border-gray-400/50 transition-colors group active:scale-95">
                    <AddIcon className="h-5 w-5" />
                    <span>Add Task</span>
                </button>
                 <button onClick={onSavePlan} className="w-full bg-surface border border-border font-semibold py-2 px-4 rounded-md flex items-center justify-center gap-2 hover:border-gray-400/50 transition-colors group active:scale-95">
                    <SaveIcon className="h-5 w-5" />
                    <span>Save Plan</span>
                </button>
              </div>
              <button onClick={handleApprove} className="w-full flex items-center justify-center gap-2 bg-cta text-white font-bold text-base py-3 px-4 rounded-lg transition-all duration-200 hover:bg-orange-600 active:scale-95 shadow-md hover:shadow-lg">
                  <PaperAirplaneIcon className="h-5 w-5" />
                  <span>Confirm & Launch</span>
              </button>
          </div>
        )}
    </div>
  );
};

export default TaskList;