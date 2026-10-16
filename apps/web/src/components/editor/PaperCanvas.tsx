import React from 'react';
import { ResumeDocument } from '@resumeforge/shared';
import { TemplateRenderer } from '../templates/TemplateRenderer';

interface PaperCanvasProps {
  document: ResumeDocument;
  zoom: number;
}

export const PaperCanvas: React.FC<PaperCanvasProps> = ({ document, zoom }) => {
  const { pageSize = 'A4', marginPreset = 'normal', fontFamily = 'Inter' } = document.metadata;

  // Page dimensions in px at standard 96 DPI screen render
  // A4: 210mm x 297mm -> ~794px x 1123px
  // LETTER: 215.9mm x 279.4mm -> ~816px x 1056px
  const isA4 = pageSize === 'A4';
  const pageWidth = isA4 ? 794 : 816;
  const pageMinHeight = isA4 ? 1123 : 1056;

  // Padding based on marginPreset
  const paddingMap = {
    narrow: 'p-8', // ~32px / 8.5mm
    normal: 'p-12', // ~48px / 12.7mm
    wide: 'p-16', // ~64px / 17mm
  };
  const paddingClass = paddingMap[marginPreset] || 'p-12';

  // Font family class
  const fontClassMap = {
    'Inter': 'font-sans',
    'Roboto': 'font-sans',
    'Source Serif 4': 'font-serif',
    'Merriweather': 'font-serif',
    'JetBrains Mono': 'font-mono',
  };
  const fontClass = fontClassMap[fontFamily as keyof typeof fontClassMap] || 'font-sans';

  return (
    <div className="flex justify-center p-8 overflow-auto min-h-full">
      <div
        style={{
          transform: `scale(${zoom})`,
          transformOrigin: 'top center',
          transition: 'transform 120ms ease-out',
        }}
        className="relative"
      >
        {/* Physical Paper Sheet */}
        <div
          id="resume-print-canvas"
          className={`bg-white text-gray-900 rounded-[2px] relative transition-all duration-200 select-text ${paddingClass} ${fontClass}`}
          style={{
            width: `${pageWidth}px`,
            minHeight: `${pageMinHeight}px`,
            boxShadow: '0 16px 40px -8px rgba(35, 41, 54, 0.12), 0 4px 12px -2px rgba(35, 41, 54, 0.06), 0 0 0 1px #D6D4C7',
          }}
        >
          {/* Active Template Renderer */}
          <TemplateRenderer document={document} />

          {/* Page break marker indicator */}
          <div
            className="absolute left-0 right-0 border-b border-dashed border-red-400/40 pointer-events-none flex items-center justify-end pr-2 text-[9px] font-mono text-red-500/70"
            style={{ top: `${pageMinHeight}px` }}
          >
            <span className="bg-red-50/80 px-1.5 py-0.5 rounded shadow-sm border border-red-200/50">
              Page 1 Cutoff ({pageSize})
            </span>
          </div>
        </div>

        {/* Paper stage bottom indicator */}
        <div className="text-center mt-3 text-[11px] font-mono text-slate-500">
          Rendered at 100% vector scale • ATS Parseable Text
        </div>
      </div>
    </div>
  );
};
