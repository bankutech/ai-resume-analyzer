import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import {
  Plus,
  Search,
  Sparkles,
  Copy,
  Trash2,
  Clock,
  Loader2,
  X,
  CheckCircle2,
  Building2,
  Feather,
  Wand2,
} from 'lucide-react';

export type CoverLetterTone = 'professional' | 'casual' | 'enthusiastic' | 'formal';

export interface CoverLetterItem {
  id: string;
  title: string;
  company?: string | null;
  roleTitle?: string | null;
  tone: string;
  content: string;
  resumeId?: string | null;
  resume?: {
    id: string;
    title: string;
  } | null;
  createdAt: string;
  updatedAt: string;
}

interface ResumeSummary {
  id: string;
  title: string;
}

const TONE_OPTIONS: Array<{ value: CoverLetterTone; label: string; desc: string }> = [
  { value: 'professional', label: 'Professional', desc: 'Balanced, confident, and results-focused.' },
  { value: 'formal', label: 'Formal / Executive', desc: 'Structured, traditional, and respectful.' },
  { value: 'enthusiastic', label: 'Enthusiastic', desc: 'High-energy, passionate, and mission-aligned.' },
  { value: 'casual', label: 'Casual & Conversational', desc: 'Approachable, warm, and tech-forward.' },
];

