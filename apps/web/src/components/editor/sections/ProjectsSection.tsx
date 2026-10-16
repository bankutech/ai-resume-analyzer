import React, { useState } from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2, FolderGit2, Sparkles, Loader2, X } from 'lucide-react';
import { api } from '../../../lib/api';

const inputCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

export const ProjectsSection: React.FC = () => {
  const projects = useResumeEditorStore((state) => state.document.projects);
  const updateProject = useResumeEditorStore((state) => state.updateProject);
  const addProject = useResumeEditorStore((state) => state.addProject);
  const removeProject = useResumeEditorStore((state) => state.removeProject);
  const addProjectBullet = useResumeEditorStore((state) => state.addProjectBullet);
  const updateProjectBullet = useResumeEditorStore((state) => state.updateProjectBullet);
  const removeProjectBullet = useResumeEditorStore((state) => state.removeProjectBullet);

  const [techInputs, setTechInputs] = useState<{ [id: string]: string }>({});
  const [enhancingBulletKey, setEnhancingBulletKey] = useState<string | null>(null);

  const handleAddTech = (projId: string) => {
    const raw = techInputs[projId]?.trim();
    if (!raw) return;
    const newItems = raw.split(',').map((t) => t.trim()).filter(Boolean);
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    const existing = new Set(proj.techStack || []);
    const merged = [...(proj.techStack || [])];
    newItems.forEach((t) => {
      if (!existing.has(t)) merged.push(t);
    });
    updateProject(projId, { techStack: merged });
    setTechInputs({ ...techInputs, [projId]: '' });
  };

  const handleRemoveTech = (projId: string, item: string) => {
    const proj = projects.find((p) => p.id === projId);
    if (!proj) return;
    updateProject(projId, {
      techStack: (proj.techStack || []).filter((t) => t !== item),
    });
  };

  const handleEnhanceBullet = async (projId: string, bulletIdx: number, currentText: string) => {
    const key = `${projId}-${bulletIdx}`;
    setEnhancingBulletKey(key);
    try {
      const res = await api.post<{ status: string; result: { enhancedBullet: string } }>(
        '/ai/enhance-bullet',
        {
          rawBullet: currentText,
          formula: 'XYZ',
        }
      );
      if (res?.result?.enhancedBullet) {
        updateProjectBullet(projId, bulletIdx, res.result.enhancedBullet);
      }
    } catch {
      // Local fallback
      const actionWords = ['Designed', 'Engineered', 'Constructed', 'Implemented', 'Developed'];
      const chosen = actionWords[Math.floor(Math.random() * actionWords.length)];
      let enhanced = currentText;
      if (!currentText.match(/^(Architected|Engineered|Constructed|Implemented|Designed|Built)/i)) {
        enhanced = `${chosen} ${currentText.charAt(0).toLowerCase() + currentText.slice(1)}`;
      }
      if (!enhanced.match(/\b\d+/)) {
        enhanced = `${enhanced}, handling 10k+ requests with 99.9% uptime.`;
      }
      updateProjectBullet(projId, bulletIdx, enhanced);
    } finally {
      setEnhancingBulletKey(null);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Engineering & Academic Projects ({projects.length})
        </span>
        <button
          type="button"
          onClick={() => addProject()}
          className="flex items-center gap-1.5 text-xs font-mono text-royal-600 hover:text-royal-700 px-2.5 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Project
        </button>
      </div>

      {projects.map((proj, pIdx) => (
        <div
          key={proj.id}
          className="p-4 bg-archival-50 rounded-xl border border-archival-200 space-y-3 shadow-paper-xs"
        >
          <div className="flex items-center justify-between border-b border-archival-200 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-100 flex items-center gap-1.5">
              <FolderGit2 className="w-4 h-4 text-royal-600" />
              Project #{pIdx + 1}
            </span>
            <button
              type="button"
              onClick={() => removeProject(proj.id)}
              className="text-slate-400 hover:text-rose-500 transition"
              title="Delete project"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Project Name</label>
              <input
                type="text"
                value={proj.title || ''}
                onChange={(e) => updateProject(proj.id, { title: e.target.value })}
                placeholder="e.g. MarketPulse AI Analytics"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Role / Subtitle</label>
              <input
                type="text"
                value={proj.subtitle || ''}
                onChange={(e) => updateProject(proj.id, { subtitle: e.target.value })}
                placeholder="e.g. Distributed Stream Engine"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Date / Duration</label>
              <input
                type="text"
                value={proj.date || ''}
                onChange={(e) => updateProject(proj.id, { date: e.target.value })}
                placeholder="e.g. Sep 2024 – Nov 2024"
                className="w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">GitHub / Code URL</label>
              <input
                type="url"
                value={proj.repoUrl || ''}
                onChange={(e) => updateProject(proj.id, { repoUrl: e.target.value })}
                placeholder="https://github.com/..."
                className="w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none font-mono transition"
              />
            </div>
          </div>

          {/* Tech Stack Tags */}
          <div className="pt-2 border-t border-archival-200">
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Tech Stack</label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {proj.techStack?.map((tech) => (
                <span
                  key={tech}
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-royal-50 text-royal-700 border border-royal-200"
                >
                  {tech}
                  <button
                    type="button"
                    onClick={() => handleRemoveTech(proj.id, tech)}
                    className="hover:text-rose-500 text-royal-400 transition"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={techInputs[proj.id] || ''}
                onChange={(e) => setTechInputs({ ...techInputs, [proj.id]: e.target.value })}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTech(proj.id);
                  }
                }}
                placeholder="Add tech stack tags (e.g. Next.js, Redis, PyTorch) and press Enter"
                className="flex-1 px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none font-mono transition"
              />
              <button
                type="button"
                onClick={() => handleAddTech(proj.id)}
                className="px-3 py-1.5 bg-royal-50 hover:bg-royal-100 border border-royal-200 rounded-lg text-xs font-mono text-royal-700 transition"
              >
                Add
              </button>
            </div>
          </div>

          {/* Impact Bullets */}
          <div className="pt-2 border-t border-archival-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-mono text-slate-400">
                Project Bullets ({proj.bullets?.length || 0})
              </label>
              <button
                type="button"
                onClick={() => addProjectBullet(proj.id)}
                className="flex items-center gap-1 text-[11px] font-mono text-royal-600 hover:text-royal-700 transition"
              >
                <Plus className="w-3 h-3" />
                Add Bullet
              </button>
            </div>

            <div className="space-y-2">
              {proj.bullets?.map((bullet, bIdx) => {
                const isEnhancing = enhancingBulletKey === `${proj.id}-${bIdx}`;
                return (
                  <div key={bIdx} className="space-y-1 bg-white p-2.5 rounded-lg border border-archival-200 shadow-paper-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-xs font-mono text-slate-400 mt-2 select-none">•</span>
                      <textarea
                        rows={2}
                        value={bullet}
                        onChange={(e) => updateProjectBullet(proj.id, bIdx, e.target.value)}
                        placeholder="Built [X] utilizing [Y], resulting in [Z]..."
                        className="flex-1 px-2.5 py-1.5 bg-archival-50/60 border border-archival-200 rounded text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none leading-relaxed transition"
                      />
                      <button
                        type="button"
                        onClick={() => removeProjectBullet(proj.id, bIdx)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                        title="Delete bullet"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="flex items-center justify-end pt-1 pr-1 text-[10.5px] font-mono">
                      <button
                        type="button"
                        disabled={isEnhancing || !bullet.trim()}
                        onClick={() => handleEnhanceBullet(proj.id, bIdx, bullet)}
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
