import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SaveIcon from './icons/SaveIcon';
import RestartIcon from './icons/RestartIcon';
import CommandIcon from './icons/CommandIcon';
import XIcon from './icons/XIcon';
import StellarCartographyIcon from './icons/StellarCartographyIcon';
import CaptainsLogIcon from './icons/CaptainsLogIcon';
import NavComputerIcon from './icons/NavComputerIcon';

interface Command {
  id: string;
  type: 'template' | 'action';
  title: string;
  prompt?: string;
  icon: React.ReactElement;
  action?: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (prompt: string) => void;
  onLoadPlan: () => void;
  onNewMission: () => void;
  hasSavedPlan: boolean;
}

const CommandPalette: React.FC<CommandPaletteProps> = ({ isOpen, onClose, onSelectTemplate, onLoadPlan, onNewMission, hasSavedPlan }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const commands: Command[] = useMemo(() => {
    const templates = [
      { title: "Stellar Cartography", prompt: "Conduct a comprehensive analysis of the Kepler-186 system, identifying key planetary characteristics, potential for habitability, and routes for exploration.", icon: <StellarCartographyIcon /> },
      { title: "Captain's Log", prompt: "Write a 1000-word Captain's Log entry detailing the discovery of a new sentient species on planet LV-426, focusing on first contact protocols and cultural observations.", icon: <CaptainsLogIcon /> },
      { title: "Nav-Computer Module", prompt: "Generate a responsive React component for a starship's navigation console, displaying orbital trajectories and warp jump calculations. Use a futuristic UI design.", icon: <NavComputerIcon /> },
    ];
    
    const baseCommands: Command[] = [
      { id: 'new-mission', type: 'action', title: 'Start New Mission', icon: <RestartIcon className="h-5 w-5"/>, action: onNewMission },
      // FIX: Add 'as const' to ensure the 'type' property is inferred as a literal type, satisfying the 'Command' interface.
      ...(hasSavedPlan ? [{ id: 'load-plan', type: 'action' as const, title: 'Load Saved Mission', icon: <SaveIcon className="h-5 w-5"/>, action: onLoadPlan }] : []),
    ];

    const templateCommands: Command[] = templates.map(t => ({
      id: t.title.toLowerCase().replace(/\s/g, '-'),
      type: 'template',
      title: `Template: ${t.title}`,
      prompt: t.prompt,
      icon: React.cloneElement(t.icon, { className: 'h-5 w-5' })
    }));

    return [...baseCommands, ...templateCommands];
  }, [hasSavedPlan, onLoadPlan, onNewMission]);


  const filteredCommands = useMemo(() => {
    if (!query) return commands;
    return commands.filter(cmd => cmd.title.toLowerCase().includes(query.toLowerCase()));
  }, [commands, query]);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [filteredCommands]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isOpen) return;

    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : filteredCommands.length - 1));
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filteredCommands.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const command = filteredCommands[selectedIndex];
      if (command) {
        if (command.type === 'template' && command.prompt) {
          onSelectTemplate(command.prompt);
        } else if (command.type === 'action' && command.action) {
          command.action();
        }
        onClose();
      }
    }
  }, [isOpen, filteredCommands, selectedIndex, onClose, onSelectTemplate]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-start justify-center pt-20" onClick={onClose}>
      <div className="w-full max-w-xl bg-surface holographic-border rounded-lg shadow-2xl animate-fadeIn" style={{ animationDuration: '0.2s' }} onClick={e => e.stopPropagation()}>
        <div className="p-3 border-b border-border/50 flex items-center gap-3">
          <CommandIcon className="h-5 w-5 text-secondary"/>
          <input
            type="text"
            placeholder="Type a command or search..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="w-full bg-transparent focus:outline-none text-text-primary placeholder:text-text-secondary"
          />
           <button onClick={onClose} className="p-1 rounded-full hover:bg-surface-light" aria-label="Close command palette">
               <XIcon className="h-5 w-5 text-text-secondary"/>
           </button>
        </div>
        <ul className="p-2 max-h-[400px] overflow-y-auto">
          {filteredCommands.length > 0 ? filteredCommands.map((cmd, index) => (
            <li
              key={cmd.id}
              onClick={() => {
                if (cmd.type === 'template' && cmd.prompt) onSelectTemplate(cmd.prompt);
                else if (cmd.type === 'action' && cmd.action) cmd.action();
                onClose();
              }}
              className={`flex items-center gap-4 p-3 rounded-md cursor-pointer transition-colors ${selectedIndex === index ? 'bg-primary/20 text-primary' : 'hover:bg-surface-light'}`}
              onMouseEnter={() => setSelectedIndex(index)}
            >
              <div className={selectedIndex === index ? 'text-primary' : 'text-secondary'}>{cmd.icon}</div>
              <span className="font-sans font-medium">{cmd.title}</span>
            </li>
          )) : (
            <li className="text-center p-4 text-text-secondary font-sans">No commands found.</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;