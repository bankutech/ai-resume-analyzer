import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../../lib/api';
import {
  FileText,
  Zap,
  ArrowRight,
  Check,
  Loader2,
  Terminal,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';
import { SAMPLE_STUDENT_RESUME_DOCUMENT, TemplateSlug } from '@resumeforge/shared';

export const NewResumePage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [title, setTitle] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<TemplateSlug>('classic-ats');
  const [presetType, setPresetType] = useState<'sample' | 'blank' | 'swe'>('sample');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    let docToUse = JSON.parse(JSON.stringify(SAMPLE_STUDENT_RESUME_DOCUMENT));
    docToUse.metadata.templateId = selectedTemplate;

    if (presetType === 'blank') {
      docToUse = {
        ...docToUse,
        basics: {
          fullName: 'Your Full Name',
          headline: targetJobTitle || 'Software Engineer',
          email: 'you@example.com',
          phone: '+1 555-0199',
          location: 'City, Country',
          links: [],
        },
        summary: { visible: true, content: '' },
        experience: [],
        education: [],
        projects: [],
        skills: [{ id: 'sk-1', category: 'Core Skills', items: ['TypeScript', 'SQL'], visible: true }],
        honors: [],
        certifications: [],
      };
    } else if (presetType === 'swe') {
      docToUse.metadata.templateId = 'software-engineer';
      docToUse.basics.headline = 'Senior Distributed Systems & Cloud Engineer';
    }

    try {
      const res = await api.post<{ status: string; resume: { id: string } }>('/resumes', {
        title: title.trim() || (presetType === 'sample' ? 'Alex Rivera (Sample Profile)' : 'Engineering Resume'),
        targetJobTitle: targetJobTitle.trim() || 'Software Engineer',
        templateSlug: selectedTemplate,
        document: docToUse,
        isSample: presetType === 'sample',
      });

      if (res.resume?.id) {
        toast.success('Resume Initialized', `Created "${title || 'Untitled Resume'}" ready for editing.`);
        navigate(`/app/resumes/${res.resume.id}/edit`);
      }
    } catch (err: any) {
      toast.error('Creation Failed', err.message || 'Failed to create resume document');
      setError(err.message || 'Failed to create resume document');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 md:p-8 max-w-4xl mx-auto space-y-8">
      <div className="border-b border-archival-200 pb-6">
        <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 shadow-paper-xs">
            <FileText className="w-4 h-4" />
          </div>
          Create New Resume Document
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Select a baseline persona or start from scratch with an ATS-compliant layout.
        </p>
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Step 1: Starter Preset */}
        <div className="space-y-3">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            1. Select Starter Profile
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div
              onClick={() => {
                setPresetType('sample');
                setTitle('Alex Rivera — Full-Stack & ML Profile');
                setTargetJobTitle('Full-Stack Software Engineer');
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                presetType === 'sample'
                  ? 'bg-royal-50/60 border-royal-600 shadow-paper-sm ring-1 ring-royal-600/20'
                  : 'bg-white border-archival-200 hover:border-archival-300 shadow-paper-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Zap className="w-5 h-5 text-forest-700" />
                {presetType === 'sample' && <Check className="w-4 h-4 text-royal-600" />}
              </div>
              <h3 className="font-semibold text-sm text-slate-100">Alex Rivera Persona</h3>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Complete B.Tech CSE undergrad profile with MarketPulse AI, LexGuard, hackathons, and high ATS score.
              </p>
            </div>

            <div
              onClick={() => {
                setPresetType('blank');
                setTitle('Untitled Blank Resume');
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                presetType === 'blank'
                  ? 'bg-royal-50/60 border-royal-600 shadow-paper-sm ring-1 ring-royal-600/20'
                  : 'bg-white border-archival-200 hover:border-archival-300 shadow-paper-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileText className="w-5 h-5 text-royal-600" />
                {presetType === 'blank' && <Check className="w-4 h-4 text-royal-600" />}
              </div>
              <h3 className="font-semibold text-sm text-slate-100">Blank Canvas</h3>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                Clean slate with empty sections ready for your unique experience and career history.
              </p>
            </div>

            <div
              onClick={() => {
                setPresetType('swe');
                setSelectedTemplate('software-engineer');
                setTitle('Distributed Systems SWE Profile');
                setTargetJobTitle('Senior Backend / Infrastructure Engineer');
              }}
              className={`p-4 rounded-xl border text-left cursor-pointer transition-all ${
                presetType === 'swe'
                  ? 'bg-royal-50/60 border-royal-600 shadow-paper-sm ring-1 ring-royal-600/20'
                  : 'bg-white border-archival-200 hover:border-archival-300 shadow-paper-xs'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <Terminal className="w-5 h-5 text-ochre-600" />
                {presetType === 'swe' && <Check className="w-4 h-4 text-royal-600" />}
              </div>
              <h3 className="font-semibold text-sm text-slate-100">Systems & SWE Pro</h3>
              <p className="text-xs text-slate-400 mt-1 leading-snug">
                High-concurrency infrastructure focus with JetBrains Mono telemetry and Google X-Y-Z metrics.
              </p>
            </div>
          </div>
        </div>

        {/* Step 2: Details */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            2. Resume Title & Target Position
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Document Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Alex Rivera — Staff Backend Engineer"
                className="w-full px-3.5 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Target Role / Job Title</label>
              <input
                type="text"
                value={targetJobTitle}
                onChange={(e) => setTargetJobTitle(e.target.value)}
                placeholder="e.g. Full-Stack Developer or Distributed Systems"
                className="w-full px-3.5 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-sans text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
              />
            </div>
          </div>
        </div>

        {/* Step 3: Initial Template */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            3. Choose Initial Template Style
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { id: 'classic-ats', name: 'Classic ATS', desc: 'Ivy League / MIT 1-col standard' },
              { id: 'modern-professional', name: 'Modern Professional', desc: 'Clean horizontal rules & pills' },
              { id: 'student-fresher', name: 'Student & Fresher', desc: 'Projects & Coursework first' },
              { id: 'software-engineer', name: 'SWE Tech', desc: 'Monospace telemetry & impact' },
              { id: 'academic-research', name: 'Academic CV', desc: 'Serif scholarly typography' },
              { id: 'creative-portfolio', name: 'Creative Minimal', desc: 'Asymmetric Swiss editorial' },
            ].map((tpl) => (
              <button
                key={tpl.id}
                type="button"
                onClick={() => setSelectedTemplate(tpl.id as TemplateSlug)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  selectedTemplate === tpl.id
                    ? 'bg-royal-50 border-royal-600 text-royal-700 shadow-paper-xs ring-1 ring-royal-600/20'
                    : 'bg-white border-archival-200 text-slate-300 hover:border-archival-300 shadow-paper-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-semibold text-xs text-slate-100">{tpl.name}</span>
                  {selectedTemplate === tpl.id && <Check className="w-3.5 h-3.5 text-royal-600" />}
                </div>
                <p className="text-[11px] text-slate-400 leading-tight">{tpl.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-4 border-t border-archival-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={() => navigate('/app/resumes')}
            className="px-4 py-2 rounded-xl text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-archival-100 transition"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-semibold text-xs font-mono shadow-paper-sm transition disabled:opacity-40"
          >
            {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>Open in Interactive Studio</span>
          </button>
        </div>
      </form>
    </div>
  );
};
