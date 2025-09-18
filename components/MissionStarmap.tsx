import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Task, TaskStatus } from '../types';
import StellarCartographyIcon from './icons/StellarCartographyIcon';
import { AGENT_AVATARS } from './agent-config';
import DotIcon from './icons/DotIcon';

interface MissionStarmapProps {
  tasks: Task[];
}

const statusStyles: { [key in TaskStatus]: { fill: string; stroke: string; text: string; } } = {
  'pending': { fill: 'var(--surface-color)', stroke: '#8c96a5', text: 'text-text-secondary' },
  'blocked': { fill: 'var(--bg-color)', stroke: '#484f58', text: 'text-text-secondary/60' },
  'in-progress': { fill: 'var(--primary-light-color)', stroke: 'var(--primary-color)', text: 'text-primary' },
  'completed': { fill: 'rgba(51, 255, 140, 0.1)', stroke: 'var(--success-color)', text: 'text-success' },
  'error': { fill: 'rgba(255, 77, 77, 0.1)', stroke: 'var(--error-color)', text: 'text-error' },
};

const truncate = (str: string, length: number) => {
    return str.length > length ? str.substring(0, length) + '...' : str;
}


const MissionStarmap: React.FC<MissionStarmapProps> = ({ tasks }) => {
  const prevTasksRef = useRef<Map<string, TaskStatus>>(new Map());
  const [animatedNodes, setAnimatedNodes] = useState<Record<string, string>>({});

  // Effect to apply one-shot animations on status change
  useEffect(() => {
    const currentTasksMap = new Map(tasks.map(t => [t.id, t.status]));
    const newAnimations: Record<string, string> = {};

    currentTasksMap.forEach((currentStatus, taskId) => {
      const prevStatus = prevTasksRef.current.get(taskId);
      if (prevStatus) {
        if (prevStatus !== 'in-progress' && currentStatus === 'in-progress') {
          newAnimations[taskId] = 'node-activated';
        } else if (prevStatus === 'in-progress' && currentStatus === 'completed') {
          newAnimations[taskId] = 'node-completed';
        }
      }
    });

    if (Object.keys(newAnimations).length > 0) {
      setAnimatedNodes(currentAnims => ({ ...currentAnims, ...newAnimations }));

      const timer = setTimeout(() => {
        setAnimatedNodes(currentAnims => {
          const nextAnims = { ...currentAnims };
          Object.keys(newAnimations).forEach(id => delete nextAnims[id]);
          return nextAnims;
        });
      }, 1000); // Corresponds to animation duration

      return () => clearTimeout(timer);
    }
  }, [tasks]);

  // Effect to update the ref *after* render, so the above effect gets the previous state
  useEffect(() => {
    prevTasksRef.current = new Map(tasks.map(t => [t.id, t.status]));
  }, [tasks]);

  const graphData = useMemo(() => {
    if (!tasks || tasks.length === 0) return null;
    
    const NODE_WIDTH = 150;
    const NODE_HEIGHT = 55;
    const PADDING_X = NODE_WIDTH + 50;
    const PADDING_Y = NODE_HEIGHT + 40;

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
          // Adjust path to connect to the edge of the node, not the center
          const sourceEdgeX = sourcePos.x + NODE_WIDTH / 2;
          const targetEdgeX = targetPos.x - NODE_WIDTH / 2;
          const path = `M${sourceEdgeX},${sourcePos.y} C${sourceEdgeX + dx / 3},${sourcePos.y} ${targetEdgeX - dx / 3},${targetPos.y} ${targetEdgeX},${targetPos.y}`;
          edges.push({
            id: `${sourceId}-${targetNode.id}`,
            path,
            status: sourcePos.node.status
          });
        }
      });
    });

    return { nodePositions: Array.from(nodePositions.values()), edges, width, height, NODE_WIDTH, NODE_HEIGHT };
  }, [tasks]);

  return (
    <div className="bg-surface/80 backdrop-blur-sm border border-border p-4 w-full h-full flex flex-col transition-all duration-300 shadow-lg rounded-lg animate-fadeInUp">
      <h2 className="text-xl font-semibold flex items-center gap-3 text-text-primary mb-4 pb-3 border-b border-border">
          <StellarCartographyIcon className="h-6 w-6 text-secondary"/> Mission Starmap
      </h2>
      <div className="flex-1 min-h-0 w-full overflow-auto grid place-items-center bg-background rounded-md border border-border">
        {graphData ? (
          <div className="p-2">
            <svg width={graphData.width} height={graphData.height}>
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#484f58" />
                </marker>
                <marker id="arrowhead-completed" markerWidth="10" markerHeight="7" refX="8" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="var(--success-color)" />
                </marker>
                <pattern id="blocked-pattern" patternUnits="userSpaceOnUse" width="8" height="8">
                  <rect width="8" height="8" fill="var(--bg-color)" />
                  <path d="M-2,2 l4,-4 M0,8 l8,-8 M6,10 l4,-4" stroke="#484f58" strokeWidth="1" />
                </pattern>
              </defs>
              <g>
              {graphData.edges.map(edge => (
                <path
                  key={edge.id}
                  d={edge.path}
                  fill="none"
                  stroke={edge.status === 'completed' ? 'var(--success-color)' : '#484f58'}
                  strokeWidth={edge.status === 'completed' ? 2 : 1.5}
                  markerEnd={edge.status === 'completed' ? 'url(#arrowhead-completed)' : 'url(#arrowhead)'}
                  className={`transition-all duration-500 ${edge.status === 'completed' ? 'edge-flow' : ''}`}
                />
              ))}
              </g>
              <g>
              {graphData.nodePositions.map(({ x, y, node, index }) => {
                const style = statusStyles[node.status] || statusStyles.pending;
                const isPulsing = node.status === 'in-progress';
                const AgentIcon = AGENT_AVATARS[node.agent] || DotIcon;
                const animationClass = animatedNodes[node.id] || '';
                return (
                  <g key={node.id} transform={`translate(${x - graphData.NODE_WIDTH / 2}, ${y - graphData.NODE_HEIGHT / 2})`} className={`cursor-pointer group ${isPulsing ? 'node-in-progress' : ''} ${animationClass}`}>
                    <title>{`[Task ${index}] ${node.title}\n\nStatus: ${node.status.toUpperCase()}\nAgent: ${node.agent}\n\nDescription:\n${node.description}\n\nDependencies: ${node.dependencies.join(', ') || 'None'}`}</title>
                    <rect
                      width={graphData.NODE_WIDTH}
                      height={graphData.NODE_HEIGHT}
                      rx="8"
                      fill={node.status === 'blocked' ? 'url(#blocked-pattern)' : style.fill}
                      stroke={style.stroke}
                      strokeWidth="2"
                      className="transition-all duration-300 group-hover:stroke-[3px]"
                    />
                    <foreignObject x="8" y="8" width="24" height="24">
                      <div className="w-full h-full flex items-center justify-center bg-surface rounded-md border border-border/50">
                        <AgentIcon className={`h-4 w-4 ${style.text}`} />
                      </div>
                    </foreignObject>
                    <text x="40" y="19" fill="var(--text-primary-color)" fontSize="12" fontWeight="500" className="pointer-events-none select-none font-sans">
                      {truncate(node.title, 16)}
                    </text>
                    <text x="40" y="39" fill={style.stroke} fontSize="11" className="pointer-events-none select-none font-mono uppercase">
                      {`T${index} - ${node.status}`}
                    </text>
                  </g>
                );
              })}
              </g>
            </svg>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center text-center text-sm text-text-secondary">
            Awaiting mission plan...
          </div>
        )}
      </div>
    </div>
  );
};

export default MissionStarmap;