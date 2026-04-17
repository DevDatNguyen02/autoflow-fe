"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { GitBranch } from 'lucide-react';

export default function ConditionNode({ data }: any) {
  return (
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-purple-500/50 min-w-[220px]">
      <Handle 
        type="target" 
        position={Position.Top} 
        className="w-3 h-3 bg-purple-500 border-2 border-slate-900" 
      />
      
      <div className="flex items-center gap-3">
        <div className="p-2 bg-purple-500/20 rounded-lg">
          <GitBranch className="w-5 h-5 text-purple-500" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-purple-500/70">Condition</p>
          <h4 className="text-sm font-bold text-white">{data.label || 'Check Logic'}</h4>
        </div>
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
