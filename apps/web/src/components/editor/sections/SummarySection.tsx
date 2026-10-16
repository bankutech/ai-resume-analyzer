import React, { useState } from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Eye, EyeOff, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';
import { useToast } from '../../../context/ToastContext';

export const SummarySection: React.FC = () => {
  const summary = useResumeEditorStore((state) => state.document.summary);
  const updateSummary = useResumeEditorStore((state) => state.updateSummary);
  const targetJobTitle = useResumeEditorStore((state) => state.targetJobTitle);
  const experience = useResumeEditorStore((state) => state.document.experience);
  const skills = useResumeEditorStore((state) => state.document.skills);
  const toast = useToast();

  const [isGenerating, setIsGenerating] = useState(false);

  const characterCount = summary?.content?.length || 0;
  const isOptimal = characterCount >= 100 && characterCount <= 450;

  const handleGenerateAiSummary = async () => {
    setIsGenerating(true);
    try {
      const res = await api.post<{ status: string; summary: string }>('/ai/generate-summary', {
        roleTitle: targetJobTitle || 'Software Engineer',
        experience: experience || [],
        skills: skills || [],
      });

      if (res?.summary) {
        updateSummary(res.summary, true);
        toast.success('Summary Generated', 'Executive 3-sentence summary drafted with Gemini AI.');
      }
    } catch (err: any) {
      toast.error('Generation Failed', err.message || 'Could not generate summary.');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-3 p-4 bg-archival-50 rounded-xl border border-archival-200">
      <div className="flex items-center justify-between">
        <label className="text-xs font-mono font-medium text-slate-400">
          Professional / Career Summary
        </label>
        <div className="flex items-center gap-3">
          <span
            className={`text-[11px] font-mono font-semibold ${
              isOptimal ? 'text-forest-700' : 'text-ochre-600'
            }`}
          >
            {characterCount} chars {isOptimal ? '(ATS Optimal)' : '(Target: 150-400)'}
          </span>
          <button
            type="button"
            onClick={() => updateSummary(summary?.content || '', !summary?.visible)}
            className="flex items-center gap-1 text-xs font-mono text-slate-400 hover:text-slate-100 transition"
          >
            {summary?.visible ? <Eye className="w-3.5 h-3.5 text-royal-600" /> : <EyeOff className="w-3.5 h-3.5 text-slate-400" />}
            {summary?.visible ? 'Visible' : 'Hidden'}
          </button>
        </div>
      </div>

      <textarea
        rows={4}
        value={summary?.content || ''}
        onChange={(e) => updateSummary(e.target.value, summary?.visible ?? true)}
        placeholder="Write a concise 2-3 sentence overview of your technical background, core specialization, engineering methodologies, and quantifiable achievements..."
        className="w-full px-3 py-2.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none leading-relaxed font-sans transition"
      />

      <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-1">
        <span>💡 Mention years of experience, core stack, and greatest measured impact.</span>
        <button
          type="button"
          disabled={isGenerating}
          onClick={handleGenerateAiSummary}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-royal-50 hover:bg-royal-100 text-royal-700 border border-royal-200 text-[11px] font-mono transition disabled:opacity-40"
        >
          {isGenerating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Sparkles className="w-3 h-3" />}
          <span>{isGenerating ? 'Generating...' : 'AI Draft'}</span>
        </button>
      </div>
    </div>
  );
};
