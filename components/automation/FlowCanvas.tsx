"use client";

import React, { useCallback, useMemo, useState } from 'react';
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
  BackgroundVariant,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import TriggerNode from './nodes/TriggerNode';
import ActionNode from './nodes/ActionNode';
import ConditionNode from './nodes/ConditionNode';
import { Save, Plus } from 'lucide-react';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 250, y: 50 },
    data: { label: 'Page View Event' },
  },
];

const initialEdges: Edge[] = [];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('My New Automation');

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, stroke: '#3b82f6' }, eds)),
    [setEdges]
  );

  const addNode = (type: 'action' | 'condition') => {
    const id = `${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 400, y: Math.random() * 400 },
      data: { label: type === 'action' ? 'New Action' : 'New Condition' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onSave = async () => {
    const flowData = {
      name: flowName,
      graph: { nodes, edges },
    };

    try {
      const response = await fetch('http://localhost:3001/automation/workflows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowData),
      });

      if (response.ok) {
        alert('Workflow saved successfully!');
      } else {
        alert('Failed to save workflow.');
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Error saving workflow.');
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#0f172a]">
      {/* Toolbar */}
      <div className="h-16 border-b border-slate-800 bg-slate-900/80 backdrop-blur-md flex items-center justify-between px-6 z-10">
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            value={flowName} 
            onChange={(e) => setFlowName(e.target.value)}
            className="bg-transparent text-white font-bold text-lg border-none focus:ring-0 w-64"
          />
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => addNode('action')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Add Action
          </button>
          <button 
            onClick={() => addNode('condition')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Add Condition
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2" />
          <button 
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            <Save className="w-4 h-4" /> Save Script
          </button>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 w-full bg-slate-950 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Dots} gap={20} color="#1e293b" />
          <Controls className="bg-slate-900 border-slate-800 fill-white" />
          <MiniMap 
            className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden" 
            nodeColor={(node) => {
              if (node.type === 'trigger') return '#f97316';
              if (node.type === 'action') return '#3b82f6';
              if (node.type === 'condition') return '#a855f7';
              return '#eee';
            }}
            maskColor="rgba(15, 23, 42, 0.7)"
          />
        </ReactFlow>
      </div>
    </div>
  );
}
