import React from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Palette, Check, Layout, Type, FileText } from 'lucide-react';
import { TemplateSlug } from '@resumeforge/shared';

interface TemplateOption {
  id: TemplateSlug;
  name: string;
  tagline: string;
  badge: string;
}

const TEMPLATE_OPTIONS: TemplateOption[] = [
  {
    id: 'classic-ats',
    name: 'Classic ATS',
    tagline: 'Single-column MIT/Harvard career standard. 100% legacy ATS score.',
    badge: 'Gold Standard',
  },
  {
    id: 'modern-professional',
    name: 'Modern Professional',
    tagline: 'Horizontal accent dividers, crisp skill tags, high information density.',
    badge: 'Popular',
  },
  {
    id: 'student-fresher',
    name: 'Student & Fresher',
    tagline: 'Elevates Education, Coursework, Hackathons & Academic Projects.',
    badge: 'Campus Fav',
  },
  {
    id: 'software-engineer',
    name: 'Software Engineer',
    tagline: 'JetBrains Mono accents, repository telemetry, quantitative metrics.',
    badge: 'SWE / Infra',
  },
  {
    id: 'academic-research',
    name: 'Academic CV',
    tagline: 'Serif typography, publication citations, research appointments.',
    badge: 'Scholar',
  },
  {
    id: 'creative-portfolio',
    name: 'Creative Minimal',
    tagline: 'Editorial Swiss numbers, asymmetric layout, clean links.',
    badge: 'Design / Tech',
  },
];

const ACCENT_COLORS = [
  { name: 'Classic Navy', hex: '#1E3A8A' },
  { name: 'Emerald Forest', hex: '#059669' },
  { name: 'Indigo Forge', hex: '#4F46E5' },
  { name: 'Teal Modern', hex: '#0D9488' },
  { name: 'Amber Core', hex: '#D97706' },
  { name: 'Burgundy Academic', hex: '#7C2D12' },
  { name: 'Charcoal Minimal', hex: '#111827' },
];

const selectCls =
  'w-full px-2.5 py-1.5 bg-white border border-archival-200 rounded-lg text-xs font-mono text-slate-100 focus:border-royal-600 focus:outline-none transition';

export const DesignSection: React.FC = () => {
  const metadata = useResumeEditorStore((state) => state.document.metadata);
  const updateMetadata = useResumeEditorStore((state) => state.updateMetadata);

  return (
    <div className="space-y-6">
      {/* Template Selection */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <Layout className="w-4 h-4 text-royal-600" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Bespoke ATS Resume Templates
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {TEMPLATE_OPTIONS.map((tpl) => {
            const isSelected = metadata.templateId === tpl.id;
            return (
              <button
                key={tpl.id}
                type="button"
                onClick={() => updateMetadata({ templateId: tpl.id })}
                className={`p-3 rounded-xl border text-left transition-all relative ${
                  isSelected
                    ? 'bg-royal-50 border-royal-500 shadow-paper-sm'
                    : 'bg-white border-archival-200 hover:border-archival-300 hover:shadow-paper-xs'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className={`font-semibold text-sm ${isSelected ? 'text-royal-700' : 'text-slate-100'}`}>
                    {tpl.name}
                  </span>
                  <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded border ${
                    isSelected
                      ? 'bg-royal-100 text-royal-700 border-royal-200'
                      : 'bg-archival-100 text-slate-400 border-archival-200'
                  }`}>
                    {tpl.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 leading-snug">{tpl.tagline}</p>
                {isSelected && (
                  <div className="absolute top-2 right-8 w-2 h-2 rounded-full bg-royal-500 animate-pulse" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Accent Color Palette */}
      <div className="space-y-3 pt-3 border-t border-archival-200">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-royal-600" />
          <h3 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
            Accent Color & Theme
          </h3>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {ACCENT_COLORS.map((col) => {
            const isSelected = metadata.accentColor === col.hex;
            return (
              <button
                key={col.hex}
                type="button"
                onClick={() => updateMetadata({ accentColor: col.hex })}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-mono transition-all ${
                  isSelected
                    ? 'border-royal-500 bg-royal-50 shadow-paper-xs'
                    : 'border-archival-200 bg-white hover:border-archival-300'
                }`}
              >
                <span className="w-3.5 h-3.5 rounded-full border border-white shadow-sm" style={{ backgroundColor: col.hex }} />
                <span className={isSelected ? 'text-royal-700' : 'text-slate-100'}>{col.name}</span>
                {isSelected && <Check className="w-3 h-3 text-royal-600" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* Typography & Geometry */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-archival-200">
        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
            <Type className="w-3.5 h-3.5 text-royal-600" />
            Font Family
          </label>
          <select
            value={metadata.fontFamily}
            onChange={(e) => updateMetadata({ fontFamily: e.target.value as any })}
            className={selectCls}
          >
            <option value="Inter">Inter (Clean Grotesque)</option>
            <option value="Source Serif 4">Source Serif 4 (Academic)</option>
            <option value="JetBrains Mono">JetBrains Mono (Technical)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
            <Layout className="w-3.5 h-3.5 text-royal-600" />
            Margin Preset
          </label>
          <select
            value={metadata.marginPreset}
            onChange={(e) => updateMetadata({ marginPreset: e.target.value as any })}
            className={selectCls}
          >
            <option value="narrow">Narrow (12mm — High Density)</option>
            <option value="normal">Normal (18mm — Standard)</option>
            <option value="wide">Wide (24mm — Spacious)</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-mono text-slate-400 mb-1 flex items-center gap-1.5">
            <FileText className="w-3.5 h-3.5 text-royal-600" />
            Page Format
          </label>
          <select
            value={metadata.pageSize}
            onChange={(e) => updateMetadata({ pageSize: e.target.value as any })}
            className={selectCls}
          >
            <option value="A4">A4 (International)</option>
            <option value="LETTER">Letter (US & Canada)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
