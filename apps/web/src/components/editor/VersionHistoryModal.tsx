import React, { useState, useEffect, useCallback } from 'react';
import { History, X, RotateCcw, Clock, Award, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';

interface ResumeVersion {
  id: string;
  versionNumber: number;
  label: string;
  atsScoreSnapshot: number | null;
  createdAt: string;
  documentSnapshot: any;
}

interface VersionHistoryModalProps {
  resumeId: string;
  isOpen: boolean;
  onClose: () => void;
  onRestore: (restoredDocument: any, atsScore?: number | null) => void;
}

export const VersionHistoryModal: React.FC<VersionHistoryModalProps> = ({
  resumeId,
  isOpen,
  onClose,
  onRestore,
}) => {
  const toast = useToast();
  const [versions, setVersions] = useState<ResumeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<string | null>(null);

  const fetchVersions = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await api.get<{ status: string; versions: ResumeVersion[] }>(
        `/resumes/${resumeId}/versions`
      );
      setVersions(res.versions || []);
    } catch {
      toast.error('Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  }, [resumeId]);

  useEffect(() => {
    if (isOpen) {
      fetchVersions();
    }
  }, [isOpen, fetchVersions]);

  if (!isOpen) return null;

  const handleRestore = async (version: ResumeVersion) => {
    if (
      !window.confirm(
        `Restore "${version.label}"? Your current unsaved changes will be replaced with this version.`
      )
    ) {
      return;
    }

    setRestoringId(version.id);
    try {
      const res = await api.post<{ status: string; resume: any }>(
        `/resumes/${resumeId}/versions/${version.id}/restore`
      );
      toast.success(
        'Version Restored',
        `Successfully restored to checkpoint: ${version.label}`
      );
      onRestore(res.resume.document, res.resume.lastAtsScore);
      onClose();
    } catch (err: any) {
      toast.error('Restore Failed', err.message || 'Failed to restore snapshot');
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        data-lenis-prevent
        className="w-full max-w-xl bg-white border border-archival-200 rounded-2xl shadow-paper-lg flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-archival-200 bg-archival-50 rounded-t-2xl">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-slate-100">Version History & Checkpoints</h3>
              <p className="text-[11px] font-mono text-slate-400">
                Browse frozen checkpoints and rollback at any time.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-100 rounded-lg hover:bg-archival-100 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-white">
          {isLoading ? (
            <div className="py-12 flex flex-col items-center justify-center gap-3 text-xs font-mono text-slate-400">
              <Loader2 className="w-5 h-5 animate-spin text-royal-600" />
              Loading version tree...
            </div>
          ) : versions.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <Clock className="w-8 h-8 text-slate-400 mx-auto" />
              <p className="text-xs font-mono text-slate-400">No checkpoints recorded yet.</p>
              <p className="text-[11px] text-slate-400">
                Use the Snapshot camera button in the top bar to create your first checkpoint.
              </p>
            </div>
          ) : (
            versions.map((ver, idx) => (
              <div
                key={ver.id}
                className="p-4 rounded-xl bg-archival-50 border border-archival-200 hover:border-royal-300 transition flex items-center justify-between gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded bg-royal-50 text-royal-700 border border-royal-200">
                      v{ver.versionNumber}
                    </span>
                    <span className="font-semibold text-xs text-slate-100 truncate">
                      {ver.label}
                    </span>
                    {idx === 0 && (
                      <span className="text-[9px] font-mono px-1.5 py-0.5 rounded bg-archival-100 text-slate-400 border border-archival-200">
                        Latest
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-3 mt-1.5 text-[11px] font-mono text-slate-400">
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3 text-slate-400" />
                      {new Date(ver.createdAt).toLocaleString()}
                    </span>
                    {ver.atsScoreSnapshot != null && (
                      <span className="flex items-center gap-1 text-forest-700 font-semibold">
                        <Award className="w-3 h-3" />
                        ATS {ver.atsScoreSnapshot}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleRestore(ver)}
                  disabled={restoringId !== null}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-archival-200 text-slate-400 hover:bg-royal-600 hover:text-white hover:border-royal-600 font-mono text-xs font-semibold transition disabled:opacity-40 flex-shrink-0 shadow-paper-xs"
                >
                  {restoringId === ver.id ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <RotateCcw className="w-3.5 h-3.5" />
                  )}
                  <span>Restore</span>
                </button>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-archival-200 bg-archival-50 rounded-b-2xl flex items-center justify-between text-[11px] font-mono text-slate-400">
          <span>{versions.length} checkpoint{versions.length === 1 ? '' : 's'} recorded</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-archival-100 text-slate-400 hover:text-slate-100 text-xs font-mono transition border border-archival-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
