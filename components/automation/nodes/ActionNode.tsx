"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Settings } from 'lucide-react';

export default function ActionNode({ data }: any) {
  return (
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-blue-500/50 min-w-[200px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-blue-500 border-2 border-slate-900" 
      />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-blue-500/20 rounded-lg">
          <Settings className="w-5 h-5 text-blue-500" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-blue-500/70">Action</p>
          <h4 className="text-sm font-bold text-white">{data.label || 'Do Something'}</h4>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-blue-500 border-2 border-slate-900" 
      />
    </div>
  );
}
