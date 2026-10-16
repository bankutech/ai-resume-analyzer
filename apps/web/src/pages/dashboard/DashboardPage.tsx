import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../lib/api';
import {
  FileText,
  Sparkles,
  Target,
  Camera,
  Plus,
  Clock,
  Loader2,
  Trash2,
  Copy,
  ChevronRight,
  Zap,
  Pin,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SAMPLE_STUDENT_RESUME_DOCUMENT } from '@resumeforge/shared';

interface ResumeSummary {
  id: string;
  title: string;
  targetJobTitle?: string;
  templateSlug?: string;
  lastAtsScore?: number;
  isPinned?: boolean;
  isSample?: boolean;
  updatedAt: string;
  _count?: {
    versions: number;
  };
}

export const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const [resumes, setResumes] = useState<ResumeSummary[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreatingSample, setIsCreatingSample] = useState(false);

  const fetchResumes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const res = await api.get<{ status: string; resumes: ResumeSummary[] }>('/resumes');
      const sorted = (res.resumes || []).sort((a, b) => {
        if (a.isPinned && !b.isPinned) return -1;
        if (!a.isPinned && b.isPinned) return 1;
        return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
      });
      setResumes(sorted);
    } catch (err: any) {
      setError(err.message || 'Failed to load resumes');
    } finally {
      setIsLoading(false);
    }
  };

  const handleTogglePin = async (id: string, currentPinned: boolean, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await api.put(`/resumes/${id}`, { isPinned: !currentPinned });
      toast.success(currentPinned ? 'Resume Unpinned' : 'Resume Pinned to Top');
      fetchResumes();
    } catch (err: any) {
      toast.error('Pin Failed', err.message || 'Failed to update pin');
    }
  };

  useEffect(() => {
    fetchResumes();
  }, []);

  const handleCreateSample = async () => {
    try {
      setIsCreatingSample(true);
      const res = await api.post<{ status: string; resume: { id: string } }>('/resumes', {
        title: 'Alex Rivera — Full-Stack & ML Profile',
        targetJobTitle: 'Full-Stack Software Engineer',
        templateSlug: 'classic-ats',
        document: SAMPLE_STUDENT_RESUME_DOCUMENT,
        isSample: true,
      });
      if (res.resume?.id) {
        toast.success('Sample Resume Created', 'Alex Rivera demo persona initialized.');
        navigate(`/app/resumes/${res.resume.id}/edit`);
      }
    } catch (err: any) {
      toast.error('Creation Failed', err.message || 'Failed to create sample resume');
      setError(err.message || 'Failed to create sample resume');
      setIsCreatingSample(false);
    }
  };

  const handleDuplicate = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const res = await api.post<{ status: string; resume: { id: string } }>(`/resumes/${id}/duplicate`);
      if (res.resume) {
        toast.success('Resume Duplicated', 'Created an independent copy with version snapshot.');
        fetchResumes();
      }
    } catch (err: any) {
      toast.error('Duplication Failed', err.message || 'Failed to duplicate resume');
    }
  };

  const handleDelete = async (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await api.delete(`/resumes/${id}`);
      toast.success('Resume Deleted', `"${title}" removed from database.`);
      fetchResumes();
    } catch (err: any) {
      toast.error('Delete Failed', err.message || 'Failed to delete resume');
    }
  };

  // Metrics computation
  const totalResumes = resumes.length;
  const avgAtsScore = totalResumes
    ? Math.round(resumes.reduce((acc, r) => acc + (r.lastAtsScore || 75), 0) / totalResumes)
    : 0;
  const totalSnapshots = resumes.reduce((acc, r) => acc + (r._count?.versions || 0), 0);

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-carbon-700 pb-6">
        <div>
          <h1 className="text-2xl font-display font-bold tracking-tight text-slate-100 flex items-center gap-2.5">
            Engineering Career Command Center
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1">
            Welcome back, <span className="text-slate-200 font-semibold">{user?.name}</span> • ATS Verification & Resume Versioning Studio
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            disabled={isCreatingSample}
            onClick={handleCreateSample}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-carbon-850 text-royal-700 border border-royal-300/80 shadow-sm text-xs font-mono font-medium transition"
          >
            {isCreatingSample ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Zap className="w-3.5 h-3.5" />}
            <span>Load Alex Rivera Persona</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/app/resumes/new')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm shadow-royal-600/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>Create New Resume</span>
          </button>
        </div>
      </div>

      {/* KPI Telemetry Matrix */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Total Resumes</span>
            <FileText className="w-4 h-4 text-royal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-slate-100">{totalResumes}</div>
          <div className="text-[11px] font-mono text-slate-400">PostgreSQL Synchronized</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Average ATS Compliance</span>
            <Sparkles className="w-4 h-4 text-ochre-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-ochre-600">{avgAtsScore}/100</div>
          <div className="text-[11px] font-mono text-slate-400">Deterministic 8-Pillar Scoring</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Version Checkpoints</span>
            <Camera className="w-4 h-4 text-royal-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-royal-600">{totalSnapshots}</div>
          <div className="text-[11px] font-mono text-slate-400">Immutable JSONB Snapshots</div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-2">
          <div className="flex items-center justify-between text-slate-400 text-xs font-mono">
            <span>Target Roles</span>
            <Target className="w-4 h-4 text-forest-600" />
          </div>
          <div className="text-2xl font-bold font-mono text-forest-600">
            {new Set(resumes.map((r) => r.targetJobTitle).filter(Boolean)).size || 1}
          </div>
          <div className="text-[11px] font-mono text-slate-400">Tailored Configurations</div>
        </div>
      </div>

      {/* Main Content Grid: Recent Resumes & ATS Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Resumes List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
              Active Documents ({resumes.length})
            </h2>
            <button
              type="button"
              onClick={() => navigate('/app/resumes')}
              className="text-xs font-mono text-royal-600 hover:text-royal-700 hover:underline flex items-center gap-1 font-medium"
            >
              <span>View All</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {isLoading ? (
            <div className="p-12 rounded-2xl bg-white border border-carbon-700 flex items-center justify-center gap-3 text-xs font-mono text-slate-400 shadow-sm">
              <Loader2 className="w-4 h-4 animate-spin text-royal-600" />
              Loading resumes from Neon Cloud...
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-mono">
              {error}
            </div>
          ) : resumes.length === 0 ? (
            <div className="p-12 rounded-2xl bg-white border border-dashed border-carbon-700 text-center space-y-3 shadow-sm">
              <FileText className="w-8 h-8 text-slate-400 mx-auto" />
              <h3 className="text-sm font-bold text-slate-100">No resumes drafted yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Start from scratch with our Harvard/MIT ATS templates or load the comprehensive Alex Rivera sample persona.
              </p>
              <div className="pt-2 flex justify-center gap-3">
                <button
                  type="button"
                  onClick={handleCreateSample}
                  className="px-3.5 py-1.5 rounded-lg bg-white text-royal-700 border border-royal-300 text-xs font-mono font-medium shadow-sm hover:bg-carbon-850"
                >
                  Load Alex Rivera Persona
                </button>
                <button
                  type="button"
                  onClick={() => navigate('/app/resumes/new')}
                  className="px-3.5 py-1.5 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm"
                >
                  Create Blank
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.map((resume) => (
                <div
                  key={resume.id}
                  onClick={() => navigate(`/app/resumes/${resume.id}/edit`)}
                  className="p-4 rounded-2xl bg-white hover:bg-carbon-850/60 border border-carbon-700 hover:border-royal-400/80 shadow-sm transition-all cursor-pointer group flex items-center justify-between"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-10 h-10 rounded-xl bg-carbon-850 border border-carbon-700 flex items-center justify-center text-slate-400 group-hover:text-royal-600 transition">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        {resume.isPinned && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-300 flex items-center gap-1 font-bold">
                            <Pin className="w-2.5 h-2.5 fill-amber-700 text-amber-700" />
                            Pinned
                          </span>
                        )}
                        <span className="font-semibold text-sm text-slate-100 group-hover:text-royal-700 truncate block transition">
                          {resume.title}
                        </span>
                        {resume.isSample && (
                          <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-royal-50 text-royal-700 border border-royal-200">
                            Sample Persona
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-slate-400 mt-0.5">
                        <span>{resume.targetJobTitle || 'General Engineering'}</span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-slate-400">
                          <Clock className="w-3 h-3" />
                          {new Date(resume.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    {/* ATS Badge */}
                    <div className="px-2.5 py-1 rounded-full text-xs font-mono font-bold bg-forest-50 text-forest-700 border border-forest-300">
                      ATS {resume.lastAtsScore || 85}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => handleTogglePin(resume.id, !!resume.isPinned, e)}
                        className={`p-1.5 rounded-lg transition ${
                          resume.isPinned
                            ? 'text-amber-700 bg-amber-100'
                            : 'text-slate-400 hover:text-amber-700 hover:bg-carbon-800'
                        }`}
                        title={resume.isPinned ? 'Unpin from Top' : 'Pin to Top'}
                      >
                        <Pin className={`w-4 h-4 ${resume.isPinned ? 'fill-amber-700' : ''}`} />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDuplicate(resume.id, e)}
                        className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-carbon-800 rounded-lg transition"
                        title="Duplicate Resume"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(resume.id, resume.title, e)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-carbon-800 rounded-lg transition"
                        title="Delete Resume"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-royal-600 group-hover:translate-x-0.5 transition" />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right 1 Col: ATS Health & Rules */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            ATS Heuristic Directives
          </h2>

          <div className="p-5 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-4 text-xs font-sans">
            <div className="flex items-center gap-2 text-royal-700 font-mono font-semibold">
              <Sparkles className="w-4 h-4" />
              Google X-Y-Z Accomplishment Rule
            </div>
            <p className="text-slate-300 leading-relaxed">
              Every strong engineering bullet must follow:{' '}
              <span className="font-semibold text-slate-100">
                "Accomplished [X] as measured by [Y], by doing [Z]"
              </span>
              .
            </p>

            <div className="p-3 rounded-xl bg-carbon-850 border border-carbon-700 font-mono text-[11px] space-y-1.5">
              <span className="text-rose-600 font-bold block">❌ Bad (Passive):</span>
              <p className="text-slate-400">"Helped with backend optimization and worked on queries."</p>
              <span className="text-forest-700 font-bold block pt-1.5">✅ Best (ATS Standard):</span>
              <p className="text-slate-100 font-medium">
                "Reduced p99 query latency from 450ms to 85ms (81% decrease) by introducing composite indexes and Redis caching."
              </p>
            </div>

            <div className="space-y-2 pt-2 border-t border-carbon-700 text-[11.5px] text-slate-400 font-mono">
              <div className="flex items-center justify-between">
                <span>Action Verbs Present</span>
                <span className="text-forest-700 font-semibold">180+ Recognized</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Format Standard</span>
                <span className="text-slate-200 font-semibold">Single Column Vector</span>
              </div>
              <div className="flex items-center justify-between">
                <span>ATS Parsing Engine</span>
                <span className="text-slate-200 font-semibold">100% Text Extractable</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
