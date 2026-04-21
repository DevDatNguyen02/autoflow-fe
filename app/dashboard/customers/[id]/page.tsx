"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { 
  User, 
  Mail, 
  Calendar, 
  MessageSquare, 
  Activity, 
  ArrowLeft,
  Search,
  ShieldCheck,
  Zap
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export default function CustomerDetailPage() {
  const params = useParams();
  const id = params.id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/v1/customers/${id}`)
      .then(res => res.json())
      .then(json => {
        setData(json.data);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/dashboard/tracking" className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <h1 className="text-3xl font-bold text-white tracking-tight">Customer 360</h1>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
          <ShieldCheck className="w-4 h-4 text-blue-400" />
          <span className="text-xs font-semibold text-blue-400 uppercase tracking-wider">Secure View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/10 blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/20 transition-colors duration-500"></div>
            
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                <User className="w-12 h-12 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white capitalize">{data.profile.name}</h2>
                <p className="text-slate-500 text-sm">{data.profile.email}</p>
              </div>
            </div>

            <div className="mt-8 space-y-4">
              <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                <Calendar className="w-5 h-5 text-blue-400" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Member Since</p>
                  <p className="text-sm text-slate-200">{new Date(data.profile.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="p-4 bg-slate-800/30 rounded-2xl border border-slate-700/50 flex items-center gap-4">
                <Search className="w-5 h-5 text-purple-400" />
                <div>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Source</p>
                  <p className="text-sm text-slate-200 capitalize">{data.profile.properties?.source || "Unknown"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified Timeline */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl p-8 shadow-2xl h-full">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-500" />
                <h3 className="text-xl font-bold text-white">Unified Timeline</h3>
              </div>
              <span className="text-xs text-slate-500">Last 50 activities</span>
            </div>

            <div className="space-y-8 relative">
              {/* Timeline Line */}
              <div className="absolute left-[19px] top-2 bottom-2 w-px bg-slate-800"></div>

              {data.timeline.map((item: any) => (
                <div key={item.id} className="relative pl-12 group">
                  {/* Indicator */}
                  <div className={cn(
                    "absolute left-0 w-10 h-10 rounded-full border-4 border-[#0f172a] z-10 flex items-center justify-center transition-transform group-hover:scale-110",
                    item.type === 'chat' ? "bg-green-500/20 text-green-400" : "bg-blue-500/20 text-blue-400"
                  )}>
                    {item.type === 'chat' ? <MessageSquare className="w-4 h-4" /> : <Zap className="w-4 h-4" />}
                  </div>

                  <div className="flex flex-col space-y-1 bg-slate-800/30 p-5 rounded-2xl border border-slate-700/50 group-hover:border-slate-600 transition-colors">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold uppercase tracking-widest text-slate-500">
                        {new Date(item.timestamp).toLocaleString()}
                      </span>
                      {item.type === 'chat' && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">AI Consult</span>
                      )}
                    </div>
                    <h4 className="text-sm font-semibold text-white">{item.label}</h4>
                    <p className="text-sm text-slate-400 leading-relaxed tabular-nums">
                      {item.content}
                    </p>
                  </div>
                </div>
              ))}

              {data.timeline.length === 0 && (
                <div className="text-center py-20 text-slate-500 italic">
                  No activity recorded for this customer yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
