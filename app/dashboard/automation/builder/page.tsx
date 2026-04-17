"use client";

import React from "react";
import FlowCanvas from "@/components/automation/FlowCanvas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AutomationBuilderPage() {
  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      {/* Mini Breadcrumb Header */}
      <div className="h-10 bg-[#0f172a] border-b border-slate-800 flex items-center px-6 gap-4">
        <Link 
          href="/dashboard" 
          className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-xs font-bold"
        >
          <ArrowLeft className="w-3 h-3" />
          Back to Dashboard
        </Link>
        <span className="text-slate-700">/</span>
        <span className="text-slate-400 text-xs font-bold uppercase tracking-widest">Automation Builder</span>
      </div>

      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <FlowCanvas />
      </div>
    </div>
  );
}
