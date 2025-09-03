import React, { useState, useEffect, useCallback, useRef } from 'react';
import AgentStatus from './components/AgentStatus';
import TaskList from './components/TaskList';
import CommandPalette from './components/CommandPalette';
import { AppState, Task, LogEntry, LogEntryType, TaskStatus } from './types';
import * as agentService from './services/agentService';
import { soundEngine } from './utils/sound';
import RestartIcon from './components/icons/RestartIcon';
import { AGENT_ROLES } from './constants';
import SidebarToggleIcon from './components/icons/SidebarToggleIcon';
import CrewAILogo from './components/icons/CrewAILogo';
import Starfield from './components/Starfield';
import MissionBriefing from './components/MissionBriefing';
import ActivityMonitor from './components/ActivityMonitor';
import FinalReport from './components/FinalReport';
import MissionStarmap from './components/MissionStarmap';
import StellarCartographyIcon from './components/icons/StellarCartographyIcon';
import VolumeUpIcon from './components/icons/VolumeUpIcon';
import VolumeOffIcon from './components/icons/VolumeOffIcon';


const App: React.FC = () => {
  const [goal, setGoal] = useState<string>('');
  const [tasks, setTasks] = useState<Task[]>([]);
  const [logEntries, setLogEntries] = useState<LogEntry[]>([]);
  const [appState, setAppState] = useState<AppState>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);
  const [isStarmapOpen, setIsStarmapOpen] = useState<boolean>(true);
  const [hasSavedPlan, setHasSavedPlan] = useState<boolean>(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [chatInput, setChatInput] = useState('');
  const [isMuted, setIsMuted] = useState(false);

  const logEntriesRef = useRef(logEntries);
  useEffect(() => {
    logEntriesRef.current = logEntries;
  }, [logEntries]);

  useEffect(() => {
    if (localStorage.getItem('crewai_saved_plan')) {
        setHasSavedPlan(true);
    }
    const handleResize = () => {
        if (window.innerWidth < 768) {
            setIsSidebarOpen(false);
            setIsStarmapOpen(false);
        } else if (window.innerWidth < 1024) {
            setIsSidebarOpen(true);
            setIsStarmapOpen(false);
        } else {
            setIsSidebarOpen(true);
            setIsStarmapOpen(true);
        }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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
  
  const handleToggleMute = useCallback(() => {
    const newMuteState = soundEngine.toggleMute();
    setIsMuted(newMuteState);
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

  const resetState = useCallback(() => {
    soundEngine.playSound('click');
    setGoal('');
    setTasks([]);
    setLogEntries([]);
    setAppState('IDLE');
    setErrorMessage(null);
    setStartTime(null);
    setChatInput('');
    if (window.innerWidth >= 1024) {
        setIsSidebarOpen(true);
        setIsStarmapOpen(true);
    } else if (window.innerWidth >= 768) {
        setIsSidebarOpen(true);
        setIsStarmapOpen(false);
    } else {
        setIsSidebarOpen(false);
        setIsStarmapOpen(false);
    }
  }, []);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus, error?: string) => {
    setTasks(prevTasks => {
        const newTasks = prevTasks.map(t => 
            t.id === taskId ? { ...t, status, error: error || undefined } : t
        );
        
        if (status === 'completed') {
            soundEngine.playSound('complete');
            const completedTaskIds = new Set(newTasks.filter(t => t.status === 'completed').map(t => t.id));
            return newTasks.map(task => {
                if (task.status === 'blocked' && task.dependencies.every(depId => completedTaskIds.has(depId))) {
                    return { ...task, status: 'pending' };
                }
                return task;
            });
        }
        return newTasks;
    });
  }, []);
  
  const handleDeploy = useCallback(async () => {
    if (!chatInput.trim() || appState !== 'IDLE') return;
    
    soundEngine.initialize(); // Init sound on first user action
    soundEngine.playSound('deploy');
    const missionGoal = chatInput;
    setGoal(missionGoal);
    setTasks([]);
    setLogEntries([]);
    setAppState('PLANNING');
    setErrorMessage(null);
    setStartTime(null);
    
    addLogEntry('User', missionGoal, 'user');
    addLogEntry('System', 'Objective received. Planning mission...', 'system');

    try {
      const plannedTasks = await agentService.planTasks(missionGoal);
      const tasksWithInitialStatus: Task[] = plannedTasks.map(task => ({
          ...task,
          status: (task.dependencies?.length ?? 0) === 0 ? 'pending' : 'blocked'
      }));
      setTasks(tasksWithInitialStatus);
      addLogEntry('System', `Mission plan created with ${plannedTasks.length} tasks. Please review and approve the crew manifest.`, 'system');
      setAppState('AWAITING_APPROVAL');
      setIsSidebarOpen(true);
    } catch (error) {
      const err = error instanceof Error ? error.message : "An unknown error occurred during planning.";
      setErrorMessage(err);
      setAppState('ERROR');
      addLogEntry('System', `Critical error during planning phase: ${err}`, 'error');
      soundEngine.playSound('error');
    }
  }, [chatInput, appState, addLogEntry]);
  
  const handleApproveAndRun = useCallback(() => {
      if (appState !== 'AWAITING_APPROVAL') return;
      soundEngine.playSound('deploy');
      setStartTime(Date.now());
      setAppState('EXECUTING');
      addLogEntry('System', 'Approval confirmed. Engaging agent crew. Mission is underway.', 'system');
      if (window.innerWidth < 768) setIsSidebarOpen(false);
  }, [appState, addLogEntry]);
  
  const handleRetryTask = useCallback((taskId: string) => {
    const taskToRetry = tasks.find(t => t.id === taskId);
    if (!taskToRetry) return;
    soundEngine.playSound('click');
    updateTaskStatus(taskId, 'pending');
    if (appState === 'ERROR') {
      setErrorMessage(null);
      setAppState('EXECUTING');
    }
  }, [tasks, appState, updateTaskStatus]);

  const handleUpdateTask = useCallback((updatedTask: Task) => {
    setTasks(prev => prev.map(t => {
        if (t.id === updatedTask.id) {
            if (t.status === 'error') {
                return { ...updatedTask, status: 'pending', error: undefined };
            }
            return updatedTask;
        }
        return t;
    }));
  }, []);
  
  const handleDeleteTask = useCallback((taskId: string) => {
    soundEngine.playSound('click');
    setTasks(prev => prev.filter(t => t.id !== taskId));
  }, []);
  
  const handleAddTask = useCallback(() => {
    soundEngine.playSound('click');
    const newTask: Task = {
      id: `task-${tasks.length}-${Date.now()}`,
      title: 'New Task',
      description: 'Define the objective for this task.',
      agent: AGENT_ROLES[0],
      status: 'pending',
      dependencies: [],
    };
    setTasks(prev => [...prev, newTask]);
  }, [tasks.length]);

  const savePlan = useCallback(() => {
    if (goal && tasks.length > 0) {
        soundEngine.playSound('click');
        localStorage.setItem('crewai_saved_plan', JSON.stringify({ goal, tasks }));
        setHasSavedPlan(true);
        addLogEntry('System', 'Mission plan saved.', 'system');
    }
  }, [goal, tasks, addLogEntry]);

  const loadPlan = useCallback(() => {
    const savedPlan = localStorage.getItem('crewai_saved_plan');
    if (savedPlan) {
      try {
        soundEngine.playSound('click');
        resetState();
        const { goal: savedGoal, tasks: savedTasks } = JSON.parse(savedPlan);
        if (typeof savedGoal === 'string' && Array.isArray(savedTasks)) {
            setGoal(savedGoal);
            setChatInput(savedGoal);
            setTasks(savedTasks);
            setAppState('AWAITING_APPROVAL');
            addLogEntry('System', 'Saved mission plan loaded. Review and launch.', 'system');
            setIsSidebarOpen(true);
        } else {
            throw new Error("Saved plan is malformed.");
        }
      } catch (error) {
        console.error("Failed to load saved plan:", error);
        localStorage.removeItem('crewai_saved_plan');
        setHasSavedPlan(false);
        addLogEntry('System', 'Error: Could not load saved plan. The data was corrupted and has been cleared.', 'error');
        soundEngine.playSound('error');
      }
    }
  }, [addLogEntry, resetState]);
  
  const handleCommandSelectTemplate = useCallback((prompt: string) => {
    setChatInput(prompt);
    document.getElementById('mission-goal-input')?.focus();
  }, []);

  useEffect(() => {
    const execute = () => {
      if (appState !== 'EXECUTING') return;
      
      const allTasksDone = tasks.length > 0 && tasks.every(t => t.status === 'completed');
      if (allTasksDone) {
        soundEngine.stopTypingSound();
        addLogEntry('System', 'All tasks complete. Generating final report.', 'system');
        setAppState('FINALIZING');
        return;
      }
      
      const runnableTasks = tasks.filter(task => task.status === 'pending');
      const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
      if (runnableTasks.length === 0 && inProgressTasks.length === 0 && !allTasksDone) {
        // Stalled
        soundEngine.stopTypingSound();
      } else if (inProgressTasks.length > 0) {
        soundEngine.startTypingSound();
      } else {
        soundEngine.stopTypingSound();
      }
      
      if (runnableTasks.length === 0) return;
      
      const taskIdsToStart = runnableTasks.map(t => t.id);
      setTasks(prev => prev.map(t => taskIdsToStart.includes(t.id) ? { ...t, status: 'in-progress' } : t));
      
      runnableTasks.forEach(task => {
        const executeSingleTask = async () => {
          try {
            addLogEntry('System', `Executing Task: "${task.title}" // Agent: ${task.agent}`, 'system');
            addLogEntry(task.agent, ``, 'thought', true);
            const agentContextLogs = logEntriesRef.current.filter(e => e.type !== 'user');
            
            await agentService.executeTaskStream(task, goal, agentContextLogs, updateLastLogEntry, () => {
                markLastLogFinished();
                updateTaskStatus(task.id, 'completed');
            });
          } catch(error) {
              const err = error instanceof Error ? error.message : "An unknown task execution error occurred.";
              markLastLogFinished();
              updateTaskStatus(task.id, 'error', err);
              setAppState('ERROR');
              setErrorMessage(err);
              addLogEntry('System', `Execution failed for task "${task.title}". Halting mission. You may retry or modify the failed task.`, 'error');
              soundEngine.playSound('error');
          }
        };
        executeSingleTask();
      });
    };
    execute();
    
    // Cleanup typing sound
    return () => {
        if(appState !== 'EXECUTING') {
            soundEngine.stopTypingSound();
        }
    }
  }, [appState, tasks, goal, addLogEntry, markLastLogFinished, updateLastLogEntry, updateTaskStatus]);
  
  useEffect(() => {
    const finalize = async () => {
        if (appState === 'FINALIZING') {
            try {
                const agentContextLogs = logEntries.filter(e => e.type !== 'user');
                const output = await agentService.generateFinalOutput(goal, agentContextLogs);
                addLogEntry('System', output, 'final_report');
                setAppState('FINISHED');
                soundEngine.playSound('complete');
            } catch (error) {
                const err = error instanceof Error ? error.message : "An unknown error occurred during finalization.";
                setErrorMessage(err);
                setAppState('ERROR');
                addLogEntry('System', `Error during finalization: ${err}`, 'error');
                soundEngine.playSound('error');
            }
        }
    };
    finalize();
  }, [appState, goal, logEntries, addLogEntry]);

  const showPanels = appState !== 'IDLE';

  const renderCenterPanel = () => {
    const finalReportEntry = logEntries.find(e => e.type === 'final_report');
    switch (appState) {
        case 'IDLE':
        case 'PLANNING':
        case 'AWAITING_APPROVAL':
            return (
                <MissionBriefing
                    onSendMessage={handleDeploy}
                    onLoadPlan={loadPlan}
                    hasSavedPlan={hasSavedPlan}
                    isLoading={appState === 'PLANNING'}
                    appState={appState}
                    inputValue={chatInput}
                    onInputChange={setChatInput}
                />
            );
        case 'EXECUTING':
        case 'ERROR':
            return <ActivityMonitor tasks={tasks} logEntries={logEntries} />;
        case 'FINALIZING':
        case 'FINISHED':
            return finalReportEntry ? <FinalReport report={finalReportEntry} /> : <ActivityMonitor tasks={tasks} logEntries={logEntries} />;
        default:
            return null;
    }
  }

  return (
    <>
      <Starfield />
      <CommandPalette
        isOpen={isPaletteOpen}
        onClose={() => setIsPaletteOpen(false)}
        onSelectTemplate={handleCommandSelectTemplate}
        onLoadPlan={loadPlan}
        onNewMission={resetState}
        hasSavedPlan={hasSavedPlan}
      />
      <div className="w-full h-screen flex flex-col font-sans overflow-hidden p-2 sm:p-4 relative">
          <header className="w-full grid grid-cols-3 items-center gap-4 py-2 px-4 bg-surface/80 backdrop-blur-md border border-border rounded-lg shadow-md mb-4 animate-fadeInUp z-20">
              <div className="flex items-center gap-1 sm:gap-3">
                  {showPanels && (
                    <button aria-label="Toggle Crew Manifest" onClick={() => setIsSidebarOpen(p => !p)} className="p-2 rounded-md hover:bg-border transition-colors">
                        <SidebarToggleIcon/>
                    </button>
                  )}
                  <div className="flex items-center gap-3 group">
                      <CrewAILogo className="h-8 w-8 text-primary"/>
                      <h1 className="text-xl md:text-2xl font-semibold text-text-primary hidden sm:block">
                        Mission Control
                      </h1>
                  </div>
              </div>
              <div className="flex-1 flex flex-col items-center justify-center px-4 overflow-hidden">
                <AgentStatus state={appState} error={errorMessage} startTime={startTime} />
                {goal && <p className="text-xs text-text-secondary mt-1 truncate max-w-full" title={goal}>{goal}</p>}
              </div>
              <div className="flex items-center gap-2 justify-end">
                <button aria-label={isMuted ? "Unmute" : "Mute"} onClick={handleToggleMute} className="p-2 rounded-md hover:bg-border transition-colors">
                    {isMuted ? <VolumeOffIcon className="h-6 w-6 text-text-secondary"/> : <VolumeUpIcon className="h-6 w-6 text-text-secondary"/>}
                </button>
                {showPanels && (
                    <button aria-label="Toggle Mission Starmap" onClick={() => setIsStarmapOpen(p => !p)} className="p-2 rounded-md hover:bg-border transition-colors hidden lg:block">
                        <StellarCartographyIcon className="h-6 w-6"/>
                    </button>
                )}
                <button onClick={resetState} className="group bg-surface border border-border px-3 sm:px-4 py-2 rounded-lg flex items-center gap-2 hover:border-primary/50 transition-all text-text-primary font-medium active:scale-95 shadow-sm">
                    <RestartIcon className="h-5 w-5"/>
                    <span className="hidden sm:inline">New Mission</span>
                </button>
              </div>
          </header>

          <main className="flex-1 min-h-0 flex gap-4 transition-all duration-300">
              {/* Left Panel: Crew Manifest */}
              <aside className={`transition-all duration-300 ease-in-out ${isSidebarOpen && showPanels ? 'w-80 md:w-96' : 'w-0'} ${!showPanels ? 'hidden' : 'flex'}`}>
                <div className={`w-80 md:w-96 h-full transition-opacity duration-300 ${isSidebarOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {isSidebarOpen && <TaskList 
                        tasks={tasks} 
                        appState={appState} 
                        onApprove={handleApproveAndRun} 
                        onReset={resetState}
                        onUpdateTask={handleUpdateTask}
                        onDeleteTask={handleDeleteTask}
                        onAddTask={handleAddTask}
                        onRetryTask={handleRetryTask}
                        onSavePlan={savePlan}
                    />}
                </div>
              </aside>

              {/* Center Panel: Operations */}
              <div className="flex-1 flex justify-center min-w-0 h-full">
                  {renderCenterPanel()}
              </div>

              {/* Right Panel: Mission Starmap */}
              <aside className={`transition-all duration-300 ease-in-out hidden lg:flex ${isStarmapOpen && showPanels ? 'w-80 md:w-96' : 'w-0'}`}>
                <div className={`w-80 md:w-96 h-full transition-opacity duration-300 ${isStarmapOpen ? 'opacity-100' : 'opacity-0'}`}>
                    {isStarmapOpen && <MissionStarmap tasks={tasks} />}
                </div>
              </aside>
          </main>
      </div>
    </>
  );
};

export default App;