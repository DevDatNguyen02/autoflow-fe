"use client";

import React, { useEffect, useState } from "react";
import { Users, MousePointer2, UserPlus, Fingerprint } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

interface Profile {
  id: string;
  email: string | null;
  name: string | null;
  createdAt: string;
}

export default function TrackingPage() {
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchProfiles() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
        const res = await fetch(`${apiUrl}/api/v1/track/profiles`);
        const result = await res.json();
        setProfiles(result.data || []);
      } catch (error) {
        console.error("Failed to fetch profiles:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProfiles();
  }, []);

  const filteredProfiles = profiles.filter((p) => {
    const query = searchQuery.toLowerCase();
    return (
      p.email?.toLowerCase().includes(query) ||
      p.name?.toLowerCase().includes(query) ||
      p.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="p-8">
      <div className="mb-10 text-slate-200">
        <h1 className="text-3xl font-bold text-white flex items-center gap-3">
          <Users className="w-8 h-8 text-purple-500" />
          Customer Tracking
        </h1>
        <p className="text-slate-400 mt-2">Manage customer profiles and real-time behavioral events.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <Fingerprint className="w-6 h-6 text-purple-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Identified Users</h3>
          <p className="text-2xl font-bold text-white mt-1">{loading ? "..." : profiles.length}</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md">
          <MousePointer2 className="w-6 h-6 text-blue-400 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">Events Today</h3>
          <p className="text-2xl font-bold text-white mt-1">Live</p>
        </div>
        <div className="bg-slate-900/50 border border-slate-800 p-6 rounded-2xl backdrop-blur-md text-emerald-400">
          <UserPlus className="w-6 h-6 mb-4" />
          <h3 className="text-slate-400 text-sm font-medium">New Profiles</h3>
          <p className="text-2xl font-bold text-white mt-1">Active</p>
        </div>
      </div>

      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl overflow-hidden backdrop-blur-md">
        <div className="p-6 border-b border-slate-800 flex justify-between items-center gap-4">
          <h2 className="text-lg font-semibold text-white">Recent Profiles</h2>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by Email, Name or ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl py-2 pl-10 pr-4 text-sm text-slate-200 focus:outline-none focus:border-purple-500 transition-colors"
            />
          </div>
          <button className="text-sm text-blue-400 hover:text-blue-300 font-medium">View all</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-slate-500 text-xs uppercase tracking-wider">
                <th className="px-6 py-4 font-bold">Email / Name</th>
                <th className="px-6 py-4 font-bold">ID / UUID</th>
                <th className="px-6 py-4 font-bold">Joined At</th>
                <th className="px-6 py-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {loading ? (
                Array.from({ length: 3 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-40" /></td>
                    <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                    <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-16 float-right" /></td>
                  </tr>
                ))
              ) : filteredProfiles.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-10 text-center text-slate-500">
                    No customers found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProfiles.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-800/20 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-slate-200 font-medium">{p.email || "Anonymous"}</span>
                        <span className="text-xs text-slate-500">{p.name || ""}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-400 font-mono text-xs">{p.id}</td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link 
                        href={`/dashboard/customers/${p.id}`}
                        className="text-xs bg-slate-800 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg transition-colors border border-slate-700 inline-block"
                      >
                        Details
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
