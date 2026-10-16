import React, { useEffect, useState } from 'react';
import { api } from '../../lib/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import {
  ShieldAlert,
  Database,
  Cpu,
  Users,
  Sparkles,
  RefreshCw,
  Server,
  Activity,
  Layers,
  Lock,
  ArrowRight,
  Loader2,
  CheckCircle2,
} from 'lucide-react';

interface AdminMetricsResponse {
  system: {
    service: string;
    version: string;
    neonBranch: string;
    database: string;
    dbUser: string;
    pgVersion: string;
    uptimeSeconds: number;
    memoryUsageMb: number;
  };
  summary: {
    totalUsers: number;
    totalResumes: number;
    totalApplications: number;
    totalCoverLetters: number;
    averageAtsScore: number;
    totalAiCalls: number;
    totalTokensConsumed: number;
    averageAiLatencyMs: number;
    estimatedCostUsd: number;
  };
  templateDistribution: Array<{
    templateSlug: string;
    count: number;
  }>;
  recentUsers: Array<{
    id: string;
    email: string;
    role: string;
    createdAt: string;
    _count: {
      resumes: number;
      applications: number;
    };
  }>;
  recentAiLogs: Array<{
    id: string;
    feature: string;
    model: string;
    promptTokens: number;
    completionTokens: number;
    latencyMs: number;
    status: string;
    createdAt: string;
  }>;
  recentAudits: Array<{
    id: string;
    action: string;
    targetType: string;
    createdAt: string;
    actor?: {
      email: string;
      role: string;
    } | null;
  }>;
}

