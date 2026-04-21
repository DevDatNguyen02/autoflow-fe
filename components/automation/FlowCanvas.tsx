import React, { useCallback, useState, useEffect } from 'react';
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
import { Save, Plus, Play, ToggleLeft, ToggleRight, X } from 'lucide-react';

const nodeTypes = {
  trigger: TriggerNode,
  action: ActionNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: '1',
    type: 'trigger',
    position: { x: 100, y: 100 },
    data: { label: 'Page View Event' },
  },
];

const initialEdges: Edge[] = [];

export default function FlowCanvas() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowName, setFlowName] = useState('My New Automation');
  const [status, setStatus] = useState<'draft' | 'active'>('draft');
  const [executionTrace, setExecutionTrace] = useState<string[]>([]);
  const [isTestPanelOpen, setIsTestPanelOpen] = useState(false);
  const [mockPayload, setMockPayload] = useState('{\n  "city": "Hanoi",\n  "plan": "premium"\n}');

  // Hiệu ứng highlight node khi có trace
  useEffect(() => {
    if (executionTrace.length > 0) {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: {
            ...node.style,
            border: executionTrace.includes(node.id) 
              ? '2px solid #fbbf24' 
              : '1px solid transparent',
            boxShadow: executionTrace.includes(node.id) 
              ? '0 0 15px #fbbf24' 
              : 'none',
          },
        }))
      );
    } else {
      setNodes((nds) =>
        nds.map((node) => ({
          ...node,
          style: { ...node.style, border: 'none', boxShadow: 'none' },
        }))
      );
    }
  }, [executionTrace, setNodes]);

  const onConnect = useCallback(
    (params: Connection) => setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#3b82f6' } }, eds)),
    [setEdges]
  );

  const addNode = (type: 'action' | 'condition') => {
    const id = `node_${Date.now()}`;
    const newNode: Node = {
      id,
      type,
      position: { x: 300, y: 200 },
      data: { label: type === 'action' ? 'New Action' : 'New Condition' },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const onSave = async () => {
    const flowData = {
      name: flowName,
      graph: { nodes, edges },
      status: status,
    };

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/automation/workflows`, {
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

  const onRunTest = async () => {
    try {
      let payload = {};
      try {
        payload = JSON.parse(mockPayload);
      } catch (e) {
        alert('Invalid JSON in mock payload');
        return;
      }

      // Giả sử ta đang làm việc với flow hiện tại có ID cụ thể
      // Ở đây ta post thẳng data vì có thể flow chưa được save
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const response = await fetch(`${apiUrl}/automation/workflows/test-current`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ graph: { nodes, edges }, payload }),
      });

      if (response.ok) {
        const result = await response.json();
        setExecutionTrace(result.trace);
      } else {
        alert('Test execution failed.');
      }
    } catch (error) {
      console.error('Test error:', error);
      alert('Connection error during test.');
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
          <div className="flex items-center gap-2 bg-slate-800 rounded-full px-3 py-1 border border-slate-700">
             <span className={`text-[10px] font-bold uppercase tracking-wider ${status === 'active' ? 'text-green-400' : 'text-slate-500'}`}>
               {status}
             </span>
             <button onClick={() => setStatus(status === 'active' ? 'draft' : 'active')}>
               {status === 'active' ? (
                 <ToggleRight className="w-5 h-5 text-blue-500" />
               ) : (
                 <ToggleLeft className="w-5 h-5 text-slate-600" />
               )}
             </button>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsTestPanelOpen(!isTestPanelOpen)}
            className={`flex items-center gap-2 px-4 py-2 ${isTestPanelOpen ? 'bg-amber-600' : 'bg-slate-800'} hover:opacity-90 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700`}
          >
            <Play className="w-4 h-4 text-amber-400 fill-amber-400" /> 
            {isTestPanelOpen ? 'Close Test' : 'Simulate'}
          </button>
          <button 
            onClick={() => addNode('action')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Action
          </button>
          <button 
            onClick={() => addNode('condition')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white text-sm font-medium rounded-lg transition-colors border border-slate-700"
          >
            <Plus className="w-4 h-4" /> Condition
          </button>
          <div className="w-px h-6 bg-slate-700 mx-2" />
          <button 
            onClick={onSave}
            className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold rounded-lg transition-all shadow-lg shadow-blue-500/20"
          >
            <Save className="w-4 h-4" /> Save
          </button>
        </div>
      </div>

      {/* Main Area */}
      <div className="flex-1 flex w-full bg-slate-950 relative overflow-hidden">
        {/* ReactFlow Canvas */}
        <div className="flex-1 relative">
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
              className="bg-slate-900 border border-slate-800 rounded-lg overflow-hidden outline-none" 
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

        {/* Test Panel (Side Sheet) */}
        {isTestPanelOpen && (
          <div className="w-80 bg-slate-900 border-l border-slate-800 flex flex-col z-20 shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="p-4 border-b border-slate-800 flex justify-between items-center">
               <h3 className="text-white font-bold text-sm">Sandbox Mode</h3>
               <button onClick={() => setIsTestPanelOpen(false)}><X className="w-4 h-4 text-slate-400" /></button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
               <p className="text-slate-400 text-xs mb-3 font-medium uppercase tracking-tight">Mock Event Data (JSON)</p>
               <textarea 
                  value={mockPayload}
                  onChange={(e) => setMockPayload(e.target.value)}
                  className="w-full h-48 bg-slate-950 text-emerald-400 font-mono text-xs p-3 rounded border border-slate-800 focus:ring-1 focus:ring-blue-500 transition-all outline-none"
               />
               <button 
                 onClick={onRunTest}
                 className="w-full mt-4 bg-amber-600 hover:bg-amber-500 text-white font-bold py-2 rounded text-sm transition-colors shadow-lg shadow-amber-900/20"
               >
                 Run Simulation
               </button>

               {executionTrace.length > 0 && (
                 <div className="mt-6">
                    <p className="text-slate-400 text-xs mb-2 font-medium uppercase">Execution Trace</p>
                    <div className="space-y-2">
                       {executionTrace.map((id, index) => (
                         <div key={index} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-800/50 p-2 rounded border border-slate-800">
                            <span className="w-4 h-4 flex items-center justify-center bg-slate-700 rounded-full text-[10px] text-slate-400">{index + 1}</span>
                            <span>Node ID: {id}</span>
                         </div>
                       ))}
                    </div>
                    <button 
                      onClick={() => setExecutionTrace([])}
                      className="text-xs text-slate-500 hover:text-slate-300 mt-3 transition-colors underline"
                    >
                      Clear path
                    </button>
                 </div>
               )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
