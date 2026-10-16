import React, { useState, useEffect } from 'react';
import { api } from '../../lib/api';
import {
  Briefcase,
  Plus,
  Search,
  LayoutGrid,
  List,
  DollarSign,
  MapPin,
  ExternalLink,
  Trash2,
  Loader2,
  CheckCircle2,
  FileText,
  X,
  Calendar,
  Scale,
  Award,
  TrendingUp,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { ScheduleInterviewModal } from '../../components/applications/ScheduleInterviewModal';
import { OfferComparisonModal } from '../../components/applications/OfferComparisonModal';

interface JobApp {
  id: string;
  company: string;
  roleTitle: string;
  location?: string | null;
  status: string;
  salaryRange?: string | null;
  jobUrl?: string | null;
  appliedDate?: string | null;
  nextFollowUpDate?: string | null;
  notes?: string | null;
  resume?: {
    id: string;
    title: string;
    lastAtsScore?: number;
  } | null;
  updatedAt: string;
}

const COLUMNS: Array<{ id: string; label: string; color: string; badgeBg: string }> = [
  { id: 'SAVED', label: 'Wishlist / Saved', color: 'text-slate-500', badgeBg: 'bg-carbon-850' },
  { id: 'APPLIED', label: 'Applied', color: 'text-royal-700', badgeBg: 'bg-royal-50' },
  { id: 'ONLINE_ASSESSMENT', label: 'Online Assessment', color: 'text-ochre-700', badgeBg: 'bg-amber-50' },
  { id: 'INTERVIEWING', label: 'Interviewing', color: 'text-sky-700', badgeBg: 'bg-sky-50' },
  { id: 'OFFER', label: 'Offer Received', color: 'text-forest-700', badgeBg: 'bg-forest-50' },
  { id: 'REJECTED', label: 'Archived', color: 'text-rose-700', badgeBg: 'bg-rose-50' },
];

export const ApplicationsPage: React.FC = () => {
  const toast = useToast();
  const [applications, setApplications] = useState<JobApp[]>([]);
  const [resumes, setResumes] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedScheduleApp, setSelectedScheduleApp] = useState<JobApp | null>(null);
  const [isOfferComparisonOpen, setIsOfferComparisonOpen] = useState(false);

  // New application form state
  const [company, setCompany] = useState('');
  const [roleTitle, setRoleTitle] = useState('');
  const [location, setLocation] = useState('');
  const [status, setStatus] = useState<string>('APPLIED');
  const [resumeId, setResumeId] = useState<string>('');
  const [jobUrl, setJobUrl] = useState('');
  const [salaryRange, setSalaryRange] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const res = await api.get<{ status: string; applications: JobApp[] }>('/applications');
      setApplications(res.applications || []);
    } catch (err) {
      console.error('[Fetch Apps Error]', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    api.get<{ status: string; resumes: any[] }>('/resumes')
      .then((res) => setResumes(res.resumes || []))
      .catch(() => {});
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      // Optimistic update
      setApplications((prev) =>
        prev.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
      );
      const stageName = COLUMNS.find((c) => c.id === newStatus)?.label || newStatus;
      toast.info('Pipeline Stage Updated', `Application transitioned to ${stageName}.`);
      await api.patch(`/applications/${id}/status`, { status: newStatus });
    } catch (err: any) {
      toast.error('Failed to update stage', err.message);
      fetchApplications();
    }
  };

  const handleDelete = async (id: string, company: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!window.confirm(`Delete application for ${company}?`)) return;
    try {
      setApplications((prev) => prev.filter((a) => a.id !== id));
      toast.success('Application Removed', `Deleted ${company} entry from tracking pipeline.`);
      await api.delete(`/applications/${id}`);
    } catch (err: any) {
      toast.error('Deletion Failed', err.message);
      fetchApplications();
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!company.trim() || !roleTitle.trim()) return;

    try {
      setIsSubmitting(true);
      await api.post('/applications', {
        company: company.trim(),
        roleTitle: roleTitle.trim(),
        location: location.trim() || undefined,
        status,
        resumeId: resumeId || undefined,
        jobUrl: jobUrl.trim() || undefined,
        salaryRange: salaryRange.trim() || undefined,
        notes: notes.trim() || undefined,
        appliedDate: new Date().toISOString(),
      });
      toast.success('Application Logged', `Tracked ${company} (${roleTitle}) in CRM pipeline.`);
      setIsModalOpen(false);
      setCompany('');
      setRoleTitle('');
      setLocation('');
      setJobUrl('');
      setSalaryRange('');
      setNotes('');
      fetchApplications();
    } catch (err: any) {
      toast.error('Creation Failed', err.message || 'Failed to create application.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredApps = applications.filter((app) => {
    const query = searchQuery.toLowerCase();
    return (
      app.company.toLowerCase().includes(query) ||
      app.roleTitle.toLowerCase().includes(query) ||
      (app.location || '').toLowerCase().includes(query)
    );
  });

  const totalAppsCount = applications.length;
  const activePipelineCount = applications.filter((a) =>
    ['APPLIED', 'ONLINE_ASSESSMENT', 'INTERVIEWING'].includes(a.status)
  ).length;
  const scheduledInterviewsCount = applications.filter(
    (a) => a.status === 'INTERVIEWING' || Boolean(a.nextFollowUpDate)
  ).length;
  const offersCount = applications.filter((a) => a.status === 'OFFER').length;

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-carbon-700 pb-6">
        <div>
          <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
            <Briefcase className="w-5 h-5 text-royal-600" />
            Career Pipeline & Applications Kanban
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-0.5">
            Track interview pipelines, tailored resume attachments, and compensation targets in Neon PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => setIsOfferComparisonOpen(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-carbon-850 border border-carbon-700 text-xs font-mono text-royal-700 font-medium shadow-sm transition"
            title="Open side-by-side compensation comparison"
          >
            <Scale className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Offer Benchmark</span>
          </button>

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Application</span>
          </button>
        </div>
      </div>

      {/* Pipeline Telemetry Metric Tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-xl bg-white border border-carbon-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block">
              Total Logged
            </span>
            <span className="text-xl font-bold font-mono text-slate-100 mt-0.5 block">
              {totalAppsCount}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Applications</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-carbon-850 border border-carbon-700 flex items-center justify-center text-slate-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-carbon-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-royal-700 uppercase tracking-wider block">
              Active Loop
            </span>
            <span className="text-xl font-bold font-mono text-royal-700 mt-0.5 block">
              {activePipelineCount}
            </span>
            <span className="text-[10px] font-mono text-slate-400">In Motion</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-carbon-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-ochre-700 uppercase tracking-wider block">
              Scheduled Rounds
            </span>
            <span className="text-xl font-bold font-mono text-ochre-700 mt-0.5 block">
              {scheduledInterviewsCount}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Interviews & OAs</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center text-ochre-600">
            <Calendar className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-xl bg-white border border-carbon-700 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono text-forest-700 uppercase tracking-wider block">
              Offers Received
            </span>
            <span className="text-xl font-bold font-mono text-forest-700 mt-0.5 block">
              {offersCount}
            </span>
            <span className="text-[10px] font-mono text-slate-400">Extended</span>
          </div>
          <div className="w-9 h-9 rounded-xl bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-600">
            <Award className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Control Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, position, or location..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:border-royal-500 shadow-sm"
          />
        </div>

        <div className="flex items-center bg-white border border-carbon-700 rounded-xl p-1 shadow-sm">
          <button
            type="button"
            onClick={() => setViewMode('kanban')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'kanban' ? 'bg-carbon-850 text-royal-700 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            <span>Kanban</span>
          </button>
          <button
            type="button"
            onClick={() => setViewMode('table')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition ${
              viewMode === 'table' ? 'bg-carbon-850 text-royal-700 font-bold' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Table</span>
          </button>
        </div>
      </div>

      {/* Main Kanban Board View */}
      {isLoading ? (
        <div className="p-16 flex items-center justify-center gap-3 text-xs font-mono text-slate-400 bg-white border border-carbon-700 rounded-2xl shadow-sm">
          <Loader2 className="w-4 h-4 animate-spin text-royal-600" />
          Synchronizing applications from Neon Cloud...
        </div>
      ) : viewMode === 'kanban' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3.5 items-start overflow-x-auto pb-4">
          {COLUMNS.map((col) => {
            const columnApps = filteredApps.filter((a) => a.status === col.id);
            return (
              <div
                key={col.id}
                className="bg-white/90 border border-carbon-700 rounded-2xl p-3 flex flex-col min-h-[450px] shadow-sm"
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 border-b border-carbon-700 mb-3">
                  <div className="flex items-center gap-1.5">
                    <span className={`text-xs font-mono font-bold ${col.color}`}>{col.label}</span>
                  </div>
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-carbon-850 text-slate-400 border border-carbon-700 font-medium">
                    {columnApps.length}
                  </span>
                </div>

                {/* Column Cards */}
                <div className="space-y-2.5 flex-1 overflow-y-auto">
                  {columnApps.map((app) => (
                    <div
                      key={app.id}
                      className="p-3 bg-white hover:bg-carbon-850/60 border border-carbon-700 hover:border-royal-400/80 rounded-xl space-y-2.5 transition shadow-sm group"
                    >
                      <div className="flex items-start justify-between gap-1">
                        <div>
                          <h4 className="font-semibold text-xs text-slate-100 leading-snug line-clamp-1 group-hover:text-royal-700 transition">
                            {app.roleTitle}
                          </h4>
                          <span className="text-[11px] font-mono text-royal-700 font-semibold block mt-0.5">
                            {app.company}
                          </span>
                        </div>
                        <button
                          type="button"
                          onClick={(e) => handleDelete(app.id, app.company, e)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-rose-600 transition"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {app.location && (
                        <div className="flex items-center gap-1 text-[10.5px] font-mono text-slate-400 truncate">
                          <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" />
                          <span>{app.location}</span>
                        </div>
                      )}

                      {app.salaryRange && (
                        <div className="flex items-center gap-1 text-[10.5px] font-mono text-forest-700 font-medium">
                          <DollarSign className="w-3 h-3 text-forest-600 flex-shrink-0" />
                          <span>{app.salaryRange}</span>
                        </div>
                      )}

                      {app.resume && (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-royal-700 bg-royal-50 px-2 py-0.5 rounded border border-royal-200 truncate font-medium">
                          <FileText className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate">{app.resume.title}</span>
                        </div>
                      )}

                      {/* Scheduled Interview / Follow-up Due Badge */}
                      {app.nextFollowUpDate && (
                        <div
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedScheduleApp(app);
                          }}
                          className="flex items-center gap-1.5 text-[10.5px] font-mono text-amber-800 bg-amber-50 border border-amber-300 px-2 py-1 rounded-lg cursor-pointer hover:bg-amber-100 transition font-medium"
                          title="Click to view or reschedule interview round"
                        >
                          <Calendar className="w-3 h-3 text-amber-700 flex-shrink-0" />
                          <span className="truncate">
                            {new Date(app.nextFollowUpDate).toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                        </div>
                      )}

                      {/* Status Mover Dropdown & Card Actions */}
                      <div className="pt-2 border-t border-carbon-700 flex items-center justify-between">
                        <select
                          value={app.status}
                          onChange={(e) => handleStatusChange(app.id, e.target.value)}
                          className="px-1.5 py-0.5 bg-white border border-carbon-700 rounded text-[10px] font-mono text-slate-200"
                        >
                          {COLUMNS.map((c) => (
                            <option key={c.id} value={c.id}>
                              Move to {c.label}
                            </option>
                          ))}
                        </select>

                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => setSelectedScheduleApp(app)}
                            className="p-1 text-slate-400 hover:text-ochre-700 transition"
                            title="Schedule Interview Round / Follow-up"
                          >
                            <Calendar className="w-3 h-3" />
                          </button>
                          {app.jobUrl && (
                            <a
                              href={app.jobUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1 text-slate-400 hover:text-royal-600"
                              title="Open Job Posting"
                            >
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {columnApps.length === 0 && (
                    <div className="h-28 flex items-center justify-center border border-dashed border-carbon-700 rounded-xl text-[10.5px] font-mono text-slate-400">
                      Empty stage
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white border border-carbon-700 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-xs font-mono">
            <thead className="bg-carbon-850 border-b border-carbon-700 text-slate-400">
              <tr>
                <th className="px-4 py-3 font-semibold">Company</th>
                <th className="px-4 py-3 font-semibold">Role</th>
                <th className="px-4 py-3 font-semibold">Stage</th>
                <th className="px-4 py-3 font-semibold">Location</th>
                <th className="px-4 py-3 font-semibold">Interview Schedule</th>
                <th className="px-4 py-3 font-semibold">Target Resume</th>
                <th className="px-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-carbon-700 text-slate-200">
              {filteredApps.map((app) => (
                <tr key={app.id} className="hover:bg-carbon-850/50 transition">
                  <td className="px-4 py-3 font-bold text-slate-100">{app.company}</td>
                  <td className="px-4 py-3 text-slate-300">{app.roleTitle}</td>
                  <td className="px-4 py-3">
                    <select
                      value={app.status}
                      onChange={(e) => handleStatusChange(app.id, e.target.value)}
                      className="px-2 py-0.5 bg-white border border-carbon-700 rounded text-xs font-mono text-slate-200"
                    >
                      {COLUMNS.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.label}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-slate-400">{app.location || '—'}</td>
                  <td className="px-4 py-3">
                    {app.nextFollowUpDate ? (
                      <button
                        type="button"
                        onClick={() => setSelectedScheduleApp(app)}
                        className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[11px] font-mono text-amber-800 bg-amber-50 border border-amber-300 hover:bg-amber-100 font-medium"
                        title="Click to reschedule"
                      >
                        <Calendar className="w-3 h-3 text-amber-700" />
                        <span>
                          {new Date(app.nextFollowUpDate).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setSelectedScheduleApp(app)}
                        className="text-slate-400 hover:text-ochre-700 text-[11px] font-mono flex items-center gap-1 transition"
                      >
                        <Calendar className="w-3 h-3" />
                        <span>Set Schedule</span>
                      </button>
                    )}
                  </td>
                  <td className="px-4 py-3 text-royal-700 font-medium">{app.resume?.title || '—'}</td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={() => setSelectedScheduleApp(app)}
                        className="p-1 text-slate-400 hover:text-ochre-700"
                        title="Schedule Interview"
                      >
                        <Calendar className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={(e) => handleDelete(app.id, app.company, e)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        title="Delete"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* New Application Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-carbon-700 rounded-2xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-carbon-700 pb-3">
              <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-royal-600" />
                Add New Job Application
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-slate-400 hover:text-slate-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Company *</label>
                  <input
                    type="text"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="e.g. Stripe or Google"
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-500 font-sans shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Role Title *</label>
                  <input
                    type="text"
                    required
                    value={roleTitle}
                    onChange={(e) => setRoleTitle(e.target.value)}
                    placeholder="e.g. Software Engineer"
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-500 font-sans shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="e.g. Remote or San Francisco"
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-500 font-sans shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Initial Status</label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 shadow-sm"
                  >
                    {COLUMNS.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Linked Resume Document</label>
                <select
                  value={resumeId}
                  onChange={(e) => setResumeId(e.target.value)}
                  className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 shadow-sm"
                >
                  <option value="">None (Attach Later)</option>
                  {resumes.map((r) => (
                    <option key={r.id} value={r.id}>
                      {r.title} (ATS: {r.lastAtsScore || 85})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Job URL / Portal Link</label>
                <input
                  type="url"
                  value={jobUrl}
                  onChange={(e) => setJobUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-400 focus:border-royal-500 shadow-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Salary / Compensation Target</label>
                <input
                  type="text"
                  value={salaryRange}
                  onChange={(e) => setSalaryRange(e.target.value)}
                  placeholder="e.g. $140,000 – $170,000"
                  className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 placeholder-slate-400 focus:border-royal-500 shadow-sm"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-carbon-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-medium shadow-sm transition disabled:opacity-40"
                >
                  {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Save Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Schedule Interview Modal */}
      {selectedScheduleApp && (
        <ScheduleInterviewModal
          isOpen={!!selectedScheduleApp}
          onClose={() => setSelectedScheduleApp(null)}
          application={selectedScheduleApp}
          onUpdated={fetchApplications}
        />
      )}

      {/* Compensation & Offer Comparison Modal */}
      <OfferComparisonModal
        isOpen={isOfferComparisonOpen}
        onClose={() => setIsOfferComparisonOpen(false)}
        applications={applications}
      />
    </div>
  );
};
