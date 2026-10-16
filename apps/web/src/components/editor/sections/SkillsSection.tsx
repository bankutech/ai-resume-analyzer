import React, { useState } from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2, Cpu, X } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const skills = useResumeEditorStore((state) => state.document.skills);
  const updateSkillCategory = useResumeEditorStore((state) => state.updateSkillCategory);
  const addSkillCategory = useResumeEditorStore((state) => state.addSkillCategory);
  const removeSkillCategory = useResumeEditorStore((state) => state.removeSkillCategory);

  const [tagInputs, setTagInputs] = useState<{ [id: string]: string }>({});

  const handleAddTag = (catId: string) => {
    const raw = tagInputs[catId]?.trim();
    if (!raw) return;

    // Support comma-separated tags
    const newTags = raw.split(',').map((t) => t.trim()).filter(Boolean);
    const cat = skills.find((s) => s.id === catId);
    if (!cat) return;

    const existing = new Set(cat.items);
    const merged = [...cat.items];
    newTags.forEach((t) => {
      if (!existing.has(t)) {
        merged.push(t);
      }
    });

    updateSkillCategory(catId, { items: merged });
    setTagInputs({ ...tagInputs, [catId]: '' });
  };

  const handleRemoveTag = (catId: string, tagToRemove: string) => {
    const cat = skills.find((s) => s.id === catId);
    if (!cat) return;
    updateSkillCategory(catId, {
      items: cat.items.filter((item) => item !== tagToRemove),
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Categorized Skills ({skills.length} Categories)
        </span>
        <button
          type="button"
          onClick={() => addSkillCategory()}
          className="flex items-center gap-1.5 text-xs font-mono text-royal-600 hover:text-royal-700 px-2.5 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Category
        </button>
      </div>

      {skills.map((cat) => (
        <div
          key={cat.id}
          className="p-4 bg-archival-50 rounded-xl border border-archival-200 space-y-3 shadow-paper-xs"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 mr-3">
              <Cpu className="w-4 h-4 text-royal-600 flex-shrink-0" />
              <input
                type="text"
                value={cat.category}
                onChange={(e) => updateSkillCategory(cat.id, { category: e.target.value })}
                placeholder="Category Name (e.g. Languages / Cloud)"
                className="w-full px-2.5 py-1 bg-white border border-archival-200 rounded text-xs font-mono font-semibold text-slate-100 focus:border-royal-600 focus:outline-none transition"
              />
            </div>
            <button
              type="button"
              onClick={() => removeSkillCategory(cat.id)}
              className="text-slate-400 hover:text-rose-500 transition"
              title="Delete Category"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          {/* Skill Tag Pills */}
          <div className="flex flex-wrap gap-1.5 min-h-[30px] p-2 bg-white rounded-lg border border-archival-200">
            {cat.items.map((item) => (
              <span
                key={item}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-mono bg-royal-50 text-royal-700 border border-royal-200 hover:border-royal-300 transition"
              >
                {item}
                <button
                  type="button"
                  onClick={() => handleRemoveTag(cat.id, item)}
                  className="hover:text-rose-500 text-royal-400 transition"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))}
            {cat.items.length === 0 && (
              <span className="text-xs text-slate-400 italic">No skills added yet.</span>
            )}
          </div>

          {/* Quick Tag Adder */}
          <div className="flex gap-2">
            <input
              type="text"
              value={tagInputs[cat.id] || ''}
              onChange={(e) => setTagInputs({ ...tagInputs, [cat.id]: e.target.value })}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTag(cat.id);
                }
              }}
              placeholder="Type skills separated by commas (e.g. Python, Go, Docker) and press Enter"
              className="flex-1 px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition"
            />
            <button
              type="button"
              onClick={() => handleAddTag(cat.id)}
              className="px-3 py-1.5 bg-royal-50 hover:bg-royal-100 border border-royal-200 rounded-lg text-xs font-mono text-royal-700 transition"
            >
              Add
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};