export const AdminDashboardPage: React.FC = () => {
  const { user, login } = useAuth();
  const toast = useToast();

  const [metrics, setMetrics] = useState<AdminMetricsResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSwitching, setIsSwitching] = useState(false);

  const fetchMetrics = async (showToast = false) => {
    try {
      if (showToast) setIsRefreshing(true);
      else setIsLoading(true);
      setError(null);

      const res = await api.get<{ status: string; data: AdminMetricsResponse }>('/admin/metrics');
      setMetrics(res.data);
      if (showToast) {
        toast.success('Telemetry Refreshed', 'Neon PostgreSQL metrics synchronized.');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load administrator metrics.');
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchMetrics();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleSwitchToAdmin = async () => {
    try {
      setIsSwitching(true);
      await login('demo@myrmyc.app', 'MyRmyC2026!');
      toast.success('Administrator Access Granted', 'Logged in as demo@myrmyc.app (Role: ADMIN).');
    } catch (err: any) {
      toast.error('Switch Failed', err.message || 'Could not authenticate administrator account.');
    } finally {
      setIsSwitching(false);
    }
  };

  // If logged-in user is not an admin
  if (user?.role !== 'ADMIN') {
    return (
      <div className="p-6 md:p-12 max-w-4xl mx-auto space-y-6">
        <div className="p-8 rounded-3xl bg-white border border-archival-200 shadow-paper-lg space-y-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-ochre-50 border border-ochre-200 flex items-center justify-center text-ochre-600 mx-auto shadow-paper-xs">
            <Lock className="w-8 h-8" />
          </div>

          <div className="space-y-2 max-w-lg mx-auto">
            <h2 className="text-xl font-display font-bold text-slate-100 tracking-tight">
              Administrator Console Restricted
            </h2>
            <p className="text-xs font-mono text-slate-400 leading-relaxed">
              You are currently authenticated as <strong className="text-slate-100">{user?.email}</strong> with role <span className="text-forest-700 font-bold">{user?.role}</span>.
              Access to live Neon database metrics, telemetry, and audit logs requires <strong className="text-ochre-600">ADMIN</strong> privileges.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-archival-50 border border-archival-200 max-w-md mx-auto text-left space-y-2 text-xs font-mono">
            <div className="text-slate-400 flex items-center justify-between">
              <span>Default Admin Account:</span>
              <strong className="text-slate-100">demo@myrmyc.app</strong>
            </div>
            <div className="text-slate-400 flex items-center justify-between">
              <span>Default Password:</span>
              <code className="text-forest-700 font-bold font-mono">MyRmyC2026!</code>
            </div>
          </div>

          <button
            type="button"
            disabled={isSwitching}
            onClick={handleSwitchToAdmin}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-bold text-xs font-mono shadow-paper-sm transition disabled:opacity-40"
          >
            {isSwitching ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <ArrowRight className="w-4 h-4" />
            )}
            <span>Switch to Pre-Seeded Admin Account</span>
          </button>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="p-16 flex flex-col items-center justify-center gap-3 text-xs font-mono text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-royal-600" />
        <span>Aggregating cluster telemetry from Neon Serverless PostgreSQL...</span>
      </div>
    );
  }

  if (error || !metrics) {
    return (
      <div className="p-8 max-w-xl mx-auto text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600 mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-slate-100">Telemetry Connection Error</h3>
        <p className="text-xs font-mono text-slate-400">{error}</p>
        <button
          type="button"
          onClick={() => fetchMetrics(true)}
          className="px-4 py-2 rounded-xl bg-white border border-archival-200 text-xs font-mono text-slate-300 hover:text-slate-100 shadow-paper-xs transition"
        >
          Retry Connection
        </button>
      </div>
    );
  }

  const { system, summary, templateDistribution, recentUsers, recentAiLogs } = metrics;

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto selection:bg-royal-500/15 selection:text-royal-600">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-archival-200 pb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 shadow-paper-xs">
              <Server className="w-4 h-4" />
            </div>
            Neon Cloud & Monorepo Telemetry Console
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Live cluster telemetry, database connection health, Gemini token consumption, and system audit logs.
          </p>
        </div>

        <button
          type="button"
          disabled={isRefreshing}
          onClick={() => fetchMetrics(true)}
          className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white hover:bg-archival-50 border border-archival-200 text-xs font-mono text-slate-300 hover:text-slate-100 shadow-paper-xs transition disabled:opacity-40"
        >
          <RefreshCw className={`w-3.5 h-3.5 text-royal-600 ${isRefreshing ? 'animate-spin' : ''}`} />
          <span>Refresh Telemetry</span>
        </button>
      </div>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700 shadow-paper-xs">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                PostgreSQL Engine
              </span>
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
                {system.pgVersion}
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                {system.database} ({system.neonBranch})
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-forest-50 text-forest-700 border border-forest-200 font-bold">
            ONLINE
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 shadow-paper-xs">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Gemini 2.5 Flash Engine
              </span>
              <h4 className="text-xs font-bold text-slate-100 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-royal-500 animate-pulse" />
                Deterministic Failover
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Avg Latency: {summary.averageAiLatencyMs}ms
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-royal-50 text-royal-700 border border-royal-200 font-bold">
            HEALTHY
          </span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-ochre-50 border border-ochre-200 flex items-center justify-center text-ochre-600 shadow-paper-xs">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
                Cluster Resources
              </span>
              <h4 className="text-xs font-bold text-slate-100 mt-0.5">
                Heap: {system.memoryUsageMb} MB
              </h4>
              <span className="text-[10px] font-mono text-slate-400">
                Uptime: {Math.floor(system.uptimeSeconds / 60)}m {system.uptimeSeconds % 60}s
              </span>
            </div>
          </div>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-ochre-50 text-ochre-700 border border-ochre-200 font-bold">
            ACTIVE
          </span>
        </div>
      </div>

      {/* 4 Main Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1">
          <span className="text-xs font-mono text-slate-400">Total User Accounts</span>
          <div className="text-2xl font-black font-mono text-slate-100">
            {summary.totalUsers}
          </div>
          <span className="text-[11px] font-mono text-forest-700 block font-medium">
            {summary.totalApplications} Active Job Pipelines
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1">
          <span className="text-xs font-mono text-slate-400">Resumes Generated</span>
          <div className="text-2xl font-black font-mono text-royal-600">
            {summary.totalResumes}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            Across 6 ATS Templates
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1">
          <span className="text-xs font-mono text-slate-400">Mean ATS Health Score</span>
          <div className="text-2xl font-black font-mono text-forest-700">
            {summary.averageAtsScore}%
          </div>
          <span className="text-[11px] font-mono text-forest-700 block font-medium">
            Deterministic Compliance
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1">
          <span className="text-xs font-mono text-slate-400">AI Tokens / Est. Cost</span>
          <div className="text-2xl font-black font-mono text-ochre-600">
            {summary.totalTokensConsumed.toLocaleString()}
          </div>
          <span className="text-[11px] font-mono text-slate-400 block">
            ${summary.estimatedCostUsd} USD Incurred
          </span>
        </div>
      </div>

      {/* Middle Grid: Template Distribution & AI Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Template Distribution */}
        <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
          <div className="flex items-center justify-between border-b border-archival-200 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 font-semibold">
              <Layers className="w-4 h-4 text-forest-700" />
              Template Usage Distribution
            </h3>
            <span className="text-xs font-mono text-slate-400">
              {summary.totalResumes} Total
            </span>
          </div>

          <div className="space-y-3 pt-2">
            {templateDistribution.map((tpl) => {
              const pct = summary.totalResumes > 0 ? Math.round((tpl.count / summary.totalResumes) * 100) : 0;
              return (
                <div key={tpl.templateSlug} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-slate-100 capitalize font-medium">
                      {tpl.templateSlug.replace(/-/g, ' ')}
                    </span>
                    <span className="text-slate-400">
                      {tpl.count} resumes ({pct}%)
                    </span>
                  </div>
                  <div className="h-2 rounded-full bg-archival-100 overflow-hidden">
                    <div
                      className="h-full bg-royal-600 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(5, pct)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent Registered Users */}
        <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
          <div className="flex items-center justify-between border-b border-archival-200 pb-3">
            <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 font-semibold">
              <Users className="w-4 h-4 text-royal-600" />
              Recent Registered Accounts
            </h3>
            <span className="text-xs font-mono text-slate-400">
              Neon PostgreSQL Sync
            </span>
          </div>

          <div className="divide-y divide-archival-200">
            {recentUsers.map((u) => (
              <div key={u.id} className="py-2.5 flex items-center justify-between text-xs font-mono">
                <div>
                  <span className="text-slate-100 font-semibold block">{u.email}</span>
                  <span className="text-[10px] text-slate-400">
                    Joined: {new Date(u.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] px-2 py-0.5 rounded bg-archival-50 text-slate-300 border border-archival-200">
                    {u._count.resumes} Resumes
                  </span>
                  <span
                    className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                      u.role === 'ADMIN'
                        ? 'bg-ochre-50 text-ochre-700 border border-ochre-200'
                        : 'bg-forest-50 text-forest-700 border border-forest-200'
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent AI Operations & Audits Feed */}
      <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
        <div className="flex items-center justify-between border-b border-archival-200 pb-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 flex items-center gap-2 font-semibold">
            <Sparkles className="w-4 h-4 text-ochre-600" />
            Real-Time AI & System Audit Activity
          </h3>
          <span className="text-xs font-mono text-slate-400">
            Gemini 2.5 Flash Telemetry
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-archival-50 border-b border-archival-200 text-slate-400">
              <tr>
                <th className="px-4 py-2.5 font-semibold">Feature / Action</th>
                <th className="px-4 py-2.5 font-semibold">Model</th>
                <th className="px-4 py-2.5 font-semibold">Prompt Tokens</th>
                <th className="px-4 py-2.5 font-semibold">Completion Tokens</th>
                <th className="px-4 py-2.5 font-semibold">Latency</th>
                <th className="px-4 py-2.5 font-semibold">Status</th>
                <th className="px-4 py-2.5 font-semibold text-right">Timestamp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-archival-200 text-slate-300">
              {recentAiLogs.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-6 text-center text-slate-400 font-mono text-xs">
                    No recent AI usage events logged in current session.
                  </td>
                </tr>
              ) : (
                recentAiLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-archival-50/50 transition">
                    <td className="px-4 py-2.5 font-semibold text-slate-100">
                      {log.feature.replace(/_/g, ' ')}
                    </td>
                    <td className="px-4 py-2.5 text-slate-400">{log.model}</td>
                    <td className="px-4 py-2.5 text-slate-300">{log.promptTokens}</td>
                    <td className="px-4 py-2.5 text-slate-300">{log.completionTokens}</td>
                    <td className="px-4 py-2.5 text-ochre-600 font-medium">{log.latencyMs}ms</td>
                    <td className="px-4 py-2.5">
                      <span className="inline-flex items-center gap-1 text-[10px] px-2 py-0.5 rounded bg-forest-50 text-forest-700 border border-forest-200 font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5" />
                        {log.status}
                      </span>
                    </td>
                    <td className="px-4 py-2.5 text-right text-slate-400">
                      {new Date(log.createdAt).toLocaleTimeString()}
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
};
