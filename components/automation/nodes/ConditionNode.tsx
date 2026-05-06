"use client";

import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

interface NodeData {
  label: string;
  field?: string;
  operator?: string;
  value?: string;
}

export default function ConditionNode({ id, data }: { id: string, data: NodeData }) {
  const { setNodes } = useReactFlow();

  const updateData = (updates: Partial<NodeData>) => {
    setNodes((nds) =>
      nds.map((node) => {
        if (node.id === id) {
          return {
            ...node,
            data: {
              ...node.data,
              ...updates,
            },
          };
        }
        return node;
      })
    );
  };

  return (
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-purple-500/50 min-w-[280px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-purple-500 border-2 border-slate-900" 
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <GitBranch className="w-5 h-5 text-purple-500" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-purple-500/70">Condition</p>
          <input
            className="nodrag bg-transparent text-sm font-bold text-white border-none p-0 focus:ring-0 w-full"
            value={data.label}
            onChange={(e) => updateData({ label: e.target.value })}
            placeholder="Label (e.g. Check City)"
          />
        </div>
      </div>

      <div className="space-y-2 mb-2">
        <div className="grid grid-cols-2 gap-2">
          <input
            className="nodrag bg-slate-800 text-[11px] text-white rounded px-2 py-1 border-none focus:ring-1 focus:ring-purple-500"
            value={data.field || ''}
            onChange={(e) => updateData({ field: e.target.value })}
            placeholder="Field (e.g. city)"
          />
          <select
            className="nodrag bg-slate-800 text-[11px] text-white rounded px-2 py-1 border-none focus:ring-1 focus:ring-purple-500"
            value={data.operator || 'equals'}
            onChange={(e) => updateData({ operator: e.target.value })}
          >
            <option value="equals">Equals</option>
            <option value="contains">Contains</option>
            <option value="exists">Exists</option>
          </select>
        </div>
        <input
          className="nodrag bg-slate-800 text-[11px] text-white rounded px-2 py-1 border-none focus:ring-1 focus:ring-purple-500 w-full"
          value={data.value || ''}
          onChange={(e) => updateData({ value: e.target.value })}
          placeholder="Value (e.g. Hanoi)"
        />
      </div>
      
      <div className="flex justify-between mt-4 px-2">
        <div className="text-[10px] font-bold text-emerald-500">YES</div>
        <div className="text-[10px] font-bold text-rose-500">NO</div>
      </div>

      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="yes"
        style={{ left: '30%' }}
        className="w-3 h-3 bg-emerald-500 border-2 border-slate-900" 
      />
      <Handle 
        type="source" 
        position={Position.Bottom} 
        id="no"
        style={{ left: '70%' }}
        className="w-3 h-3 bg-rose-500 border-2 border-slate-900" 
      />
    </div>
  );
}
