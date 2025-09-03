import React, { useState, useEffect, useCallback, useRef } from 'react';
import AgentStatus from './components/AgentStatus';
import TaskList from './components/TaskList';
import ChatInterface from './components/ChatInterface';
import CommandPalette from './components/CommandPalette';
import { AppState, Task, LogEntry, LogEntryType } from './types';
import * as agentService from './services/agentService';
import RestartIcon from './components/icons/RestartIcon';
import { AGENT_ROLES } from './constants';
import SidebarToggleIcon from './components/icons/SidebarToggleIcon';
import CrewAILogo from './components/icons/CrewAILogo';

const App: React.FC = () => {
  const [goal, setGoal] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [currentTaskIndex, setCurrentTaskIndex] = useState<number>(0);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
  const [hasSavedPlan, setHasSavedPlan] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');

  const logEntriesRef = useRef(logEntries);
  useEffect(() => {
    logEntriesRef.current = logEntries;
  }, [logEntries]);

  useEffect(() => {
    if (localStorage.getItem('crewai_saved_plan')) {
        setHasSavedPlan(true);
    }
  }, []);
  
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            setIsPaletteOpen(prev => !prev);
        }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

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
    setAppState('IDLE');
    setErrorMessage(null);
    setCurrentTaskIndex(0);
    setStartTime(null);
    setIsSidebarOpen(false);
    setChatInput('');
  };
  
  const handleDeploy = async () => {
    if (!chatInput.trim() || appState !== 'IDLE') return;
    
    const missionGoal = chatInput;
    resetState();
    setGoal(missionGoal);
    addLogEntry('User', missionGoal, 'user');
    setAppState('PLANNING');
    addLogEntry('System', 'Objective received. Calculating mission vectors...', 'system');

    try {
      const plannedTasks = await agentService.planTasks(missionGoal);
      setTasks(plannedTasks);
      addLogEntry('System', `Flight plan established with ${plannedTasks.length} waypoints. Awaiting command authorization.`, 'system');
      setAppState('AWAITING_APPROVAL');
      setIsSidebarOpen(true);
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
      addLogEntry('System', 'Authorization confirmed. Engaging agent crew.', 'system');
      if (window.innerWidth < 768) { // Close sidebar on mobile after launch
          setIsSidebarOpen(false);
      }
  };
  
  const handleRetryTask = (taskId: string) => {
    const taskIndex = tasks.findIndex(t => t.id === taskId);
    if (taskIndex === -1) return;
    
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'pending', error: undefined } : t));
    
    if (appState === 'ERROR') {
      setErrorMessage(null);
      setAppState('EXECUTING');
    }
    
    setCurrentTaskIndex(taskIndex);
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
      title: 'New Waypoint',
      description: 'Define the objective for this waypoint.',
      agent: AGENT_ROLES[0],
      status: 'pending',
    };
    setTasks(prev => [...prev, newTask]);
  };

  const savePlan = useCallback(() => {
    if (goal && tasks.length > 0) {
        localStorage.setItem('crewai_saved_plan', JSON.stringify({ goal, tasks }));
        setHasSavedPlan(true);
        addLogEntry('System', 'Mission plan saved to local storage.', 'system');
    }
  }, [goal, tasks, addLogEntry]);

  const loadPlan = useCallback(() => {
    const savedPlan = localStorage.getItem('crewai_saved_plan');
    if (savedPlan) {
        resetState();
        const { goal, tasks } = JSON.parse(savedPlan);
        setGoal(goal);
        setTasks(tasks);
        setAppState('AWAITING_APPROVAL');
        addLogEntry('System', 'Saved mission plan loaded. Please review and launch.', 'system');
        setIsSidebarOpen(true);
    }
  }, [addLogEntry]);
  
  const handleCommandSelectTemplate = (prompt: string) => {
    setChatInput(prompt);
    document.getElementById('mission-goal-input')?.focus();
  };

  useEffect(() => {
    const execute = async () => {
      if (appState === 'EXECUTING' && currentTaskIndex < tasks.length) {
        const currentTask = tasks[currentTaskIndex];
        if (currentTask.status === 'completed' || currentTask.status === 'in-progress') {
            if (currentTask.status === 'completed') setCurrentTaskIndex(prev => prev + 1);
            return;
        }

        try {
            setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'in-progress' } : t));
            addLogEntry('System', `Executing waypoint: "${currentTask.title}" // Agent Assigned: ${currentTask.agent}`, 'system');
            addLogEntry(currentTask.agent, ``, 'thought', true);

            const agentContextLogs = logEntriesRef.current.filter(e => e.type !== 'user');
            await agentService.executeTaskStream(
              currentTask,
              goal,
              agentContextLogs,
              (chunk) => updateLastLogEntry(chunk),
              () => {
                markLastLogFinished();
                setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'completed' } : t));
                setCurrentTaskIndex(prev => prev + 1);
              }
            );
        } catch(error) {
            const err = error instanceof Error ? error.message : "An unknown task execution error occurred.";
            markLastLogFinished();
            setTasks(prev => prev.map(t => t.id === currentTask.id ? { ...t, status: 'error', error: err } : t));
            setAppState('ERROR');
            setErrorMessage(err);
            addLogEntry('System', `Execution failed for task "${currentTask.title}". Halting mission. You may retry the failed task.`, 'error');
        }

      } else if (appState === 'EXECUTING' && currentTaskIndex >= tasks.length && tasks.length > 0) {
        addLogEntry('System', 'All waypoints reached. Compiling final mission debrief.', 'system');
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
                const agentContextLogs = logEntries.filter(e => e.type !== 'user');
                const output = await agentService.generateFinalOutput(goal, agentContextLogs);
                addLogEntry('System', `## Mission Debrief\n\n${output}`, 'system');
                setAppState('FINISHED');
            } catch (error) {
                const err = error instanceof Error ? error.message : "An unknown error occurred during finalization.";
                setErrorMessage(err);
                setAppState('ERROR');
                addLogEntry('System', `Error during finalization: ${err}`, 'error');
            }
        }
    };
    finalize();
  }, [appState, goal, logEntries, addLogEntry]);

  const showRoster = appState !== 'IDLE' && appState !== 'PLANNING';

  return (
    <>
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTemplate={handleCommandSelectTemplate}
        onLoadPlan={loadPlan}
        onNewMission={resetState}
        hasSavedPlan={hasSavedPlan}
      />
      <div className="w-full h-screen flex flex-col font-sans overflow-hidden p-2 sm:p-4">
          <header className="w-full flex items-center justify-between animate-fadeIn py-2 px-4 bg-surface/80 backdrop-blur-md border border-border/50 rounded-lg shadow-lg mb-4">
              <div className="flex items-center gap-1 sm:gap-3">
                  {showRoster && (
                    <button aria-label="Open Crew Roster" onClick={() => setIsSidebarOpen(true)} className="p-2 rounded-md hover:bg-surface-light transition-colors md:hidden">
                        <SidebarToggleIcon/>
                    </button>
                  )}
                  <div className="flex items-center gap-2 group">
                      <CrewAILogo className="h-8 w-8 text-primary" style={{ filter: `drop-shadow(0 0 8px var(--primary-color))` }}/>
                      <h1 className="text-xl md:text-2xl font-bold text-text-primary hidden sm:block uppercase tracking-widest font-sans" style={{ textShadow: '0 0 8px var(--glow-color-primary)' }}>
                        CrewAI
                      </h1>
                  </div>
              </div>
              <div className="flex-1 flex justify-center px-4">
                <AgentStatus state={appState} error={errorMessage} startTime={startTime} />
              </div>
              {appState !== 'IDLE' && (
                <button onClick={resetState} className="group bg-error/80 border border-transparent px-3 sm:px-4 py-2 rounded-md flex items-center gap-2 hover:bg-error hover:border-error hover:shadow-[0_0_15px_var(--glow-color-error)] transition-all text-white font-bold active:scale-95">
                    <RestartIcon className="h-5 w-5"/>
                    <span className="hidden sm:inline">New Mission</span>
                </button>
              )}
          </header>

          <main className="flex-1 min-h-0 flex gap-4">
              {/* Overlay for mobile sidebar */}
              <div 
                className={`fixed inset-0 bg-black/60 z-30 md:hidden transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={() => setIsSidebarOpen(false)}
              ></div>
              
              {/* Sidebar */}
              <aside className={`fixed top-0 left-0 w-80 md:w-96 h-full z-40 md:relative md:z-auto md:top-auto md:left-auto md:h-auto transform transition-transform duration-300 ease-in-out ${isSidebarOpen && showRoster ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0 md:block ${!showRoster ? 'hidden' : ''}`}>
                <TaskList 
                    tasks={tasks} 
                    appState={appState} 
                    currentTaskIndex={currentTaskIndex}
                    onApprove={handleApproveAndRun} 
                    onReset={resetState}
                    onUpdateTask={handleUpdateTask}
                    onDeleteTask={handleDeleteTask}
                    onAddTask={handleAddTask}
                    onClose={() => setIsSidebarOpen(false)}
                    onRetryTask={handleRetryTask}
                    onSavePlan={savePlan}
                />
              </aside>

              <div className="flex-1 flex justify-center min-w-0">
                  <ChatInterface
                      logEntries={logEntries}
                      onSendMessage={handleDeploy}
                      onLoadPlan={loadPlan}
                      hasSavedPlan={hasSavedPlan}
                      isLoading={appState === 'PLANNING'}
                      appState={appState}
                      inputValue={chatInput}
                      onInputChange={setChatInput}
                  />
              </div>
          </main>
      </div>
    </>
  );
};

export default App;