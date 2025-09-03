export type TaskStatus = 'pending' | 'in-progress' | 'completed' | 'error';

export interface Task {
  id: string;
  title: string;
  description: string;
  agent: string;
  status: TaskStatus;
  error?: string;
}

export type LogEntryType = 'system' | 'thought' | 'action' | 'observation' | 'error' | 'user';

export interface LogEntry {
  id: string;
  timestamp: string;
  type: LogEntryType;
  agent: string;
  content: string;
  isStreaming?: boolean;
}

export type AppState = 'IDLE' | 'PLANNING' | 'AWAITING_APPROVAL' | 'EXECUTING' | 'FINALIZING' | 'FINISHED' | 'ERROR';
