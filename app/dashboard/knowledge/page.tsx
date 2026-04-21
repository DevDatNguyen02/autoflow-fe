"use client";

import React, { useEffect, useState } from "react";
import { BrainCircuit, BookOpen, MessageSquare, Database, Plus, FileText, AlertCircle, ThumbsUp, ThumbsDown } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface KnowledgeDocument {
  id: string;
  filename: string;
  contentType: string;
  createdAt: string;
}

interface ChatSession {
  id: string;
  anonymousId: string;
  needsAgent: number;
  createdAt: string;
}

interface FeedbackStats {
  total: number;
  likes: number;
  dislikes: number;
  dislikeRate: number;
}

export default function KnowledgePage() {
  const [activeTab, setActiveTab] = useState<"docs" | "sessions">("docs");
  const [documents, setDocuments] = useState<KnowledgeDocument[]>([]);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [stats, setStats] = useState<FeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        // Fetch Documents
        const docsRes = await fetch(`${apiUrl}/api/knowledge/documents`);
        const docsData = await docsRes.json();
        setDocuments(docsData.data || []);

        // Fetch Sessions
        const sessionsRes = await fetch(`${apiUrl}/api/knowledge/history/sessions`, { method: 'POST' });
        const sessionsData = await sessionsRes.json();
        setSessions(sessionsData || []);

        // Fetch Stats
        const statsRes = await fetch(`${apiUrl}/api/knowledge/stats/feedback`, { method: 'POST' });
        const statsData = await statsRes.json();
        setStats(statsData);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [apiUrl]);

  return (
    <div className="p-8">
      {/* Red Alert Banner */}
      {stats && stats.dislikeRate > 20 && (
        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/50 rounded-xl flex items-center gap-4 text-red-400 animate-pulse">
          <AlertCircle className="w-6 h-6 flex-shrink-0" />
          <div>
            <h4 className="font-bold">Cảnh báo chất lượng RAG thấp!</h4>
            <p className="text-sm">Tỷ lệ phản hồi tiêu cực hiện là {stats.dislikeRate.toFixed(1)}%. Vui lòng kiểm tra lại tài liệu nguồn hoặc cấu hình logic.</p>
          </div>
        </div>
      )}

      <div className="flex justify-between items-start mb-10 text-slate-200">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <BrainCircuit className="w-8 h-8 text-emerald-500" />
            AI Knowledge Hub
          </h1>
          <p className="text-slate-400 mt-2">Manage your AI&apos;s data sources and chatbot configuration.</p>
        </div>
        <button className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-900/20 font-semibold transition-all hover:scale-[1.02] active:scale-[0.98]">
          <Plus className="w-5 h-5" />
          Add Data Source
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <BookOpen className="w-6 h-6 text-emerald-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Knowledge Base</h3>
          <p className="text-2xl font-bold text-white mt-1">{loading ? "..." : documents.length} Sources</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <MessageSquare className="w-6 h-6 text-purple-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Chat Sessions</h3>
          <p className="text-2xl font-bold text-white mt-1">{loading ? "..." : sessions.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <ThumbsUp className="w-6 h-6 text-blue-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Total Likes</h3>
          <p className="text-2xl font-bold text-white mt-1">{stats ? stats.likes : 0}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <ThumbsDown className="w-6 h-6 text-red-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Total Dislikes</h3>
          <p className="text-2xl font-bold text-white mt-1">{stats ? stats.dislikes : 0}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6 border-b border-slate-800">
        <button
          onClick={() => setActiveTab("docs")}
          className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'docs' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Data Sources
          {activeTab === 'docs' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />}
        </button>
        <button
          onClick={() => setActiveTab("sessions")}
          className={`pb-4 px-2 font-medium transition-colors relative ${activeTab === 'sessions' ? 'text-emerald-500' : 'text-slate-500 hover:text-slate-300'}`}
        >
          Conversations
          {activeTab === 'sessions' && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-emerald-500" />}
        </button>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md min-h-[400px]">
        {activeTab === "docs" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-6">
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30">
                  <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              ))
            ) : documents.length === 0 ? (
              <div className="col-span-full py-10 text-center text-slate-500">
                No data sources uploaded yet.
              </div>
            ) : (
              documents.map((doc) => (
                <div key={doc.id} className="p-4 rounded-xl border border-slate-800 bg-slate-900/30 hover:bg-slate-800/40 transition-all group relative">
                  <div className="flex items-start justify-between mb-4">
                    <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
                      <FileText className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase px-2 py-1 rounded-md bg-emerald-500/10 text-emerald-400">
                      Indexed
                    </span>
                  </div>
                  <h4 className="text-slate-200 font-bold mb-1 truncate">{doc.filename}</h4>
                  <p className="text-xs text-slate-500">
                    {doc.contentType.toUpperCase()} • {new Date(doc.createdAt).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="p-0">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 text-xs uppercase font-bold border-b border-slate-800">
                  <th className="px-6 py-4">Session ID</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4">Action</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {loading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i} className="border-b border-slate-800/50">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                    </tr>
                  ))
                ) : sessions.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-6 py-10 text-center text-slate-500">No chat sessions recorded.</td>
                  </tr>
                ) : (
                  sessions.map((session) => (
                    <tr key={session.id} className="border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                      <td className="px-6 py-4 font-mono text-xs">{session.id}</td>
                      <td className="px-6 py-4">
                        {session.needsAgent === 1 ? (
                          <span className="px-2 py-1 bg-red-500/10 text-red-400 text-[10px] font-bold rounded-md border border-red-500/20">
                            NEEDS AGENT
                          </span>
                        ) : (
                          <span className="px-2 py-1 bg-slate-800 text-slate-400 text-[10px] font-bold rounded-md">
                            HANDLED
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-500">
                        {new Date(session.createdAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <button className="text-emerald-500 hover:text-emerald-400 text-sm font-medium">View Detail</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
} 
