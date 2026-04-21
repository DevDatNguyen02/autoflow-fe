"use client";

import React from 'react';
import { Handle, Position } from '@xyflow/react';
import { Zap } from 'lucide-react';

interface NodeData {
  label: string;
}

export default function TriggerNode({ data }: { data: NodeData }) {
  return (
    <div className="px-4 py-3 shadow-xl rounded-xl bg-slate-900 border-2 border-orange-500/50 min-w-[200px]">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-orange-500/20 rounded-lg">
          <Zap className="w-5 h-5 text-orange-500" />
        </div>
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-orange-500/70">Trigger</p>
          <h4 className="text-sm font-bold text-white">{data.label || 'On Event'}</h4>
        </div>
      </div>
      
      <Handle 
        type="source" 
        position={Position.Bottom} 
        className="w-3 h-3 bg-orange-500 border-2 border-slate-900" 
      />
    </div>
  );
}
