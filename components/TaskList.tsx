import React, { useState } from 'react';
import { AppState, Task, TaskStatus } from '../types';
import { AGENT_ROLES } from '../constants';
import { AGENT_AVATARS } from './agent-config';

import CheckCircleIcon from './icons/CheckCircleIcon';
import CogIcon from './icons/CogIcon';
import DotIcon from './icons/DotIcon';
import PaperAirplaneIcon from './icons/PaperAirplaneIcon';
import RestartIcon from './icons/RestartIcon';
import EditIcon from './icons/EditIcon';
import DeleteIcon from './icons/DeleteIcon';
import AddIcon from './icons/AddIcon';
import SaveIcon from './icons/SaveIcon';
import XIcon from './icons/XIcon';
import SparklesIcon from './icons/SparklesIcon';
import Loader from './Loader';

interface TaskListProps {
  tasks: Task[];
  appState: AppState;
  currentTaskIndex: number;
  isCollapsed: boolean;
  onApprove: () => void;
  onReset: () => void;
  onUpdateTask: (updatedTask: Task) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: () => void;
}

const TaskStatusIcon: React.FC<{ status: TaskStatus }> = ({ status }) => {
  switch (status) {
    case 'completed':
      return <CheckCircleIcon className="h-6 w-6 text-success" />;
    case 'in-progress':
      return <SparklesIcon className="h-6 w-6 text-primary animate-pulse" />;
    case 'pending':
      return <DotIcon className="h-6 w-6 text-text-secondary opacity-50" />;
    case 'error':
      return <XIcon className="h-6 w-6 text-error" />;
    default:
      return <DotIcon className="h-6 w-6 text-text-secondary opacity-50" />;
  }
};

