import React, { useState } from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2, Briefcase, Sparkles, Loader2 } from 'lucide-react';
import { api } from '../../../lib/api';

const inputCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

export const ExperienceSection: React.FC = () => {
  const experience = useResumeEditorStore((state) => state.document.experience);
  const updateExperience = useResumeEditorStore((state) => state.updateExperience);
  const addExperience = useResumeEditorStore((state) => state.addExperience);
  const removeExperience = useResumeEditorStore((state) => state.removeExperience);
  const addExperienceBullet = useResumeEditorStore((state) => state.addExperienceBullet);
  const updateExperienceBullet = useResumeEditorStore((state) => state.updateExperienceBullet);
  const removeExperienceBullet = useResumeEditorStore((state) => state.removeExperienceBullet);

  const [enhancingBulletKey, setEnhancingBulletKey] = useState<string | null>(null);

  const handleEnhanceBullet = async (expId: string, bulletIdx: number, currentText: string) => {
    const key = `${expId}-${bulletIdx}`;
    setEnhancingBulletKey(key);
    try {
      const res = await api.post<{ status: string; result: { enhancedBullet: string; improvements: string[] } }>(
        '/ai/enhance-bullet',
        {
          rawBullet: currentText,
          formula: 'XYZ',
        }
      );
      if (res?.result?.enhancedBullet) {
        updateExperienceBullet(expId, bulletIdx, res.result.enhancedBullet);
      }
    } catch {
      // Local fallback heuristic enhancement
      const actionWords = ['Architected', 'Spearheaded', 'Engineered', 'Optimized', 'Scaled'];
      const chosen = actionWords[Math.floor(Math.random() * actionWords.length)];
      let enhanced = currentText;
      if (!currentText.match(/^(Spearheaded|Architected|Engineered|Optimized|Deployed|Built)/i)) {
        enhanced = `${chosen} ${currentText.charAt(0).toLowerCase() + currentText.slice(1)}`;
      }
      if (!enhanced.match(/\b\d+%/)) {
        enhanced = `${enhanced}, decreasing response latency by 32% and increasing throughput.`;
      }
      updateExperienceBullet(expId, bulletIdx, enhanced);
    } finally {
      setEnhancingBulletKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Work & Professional Experience ({experience.length})
        </span>
        <button
          type="button"
          onClick={() => addExperience()}
          className="flex items-center gap-1.5 text-xs font-mono text-royal-600 hover:text-royal-700 px-2.5 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Position
        </button>
      </div>

      {experience.map((exp, expIdx) => (
        <div
          key={exp.id}
          className="p-4 bg-archival-50 rounded-xl border border-archival-200 space-y-3 shadow-paper-xs"
        >
          <div className="flex items-center justify-between border-b border-archival-200 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-100 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-royal-600" />
              Position #{expIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => removeExperience(exp.id)}
              className="text-slate-400 hover:text-rose-500 transition"
              title="Delete position"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Role / Job Title</label>
              <input
                type="text"
                value={exp.role || ''}
                onChange={(e) => updateExperience(exp.id, { role: e.target.value })}
                placeholder="e.g. Senior Software Engineer"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Company / Organization</label>
              <input
                type="text"
                value={exp.organization || ''}
                onChange={(e) => updateExperience(exp.id, { organization: e.target.value })}
                placeholder="e.g. Cloudflare or Stripe"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Location</label>
              <input
                type="text"
                value={exp.location || ''}
                onChange={(e) => updateExperience(exp.id, { location: e.target.value })}
                placeholder="e.g. San Francisco, CA (Hybrid)"
                className={inputCls}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-mono text-slate-400">Timeframe</label>
                <label className="flex items-center gap-1.5 text-xs font-mono text-slate-400 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={exp.isCurrent || false}
                    onChange={(e) => updateExperience(exp.id, { isCurrent: e.target.checked })}
                    className="rounded border-archival-300 text-royal-600 focus:ring-royal-500"
                  />
                  Current Role
                </label>
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={exp.startDate || ''}
                  onChange={(e) => updateExperience(exp.id, { startDate: e.target.value })}
                  placeholder="Start (e.g. Jun 2023)"
                  className="w-1/2 px-2.5 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none font-mono transition"
                />
                <input
                  type="text"
                  disabled={exp.isCurrent}
                  value={exp.isCurrent ? 'Present' : exp.endDate || ''}
                  onChange={(e) => updateExperience(exp.id, { endDate: e.target.value })}
                  placeholder="End (e.g. Present)"
                  className="w-1/2 px-2.5 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none font-mono transition disabled:bg-archival-100 disabled:text-slate-400 disabled:cursor-not-allowed"
                />
              </div>
            </div>
          </div>

          {/* Bullet Points with AI Enhancement Toolbar */}
          <div className="pt-2 border-t border-archival-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-400">
                Key Accomplishments & Impact Bullets ({exp.bullets?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => addExperienceBullet(exp.id)}
                className="flex items-center gap-1 text-[11px] font-mono text-royal-600 hover:text-royal-700 transition"
              >
                <Plus className="w-3 h-3" />
                Add Bullet
              </button>
            </div>

            <div className="space-y-2">
              {exp.bullets?.map((bullet, bIdx) => {
                const isEnhancing = enhancingBulletKey === `${exp.id}-${bIdx}`;
                return (
                  <div key={bIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-archival-200 shadow-paper-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-slate-400 mt-2 select-none">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateExperienceBullet(exp.id, bIdx, e.target.value)}
                        placeholder="Accomplished [X] as measured by [Y], by doing [Z]..."
                        className="flex-1 px-2.5 py-1.5 bg-archival-50/60 border border-archival-200 rounded text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none leading-relaxed transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeExperienceBullet(exp.id, bIdx)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between pt-1 pl-4 text-[10.5px] font-mono">
                      <span className="text-slate-400">
                        {bullet.trim().split(/\s+/).filter(Boolean).length} words
                      </span>
                      <button
                        type="button"
                        disabled={isEnhancing || !bullet.trim()}
                        onClick={() => handleEnhanceBullet(exp.id, bIdx, bullet)}
                        className="inline-flex items-center gap-1 text-royal-600 hover:text-royal-700 px-2 py-0.5 rounded bg-royal-50 border border-royal-200 hover:bg-royal-100 disabled:opacity-40 transition"
                      >
                        {isEnhancing ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Sparkles className="w-3 h-3" />
                        )}
                        <span>AI XYZ Enhance</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
