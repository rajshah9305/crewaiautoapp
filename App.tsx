import React, { useState, useEffect, useCallback } from 'react';
import GoalInput from './components/GoalInput';
import AgentStatus from './components/AgentStatus';
import TaskList from './components/TaskList';
import LogStream from './components/LogStream';
import FinalOutput from './components/FinalOutput';
import { AppState, Task, LogEntry, LogEntryType } from './types';
import * as agentService from './services/agentService';
import SparklesIcon from './components/icons/SparklesIcon';
import RestartIcon from './components/icons/RestartIcon';
import { AGENT_ROLES } from './constants';
import CubeIcon from './components/icons/CubeIcon';
import SidebarToggleIcon from './components/icons/SidebarToggleIcon';

type ActiveTab = 'log' | 'output';

const App: React.FC = () => {
  const [goal, setGoal] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [finalOutput, setFinalOutput] = useState<string | null>(null);
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<ActiveTab>('log');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

  const addLogEntry = useCallback((agent: string, content: string, type: LogEntryType, isStreaming: boolean = false) => {
    setLogEntries(prev => [...prev, {
      id: `log-${Date.now()}-${Math.random()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      agent,
      type,
      content,
      isStreaming
    }]);
  }, []);
  
  const updateLastLogEntry = useCallback((chunk: string) => {
    setLogEntries(prev => {
        if(prev.length === 0) return [];
        const lastEntry = prev[prev.length-1];
        if(lastEntry.isStreaming) {
            const newLogs = [...prev];
            newLogs[newLogs.length-1] = {
                ...lastEntry,
                content: lastEntry.content + chunk
            };
            return newLogs;
        }
        return prev;
    });
  }, []);

  const markLastLogFinished = useCallback(() => {
     setLogEntries(prev => {
        if(prev.length === 0) return [];
        const lastEntry = prev[prev.length - 1];
        if (!lastEntry) return prev;
        const newLogs = [...prev];
        newLogs[newLogs.length-1] = { ...lastEntry, isStreaming: false };
        return newLogs;
     });
  }, []);


  const resetState = () => {
    setGoal('');
    setTasks([]);
    setLogEntries([]);
    setFinalOutput(null);
    setAppState('IDLE');
    setErrorMessage(null);
    setCurrentTaskIndex(0);
    setActiveTab('log');
    setStartTime(null);
    setIsSidebarCollapsed(false);
  };
  
  const handleDeploy = async () => {
    if (!goal.trim() || appState !== 'IDLE' && appState !== 'PLANNING') return;

    setAppState('PLANNING');
    addLogEntry('System', 'Objective received. Starting planning phase...', 'system');

    try {
      const plannedTasks = await agentService.planTasks(goal);
      setTasks(plannedTasks);
      addLogEntry('System', `Planning complete. ${plannedTasks.length} tasks created. Please review, edit, and approve the plan.`, 'system');
      setAppState('AWAITING_APPROVAL');
    } catch (error) {
      const err = error instanceof Error ? error.message : "An unknown error occurred during planning.";
      setErrorMessage(err);
      setAppState('ERROR');
      addLogEntry('System', `Error during planning: ${err}`, 'error');
    }
  };
  
  const handleApproveAndRun = () => {
      if (appState !== 'AWAITING_APPROVAL') return;
      setStartTime(Date.now());
      setAppState('EXECUTING');
      addLogEntry('System', 'Plan approved. Starting execution...', 'system');
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };
  
  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(t => t.id !== taskId));
  };
  
  const handleAddTask = () => {
    const newTask: Task = {
      id: `task-${tasks.length}-${Date.now()}`,
      title: 'New Task',
      description: 'Define the purpose of this task.',
      agent: AGENT_ROLES[0],
      status: 'pending',
    };
    setTasks(prev => [...prev, newTask]);
  };


  useEffect(() => {
    const execute = async () => {
      if (appState === 'EXECUTING' && currentTaskIndex < tasks.length) {
        const currentTask = tasks[currentTaskIndex];
        
        setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'in-progress' } : t));
        addLogEntry('System', `Executing task: "${currentTask.title}" with ${currentTask.agent}.`, 'system');
        addLogEntry(currentTask.agent, ``, 'thought', true);

        await agentService.executeTaskStream(
          currentTask,
          goal,
          logEntries,
          (chunk) => updateLastLogEntry(chunk),
          () => {
            markLastLogFinished();
            setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'completed' } : t));
            setCurrentTaskIndex(prev => prev + 1);
          }
        );

      } else if (appState === 'EXECUTING' && currentTaskIndex >= tasks.length && tasks.length > 0) {
        addLogEntry('System', 'All tasks completed. Finalizing output.', 'system');
        setAppState('FINALIZING');
      }
    };
    execute();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, currentTaskIndex]);
  
  useEffect(() => {
    const finalize = async () => {
        if (appState === 'FINALIZING') {
            try {
                const output = await agentService.generateFinalOutput(goal, logEntries);
                setFinalOutput(output);
                addLogEntry('System', 'Final output generated.', 'system');
                setAppState('FINISHED');
                setActiveTab('output');
            } catch (error) {
                const err = error instanceof Error ? error.message : "An unknown error occurred during finalization.";
                setErrorMessage(err);
                setAppState('ERROR');
                addLogEntry('System', `Error during finalization: ${err}`, 'error');
            }
        }
    };
    finalize();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appState, goal, logEntries]);

  const isPlanning = appState === 'PLANNING';

  return (
    <div className="min-h-screen bg-background font-sans p-4 flex flex-col items-center">
        {appState === 'IDLE' ? (
            <div className="w-full h-full flex-1 flex flex-col items-center justify-center">
                <header className="flex items-center gap-4 mb-8 animate-fadeIn">
                    <SparklesIcon className="h-12 w-12 text-primary animate-subtleFloat"/>
                    <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                      CrewAI Agent Platform
                    </h1>
                </header>
                <GoalInput goal={goal} setGoal={setGoal} onDeploy={handleDeploy} isLoading={isPlanning} />
            </div>
        ) : (
             <div className="w-full max-w-screen-2xl flex-1 flex flex-col gap-4">
                <header className="w-full flex items-center justify-between animate-fadeIn p-2">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)} className="p-2 rounded-md hover:bg-surface" data-tooltip="Toggle Sidebar">
                            <SidebarToggleIcon isCollapsed={isSidebarCollapsed}/>
                        </button>
                        <SparklesIcon className="h-7 w-7 text-primary"/>
                        <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary hidden md:block">CrewAI</h1>
                    </div>
                    <AgentStatus state={appState} error={errorMessage} startTime={startTime} />
                    <button onClick={resetState} className="bg-surface border border-border px-4 py-2 rounded-lg flex items-center gap-2 hover:border-primary transition-colors backdrop-blur-lg active:animate-buttonPress">
                        <RestartIcon className="h-5 w-5"/>
                        New Run
                    </button>
                </header>

                <main className="w-full flex-1 flex flex-row gap-4 overflow-hidden">
                    <TaskList 
                        tasks={tasks} 
                        appState={appState} 
                        currentTaskIndex={currentTaskIndex}
                        isCollapsed={isSidebarCollapsed}
                        onApprove={handleApproveAndRun} 
                        onReset={resetState}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onAddTask={handleAddTask}
                    />

                    <div className="flex-1 flex flex-col gap-4 min-w-0">
                        <div className="flex items-center justify-between gap-2 bg-surface border border-border rounded-lg p-2 backdrop-blur-lg">
                             <div className="flex items-center gap-3 px-2 text-text-primary truncate">
                                <CubeIcon className="h-5 w-5 flex-shrink-0" />
                                <span className="font-mono text-sm truncate" title={goal}>{goal}</span>
                             </div>
                             <div className="flex items-center gap-2 p-1 bg-background rounded-md">
                                 <button onClick={() => setActiveTab('log')} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'log' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-text-secondary hover:bg-surface-light'}`}>
                                    Execution Log
                                </button>
                                <button onClick={() => setActiveTab('output')} disabled={appState !== 'FINISHED'} className={`px-4 py-1.5 rounded-md text-sm font-semibold transition-colors ${activeTab === 'output' ? 'bg-primary text-white shadow-md shadow-primary/30' : 'text-text-secondary'} disabled:opacity-50 disabled:cursor-not-allowed enabled:hover:bg-surface-light`}>
                                    Final Output
                                </button>
                             </div>
                        </div>
                        <div className="flex-1 overflow-hidden">
                            {activeTab === 'log' && <LogStream logEntries={logEntries} />}
                            {activeTab === 'output' && <FinalOutput output={finalOutput} />}
                        </div>
                    </div>
                </main>
             </div>
        )}
    </div>
  );
};

export default App;