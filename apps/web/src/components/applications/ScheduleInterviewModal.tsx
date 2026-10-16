import React, { useState } from 'react';
import { api } from '../../lib/api';
import { useToast } from '../../context/ToastContext';
import { X, Calendar, Video, Loader2, CheckCircle2 } from 'lucide-react';

interface ScheduleInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  application: {
    id: string;
    company: string;
    roleTitle: string;
    nextFollowUpDate?: string | null;
    notes?: string | null;
  } | null;
  onUpdated: () => void;
}

export const ScheduleInterviewModal: React.FC<ScheduleInterviewModalProps> = ({
  isOpen,
  onClose,
  application,
  onUpdated,
}) => {
  const toast = useToast();

  const [dateStr, setDateStr] = useState<string>(() => {
    if (application?.nextFollowUpDate) {
      return new Date(application.nextFollowUpDate).toISOString().slice(0, 16);
    }
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    tomorrow.setHours(10, 0, 0, 0);
    return tomorrow.toISOString().slice(0, 16);
  });

  const [interviewType, setInterviewType] = useState<string>('Technical Round');
  const [meetingUrl, setMeetingUrl] = useState<string>('');
  const [notes, setNotes] = useState<string>(application?.notes || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen || !application) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsSubmitting(true);
      const combinedNotes = [
        notes.trim(),
        interviewType ? `[Round: ${interviewType}]` : null,
        meetingUrl.trim() ? `[Link: ${meetingUrl.trim()}]` : null,
      ]
        .filter(Boolean)
        .join(' ');

      await api.put(`/applications/${application.id}`, {
        nextFollowUpDate: dateStr ? new Date(dateStr).toISOString() : null,
        notes: combinedNotes,
      });

      toast.success(
        'Interview Scheduled',
        `Updated schedule for ${application.company} (${interviewType}).`
      );
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error('Scheduling Failed', err.message || 'Could not update schedule.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClear = async () => {
    try {
      setIsSubmitting(true);
      await api.put(`/applications/${application.id}`, {
        nextFollowUpDate: null,
      });
      toast.info('Schedule Cleared', `Removed follow-up date for ${application.company}.`);
      onUpdated();
      onClose();
    } catch (err: any) {
      toast.error('Failed to clear date', err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="w-full max-w-md bg-white border border-carbon-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-700 bg-carbon-850/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-300 flex items-center justify-center text-amber-700">
              <Calendar className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-slate-100 tracking-tight">
                Schedule Interview / Follow-up
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                {application.company} • {application.roleTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-100 hover:bg-carbon-800 transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Interview Stage / Round
            </label>
            <select
              value={interviewType}
              onChange={(e) => setInterviewType(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-200 focus:border-royal-500 shadow-sm"
            >
              <option value="Recruiter Screen">Recruiter Phone Screen</option>
              <option value="Online Assessment">Online Assessment (OA)</option>
              <option value="Technical Round">Technical Round / Live Coding</option>
              <option value="System Design">System Design & Architecture</option>
              <option value="Hiring Manager 1:1">Hiring Manager 1:1</option>
              <option value="Onsite Virtual Loop">Onsite Virtual Loop (Finals)</option>
              <option value="Executive / Culture Fit">Executive / Culture Fit</option>
              <option value="Offer / Comp Review">Offer & Compensation Review</option>
              <option value="Follow-up Reminder">Follow-up Email Reminder</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Scheduled Date & Time
            </label>
            <input
              type="datetime-local"
              required
              value={dateStr}
              onChange={(e) => setDateStr(e.target.value)}
              className="w-full px-3 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 focus:border-royal-500 shadow-sm"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Video Call URL / Meeting Link (Optional)
            </label>
            <div className="relative">
              <Video className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="url"
                value={meetingUrl}
                onChange={(e) => setMeetingUrl(e.target.value)}
                placeholder="https://meet.google.com/xyz or Zoom URL..."
                className="w-full pl-9 pr-3 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:border-royal-500 shadow-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1">
              Preparation Notes & Focus Topics
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Interviewer names, coding questions to review, key talking points..."
              className="w-full px-3 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:border-royal-500 shadow-sm"
            />
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-carbon-700">
            {application.nextFollowUpDate ? (
              <button
                type="button"
                disabled={isSubmitting}
                onClick={handleClear}
                className="text-xs font-mono text-rose-600 hover:text-rose-700 transition"
              >
                Clear Date
              </button>
            ) : (
              <span />
            )}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-2 rounded-xl bg-carbon-850 hover:bg-carbon-800 text-xs font-mono text-slate-300 transition"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-sm transition disabled:opacity-40"
              >
                {isSubmitting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <CheckCircle2 className="w-3.5 h-3.5" />
                )}
                <span>Save Schedule</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
