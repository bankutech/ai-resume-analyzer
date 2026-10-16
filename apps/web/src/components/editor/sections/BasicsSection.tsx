import React from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2 } from 'lucide-react';
import { LinkItem } from '@resumeforge/shared';

const inputCls =
  'w-full px-3 py-2 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

const inputSmCls =
  'px-2 py-1 bg-white border border-archival-200 rounded text-xs text-slate-100 font-mono focus:border-royal-600 focus:outline-none transition';

export const BasicsSection: React.FC = () => {
  const basics = useResumeEditorStore((state) => state.document.basics);
  const updateBasics = useResumeEditorStore((state) => state.updateBasics);

  const handleLinkChange = (id: string, patch: Partial<LinkItem>) => {
    const updatedLinks = (basics.links || []).map((l) => (l.id === id ? { ...l, ...patch } : l));
    updateBasics({ links: updatedLinks });
  };

  const handleAddLink = () => {
    const newLink: LinkItem = {
      id: `lnk-${Date.now()}`,
      label: 'GitHub',
      displayHandle: 'github.com/profile',
      url: 'https://github.com/',
    };
    updateBasics({ links: [...(basics.links || []), newLink] });
  };

  const handleRemoveLink = (id: string) => {
    updateBasics({ links: (basics.links || []).filter((l) => l.id !== id) });
  };

  return (
    <div className="space-y-4 p-4 bg-archival-50 rounded-xl border border-archival-200">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
            Full Name <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            value={basics.fullName || ''}
            onChange={(e) => updateBasics({ fullName: e.target.value })}
            placeholder="e.g. Alex Rivera"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
            Target Headline / Role
          </label>
          <input
            type="text"
            value={basics.headline || ''}
            onChange={(e) => updateBasics({ headline: e.target.value })}
            placeholder="e.g. Full-Stack Software Engineer"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
            Email Address <span className="text-rose-500">*</span>
          </label>
          <input
            type="email"
            value={basics.email || ''}
            onChange={(e) => updateBasics({ email: e.target.value })}
            placeholder="alex.rivera@example.com"
            className={inputCls}
          />
        </div>

        <div>
          <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
            Phone Number <span className="text-rose-500">*</span>
          </label>
          <input
            type="tel"
            value={basics.phone || ''}
            onChange={(e) => updateBasics({ phone: e.target.value })}
            placeholder="+1 (555) 000-0000"
            className={inputCls}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="block text-xs font-mono font-medium text-slate-400 mb-1">
            Location (City, State / Country)
          </label>
          <input
            type="text"
            value={basics.location || ''}
            onChange={(e) => updateBasics({ location: e.target.value })}
            placeholder="e.g. San Francisco, CA or Bengaluru, India"
            className={inputCls}
          />
        </div>
      </div>

      {/* Social & Professional Links */}
      <div className="pt-3 border-t border-archival-200">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Professional Links & Profiles
          </span>
          <button
            type="button"
            onClick={handleAddLink}
            className="flex items-center gap-1 text-xs font-mono text-royal-600 hover:text-royal-700 px-2 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Link
          </button>
        </div>

        <div className="space-y-2">
          {basics.links?.map((link) => (
            <div key={link.id} className="flex items-center gap-2 bg-white p-2 rounded-lg border border-archival-200 shadow-paper-xs">
              <select
                value={link.label}
                onChange={(e) => handleLinkChange(link.id, { label: e.target.value as any })}
                className={`${inputSmCls} text-slate-100`}
              >
                <option value="GitHub">GitHub</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Portfolio">Portfolio</option>
                <option value="Google Scholar">Google Scholar</option>
                <option value="Website">Website</option>
                <option value="Other">Other</option>
              </select>

              <input
                type="text"
                value={link.displayHandle}
                onChange={(e) => handleLinkChange(link.id, { displayHandle: e.target.value })}
                placeholder="Display label"
                className={`w-1/3 ${inputSmCls}`}
              />

              <input
                type="url"
                value={link.url}
                onChange={(e) => handleLinkChange(link.id, { url: e.target.value })}
                placeholder="https://..."
                className={`flex-1 ${inputSmCls}`}
              />

              <button
                type="button"
                onClick={() => handleRemoveLink(link.id)}
                className="p-1 text-slate-400 hover:text-rose-500 transition"
                title="Remove link"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
