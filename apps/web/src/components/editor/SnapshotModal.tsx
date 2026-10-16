import React, { useState } from 'react';
import { Camera, X, Check, Loader2 } from 'lucide-react';
import { api } from '../../lib/api';

interface SnapshotModalProps {
  resumeId: string;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (versionName: string) => void;
}

export const SnapshotModal: React.FC<SnapshotModalProps> = ({
  resumeId,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [versionName, setVersionName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!versionName.trim()) return;

    setIsSubmitting(true);
    setError(null);

    try {
      await api.post(`/resumes/${resumeId}/versions`, {
        versionName: versionName.trim(),
      });
      onSuccess(versionName.trim());
      setVersionName('');
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to create checkpoint snapshot');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div data-lenis-prevent className="w-full max-w-md bg-white border border-archival-200 rounded-2xl p-6 shadow-paper-lg space-y-4">
        <div className="flex items-center justify-between border-b border-archival-200 pb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
              <Camera className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm text-slate-100">Create Version Checkpoint</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-100 hover:bg-archival-100 rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-400 leading-relaxed">
          Snapshots freeze your full resume document tree and ATS telemetry at this exact moment. You can safely experiment or restore this state anytime.
        </p>

        {error && (
          <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-xs font-mono text-rose-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Checkpoint Label / Target
            </label>
            <input
              type="text"
              autoFocus
              value={versionName}
              onChange={(e) => setVersionName(e.target.value)}
              placeholder="e.g. Before Stripe Staff Backend Application"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-sm text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-sans transition"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg text-xs font-mono text-slate-400 hover:text-slate-100 hover:bg-archival-100 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || !versionName.trim()}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-royal-600 hover:bg-royal-700 text-white font-mono text-xs font-semibold shadow transition disabled:opacity-40"
            >
              {isSubmitting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
              Save Checkpoint
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
