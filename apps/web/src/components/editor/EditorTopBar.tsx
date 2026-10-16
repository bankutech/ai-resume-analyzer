import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Download,
  FileDown,
  Sparkles,
  Camera,
  History,
  ZoomIn,
  ZoomOut,
  Maximize2,
  CheckCircle2,
  Loader2,
  ChevronDown,
  FileText,
  Share2,
} from 'lucide-react';
import { useResumeEditorStore } from '../../store/resumeEditorStore';
import { TemplateSlug } from '@resumeforge/shared';
import { ShareResumeModal } from '../resumes/ShareResumeModal';

interface EditorTopBarProps {
  onExportPdf: () => void;
  onExportDocx: () => void;
  onExportJson: () => void;
  onOpenSnapshotModal: () => void;
  onOpenHistoryModal?: () => void;
  onOpenAiTailor?: () => void;
  isExportingPdf?: boolean;
  isExportingDocx?: boolean;
}

export const EditorTopBar: React.FC<EditorTopBarProps> = ({
  onExportPdf,
  onExportDocx,
  onExportJson,
  onOpenSnapshotModal,
  onOpenHistoryModal,
  onOpenAiTailor,
  isExportingPdf = false,
  isExportingDocx = false,
}) => {
  const navigate = useNavigate();
  const title = useResumeEditorStore((state) => state.title);
  const setTitle = useResumeEditorStore((state) => state.setTitle);
  const isSaving = useResumeEditorStore((state) => state.isSaving);
  const isDirty = useResumeEditorStore((state) => state.isDirty);
  const lastSavedAt = useResumeEditorStore((state) => state.lastSavedAt);
  const zoom = useResumeEditorStore((state) => state.zoom);
  const setZoom = useResumeEditorStore((state) => state.setZoom);
  const atsScore = useResumeEditorStore((state) => state.atsScore);
  const templateId = useResumeEditorStore((state) => state.document.metadata.templateId);
  const updateMetadata = useResumeEditorStore((state) => state.updateMetadata);
  const pageSize = useResumeEditorStore((state) => state.document.metadata.pageSize);
  const resumeId = useResumeEditorStore((state) => state.resumeId);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [localTitle, setLocalTitle] = useState(title);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    setLocalTitle(title);
  }, [title]);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (localTitle.trim()) {
      setTitle(localTitle.trim());
    } else {
      setLocalTitle(title);
    }
  };

  // Undo / Redo from zundo temporal store
  const temporal = (useResumeEditorStore as any).temporal?.getState();
  const canUndo = temporal?.pastStates?.length > 0;
  const canRedo = temporal?.futureStates?.length > 0;

  const handleUndo = () => {
    if (canUndo) temporal.undo();
  };

  const handleRedo = () => {
    if (canRedo) temporal.redo();
  };

  // ATS Score Color
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-forest-700 bg-forest-50 border-forest-300';
    if (score >= 60) return 'text-amber-800 bg-amber-50 border-amber-300';
    return 'text-rose-700 bg-rose-50 border-rose-300';
  };

  return (
    <header className="h-14 border-b border-carbon-700 bg-white/95 backdrop-blur px-4 flex items-center justify-between z-20 select-none shadow-sm">
      {/* Left: Back & Title */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate('/app/resumes')}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-carbon-850 transition"
          title="Back to Resumes"
        >
          <ArrowLeft className="w-4 h-4" />
        </button>

        <div className="h-5 w-px bg-carbon-700" />

        {/* Title editing */}
        <div className="flex items-center gap-2">
          {isEditingTitle ? (
            <input
              type="text"
              autoFocus
              value={localTitle}
              onChange={(e) => setLocalTitle(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setLocalTitle(title);
                  setIsEditingTitle(false);
                }
              }}
              className="px-2 py-0.5 bg-white border border-royal-500 rounded text-xs font-semibold text-slate-100 focus:outline-none shadow-sm"
            />
          ) : (
            <button
              type="button"
              onClick={() => setIsEditingTitle(true)}
              className="text-xs font-semibold text-slate-100 hover:text-royal-700 hover:bg-carbon-850 px-2 py-1 rounded transition max-w-[200px] truncate text-left"
              title="Click to rename"
            >
              {title || 'Untitled Resume'}
            </button>
          )}

          {/* Autosave Status Indicator */}
          <div className="flex items-center gap-1.5 text-[11px] font-mono">
            {isSaving ? (
              <span className="flex items-center gap-1 text-ochre-700">
                <Loader2 className="w-3 h-3 animate-spin" />
                <span>Saving...</span>
              </span>
            ) : isDirty ? (
              <span className="text-slate-400">● Unsaved edits</span>
            ) : (
              <span className="flex items-center gap-1 text-slate-400">
                <CheckCircle2 className="w-3 h-3 text-forest-600" />
                <span>{lastSavedAt ? `Saved ${lastSavedAt}` : 'Saved to Cloud'}</span>
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Center: Undo/Redo & Zoom Controls */}
      <div className="hidden md:flex items-center gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-white rounded-lg p-0.5 border border-carbon-700 shadow-sm">
          <button
            type="button"
            disabled={!canUndo}
            onClick={handleUndo}
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-carbon-850 disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Undo (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={handleRedo}
            className="p-1.5 rounded text-slate-400 hover:text-slate-100 hover:bg-carbon-850 disabled:opacity-30 disabled:hover:bg-transparent transition"
            title="Redo (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Template Switcher */}
        <select
          value={templateId}
          onChange={(e) => updateMetadata({ templateId: e.target.value as TemplateSlug })}
          className="px-2.5 py-1.5 bg-white border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 focus:border-royal-500 shadow-sm"
        >
          <option value="classic-ats">Classic ATS</option>
          <option value="modern-professional">Modern Professional</option>
          <option value="student-fresher">Student & Fresher</option>
          <option value="software-engineer">SWE / Systems</option>
          <option value="academic-research">Academic CV</option>
          <option value="creative-portfolio">Creative Minimal</option>
        </select>

        {/* Page Size */}
        <button
          type="button"
          onClick={() => updateMetadata({ pageSize: pageSize === 'A4' ? 'LETTER' : 'A4' })}
          className="px-2.5 py-1.5 bg-white hover:bg-carbon-850 border border-carbon-700 rounded-lg text-xs font-mono text-slate-200 shadow-sm transition"
          title="Toggle Page Standard"
        >
          {pageSize}
        </button>

        {/* Zoom Slider */}
        <div className="flex items-center gap-1.5 bg-white rounded-lg px-2 py-1 border border-carbon-700 text-xs font-mono text-slate-300 shadow-sm">
          <button
            type="button"
            onClick={() => setZoom(Math.max(0.5, Number((zoom - 0.1).toFixed(1))))}
            className="hover:text-slate-100"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <span className="w-9 text-center text-slate-200 font-medium">{Math.round(zoom * 100)}%</span>
          <button
            type="button"
            onClick={() => setZoom(Math.min(1.5, Number((zoom + 0.1).toFixed(1))))}
            className="hover:text-slate-100"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            className="hover:text-royal-600 ml-1 text-slate-400 hover:text-slate-200"
            title="Reset to 100%"
          >
            <Maximize2 className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Right: ATS Score & Actions */}
      <div className="flex items-center gap-2.5">
        {/* Real-time ATS Score Badge */}
        <div
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${getScoreColor(
            atsScore
          )}`}
          title="Real-Time ATS Compliance Score"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>ATS {atsScore}/100</span>
        </div>

        {/* AI Tailor to Job Description */}
        {onOpenAiTailor && (
          <button
            type="button"
            onClick={onOpenAiTailor}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-royal-50 hover:bg-royal-100 text-royal-700 border border-royal-200 text-xs font-mono font-medium shadow-sm transition"
            title="Tailor resume to job description with AI diff review"
          >
            <Sparkles className="w-3.5 h-3.5 text-royal-600" />
            <span>AI Tailor</span>
          </button>
        )}

        {/* Create Checkpoint Snapshot */}
        <button
          type="button"
          onClick={onOpenSnapshotModal}
          className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-carbon-850 text-slate-200 border border-carbon-700 text-xs font-mono shadow-sm transition"
          title="Save manual version snapshot"
        >
          <Camera className="w-3.5 h-3.5 text-royal-600" />
          <span>Checkpoint</span>
        </button>

        {/* Version History Checkpoint Browser */}
        {onOpenHistoryModal && (
          <button
            type="button"
            onClick={onOpenHistoryModal}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-carbon-850 text-slate-200 border border-carbon-700 text-xs font-mono shadow-sm transition"
            title="Browse and restore previous checkpoints"
          >
            <History className="w-3.5 h-3.5 text-forest-600" />
            <span>History</span>
          </button>
        )}

        {/* Share & QR Code Modal Trigger */}
        {resumeId && (
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white hover:bg-carbon-850 text-slate-200 border border-carbon-700 text-xs font-mono shadow-sm transition"
            title="Open public share link & mobile QR code"
          >
            <Share2 className="w-3.5 h-3.5 text-royal-600" />
            <span>Share & QR</span>
          </button>
        )}

        {/* Export Dropdown Menu */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm transition"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export</span>
            <ChevronDown className="w-3 h-3" />
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-carbon-700 shadow-2xl p-1.5 space-y-1 z-50">
              {resumeId && (
                <button
                  type="button"
                  onClick={() => {
                    setShowExportMenu(false);
                    setIsShareModalOpen(true);
                  }}
                  className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-200 hover:bg-carbon-850 transition text-left"
                >
                  <Share2 className="w-4 h-4 text-royal-600" />
                  <div>
                    <span className="font-semibold block text-slate-100">Share & QR Code</span>
                    <span className="text-[10px] text-slate-400">Public Link & Scanner</span>
                  </div>
                </button>
              )}

              <button
                type="button"
                disabled={isExportingPdf}
                onClick={() => {
                  setShowExportMenu(false);
                  onExportPdf();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-200 hover:bg-carbon-850 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <FileDown className="w-4 h-4 text-royal-600" />
                  <div>
                    <span className="font-semibold block text-slate-100">Download PDF</span>
                    <span className="text-[10px] text-slate-400">Headless Chromium Vector</span>
                  </div>
                </div>
                {isExportingPdf && <Loader2 className="w-3.5 h-3.5 animate-spin text-royal-600" />}
              </button>

              <button
                type="button"
                disabled={isExportingDocx}
                onClick={() => {
                  setShowExportMenu(false);
                  onExportDocx();
                }}
                className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-mono text-slate-200 hover:bg-carbon-850 transition text-left"
              >
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-royal-600" />
                  <div>
                    <span className="font-semibold block text-slate-100">Download Word (.docx)</span>
                    <span className="text-[10px] text-slate-400">Editable Canonical Schema</span>
                  </div>
                </div>
                {isExportingDocx && <Loader2 className="w-3.5 h-3.5 animate-spin text-royal-600" />}
              </button>

              <button
                type="button"
                onClick={() => {
                  setShowExportMenu(false);
                  onExportJson();
                }}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-mono text-slate-300 hover:bg-carbon-850 transition text-left"
              >
                <div className="w-4 h-4 rounded bg-carbon-850 border border-carbon-700 flex items-center justify-center text-[10px] text-ochre-700 font-bold">
                  {'{}'}
                </div>
                <div>
                  <span className="font-semibold block text-slate-100">Export JSON</span>
                  <span className="text-[10px] text-slate-400">Portable Schema Backup</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>

      {resumeId && (
        <ShareResumeModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          resumeId={resumeId}
          resumeTitle={title}
        />
      )}
    </header>
  );
};
