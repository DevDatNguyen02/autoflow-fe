"use client";

import React from "react";
import FlowCanvas from "@/components/automation/FlowCanvas";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function AutomationBuilderPage() {
  return (
    <div className="flex flex-col h-full w-full overflow-hidden">
      {/* Main Canvas Area */}
      <div className="flex-1 relative">
        <FlowCanvas />
      </div>
    </div>
  );
}
