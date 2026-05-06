"use client";

import React from 'react';
import { Handle, Position, useReactFlow } from '@xyflow/react';
import { Settings } from 'lucide-react';

interface NodeData {
  label: string;
  service?: string;
  template?: string;
}

export default function ActionNode({ id, data }: { id: string, data: NodeData }) {
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
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-blue-500/50 min-w-[220px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-blue-500 border-2 border-slate-900" 
      />
      
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Settings className="w-5 h-5 text-blue-500" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] uppercase tracking-wider font-bold text-blue-500/70">Action</p>
          <input
            className="nodrag bg-transparent text-sm font-bold text-white border-none p-0 focus:ring-0 w-full"
            value={data.label}
            onChange={(e) => updateData({ label: e.target.value })}
            placeholder="Label (e.g. Send Email)"
          />
        </div>
      </div>

      <div className="space-y-2 mb-1">
        <select
          className="nodrag bg-slate-800 text-[11px] text-white rounded px-2 py-1 border-none focus:ring-1 focus:ring-blue-500 w-full"
          value={data.service || 'email'}
          onChange={(e) => updateData({ service: e.target.value })}
        >
          <option value="email">Email Service</option>
          <option value="slack">Slack Notification</option>
          <option value="webhook">Webhook</option>
        </select>
        <input
          className="nodrag bg-slate-800 text-[11px] text-white rounded px-2 py-1 border-none focus:ring-1 focus:ring-blue-500 w-full"
          value={data.template || ''}
          onChange={(e) => updateData({ template: e.target.value })}
          placeholder="Template / URL"
        />
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-blue-500 border-2 border-slate-900" 
      />
    </div>
  );
}