export const CoverLettersPage: React.FC = () => {
  const toast = useToast();
  const queryClient = useQueryClient();

  const [searchQuery, setSearchQuery] = useState('');
  const [toneFilter, setToneFilter] = useState<string>('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLetterId, setEditingLetterId] = useState<string | null>(null);

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formCompany, setFormCompany] = useState('');
  const [formRoleTitle, setFormRoleTitle] = useState('');
  const [formTone, setFormTone] = useState<CoverLetterTone>('professional');
  const [formContent, setFormContent] = useState('');
  const [formResumeId, setFormResumeId] = useState<string>('');

  // AI Generation Drawer / Section inside Modal
  const [showAiDrawer, setShowAiDrawer] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState('');
  const [aiCompany, setAiCompany] = useState('');
  const [aiTone, setAiTone] = useState<CoverLetterTone>('professional');
  const [aiJobDescription, setAiJobDescription] = useState('');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);

  // Fetch cover letters
  const {
    data: coverLetters = [],
    isLoading,
  } = useQuery<CoverLetterItem[]>({
    queryKey: ['cover-letters'],
    queryFn: async () => {
      try {
        const res = await api.get<{ status?: string; coverLetters?: CoverLetterItem[] } | CoverLetterItem[]>('/cover-letters');
        if ('coverLetters' in res && Array.isArray(res.coverLetters)) {
          return res.coverLetters;
        }
        if (Array.isArray(res)) {
          return res;
        }
        return [];
      } catch (err: unknown) {
        console.error('[Fetch Cover Letters Error]', err);
        return [];
      }
    },
  });

  // Fetch user resumes for optional linking in AI generation
  const { data: resumes = [] } = useQuery<ResumeSummary[]>({
    queryKey: ['resumes-summary'],
    queryFn: async () => {
      try {
        const res = await api.get<{ status?: string; resumes?: ResumeSummary[] }>('/resumes');
        return res.resumes || [];
      } catch {
        return [];
      }
    },
  });

  // Open Creation Modal
  const handleOpenCreateModal = () => {
    setEditingLetterId(null);
    setFormTitle('Cover Letter — ' + (coverLetters.length + 1));
    setFormCompany('');
    setFormRoleTitle('');
    setFormTone('professional');
    setFormContent('');
    setFormResumeId('');
    setShowAiDrawer(true); // Open AI drawer by default for new creations
    setAiJobTitle('');
    setAiCompany('');
    setAiTone('professional');
    setAiJobDescription('');
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (letter: CoverLetterItem) => {
    setEditingLetterId(letter.id);
    setFormTitle(letter.title);
    setFormCompany(letter.company || '');
    setFormRoleTitle(letter.roleTitle || '');
    const matchedTone = TONE_OPTIONS.find((t) => t.value === letter.tone)?.value || 'professional';
    setFormTone(matchedTone);
    setFormContent(letter.content);
    setFormResumeId(letter.resumeId || '');
    setShowAiDrawer(false);
    setAiJobTitle(letter.roleTitle || '');
    setAiCompany(letter.company || '');
    setAiTone(matchedTone);
    setAiJobDescription('');
    setIsModalOpen(true);
  };

  // Create Mutation
  const createMutation = useMutation({
    mutationFn: async (payload: {
      title: string;
      company?: string;
      roleTitle?: string;
      tone: string;
      content: string;
      resumeId?: string;
    }) => {
      return api.post<{ status: string; coverLetter: CoverLetterItem }>('/cover-letters', payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      toast.success('Cover Letter Created', `Saved "${formTitle}" to your document library.`);
      setIsModalOpen(false);
    },
    onError: (err: Error) => {
      toast.error('Creation Failed', err.message || 'Unable to save cover letter.');
    },
  });

  // Update Mutation
  const updateMutation = useMutation({
    mutationFn: async (payload: {
      id: string;
      data: {
        title?: string;
        company?: string;
        roleTitle?: string;
        tone?: string;
        content?: string;
        resumeId?: string | null;
      };
    }) => {
      return api.put<{ status: string; coverLetter: CoverLetterItem }>(
        `/cover-letters/${payload.id}`,
        payload.data
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      toast.success('Cover Letter Updated', `Saved changes to "${formTitle}".`);
      setIsModalOpen(false);
    },
    onError: (err: Error) => {
      toast.error('Update Failed', err.message || 'Unable to update cover letter.');
    },
  });

  // Delete Mutation
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return api.delete<{ status: string }>(`/cover-letters/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cover-letters'] });
      toast.success('Cover Letter Deleted', 'Document removed from database.');
    },
    onError: (err: Error) => {
      toast.error('Deletion Failed', err.message || 'Unable to delete cover letter.');
    },
  });

  // Delete confirmation handler
  const handleDelete = (id: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Delete cover letter "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  // Copy to clipboard helper
  const handleCopy = (text: string, title: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    navigator.clipboard.writeText(text);
    toast.success('Copied to Clipboard', `"${title}" text copied.`);
  };

  // AI Generation Handler
  const handleGenerateAi = async () => {
    if (!aiJobTitle.trim() || !aiCompany.trim()) {
      toast.warning('Missing Information', 'Please provide Job Title and Company for AI tailoring.');
      return;
    }

    try {
      setIsGeneratingAi(true);
      const res = await api.post<{ status: string; content: string }>('/cover-letters/generate', {
        jobTitle: aiJobTitle.trim(),
        company: aiCompany.trim(),
        tone: aiTone,
        jobDescription: aiJobDescription.trim() || undefined,
        resumeId: formResumeId || undefined,
      });

      if (res.content) {
        setFormContent(res.content);
        if (!formTitle || formTitle.startsWith('Cover Letter —')) {
          setFormTitle(`${aiCompany} — ${aiJobTitle}`);
        }
        if (!formCompany) setFormCompany(aiCompany);
        if (!formRoleTitle) setFormRoleTitle(aiJobTitle);
        setFormTone(aiTone);
        setShowAiDrawer(false);
        toast.success('Cover Letter Drafted', 'Gemini AI generated tailored paragraphs. Review below.');
      }
    } catch (err: any) {
      toast.error('AI Generation Failed', err.message || 'Unable to generate cover letter.');
    } finally {
      setIsGeneratingAi(false);
    }
  };

  // Save Modal Form
  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.warning('Title Required', 'Please give this cover letter a descriptive title.');
      return;
    }
    if (!formContent.trim()) {
      toast.warning('Content Required', 'Cover letter content cannot be blank.');
      return;
    }

    if (editingLetterId) {
      updateMutation.mutate({
        id: editingLetterId,
        data: {
          title: formTitle.trim(),
          company: formCompany.trim() || undefined,
          roleTitle: formRoleTitle.trim() || undefined,
          tone: formTone,
          content: formContent.trim(),
          resumeId: formResumeId || null,
        },
      });
    } else {
      createMutation.mutate({
        title: formTitle.trim(),
        company: formCompany.trim() || undefined,
        roleTitle: formRoleTitle.trim() || undefined,
        tone: formTone,
        content: formContent.trim(),
        resumeId: formResumeId || undefined,
      });
    }
  };

  // Filter & Search Logic
  const filteredLetters = coverLetters.filter((letter) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      letter.title.toLowerCase().includes(q) ||
      (letter.company || '').toLowerCase().includes(q) ||
      (letter.roleTitle || '').toLowerCase().includes(q) ||
      letter.content.toLowerCase().includes(q);

    const matchesTone =
      toneFilter === 'ALL' || letter.tone.toLowerCase() === toneFilter.toLowerCase();

    return matchesSearch && matchesTone;
  });

  const getToneBadge = (tone: string) => {
    const t = tone.toLowerCase();
    if (t === 'casual') {
      return 'bg-sky-50 text-sky-800 border-sky-200';
    }
    if (t === 'enthusiastic') {
      return 'bg-amber-50 text-amber-800 border-amber-200';
    }
    if (t === 'formal') {
      return 'bg-royal-50 text-royal-800 border-royal-200';
    }
    return 'bg-forest-50 text-forest-800 border-forest-200';
  };

  return (
    <div className="p-6 md:p-8 space-y-6 max-w-7xl mx-auto">
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-carbon-700 pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 shadow-sm">
              <Feather className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight">
                Cover Letters & Application Pitches
              </h1>
              <p className="text-xs font-mono text-slate-400 mt-0.5">
                Generate high-conversion cover letters tailored to job descriptions with Gemini AI.
              </p>
            </div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenCreateModal}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm transition"
        >
          <Plus className="w-4 h-4" />
          <span>New Cover Letter</span>
        </button>
      </div>

      {/* 2. Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative flex-1 w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search company, title, or keywords..."
            className="w-full pl-9 pr-4 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none shadow-sm"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
          {['ALL', 'professional', 'casual', 'enthusiastic', 'formal'].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setToneFilter(t)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono capitalize transition ${
                toneFilter === t
                  ? 'bg-carbon-850 text-royal-700 font-semibold border border-carbon-700 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-carbon-850'
              }`}
            >
              {t === 'ALL' ? 'All Tones' : t}
            </button>
          ))}
        </div>
      </div>

      {/* 3. Grid of Cover Letter Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white border border-carbon-700 animate-pulse space-y-3 h-64 shadow-sm"
            >
              <div className="h-5 bg-carbon-800 rounded w-2/3" />
              <div className="h-4 bg-carbon-800/80 rounded w-1/2" />
              <div className="space-y-2 pt-2">
                <div className="h-3 bg-carbon-800/60 rounded w-full" />
                <div className="h-3 bg-carbon-800/60 rounded w-5/6" />
                <div className="h-3 bg-carbon-800/60 rounded w-4/6" />
              </div>
            </div>
          ))}
        </div>
      ) : filteredLetters.length === 0 ? (
        /* 4. Empty State */
        <div className="p-16 rounded-2xl bg-white border border-dashed border-carbon-700 text-center space-y-4 shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 mx-auto">
            <Feather className="w-7 h-7 text-royal-600" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">No cover letters crafted yet</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              Generate tailored cover letters for each job application using Gemini 2.5 Flash AI or write one manually.
            </p>
          </div>
          <div className="pt-2">
            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm transition"
            >
              <Plus className="w-4 h-4" />
              <span>Draft First Cover Letter</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredLetters.map((letter) => (
            <div
              key={letter.id}
              onClick={() => handleOpenEditModal(letter)}
              className="p-5 rounded-2xl bg-white hover:bg-carbon-850/60 border border-carbon-700 hover:border-royal-400/80 transition-all cursor-pointer group flex flex-col justify-between shadow-sm space-y-4"
            >
              <div>
                {/* Header & Badges */}
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm text-slate-100 group-hover:text-royal-700 transition truncate">
                      {letter.title}
                    </h3>

                    {(letter.company || letter.roleTitle) && (
                      <div className="flex items-center gap-2 text-xs font-mono text-slate-400 mt-1 flex-wrap">
                        {letter.company && (
                          <span className="flex items-center gap-1 text-slate-200">
                            <Building2 className="w-3 h-3 text-royal-600" />
                            {letter.company}
                          </span>
                        )}
                        {letter.company && letter.roleTitle && <span>•</span>}
                        {letter.roleTitle && (
                          <span className="truncate">{letter.roleTitle}</span>
                        )}
                      </div>
                    )}
                  </div>

                  <span
                    className={`text-[10px] font-mono px-2 py-0.5 rounded-full border capitalize shrink-0 font-medium ${getToneBadge(
                      letter.tone
                    )}`}
                  >
                    {letter.tone}
                  </span>
                </div>

                {/* Excerpt */}
                <p className="text-xs font-sans text-slate-400 mt-3 line-clamp-3 leading-relaxed">
                  {letter.content}
                </p>
              </div>

              {/* Bottom Telemetry & Quick Actions */}
              <div className="pt-3 border-t border-carbon-700 flex items-center justify-between text-[11px] font-mono text-slate-400">
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3 text-slate-400" />
                  {new Date(letter.updatedAt).toLocaleDateString()}
                </span>

                <div className="flex items-center gap-1">
                  <button
                    type="button"
                    onClick={(e) => handleCopy(letter.content, letter.title, e)}
                    className="p-1.5 text-slate-400 hover:text-royal-600 hover:bg-carbon-800 rounded-lg transition"
                    title="Copy full cover letter"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDelete(letter.id, letter.title, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-carbon-800 rounded-lg transition"
                    title="Delete cover letter"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 4. CRUD & AI Generation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm overflow-y-auto">
          <div className="w-full max-w-3xl bg-white border border-carbon-700 rounded-2xl p-6 shadow-2xl space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-carbon-700 pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
                  <Feather className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-slate-100">
                    {editingLetterId ? 'Edit Cover Letter' : 'Draft New Cover Letter'}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400">
                    Fine-tune tone, structure, and targeted achievements.
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setShowAiDrawer(!showAiDrawer)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono transition border ${
                    showAiDrawer
                      ? 'bg-royal-50 text-royal-700 border-royal-200 font-semibold'
                      : 'bg-white text-slate-400 border-carbon-700 hover:text-royal-700'
                  }`}
                >
                  <Wand2 className="w-3.5 h-3.5 text-royal-600" />
                  <span>{showAiDrawer ? 'Hide AI Generator' : 'Generate with AI'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-carbon-800 transition"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 5. "Generate with AI" Section in Modal */}
            {showAiDrawer && (
              <div className="p-4 rounded-xl bg-royal-50/50 border border-royal-200 space-y-3.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-mono font-semibold text-royal-700">
                    <Sparkles className="w-4 h-4" />
                    <span>Gemini 2.5 Flash Tailoring Engine</span>
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    Context-aware ATS generation
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Target Job Title *</label>
                    <input
                      type="text"
                      value={aiJobTitle}
                      onChange={(e) => setAiJobTitle(e.target.value)}
                      placeholder="e.g. Senior Software Engineer"
                      className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Target Company *</label>
                    <input
                      type="text"
                      value={aiCompany}
                      onChange={(e) => setAiCompany(e.target.value)}
                      placeholder="e.g. Stripe or Google"
                      className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none shadow-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">Tone & Voice</label>
                    <select
                      value={aiTone}
                      onChange={(e) => setAiTone(e.target.value as CoverLetterTone)}
                      className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 focus:border-royal-500 focus:outline-none shadow-sm"
                    >
                      {TONE_OPTIONS.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono text-slate-400 mb-1">
                      Candidate Resume Context (Optional)
                    </label>
                    <select
                      value={formResumeId}
                      onChange={(e) => setFormResumeId(e.target.value)}
                      className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 focus:border-royal-500 focus:outline-none shadow-sm"
                    >
                      <option value="">No Resume (General Pitch)</option>
                      {resumes.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.title}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">
                    Paste Job Description / Requirements (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={aiJobDescription}
                    onChange={(e) => setAiJobDescription(e.target.value)}
                    placeholder="Paste job posting text here so Gemini can mirror matching tech keywords and qualifications..."
                    className="w-full p-2.5 bg-white border border-carbon-700 rounded-lg text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none leading-relaxed shadow-sm"
                  />
                </div>

                <div className="flex justify-end pt-1">
                  <button
                    type="button"
                    onClick={handleGenerateAi}
                    disabled={isGeneratingAi || !aiJobTitle.trim() || !aiCompany.trim()}
                    className="flex items-center gap-2 px-4 py-1.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-medium shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {isGeneratingAi ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{isGeneratingAi ? 'Synthesizing with Gemini...' : 'Generate with AI'}</span>
                  </button>
                </div>
              </div>
            )}

            {/* 6. Form & Manual Editor */}
            <form onSubmit={handleSaveModal} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-1">
                  <label className="block text-xs font-mono text-slate-400 mb-1">Document Title *</label>
                  <input
                    type="text"
                    required
                    value={formTitle}
                    onChange={(e) => setFormTitle(e.target.value)}
                    placeholder="e.g. Stripe Backend Lead Pitch"
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Target Company</label>
                  <input
                    type="text"
                    value={formCompany}
                    onChange={(e) => setFormCompany(e.target.value)}
                    placeholder="e.g. Stripe"
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none shadow-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Role Title</label>
                  <input
                    type="text"
                    value={formRoleTitle}
                    onChange={(e) => setFormRoleTitle(e.target.value)}
                    placeholder="e.g. Senior Software Engineer"
                    className="w-full px-3 py-1.5 bg-white border border-carbon-700 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* Large Manual Textarea Editor */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-mono text-slate-400">
                    Cover Letter Body *
                  </label>
                  <div className="flex items-center gap-3 text-[10.5px] font-mono text-slate-400">
                    <span>
                      {formContent.trim().split(/\s+/).filter(Boolean).length} words
                    </span>
                    <span>•</span>
                    <span>{formContent.length} characters</span>
                    <button
                      type="button"
                      onClick={() => handleCopy(formContent, formTitle)}
                      className="text-slate-400 hover:text-royal-600 ml-1 transition"
                      title="Copy text"
                    >
                      Copy
                    </button>
                  </div>
                </div>

                <textarea
                  required
                  rows={12}
                  value={formContent}
                  onChange={(e) => setFormContent(e.target.value)}
                  placeholder="Dear Hiring Team,&#10;&#10;I am writing to express my strong interest in the role..."
                  className="w-full p-4 bg-white border border-carbon-700 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:border-royal-500 focus:outline-none transition leading-relaxed shadow-sm"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-carbon-700">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 transition"
                >
                  Cancel
                </button>

                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={
                      createMutation.isPending ||
                      updateMutation.isPending ||
                      !formTitle.trim() ||
                      !formContent.trim()
                    }
                    className="flex items-center gap-2 px-5 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-medium shadow-sm transition disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending || updateMutation.isPending ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {editingLetterId ? 'Save Changes' : 'Create Cover Letter'}
                    </span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
