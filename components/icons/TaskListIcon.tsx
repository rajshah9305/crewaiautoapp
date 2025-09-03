import React from 'react';

const TaskListIcon: React.FC<{ className?: string, style?: React.CSSProperties }> = ({ className, style }) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={className} style={style}>
    <path d="M3.5 3A1.5 1.5 0 002 4.5v11A1.5 1.5 0 003.5 17h13a1.5 1.5 0 001.5-1.5v-11A1.5 1.5 0 0016.5 3h-13z" opacity="0.3"/>
    <path d="M14 7a1 1 0 11-2 0 1 1 0 012 0zM5 7a1 1 0 100 2h4a1 1 0 100-2H5zm0 4a1 1 0 100 2h4a1 1 0 100-2H5z" />
  </svg>
);

export default TaskListIcon;