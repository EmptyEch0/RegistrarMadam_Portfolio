import { useState, useEffect, useCallback, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Users,
  Search,
  Download,
  Trash2,
  RefreshCw,
  GraduationCap,
  Gamepad2,
  Clock,
  Mail,
  UserCheck,
  CheckCircle2,
  Database,
  ExternalLink,
  Copy,
  ChevronRight,
  Filter,
} from "lucide-react";
import AdminLayout from "@/components/admin/AdminLayout";
import {
  getVisitorLogs,
  clearAllVisitorLogs,
  exportVisitorLogsToCSV,
  VisitorLog,
} from "@/lib/visitorTracking";

export default function AdminVisitors() {
  const [logs, setLogs] = useState<VisitorLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCloudSynced, setIsCloudSynced] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"all" | "course" | "puzzle">("all");
  const [showSqlModal, setShowSqlModal] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getVisitorLogs();
      setLogs(result.logs);
      setIsCloudSynced(result.isCloudSynced);
    } catch (err) {
      console.error("Failed to load visitor logs:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  // Statistics
  const stats = useMemo(() => {
    const total = logs.length;
    const uniqueEmails = new Set(logs.map((l) => l.visitor_email.toLowerCase())).size;
    const courseVisits = logs.filter((l) => l.access_type === "course").length;
    const puzzleVisits = logs.filter((l) => l.access_type === "puzzle").length;
    const lastVisit = logs.length > 0 ? logs[0].created_at : null;

    return { total, uniqueEmails, courseVisits, puzzleVisits, lastVisit };
  }, [logs]);

  // Filtered Logs
  const filteredLogs = useMemo(() => {
    return logs.filter((log) => {
      const matchesType =
        filterType === "all" ? true : log.access_type === filterType;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        log.visitor_name.toLowerCase().includes(q) ||
        log.visitor_email.toLowerCase().includes(q) ||
        log.accessed_item.toLowerCase().includes(q);

      return matchesType && matchesSearch;
    });
  }, [logs, searchQuery, filterType]);

  const handleClear = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all visitor access logs? This cannot be undone."
      )
    )
      return;

    await clearAllVisitorLogs();
    setLogs([]);
  };

  const handleExport = () => {
    exportVisitorLogsToCSV(filteredLogs.length > 0 ? filteredLogs : logs);
  };

  const formatDateTime = (isoString: string) => {
    try {
      const d = new Date(isoString);
      return d.toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
      });
    } catch {
      return isoString;
    }
  };

  const formatRelativeTime = (isoString: string) => {
    try {
      const now = Date.now();
      const diffMs = now - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      if (diffSec < 60) return "Just now";
      const diffMin = Math.floor(diffSec / 60);
      if (diffMin < 60) return `${diffMin}m ago`;
      const diffHour = Math.floor(diffMin / 60);
      if (diffHour < 24) return `${diffHour}h ago`;
      const diffDay = Math.floor(diffHour / 24);
      return `${diffDay}d ago`;
    } catch {
      return "";
    }
  };

  const sqlCode = `-- SQL definition for visitor_logs table in Supabase
create table if not exists public.visitor_logs (
  id             text primary key,
  visitor_name   text not null,
  visitor_email  text not null,
  accessed_item  text not null,
  access_type    text not null default 'course',
  created_at     timestamptz not null default now()
);

create index if not exists visitor_logs_created_at_idx
  on public.visitor_logs (created_at desc);

alter table public.visitor_logs enable row level security;

create policy "Anyone can insert visitor logs"
  on public.visitor_logs for insert to anon, authenticated with check (true);

create policy "Anyone can read visitor logs"
  on public.visitor_logs for select to anon, authenticated using (true);

grant select, insert on public.visitor_logs to anon, authenticated;`;

  const copySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  return (
    <AdminLayout>
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
      >
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-white drop-shadow">
              Visitors & Access Tracking
            </h2>
            <span
              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border shadow-xs ${
                isCloudSynced
                  ? "bg-emerald-500/20 text-emerald-100 border-emerald-400/30"
                  : "bg-amber-500/20 text-amber-100 border-amber-400/30"
              }`}
            >
              <Database size={11} />
              {isCloudSynced ? "Cloud Synced (Supabase)" : "Local Storage Active"}
            </span>
          </div>
          <p className="text-white/80 text-sm">
            Log of learners who visited the site, accessed Courses, or played Puzzles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={() => setShowSqlModal(true)}
            className="flex items-center gap-1.5 rounded-xl bg-white/20 backdrop-blur-md px-3.5 py-2 text-xs font-semibold text-white border border-white/30 hover:bg-white/30 transition-all"
            title="View database table instructions"
          >
            <Database size={14} /> Schema SQL
          </button>

          <button
            onClick={fetchLogs}
            disabled={loading}
            className="flex items-center gap-1.5 rounded-xl bg-white/80 px-3.5 py-2 text-xs font-semibold text-gray-800 shadow hover:bg-white transition-all disabled:opacity-50"
          >
            <RefreshCw size={14} className={loading ? "animate-spin" : ""} /> Refresh
          </button>

          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-emerald-700 transition-all disabled:opacity-50"
          >
            <Download size={14} /> Export CSV
          </button>

          {logs.length > 0 && (
            <button
              onClick={handleClear}
              className="flex items-center gap-1.5 rounded-xl bg-red-600/80 px-3.5 py-2 text-xs font-semibold text-white shadow hover:bg-red-600 transition-all"
            >
              <Trash2 size={14} /> Clear
            </button>
          )}
        </div>
      </motion.div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between text-gray-600 text-xs font-medium mb-1">
            <span>Total Visits</span>
            <Users size={16} className="text-amber-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
          <div className="text-[11px] text-gray-500 mt-1">Courses & Puzzles combined</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between text-gray-600 text-xs font-medium mb-1">
            <span>Unique Learners</span>
            <UserCheck size={16} className="text-indigo-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.uniqueEmails}</div>
          <div className="text-[11px] text-gray-500 mt-1">Distinct emails logged</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between text-gray-600 text-xs font-medium mb-1">
            <span>Course Accesses</span>
            <GraduationCap size={16} className="text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.courseVisits}</div>
          <div className="text-[11px] text-gray-500 mt-1">Domain roadmaps & units</div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl bg-white/70 backdrop-blur-xl border border-white/50 p-4 shadow-lg"
        >
          <div className="flex items-center justify-between text-gray-600 text-xs font-medium mb-1">
            <span>Puzzle Plays</span>
            <Gamepad2 size={16} className="text-rose-500" />
          </div>
          <div className="text-2xl font-bold text-gray-900">{stats.puzzleVisits}</div>
          <div className="text-[11px] text-gray-500 mt-1">Word connect challenges</div>
        </motion.div>
      </div>

      {/* CONTROLS (SEARCH & FILTER TABS) */}
      <div className="rounded-2xl bg-white/80 backdrop-blur-xl border border-white/50 p-4 shadow-lg mb-6 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, email, or item..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-white/90 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500 transition-all"
          />
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs text-gray-500 mr-1 flex items-center gap-1">
            <Filter size={13} /> Filter:
          </span>
          <button
            onClick={() => setFilterType("all")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              filterType === "all"
                ? "bg-gray-800 text-white shadow"
                : "bg-white/70 text-gray-600 hover:bg-white"
            }`}
          >
            All ({logs.length})
          </button>
          <button
            onClick={() => setFilterType("course")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              filterType === "course"
                ? "bg-blue-600 text-white shadow"
                : "bg-white/70 text-gray-600 hover:bg-white"
            }`}
          >
            <GraduationCap size={13} /> Courses ({stats.courseVisits})
          </button>
          <button
            onClick={() => setFilterType("puzzle")}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1 transition-all ${
              filterType === "puzzle"
                ? "bg-rose-600 text-white shadow"
                : "bg-white/70 text-gray-600 hover:bg-white"
            }`}
          >
            <Gamepad2 size={13} /> Puzzles ({stats.puzzleVisits})
          </button>
        </div>
      </div>

      {/* TABLE / CONTENT */}
      <div className="rounded-2xl bg-white/85 backdrop-blur-xl border border-white/50 shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-gray-500">
            <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-amber-500" />
            <p className="text-sm font-medium">Loading visitor activity records...</p>
          </div>
        ) : filteredLogs.length === 0 ? (
          <div className="p-12 text-center text-gray-500">
            <Users size={36} className="mx-auto mb-3 text-gray-400 opacity-60" />
            <h4 className="text-base font-semibold text-gray-700">No Visitor Records Found</h4>
            <p className="text-xs text-gray-500 max-w-md mx-auto mt-1">
              {searchQuery || filterType !== "all"
                ? "No entries match your search query or filter. Try clearing filters."
                : "When visitors or students click on Courses or Puzzles, their Name, Email, and visit timestamps will appear here automatically."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-gray-50/80 border-b border-gray-200/80 text-[11px] font-bold text-gray-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Visitor</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Item Accessed</th>
                  <th className="py-3 px-4">Type</th>
                  <th className="py-3 px-4">Date & Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredLogs.map((log) => {
                  const isPuzzle = log.access_type === "puzzle";
                  return (
                    <tr
                      key={log.id}
                      className="hover:bg-amber-50/40 transition-colors"
                    >
                      {/* Name */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-rose-400 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs">
                            {log.visitor_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 leading-tight">
                              {log.visitor_name}
                            </div>
                            <div className="text-[11px] text-gray-400 sm:hidden">
                              {log.visitor_email}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3.5 px-4 text-gray-600 font-mono text-xs">
                        <div className="flex items-center gap-1.5">
                          <Mail size={13} className="text-gray-400 shrink-0" />
                          <span className="truncate max-w-[220px]">{log.visitor_email}</span>
                        </div>
                      </td>

                      {/* Accessed Item */}
                      <td className="py-3.5 px-4 font-medium text-gray-800">
                        <div className="flex items-center gap-1.5">
                          {isPuzzle ? (
                            <Gamepad2 size={15} className="text-rose-500 shrink-0" />
                          ) : (
                            <GraduationCap size={15} className="text-blue-500 shrink-0" />
                          )}
                          <span className="truncate max-w-[260px]">{log.accessed_item}</span>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                            isPuzzle
                              ? "bg-rose-50 text-rose-700 border-rose-200"
                              : "bg-blue-50 text-blue-700 border-blue-200"
                          }`}
                        >
                          {isPuzzle ? "Puzzle" : "Course"}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td className="py-3.5 px-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 font-medium text-gray-800">
                          <Clock size={12} className="text-gray-400 shrink-0" />
                          <span>{formatDateTime(log.created_at)}</span>
                        </div>
                        <div className="text-[11px] text-gray-400 pl-4 mt-0.5">
                          {formatRelativeTime(log.created_at)}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SQL MODAL */}
      {showSqlModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl border border-gray-200 text-left">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Database size={20} className="text-amber-500" />
                <h3 className="font-bold text-lg text-gray-900">
                  Supabase Table Setup (Optional)
                </h3>
              </div>
              <button
                onClick={() => setShowSqlModal(false)}
                className="text-gray-400 hover:text-gray-600 p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-gray-600 mb-3">
              Logs are already securely recorded in localStorage and immediately visible here. 
              To enable cloud syncing across all devices, open your Supabase SQL Editor and run this query:
            </p>

            <div className="relative">
              <pre className="p-4 bg-gray-900 text-gray-100 rounded-xl text-xs font-mono overflow-x-auto max-h-60 leading-relaxed">
                {sqlCode}
              </pre>
              <button
                onClick={copySql}
                className="absolute top-3 right-3 px-2.5 py-1.5 rounded-lg bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1 backdrop-blur-sm transition-all"
              >
                {copiedSql ? (
                  <>
                    <CheckCircle2 size={13} className="text-emerald-400" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy size={13} /> Copy SQL
                  </>
                )}
              </button>
            </div>

            <div className="mt-5 flex justify-end">
              <button
                onClick={() => setShowSqlModal(false)}
                className="px-4 py-2 rounded-xl bg-gray-900 text-white text-xs font-semibold hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}
