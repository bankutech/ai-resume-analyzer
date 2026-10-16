import React, { useState, useEffect, useCallback } from 'react';
import {
  Bookmark,
  Plus,
  Trash2,
  Edit3,
  X,
  Loader2,
  Save,
  Search,
  Tag,
  MapPin,
  Building2,
  ArrowUpRight,
} from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

interface SavedJob {
  id: string;
  company: string;
  roleTitle: string;
  location: string | null;
  jobUrl: string | null;
  rawSnippet: string | null;
  tags: string[];
  priority: number;
  createdAt: string;
}

const PRIORITY_CONFIG: Record<number, { label: string; color: string }> = {
  1: { label: 'Low', color: 'bg-archival-100 text-slate-400 border-archival-200' },
  2: { label: 'Medium', color: 'bg-ochre-50 text-ochre-700 border-ochre-200' },
  3: { label: 'High', color: 'bg-forest-50 text-forest-700 border-forest-200' },
};

export const SavedJobsPage: React.FC = () => {
  const toast = useToast();

  const [jobs, setJobs] = useState<SavedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingJob, setEditingJob] = useState<SavedJob | null>(null);

  // Form state
  const [formCompany, setFormCompany] = useState('');
  const [formRole, setFormRole] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formUrl, setFormUrl] = useState('');
  const [formSnippet, setFormSnippet] = useState('');
  const [formTags, setFormTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');
  const [formPriority, setFormPriority] = useState(2);
  const [isSaving, setIsSaving] = useState(false);

  const fetchJobs = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ savedJobs: SavedJob[] }>('/saved-jobs', {
        params: searchQuery ? { search: searchQuery } : undefined,
      });
      setJobs(res.savedJobs);
    } catch {
      toast.error('Failed to load saved jobs');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery]);

  useEffect(() => {
    const debounce = setTimeout(fetchJobs, 300);
    return () => clearTimeout(debounce);
  }, [fetchJobs]);

  const openNewModal = () => {
    setEditingJob(null);
    setFormCompany('');
    setFormRole('');
    setFormLocation('');
    setFormUrl('');
    setFormSnippet('');
    setFormTags([]);
    setTagInput('');
    setFormPriority(2);
    setIsModalOpen(true);
  };

  const openEditModal = (job: SavedJob) => {
    setEditingJob(job);
    setFormCompany(job.company);
    setFormRole(job.roleTitle);
    setFormLocation(job.location || '');
    setFormUrl(job.jobUrl || '');
    setFormSnippet(job.rawSnippet || '');
    setFormTags(job.tags);
    setTagInput('');
    setFormPriority(job.priority);
    setIsModalOpen(true);
  };

  const addTag = () => {
    const tag = tagInput.trim();
    if (!tag || formTags.includes(tag)) return;
    setFormTags((t) => [...t, tag]);
    setTagInput('');
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formCompany || !formRole) {
      toast.error('Missing fields', 'Company and role are required.');
      return;
    }
    setIsSaving(true);
    try {
      const payload = {
        company: formCompany,
        roleTitle: formRole,
        location: formLocation,
        jobUrl: formUrl,
        rawSnippet: formSnippet,
        tags: formTags,
        priority: formPriority,
      };

      if (editingJob) {
        const res = await api.patch<{ savedJob: SavedJob }>(`/saved-jobs/${editingJob.id}`, payload);
        setJobs((prev) => prev.map((j) => (j.id === editingJob.id ? res.savedJob : j)));
        toast.success('Job updated');
      } else {
        const res = await api.post<{ savedJob: SavedJob }>('/saved-jobs', payload);
        setJobs((prev) => [res.savedJob, ...prev]);
        toast.success('Job saved to your pipeline');
      }
      setIsModalOpen(false);
    } catch (err: any) {
      toast.error('Save failed', err.message);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, company: string, role: string) => {
    if (!confirm(`Remove "${role} at ${company}" from saved jobs?`)) return;
    try {
      await api.delete(`/saved-jobs/${id}`);
      setJobs((prev) => prev.filter((j) => j.id !== id));
      toast.success('Job removed from saved list');
    } catch {
      toast.error('Failed to remove saved job');
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition';
  const labelClass = 'block text-[11px] font-mono text-slate-400 mb-1 uppercase tracking-wide';

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-archival-100 border border-archival-200 text-royal-600 flex items-center justify-center">
            <Bookmark className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight">Saved Jobs</h1>
            <p className="text-xs font-mono text-slate-400 mt-0.5">
              Your curated pipeline of target opportunities.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={openNewModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow transition"
        >
          <Plus className="w-4 h-4" />
          Save a Job
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search saved jobs by company, role, or location..."
          className="w-full pl-9 pr-4 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
        />
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="animate-pulse bg-archival-100 border border-archival-200 rounded-2xl h-24" />
          ))}
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-20 flex flex-col items-center gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-archival-100 border border-archival-200 flex items-center justify-center text-slate-400">
            <Bookmark className="w-7 h-7" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-100">
              {searchQuery ? 'No jobs match your search' : 'No saved jobs yet'}
            </h3>
            <p className="text-xs font-mono text-slate-400 mt-1">
              {searchQuery
                ? 'Try a different search term.'
                : 'Bookmark opportunities and track them here.'}
            </p>
          </div>
          {!searchQuery && (
            <button
              type="button"
              onClick={openNewModal}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow transition"
            >
              <Plus className="w-4 h-4" />
              Add First Job
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => {
            const priorityConf = PRIORITY_CONFIG[job.priority] || PRIORITY_CONFIG[2];
            return (
              <div
                key={job.id}
                className="group p-4 rounded-2xl bg-white border border-archival-200 hover:border-archival-300 shadow-paper-xs hover:shadow-paper-sm transition-all flex items-start justify-between gap-4"
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-mono border font-semibold ${priorityConf.color}`}
                    >
                      {priorityConf.label} Priority
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <h3 className="font-semibold text-sm text-slate-100">{job.roleTitle}</h3>
                  <div className="flex items-center gap-4 mt-1 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Building2 className="w-3 h-3 text-slate-400" />
                      {job.company}
                    </span>
                    {job.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {job.location}
                      </span>
                    )}
                  </div>
                  {job.rawSnippet && (
                    <p className="text-[11px] font-sans text-slate-400 mt-1.5 line-clamp-2 leading-relaxed">
                      {job.rawSnippet}
                    </p>
                  )}
                  {job.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {job.tags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-royal-50 text-royal-700 border border-royal-200 text-[10px] font-mono"
                        >
                          <Tag className="w-2.5 h-2.5" />
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-1.5 flex-shrink-0">
                  {job.jobUrl && (
                    <a
                      href={job.jobUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-1.5 text-slate-400 hover:text-royal-600 hover:bg-archival-100 rounded-lg transition"
                      title="Open job posting"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                    </a>
                  )}
                  <button
                    type="button"
                    onClick={() => openEditModal(job)}
                    className="p-1.5 text-slate-400 hover:text-royal-600 hover:bg-archival-100 rounded-lg transition"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(job.id, job.company, job.roleTitle)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-archival-100 rounded-lg transition"
                    title="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Stats bar */}
      {!isLoading && jobs.length > 0 && (
        <div className="flex items-center gap-4 text-[11px] font-mono text-slate-400 pt-2 border-t border-archival-200">
          <span>{jobs.length} saved</span>
          <span>{jobs.filter((j) => j.priority === 3).length} high priority</span>
          <span>{jobs.filter((j) => j.jobUrl).length} with links</span>
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-lg bg-white border border-archival-200 rounded-2xl shadow-paper-lg">
            <div className="flex items-center justify-between p-5 border-b border-archival-200 bg-archival-50 rounded-t-2xl">
              <h3 className="font-semibold text-sm text-slate-100 flex items-center gap-2">
                <Bookmark className="w-4 h-4 text-royal-600" />
                {editingJob ? 'Edit Saved Job' : 'Save a Job Opportunity'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-slate-400 hover:text-slate-100 hover:bg-archival-100 rounded-lg transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-5 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className={labelClass}>Company *</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="Stripe"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Role Title *</label>
                  <input
                    type="text"
                    value={formRole}
                    onChange={(e) => setFormRole(e.target.value)}
                    placeholder="Software Engineer"
                    required
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Location</label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="Remote, San Francisco"
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className={labelClass}>Priority</label>
                  <div className="grid grid-cols-3 gap-1.5">
                    {[
                      { val: 1, label: 'Low' },
                      { val: 2, label: 'Medium' },
                      { val: 3, label: 'High' },
                    ].map(({ val, label }) => (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setFormPriority(val)}
                        className={`py-2 px-3 rounded-xl text-xs font-mono font-medium transition ${
                          formPriority === val
                            ? 'bg-royal-600 text-white shadow-sm'
                            : 'bg-white border border-archival-200 text-slate-400 hover:text-slate-100 hover:border-archival-300'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Job URL</label>
                  <input
                    type="url"
                    value={formUrl}
                    onChange={(e) => setFormUrl(e.target.value)}
                    placeholder="https://jobs.stripe.com/..."
                    className={inputClass}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Notes / Job Snippet</label>
                  <textarea
                    value={formSnippet}
                    onChange={(e) => setFormSnippet(e.target.value)}
                    rows={3}
                    placeholder="Key requirements, notes, or paste the job description snippet..."
                    className={`${inputClass} resize-none leading-relaxed`}
                  />
                </div>
                <div className="col-span-2">
                  <label className={labelClass}>Tags</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }}
                      placeholder="e.g. React, Remote, FinTech — Enter to add"
                      className={`${inputClass} flex-1`}
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      className="px-3 rounded-xl bg-royal-50 border border-royal-200 text-royal-600 hover:bg-royal-100 transition"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                  {formTags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mt-2">
                      {formTags.map((tag) => (
                        <span
                          key={tag}
                          className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-royal-50 text-royal-700 border border-royal-200 text-[11px] font-mono"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => setFormTags((t) => t.filter((x) => x !== tag))}
                            className="text-slate-400 hover:text-rose-500 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-archival-200 bg-archival-50 -mx-5 -mb-5 p-4 rounded-b-2xl">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-archival-100 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSaving}
                  className="flex items-center gap-2 px-5 py-1.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow transition disabled:opacity-50"
                >
                  {isSaving ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {editingJob ? 'Update Job' : 'Save Job'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
