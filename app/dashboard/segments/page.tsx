"use client";

import React, { useEffect, useState } from "react";
import { 
  Layers, 
  Plus, 
  Trash2, 
  Search, 
  Filter, 
  ChevronRight,
  Target,
  BarChart3,
  CheckCircle2
} from "lucide-react";
import { cn } from "@/lib/utils";

export default function SegmentsPage() {
  const [segments, setSegments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [eventNames, setEventNames] = useState<string[]>([]);
  const [criteria, setCriteria] = useState<{ event_name: string; min_occurrences: number }[]>([
    { event_name: "", min_occurrences: 1 }
  ]);
  const [segmentName, setSegmentName] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    fetch('/api/v1/segments')
      .then(res => res.json())
      .then(json => {
        setSegments(json.data || []);
        setLoading(false);
      });

    // Fetch unique event names for builder
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
    fetch(`${apiUrl}/api/v1/track/event-names`)
      .then(res => res.json())
      .then(json => setEventNames(json.data || []));
  }, []);

  const addCriteria = () => {
    setCriteria([...criteria, { event_name: "", min_occurrences: 1 }]);
  };

  const updateCriteria = (index: number, field: string, value: any) => {
    const newCriteria = [...criteria];
    newCriteria[index] = { ...newCriteria[index], [field]: value };
    setCriteria(newCriteria);
  };

  const removeCriteria = (index: number) => {
    if (criteria.length > 1) {
      setCriteria(criteria.filter((_, i) => i !== index));
    }
  };

  const handleSaveSegment = async () => {
    if (!segmentName.trim()) return alert("Please enter a segment name");
    
    setIsSaving(true);
    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
      const res = await fetch(`${apiUrl}/api/v1/segments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: segmentName,
          description: `Segment based on ${criteria.length} criteria`,
          conditions: criteria,
          match_type: 'AND'
        })
      });

      if (res.ok) {
        setShowModal(false);
        setSegmentName("");
        setCriteria([{ event_name: "", min_occurrences: 1 }]);
        // Refresh list
        const listRes = await fetch('/api/v1/segments');
        const listJson = await listRes.json();
        setSegments(listJson.data || []);
      }
    } catch (err) {
      console.error("Save failed:", err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
             <Layers className="w-8 h-8 text-blue-500" />
             Customer Segments
          </h1>
          <p className="text-slate-500 mt-1">Group your customers based on behavioral and profile criteria.</p>
        </div>
        <button 
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-5 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-semibold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-5 h-5" />
          <span>New Segment</span>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: "Active Segments", value: segments.length, icon: Layers, color: "text-blue-400" },
          { label: "Targeted Customers", value: "2.4k", icon: Target, color: "text-purple-400" },
          { label: "Avg. Engagement", value: "68%", icon: BarChart3, color: "text-green-400" },
        ].map((stat, i) => (
          <div key={i} className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-6 rounded-3xl flex items-center gap-4">
            <div className={cn("p-3 rounded-2xl bg-opacity-10", stat.color.replace('text', 'bg'))}>
              <stat.icon className={cn("w-6 h-6", stat.color)} />
            </div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{stat.label}</p>
              <p className="text-2xl font-bold text-white">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Segments Table */}
      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between gap-4 bg-slate-900/30">
          <div className="flex-1 max-w-md relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search segments..." 
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2">
             <button className="p-2 hover:bg-slate-800 rounded-lg text-slate-400 transition-colors">
               <Filter className="w-5 h-5" />
             </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-800/50 text-[10px] text-slate-500 uppercase font-bold tracking-widest">
                <th className="px-8 py-4">Segment Name</th>
                <th className="px-8 py-4">Criteria Summary</th>
                <th className="px-8 py-4">Created At</th>
                <th className="px-8 py-4">Status</th>
                <th className="px-8 py-4"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {segments.map((s) => (
                <tr key={s.id} className="group hover:bg-white/5 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                       <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 font-bold group-hover:scale-110 transition-transform">
                         {s.name[0].toUpperCase()}
                       </div>
                       <div>
                         <p className="text-sm font-bold text-white leading-none mb-1">{s.name}</p>
                         <p className="text-xs text-slate-500 line-clamp-1">{s.description || "No description provided."}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex flex-wrap gap-2">
                       {/* Mock criteria display */}
                       <span className="px-2 py-1 bg-slate-800 border border-slate-700 rounded-md text-[10px] text-slate-400 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-blue-500" />
                          View Pricing ≥ 1
                       </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-xs text-slate-500 tabular-nums">
                    {new Date(s.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-8 py-6">
                    <span className="px-2 py-1 bg-green-500/10 text-green-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-green-500/20">
                      Live
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-blue-500/10 hover:text-blue-400 text-slate-500 rounded-lg transition-all active:scale-90">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}

              {segments.length === 0 && !loading && (
                <tr>
                  <td colSpan={5} className="py-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-slate-800/30 rounded-3xl mx-auto flex items-center justify-center mb-6">
                      <Filter className="w-10 h-10 text-slate-600" />
                    </div>
                    <p className="text-slate-500">No segments created yet.</p>
                    <button 
                      onClick={() => setShowModal(true)}
                      className="text-blue-500 hover:underline text-sm font-semibold"
                    >
                      Build your first segment →
                    </button>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Placeholder (Simplified for logic) */}
      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-2xl w-full relative z-10 shadow-2xl animate-in zoom-in-95 duration-200 maxHeight-[90vh] overflow-y-auto">
             <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
               <Layers className="w-6 h-6 text-blue-500" />
               Create New Segment
             </h2>
             <div className="space-y-6">
                <div>
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 block">Segment Name</label>
                  <input 
                    type="text" 
                    value={segmentName}
                    onChange={(e) => setSegmentName(e.target.value)}
                    className="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors" 
                    placeholder="e.g. VIP Customers" 
                  />
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block">Conditions (AND)</label>
                    <button 
                      onClick={addCriteria}
                      className="text-[10px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1 uppercase tracking-tighter"
                    >
                      <Plus className="w-3 h-3" /> Add Rule
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {criteria.map((c, i) => (
                      <div key={i} className="flex items-center gap-3 animate-in slide-in-from-left-2 duration-200">
                        <div className="flex-1 grid grid-cols-2 gap-3">
                          <select 
                            value={c.event_name}
                            onChange={(e) => updateCriteria(i, 'event_name', e.target.value)}
                            className="bg-slate-800 border border-slate-700 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500"
                          >
                            <option value="">Select event...</option>
                            {eventNames.map(name => (
                              <option key={name} value={name}>{name}</option>
                            ))}
                          </select>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-slate-500">Min:</span>
                            <input 
                              type="number"
                              min="1"
                              value={c.min_occurrences}
                              onChange={(e) => updateCriteria(i, 'min_occurrences', parseInt(e.target.value) || 1)}
                              className="w-full bg-slate-800 border border-slate-700 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                            />
                          </div>
                        </div>
                        <button 
                          onClick={() => removeCriteria(i)}
                          className={cn(
                            "p-2 text-slate-500 hover:text-red-400 transition-colors",
                            criteria.length === 1 && "opacity-0 pointer-events-none"
                          )}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-4 bg-blue-500/5 border border-blue-500/10 rounded-2xl flex items-center justify-between">
                   <div className="flex items-center gap-2 text-slate-400 text-xs">
                      <Target className="w-4 h-4 text-blue-500" />
                      <span>Live reach prediction</span>
                   </div>
                   <div className="text-sm font-bold text-white">... people</div>
                </div>
             </div>
             <div className="mt-10 flex justify-end gap-3 pt-6 border-t border-slate-800">
               <button 
                 onClick={() => setShowModal(false)} 
                 className="px-6 py-2.5 text-slate-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
               <button 
                 onClick={handleSaveSegment}
                 disabled={isSaving}
                 className="px-8 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold shadow-lg shadow-blue-600/20 active:scale-95 disabled:opacity-50 disabled:pointer-events-none transition-all flex items-center gap-2"
                >
                  {isSaving ? "Saving..." : "Create Segment"}
                </button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}
