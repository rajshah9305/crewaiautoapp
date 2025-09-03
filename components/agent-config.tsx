import React from 'react';
import ResearchIcon from './icons/ResearchIcon';
import ContentIcon from './icons/ContentIcon';
import WriteIcon from './icons/WriteIcon';
import CodeIcon from './icons/CodeIcon';
import ReviewIcon from './icons/ReviewIcon';
import CogIcon from './icons/CogIcon';
import UserIcon from './icons/UserIcon';

// A mapping from agent role names to their corresponding icon components.
export const AGENT_AVATARS: { [key:string]: React.FC<{ className?: string }> } = {
  "Research Agent": ResearchIcon,
  "Content Strategist": ContentIcon,
  "Technical Writer": WriteIcon,
  "Code Generator": CodeIcon,
  "Reviewer Agent": ReviewIcon,
  "System": CogIcon,
  "User": UserIcon,
};
