import React from 'react';

interface SidebarToggleIconProps {
  isCollapsed: boolean;
  className?: string;
}

const SidebarToggleIcon: React.FC<SidebarToggleIconProps> = ({ isCollapsed, className = "h-6 w-6 text-text-secondary" }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2}
    >
      <g className="transition-transform duration-300 ease-in-out" style={{ transformOrigin: 'center' }}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 6h16"
          className="transition-all duration-300 ease-in-out"
          style={{
            transform: isCollapsed ? 'translateY(5px) rotate(15deg)' : 'translateY(0) rotate(0)',
          }}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 12h16"
          className="transition-all duration-300 ease-in-out"
          style={{ opacity: isCollapsed ? 0 : 1 }}
        />
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M4 18h16"
          className="transition-all duration-300 ease-in-out"
          style={{
            transform: isCollapsed ? 'translateY(-5px) rotate(-15deg)' : 'translateY(0) rotate(0)',
          }}
        />
      </g>
    </svg>
  );
};

export default SidebarToggleIcon;