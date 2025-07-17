import React, { useEffect, useState, useMemo, useCallback } from 'react';
import {
  ReactFlow,
  Node,
  Edge,
  addEdge,
  Connection,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  MiniMap,
  Position,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { HierarchyUser } from '@/types/hierarchy';
import { getAllUsers, buildHierarchyTree } from '@/lib/hierarchyService';
import { Users, Crown, Star } from 'lucide-react';

interface HierarchyNodeData extends Record<string, unknown> {
  user: HierarchyUser;
  level: number;
}

const HierarchyNode = ({ data }: { data: HierarchyNodeData }) => {
  const { user, level } = data;
  
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin':
        return <Crown className="h-4 w-4 text-yellow-500" />;
      case 'supervisor':
        return <Star className="h-4 w-4 text-blue-500" />;
      default:
        return <Users className="h-4 w-4 text-gray-500" />;
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin':
        return 'bg-yellow-100 border-yellow-300';
      case 'supervisor':
        return 'bg-blue-100 border-blue-300';
      default:
        return 'bg-gray-100 border-gray-300';
    }
  };

  return (
    <Card className={`p-4 min-w-[200px] ${getRoleColor(user.role)} shadow-md hover:shadow-lg transition-shadow`}>
      <div className="flex items-center space-x-3">
        <Avatar className="h-10 w-10">
          <AvatarImage src={user.avatar} />
          <AvatarFallback>
            {user.name.split(' ').map(n => n[0]).join('').toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2">
            {getRoleIcon(user.role)}
            <h3 className="font-semibold text-sm truncate">{user.name}</h3>
          </div>
          <p className="text-xs text-gray-600 truncate">{user.position}</p>
          <p className="text-xs text-gray-500">{user.department}</p>
          <Badge variant="outline" className="text-xs mt-1">
            {user.role === 'admin' ? 'Administrateur' : 
             user.role === 'supervisor' ? 'Superviseur' : 'Utilisateur'}
          </Badge>
        </div>
      </div>
    </Card>
  );
};

const nodeTypes = {
  hierarchyNode: HierarchyNode,
};

const HierarchyVisualization = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  useEffect(() => {
    const users = getAllUsers();
    const hierarchyTree = buildHierarchyTree(users);
    
    const { nodes: hierarchyNodes, edges: hierarchyEdges } = buildFlowData(hierarchyTree);
    setNodes(hierarchyNodes);
    setEdges(hierarchyEdges);
  }, [setNodes, setEdges]);

  const buildFlowData = (tree: HierarchyUser[], level = 0, parentX = 0): { nodes: Node[], edges: Edge[] } => {
    const nodes: Node[] = [];
    const edges: Edge[] = [];
    const nodeWidth = 220;
    const nodeHeight = 120;
    const horizontalSpacing = 280;
    const verticalSpacing = 160;

    tree.forEach((user, index) => {
      const x = parentX + (index - (tree.length - 1) / 2) * horizontalSpacing;
      const y = level * verticalSpacing;

      const node: Node = {
        id: user.id,
        type: 'hierarchyNode',
        position: { x, y },
        data: { user, level },
        sourcePosition: Position.Bottom,
        targetPosition: Position.Top,
      };

      nodes.push(node);

      if (user.subordinates && user.subordinates.length > 0) {
        const childrenData = buildFlowData(user.subordinates, level + 1, x);
        nodes.push(...childrenData.nodes);
        edges.push(...childrenData.edges);

        // Créer les arêtes entre ce nœud et ses enfants
        user.subordinates.forEach(child => {
          edges.push({
            id: `${user.id}-${child.id}`,
            source: user.id,
            target: child.id,
            type: 'smoothstep',
            style: { stroke: '#6366f1', strokeWidth: 2 },
            animated: false,
          });
        });
      }
    });

    return { nodes, edges };
  };

  const getNodeColor = (node: Node) => {
    const nodeData = node.data as HierarchyNodeData;
    if (nodeData?.user?.role) {
      switch (nodeData.user.role) {
        case 'admin': return '#fbbf24';
        case 'supervisor': return '#3b82f6';
        default: return '#6b7280';
      }
    }
    return '#6b7280';
  };

  return (
    <div className="w-full h-[600px] border rounded-lg">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        attributionPosition="bottom-left"
      >
        <Controls />
        <MiniMap 
          nodeColor={getNodeColor}
        />
        <Background gap={12} size={1} />
      </ReactFlow>
    </div>
  );
};

export default HierarchyVisualization;
