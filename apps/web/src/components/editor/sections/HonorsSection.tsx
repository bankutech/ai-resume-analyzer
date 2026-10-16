import React from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2, Award } from 'lucide-react';

const inputCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

const inputSmCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

export const HonorsSection: React.FC = () => {
  const honors = useResumeEditorStore((state) => state.document.honors);
  const updateHonor = useResumeEditorStore((state) => state.updateHonor);
  const addHonor = useResumeEditorStore((state) => state.addHonor);
  const removeHonor = useResumeEditorStore((state) => state.removeHonor);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Honors & Leadership ({honors.length})
        </span>
        <button
          type="button"
          onClick={() => addHonor()}
          className="flex items-center gap-1.5 text-xs font-mono text-royal-600 hover:text-royal-700 px-2.5 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Honor
        </button>
      </div>

      {honors.map((honor, idx) => (
        <div
          key={honor.id}
          className="p-4 bg-archival-50 rounded-xl border border-archival-200 space-y-3 shadow-paper-xs"
        >
          <div className="flex items-center justify-between border-b border-archival-200 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-100 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-ochre-600" />
              Honor #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => removeHonor(honor.id)}
              className="text-slate-400 hover:text-rose-500 transition"
              title="Delete honor"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Title / Award</label>
              <input
                type="text"
                value={honor.title || ''}
                onChange={(e) => updateHonor(honor.id, { title: e.target.value })}
                placeholder="e.g. 1st Place National Hackathon"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Conferring Organization</label>
              <input
                type="text"
                value={honor.issuer || ''}
                onChange={(e) => updateHonor(honor.id, { issuer: e.target.value })}
                placeholder="e.g. IEEE Student Branch"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Date</label>
              <input
                type="text"
                value={honor.date || ''}
                onChange={(e) => updateHonor(honor.id, { date: e.target.value })}
                placeholder="e.g. Nov 2024"
                className={`${inputSmCls} font-mono`}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Details / Context</label>
              <input
                type="text"
                value={honor.description || ''}
                onChange={(e) => updateHonor(honor.id, { description: e.target.value })}
                placeholder="e.g. Competed against 120+ collegiate teams"
                className={inputSmCls}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
