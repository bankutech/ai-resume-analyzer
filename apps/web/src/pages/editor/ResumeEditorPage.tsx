import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useResumeEditorStore } from '../../store/resumeEditorStore';
import { EditorTopBar } from '../../components/editor/EditorTopBar';
import { SectionAccordion } from '../../components/editor/SectionAccordion';
import { PaperCanvas } from '../../components/editor/PaperCanvas';
import { SnapshotModal } from '../../components/editor/SnapshotModal';
import { VersionHistoryModal } from '../../components/editor/VersionHistoryModal';
import { AiDiffModal } from '../../components/editor/AiDiffModal';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { Loader2, AlertCircle } from 'lucide-react';
import { SAMPLE_STUDENT_RESUME_DOCUMENT } from '@resumeforge/shared';

export const ResumeEditorPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const toast = useToast();

  const initialize = useResumeEditorStore((state) => state.initialize);
  const document = useResumeEditorStore((state) => state.document);
  const title = useResumeEditorStore((state) => state.title);
  const targetJobTitle = useResumeEditorStore((state) => state.targetJobTitle);
  const isDirty = useResumeEditorStore((state) => state.isDirty);
  const zoom = useResumeEditorStore((state) => state.zoom);
  const setIsSaving = useResumeEditorStore((state) => state.setIsSaving);
  const markSaved = useResumeEditorStore((state) => state.markSaved);
  const atsScore = useResumeEditorStore((state) => state.atsScore);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [isSnapshotOpen, setIsSnapshotOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiTailorOpen, setIsAiTailorOpen] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);

  const autoSaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 1. Fetch Resume Data
  useEffect(() => {
    if (!id) return;

    let isMounted = true;
    const fetchResume = async () => {
      try {
        setIsLoading(true);
        setLoadError(null);
        const res = await api.get<{ status: string; resume: any }>(`/resumes/${id}`);
        if (isMounted && res.resume) {
          const doc = res.resume.document || SAMPLE_STUDENT_RESUME_DOCUMENT;
          initialize(res.resume.id, res.resume.title, doc, res.resume.targetJobTitle || '');
        }
      } catch (err: any) {
        if (isMounted) {
          setLoadError(err.message || 'Failed to load resume document.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    fetchResume();
    return () => {
      isMounted = false;
    };
  }, [id, initialize]);

  // 2. Debounced Auto-Save Engine (1200ms)
  const saveToServer = useCallback(async () => {
    if (!id || !isDirty) return;
    try {
      setIsSaving(true);
      await api.put(`/resumes/${id}`, {
        title,
        targetJobTitle,
        document,
        lastAtsScore: atsScore,
      });
      markSaved();
    } catch (err) {
      console.error('[AutoSave Error]', err);
      setIsSaving(false);
    }
  }, [id, isDirty, title, targetJobTitle, document, atsScore, setIsSaving, markSaved]);

  useEffect(() => {
    if (!isDirty || !id) return;

    if (autoSaveTimerRef.current) {
      clearTimeout(autoSaveTimerRef.current);
    }

    autoSaveTimerRef.current = setTimeout(() => {
      saveToServer();
    }, 1200);

    return () => {
      if (autoSaveTimerRef.current) {
        clearTimeout(autoSaveTimerRef.current);
      }
    };
  }, [isDirty, saveToServer, id]);

  // 3. Global Keyboard Shortcuts (Undo, Redo, Save)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        const temporal = (useResumeEditorStore as any).temporal?.getState();
        if (e.shiftKey) {
          temporal?.redo?.();
        } else {
          temporal?.undo?.();
        }
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        const temporal = (useResumeEditorStore as any).temporal?.getState();
        temporal?.redo?.();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToServer();
        toast.success('Document Saved', 'All resume changes persisted to Neon database.');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [saveToServer, toast]);

  // 4. Export Handlers
  const handleExportPdf = async () => {
    if (!id) return;
    try {
      setIsExportingPdf(true);
      toast.info('Generating PDF', 'Headless Chromium compiling ATS vector layout...');
      // First ensure latest edits are saved
      await api.put(`/resumes/${id}`, { title, targetJobTitle, document, lastAtsScore: atsScore });
      markSaved();

      const response = await fetch(`/api/export/pdf/${id}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('rf_access_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error('PDF export generation failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume.pdf`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('PDF Export Ready', '100% selectable vector PDF generated successfully.');
    } catch (err: any) {
      toast.error('PDF Server Busy', 'Opening direct browser print dialog as fallback.');
      // Browser fallback print
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleExportDocx = async () => {
    if (!id) return;
    try {
      setIsExportingDocx(true);
      toast.info('Generating DOCX', 'Mapping canonical document tree to Word OpenXML...');
      await api.put(`/resumes/${id}`, { title, targetJobTitle, document, lastAtsScore: atsScore });
      markSaved();

      const response = await fetch(`/api/export/docx/${id}`, {
        credentials: 'include',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('rf_access_token') || ''}`,
        },
      });

      if (!response.ok) throw new Error('DOCX export failed');

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement('a');
      link.href = url;
      link.download = `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Resume.docx`;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      toast.success('Word Document Exported', 'Clean structured .docx file generated successfully.');
    } catch (err: any) {
      toast.error('DOCX Export Failed', err.message || 'Unable to generate Word document.');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(document, null, 2));
    const downloadAnchor = window.document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${title.replace(/[^a-zA-Z0-9_-]/g, '_')}_Document.json`);
    window.document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    toast.success('JSON Document Exported', 'Complete canonical schema tree downloaded.');
  };

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-[#FAF9F5] flex flex-col items-center justify-center gap-3 text-slate-300 font-mono text-xs">
        <Loader2 className="w-6 h-6 animate-spin text-royal-600" />
        <span>Loading Resume Studio & Document Tree...</span>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="h-screen w-screen bg-[#FAF9F5] flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white border border-rose-300 rounded-2xl p-6 text-center space-y-4 shadow-sm">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h2 className="text-lg font-bold text-slate-100">Resume Not Accessible</h2>
          <p className="text-xs font-mono text-rose-700">{loadError}</p>
          <button
            type="button"
            onClick={() => navigate('/app/resumes')}
            className="px-4 py-2 bg-royal-600 hover:bg-royal-700 text-xs font-mono text-white rounded-lg shadow-sm"
          >
            Return to Resumes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col bg-[#FAF9F5] overflow-hidden text-slate-100 selection:bg-royal-500/10">
      {/* Top Bar */}
      <EditorTopBar
        onExportPdf={handleExportPdf}
        onExportDocx={handleExportDocx}
        onExportJson={handleExportJson}
        onOpenSnapshotModal={() => setIsSnapshotOpen(true)}
        onOpenHistoryModal={() => setIsHistoryOpen(true)}
        onOpenAiTailor={() => setIsAiTailorOpen(true)}
        isExportingPdf={isExportingPdf}
        isExportingDocx={isExportingDocx}
      />

      {/* Main Dual-Pane Studio Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Pane: Form Accordion Rail */}
        <aside data-lenis-prevent className="w-full md:w-[460px] lg:w-[500px] border-r border-carbon-700 bg-white overflow-y-auto p-4 flex-shrink-0 shadow-sm">
          <SectionAccordion />
        </aside>

        {/* Center / Right: Live Paper Stage */}
        <main data-lenis-prevent className="flex-1 bg-[#F4F2E9] overflow-y-auto relative flex flex-col items-center bg-[radial-gradient(#D6D4C7_1.2px,transparent_1.2px)] [background-size:20px_20px]">
          <PaperCanvas document={document} zoom={zoom} />
        </main>
      </div>

      {/* AI Tailoring Diff Modal */}
      <AiDiffModal
        isOpen={isAiTailorOpen}
        onClose={() => setIsAiTailorOpen(false)}
        onApplied={() => toast.success('AI Tailoring Applied', 'Suggested quantitative improvements merged into active resume.')}
      />

      {/* Snapshot Modal */}
      {id && (
        <SnapshotModal
          resumeId={id}
          isOpen={isSnapshotOpen}
          onClose={() => setIsSnapshotOpen(false)}
          onSuccess={(name) => toast.success('Checkpoint Created', `Snapshot "${name}" saved to immutable history.`)}
        />
      )}

      {/* Version History Modal */}
      {id && (
        <VersionHistoryModal
          resumeId={id}
          isOpen={isHistoryOpen}
          onClose={() => setIsHistoryOpen(false)}
          onRestore={(restoredDoc) => {
            initialize(id, title, restoredDoc, targetJobTitle);
          }}
        />
      )}
    </div>
  );
};