const TaskList: React.FC<TaskListProps> = ({ tasks, appState, currentTaskIndex, isCollapsed, onApprove, onReset, onUpdateTask, onDeleteTask, onAddTask }) => {
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null);
  const [editedTask, setEditedTask] = useState<Partial<Task>>({});

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
  
  const isApproving = appState === 'EXECUTING' && currentTaskIndex === 0;
  const completedTasks = tasks.filter(t => t.status === 'completed').length;
  const progress = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;
  
  const isPlanEditable = appState === 'AWAITING_APPROVAL';

  if (isCollapsed) {
    return (
      <div className="bg-surface border border-border rounded-xl p-3 flex-shrink-0 w-16 animate-fadeIn backdrop-blur-lg flex flex-col items-center gap-4 transition-all duration-300">
        <div data-tooltip="Mission Plan">
          <CogIcon className="h-7 w-7 text-text-primary"/> 
        </div>
        <div className="w-full h-1 bg-background rounded-full my-1 border border-border relative">
            <div className="bg-gradient-to-r from-secondary to-success h-full rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
        </div>
        <ul className="space-y-3 flex-1 flex flex-col items-center">
            {tasks.map((task, index) => {
                const AgentIcon = AGENT_AVATARS[task.agent] || DotIcon;
                const isActive = appState === 'EXECUTING' && index === currentTaskIndex;
                return (
                    <li key={task.id} data-tooltip={`${task.title} - ${task.status}`}>
                        <div className={`p-2 rounded-full ${isActive ? 'animate-pulseGlow' : ''} ${task.status === 'completed' ? 'bg-success/20' : 'bg-surface-light'}`}>
                             <AgentIcon className={`h-6 w-6 ${task.status === 'completed' ? 'text-success' : 'text-text-secondary'}`} />
                        </div>
                    </li>
                )
            })}
        </ul>
      </div>
    )
  }

  return (
    <div className="bg-surface border border-border rounded-xl p-4 flex-shrink-0 w-full md:w-96 animate-fadeIn backdrop-blur-lg flex flex-col h-full transition-all duration-300">
      <h2 className="text-xl font-bold mb-2 text-text-primary border-b border-border pb-3 flex items-center gap-2"><CogIcon className="h-6 w-6"/> Mission Plan</h2>
      <div className="w-full bg-background rounded-full h-2.5 my-3 border border-border">
          <div className="bg-gradient-to-r from-secondary to-success h-2 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.5s ease-in-out' }}></div>
      </div>

      <ul className="space-y-1 flex-1 overflow-y-auto pr-2 -mr-2 relative">
        {tasks.map((task, index) => {
           const AgentIcon = AGENT_AVATARS[task.agent] || DotIcon;
           const isEditing = editingTaskId === task.id;
           const isActive = appState === 'EXECUTING' && index === currentTaskIndex;

           return (
            <li key={task.id} className="relative pl-10 py-2">
                {/* Timeline line */}
                <div className={`absolute left-4 top-0 w-0.5 h-full ${index === 0 ? 'top-4' : ''} ${index === tasks.length -1 ? 'h-4' : ''} bg-border`}></div>
                
                <div className={`p-3 rounded-lg transition-all duration-300 ${isActive ? 'animate-pulseGlow' : ''} ${isEditing ? 'bg-surface-light ring-2 ring-secondary' : 'bg-surface-light/50'}`}>
                    {isEditing ? (
                        <div className="flex flex-col gap-3">
                            <input type="text" value={editedTask.title} onChange={e => setEditedTask({...editedTask, title: e.target.value})} className="bg-background border border-border rounded px-2 py-1 w-full focus:outline-none focus:ring-1 focus:ring-primary"/>
                            <textarea value={editedTask.description} onChange={e => setEditedTask({...editedTask, description: e.target.value})} className="bg-background border border-border rounded px-2 py-1 w-full text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary" rows={2}></textarea>
                            <select value={editedTask.agent} onChange={e => setEditedTask({...editedTask, agent: e.target.value})} className="bg-background border border-border rounded px-2 py-1 w-full text-sm focus:outline-none focus:ring-1 focus:ring-primary">
                                {AGENT_ROLES.map(role => <option key={role} value={role}>{role}</option>)}
                            </select>
                            <div className="flex items-center justify-end gap-2 mt-2">
                                <button onClick={handleCancel} className="p-2 rounded-md hover:bg-border" data-tooltip="Cancel"><XIcon className="h-5 w-5 text-text-secondary"/></button>
                                <button onClick={handleSave} className="p-2 rounded-md hover:bg-border" data-tooltip="Save"><SaveIcon className="h-5 w-5 text-secondary"/></button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-start gap-4">
                            <div className="absolute left-0 top-3 bg-background p-1 rounded-full border border-border">
                              <TaskStatusIcon status={task.status} />
                            </div>
                            <div className="flex-1">
                              <p className="font-semibold text-text-primary">{task.title}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <AgentIcon className="h-4 w-4 text-text-secondary"/>
                                <p className="text-sm text-text-secondary">{task.agent}</p>
                              </div>
                            </div>
                             {isPlanEditable && (
                                <div className="flex items-center gap-1">
                                    <button onClick={() => handleEdit(task)} className="p-2 rounded-md hover:bg-border" data-tooltip="Edit Task"><EditIcon className="h-4 w-4 text-text-secondary"/></button>
                                    <button onClick={() => onDeleteTask(task.id)} className="p-2 rounded-md hover:bg-border" data-tooltip="Delete Task"><DeleteIcon className="h-4 w-4 text-error/80"/></button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </li>
           )
        })}
      </ul>
      {isPlanEditable && (
          <div className="mt-4 pt-4 border-t border-border flex flex-col gap-3">
              <button onClick={onAddTask} className="w-full bg-surface-light border border-dashed border-border font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:border-primary hover:text-primary transition-colors active:animate-buttonPress">
                  <AddIcon className="h-5 w-5" />
                  Add Task
              </button>
              <button onClick={onApprove} disabled={isApproving} className="w-full bg-gradient-to-br from-primary to-secondary text-white font-semibold py-3 px-4 rounded-lg flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-primary/50 transition-shadow active:animate-buttonPress disabled:opacity-70 h-12">
                  {isApproving ? <Loader /> : (
                      <>
                        <PaperAirplaneIcon className="h-5 w-5" />
                        Approve & Run
                      </>
                  )}
              </button>
               <button onClick={onReset} className="w-full bg-surface-light border border-border font-semibold py-2.5 px-4 rounded-lg flex items-center justify-center gap-2 hover:border-text-secondary transition-colors text-sm active:animate-buttonPress">
                  <RestartIcon className="h-5 w-5" />
                  Start Over
              </button>
          </div>
        )}
    </div>
  );
};

export default TaskList;