import React, { useMemo } from 'react';
import { Task, TaskStatus } from '../types';
import StellarCartographyIcon from './icons/StellarCartographyIcon';

interface MissionStarmapProps {
  tasks: Task[];
}

const statusColors: { [key in TaskStatus]: { fill: string; stroke: string; glow: string } } = {
  'pending': { fill: 'var(--surface-color)', stroke: '#8b949e', glow: '#8b949e' },
  'blocked': { fill: 'var(--bg-color)', stroke: '#484f58', glow: '#484f58' },
  'in-progress': { fill: 'var(--primary-light-color)', stroke: 'var(--primary-color)', glow: 'var(--primary-color)' },
  'completed': { fill: 'rgba(35, 134, 54, 0.1)', stroke: 'var(--success-color)', glow: 'var(--success-color)' },
  'error': { fill: 'rgba(218, 54, 51, 0.1)', stroke: 'var(--error-color)', glow: 'var(--error-color)' },
};

const MissionStarmap: React.FC<MissionStarmapProps> = ({ tasks }) => {
  const graphData = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;

    const nodes = tasks.map(task => ({ ...task, children: new Set<string>() }));
    const nodesById = new Map(nodes.map(node => [node.id, node]));
    const taskIndexMap = new Map(tasks.map((task, index) => [task.id, index + 1]));

    nodes.forEach(node => {
      node.dependencies.forEach(depId => {
        nodesById.get(depId)?.children.add(node.id);
      });
    });

    const levels: (typeof nodes[0])[][] = [];
    let currentLevelNodes = nodes.filter(n => n.dependencies.length === 0);
    const assignedNodes = new Set<string>();

    while (currentLevelNodes.length > 0 && assignedNodes.size < nodes.length) {
      levels.push(currentLevelNodes);
      currentLevelNodes.forEach(n => assignedNodes.add(n.id));
      const nextLevelNodes = new Set<(typeof nodes[0])>();
      currentLevelNodes.forEach(node => {
        node.children.forEach(childId => {
          const childNode = nodesById.get(childId);
          if (childNode && childNode.dependencies.every(depId => assignedNodes.has(depId))) {
            nextLevelNodes.add(childNode);
          }
        });
      });
      currentLevelNodes = Array.from(nextLevelNodes);
    }
    
    if (nodes.filter(node => !assignedNodes.has(node.id)).length > 0) {
        // Basic cycle detection fallback - just render remaining nodes
        levels.push(nodes.filter(node => !assignedNodes.has(node.id)));
    }

    const PADDING_X = 120;
    const PADDING_Y = 70;
    const width = (levels.length) * PADDING_X;
    const maxNodesInLevel = Math.max(1, ...levels.map(l => l.length));
    const height = maxNodesInLevel * PADDING_Y + PADDING_Y;

    const nodePositions = new Map<string, { x: number; y: number; node: typeof nodes[0], index: number | undefined }>();
    levels.forEach((levelNodes, levelIndex) => {
      const levelHeight = levelNodes.length * PADDING_Y;
      const startY = (height - levelHeight) / 2 + PADDING_Y / 2;
      levelNodes.forEach((node, nodeIndex) => {
        const x = levelIndex * PADDING_X + PADDING_X / 2;
        const y = startY + nodeIndex * PADDING_Y;
        nodePositions.set(node.id, { x, y, node, index: taskIndexMap.get(node.id) });
      });
    });

    const edges: { id: string; path: string; status: TaskStatus }[] = [];
    nodes.forEach(targetNode => {
      targetNode.dependencies.forEach(sourceId => {
        const sourcePos = nodePositions.get(sourceId);
        const targetPos = nodePositions.get(targetNode.id);
        if (sourcePos && targetPos) {
          const dx = targetPos.x - sourcePos.x;
          const path = `M${sourcePos.x},${sourcePos.y} C${sourcePos.x + dx / 2},${sourcePos.y} ${sourcePos.x + dx / 2},${targetPos.y} ${targetPos.x},${targetPos.y}`;
          edges.push({
            id: `${sourceId}-${targetNode.id}`,
            path,
            status: sourcePos.node.status
          });
        }
      });
    });

    return { nodePositions: Array.from(nodePositions.values()), edges, width, height };
  }, [tasks]);

  if (!tasks || tasks.length === 0) {
    return (
        <div className="bg-surface/80 backdrop-blur-md border border-border p-4 w-full h-full flex flex-col transition-all duration-300 shadow-lg rounded-lg animate-fadeInUp">
            <h2 className="text-xl font-semibold flex items-center gap-3 text-text-primary mb-4 pb-3 border-b border-border">
                <StellarCartographyIcon className="h-6 w-6 text-secondary"/> Mission Starmap
            </h2>
            <div className="flex-1 flex items-center justify-center text-center text-sm text-text-secondary">
                Awaiting mission plan...
            </div>
        </div>
    );
  }

  return (
    <div className="bg-surface/80 backdrop-blur-md border border-border p-4 w-full h-full flex flex-col transition-all duration-300 shadow-lg rounded-lg animate-fadeInUp">
        <h2 className="text-xl font-semibold flex items-center gap-3 text-text-primary mb-4 pb-3 border-b border-border">
            <StellarCartographyIcon className="h-6 w-6 text-secondary"/> Mission Starmap
        </h2>
        <div className="w-full h-full overflow-auto p-2 bg-background rounded-md border border-border">
            {graphData && (
                <svg width={graphData.width} height={graphData.height} className="min-w-full min-h-full">
                    <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#484f58" />
                    </marker>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge>
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                    </defs>
                    <g>
                    {graphData.edges.map(edge => (
                        <path
                        key={edge.id}
                        d={edge.path}
                        fill="none"
                        stroke={edge.status === 'completed' ? 'var(--success-color)' : '#484f58'}
                        strokeWidth="1.5"
                        markerEnd="url(#arrowhead)"
                        className="transition-all duration-300"
                        />
                    ))}
                    </g>
                    <g>
                    {graphData.nodePositions.map(({ x, y, node, index }) => {
                        const colors = statusColors[node.status] || statusColors.pending;
                        const isPulsing = node.status === 'in-progress';
                        return (
                        <g key={node.id} transform={`translate(${x}, ${y})`}>
                            <title>{`[${index}] ${node.title} - Status: ${node.status}`}</title>
                            {isPulsing && (
                                <circle r={16} fill={colors.stroke} className="animate-ping opacity-70" />
                            )}
                             <circle
                                r={16}
                                fill={colors.fill}
                                stroke={colors.stroke}
                                strokeWidth="2"
                                className="transition-all duration-300"
                                style={{ filter: isPulsing ? `url(#glow)`: 'none', boxShadow: `0 0 20px ${colors.glow}` }}
                            />
                            <text
                                textAnchor="middle"
                                dy=".3em"
                                fill="var(--text-primary-color)"
                                fontSize="12"
                                fontWeight="bold"
                                className="pointer-events-none select-none font-mono"
                            >
                            {index}
                            </text>
                        </g>
                        );
                    })}
                    </g>
                </svg>
            )}
        </div>
    </div>
  );
};

export default MissionStarmap;