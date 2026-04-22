"use client";

import React, { useEffect, useState } from "react";
import { 
  Users, 
  MousePointer2, 
  Workflow, 
  TrendingUp, 
  Activity,
  Calendar,
  LayoutDashboard
} from "lucide-react";
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";

interface DashboardStats {
  totalUsers: number;
  totalEvents: number;
  activeFlows: number;
  timeSeries: Array<{
    date: string;
    count: number;
  }>;
}

import { Skeleton } from "@/components/ui/Skeleton";

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    async function fetchStats() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/dashboard/overview`);
        const data = await res.json();
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (!isMounted) return null;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] p-8">
        <div className="flex justify-between mb-10">
          <div className="space-y-3">
            <Skeleton className="h-10 w-64" />
            <Skeleton className="h-5 w-48" />
          </div>
          <Skeleton className="h-10 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
          <Skeleton className="h-32 w-full rounded-2xl" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-2xl" />
      </div>
    );
  }

  const statItems = [
    {
      title: "Total Users",
      value: stats?.totalUsers || 0,
      icon: Users,
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      title: "Tracking Events",
      value: stats?.totalEvents || 0,
      icon: MousePointer2,
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
    {
      title: "Active Flows",
      value: stats?.activeFlows || 0,
      icon: Workflow,
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-slate-200 p-8 font-[family-name:var(--font-geist-sans)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent flex items-center gap-3">
            <LayoutDashboard className="w-8 h-8 text-blue-500" />
            Dashboard Overview
          </h1>
          <p className="text-slate-400 mt-2">Welcome back to AutoFlow. Here&apos;s what&apos;s happening today.</p>
        </div>
        <div className="flex items-center gap-4 bg-slate-800/50 p-2 rounded-lg border border-slate-700/50 backdrop-blur-sm">
          <Calendar className="w-5 h-5 text-slate-400" />
          <span className="text-sm font-medium">{new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {statItems.map((item, idx) => (
          <div 
            key={idx}
            className={`p-6 rounded-2xl border ${item.border} ${item.bg} backdrop-blur-md hover:scale-[1.02] transition-all duration-300 group`}
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-slate-400 text-sm font-medium mb-1">{item.title}</p>
                <h3 className="text-3xl font-bold text-white group-hover:text-blue-400 transition-colors">
                  {item.value.toLocaleString()}
                </h3>
              </div>
              <div className={`p-3 rounded-xl ${item.bg} ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-xs font-medium text-slate-500">
              <TrendingUp className="w-3 h-3 text-emerald-500" />
              <span className="text-emerald-500">+12%</span> vs last month
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6 backdrop-blur-md">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-xl font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-blue-500" />
              Event Traffic
            </h2>
            <p className="text-sm text-slate-400">Tracking activity for the last 7 days</p>
          </div>
          <div className="flex gap-2">
            {['7d', '30d', '90d'].map((range) => (
              <button 
                key={range}
                className={`px-3 py-1 rounded-md text-xs font-semibold transition-colors ${range === '7d' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:bg-slate-800'}`}
              >
                {range}
              </button>
            ))}
          </div>
        </div>

        <div className="h-[400px] w-full min-h-[400px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={Array.isArray(stats?.timeSeries) ? stats.timeSeries : []}>
              <defs>
                <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis 
                dataKey="date" 
                stroke="#64748b" 
                fontSize={12}
                tickFormatter={(val) => new Date(val).toLocaleDateString('en-US', { weekday: 'short' })}
              />
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <YAxis stroke="#64748b" fontSize={12} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff' }}
                itemStyle={{ color: '#60a5fa' }}
              />
              <Area 
                type="monotone" 
                dataKey="count" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorCount)" 
                animationDuration={1500}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Footer Info */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-purple-700 p-6 rounded-2xl text-white relative overflow-hidden group">
          <div className="relative z-10">
            <h3 className="text-lg font-bold mb-2">Build your first Flow</h3>
            <p className="text-blue-100 text-sm mb-4 max-w-[250px]">Automation helps you convert customers while you sleep. Try Xyflow today.</p>
            <button className="bg-white text-blue-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-50 transition-colors">
              Go to Builder
            </button>
          </div>
          <Workflow className="absolute -bottom-4 -right-4 w-32 h-32 text-white/10 group-hover:rotate-12 transition-transform duration-500" />
        </div>
        
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl flex items-center justify-between group">
          <div>
            <h3 className="text-lg font-bold text-white mb-1">Knowledge Hub</h3>
            <p className="text-slate-400 text-sm">Train your AI Chatbot with new docs</p>
          </div>
          <div className="p-4 bg-slate-800 rounded-xl group-hover:bg-blue-500/20 transition-colors">
            <LayoutDashboard className="w-6 h-6 text-blue-400" />
          </div>
        </div>
      </div>
    </div>
  );
}
