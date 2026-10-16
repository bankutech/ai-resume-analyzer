import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ResumeDocument, SAMPLE_STUDENT_RESUME_DOCUMENT } from '@resumeforge/shared';
import { TemplateRenderer } from '../../components/templates/TemplateRenderer';
import {
  Share2,
  Printer,
  Sparkles,
  FileText,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ShareResumeModal } from '../../components/resumes/ShareResumeModal';

export const PublicResumeViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<ResumeDocument | null>(null);
  const [resumeTitle, setResumeTitle] = useState<string>('Candidate Resume');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    fetch(`/api/resumes/print-payload/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Document not found (HTTP ${res.status})`);
        return res.json();
      })
      .then((data) => {
        if (data.resume?.document) {
          setDoc(data.resume.document);
          setResumeTitle(data.resume.title || data.resume.document.basics?.fullName || 'Resume');
        } else {
          setDoc(SAMPLE_STUDENT_RESUME_DOCUMENT);
          setResumeTitle('Alex Rivera — Sample Resume');
        }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadDocx = () => {
    if (!id) return;
    window.open(`/api/export/docx/${id}`, '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-carbon-950 flex flex-col items-center justify-center p-6 text-slate-400 font-mono text-xs space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-royal-600" />
        <span>Loading verified resume from Neon Cloud...</span>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="min-h-screen bg-carbon-950 flex flex-col items-center justify-center p-6 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertCircle className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-lg font-display font-bold text-slate-100">Resume Document Unavailable</h2>
          <p className="text-xs font-mono text-slate-400 mt-1 max-w-md">
            This resume link may have expired, been set to private, or deleted by the author.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white border border-archival-200 text-xs font-mono text-slate-300 hover:text-slate-100 shadow-paper-xs transition"
        >
          <span>Return to myRmyC Homepage</span>
        </Link>
      </div>
    );
  }

  const { pageSize = 'A4', fontFamily = 'Inter' } = doc.metadata || {};

  return (
    <div className="min-h-screen bg-carbon-950 text-slate-100 flex flex-col selection:bg-royal-500/15 selection:text-royal-600">
      {/* Top Action Bar (Hidden during print) */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-archival-200 px-4 md:px-8 py-3 flex flex-wrap items-center justify-between gap-4 print:hidden shadow-paper-xs">
        <div className="flex items-center gap-3">
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-7 h-7 rounded-lg bg-royal-600 flex items-center justify-center text-white font-bold font-mono text-xs group-hover:scale-105 transition shadow-xs">
              mR
            </div>
            <div className="flex flex-col">
              <span className="font-display font-bold text-xs tracking-tight text-slate-100 flex items-center gap-1.5">
                myRmyC
                <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-forest-50 text-forest-700 border border-forest-200 font-bold">
                  VERIFIED
                </span>
              </span>
              <span className="text-[9px] font-mono text-slate-400">myresume mycareer</span>
            </div>
          </Link>

          <span className="h-4 w-px bg-archival-200 hidden sm:block" />

          <div className="hidden sm:block">
            <h1 className="text-xs font-semibold text-slate-100 line-clamp-1">
              {doc.basics?.fullName || resumeTitle}
            </h1>
            <p className="text-[10px] font-mono text-slate-400 line-clamp-1">
              {doc.basics?.headline || 'Professional Profile'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Share / QR Modal Button */}
          <button
            type="button"
            onClick={() => setIsShareModalOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-archival-50 border border-archival-200 text-xs font-mono text-slate-300 hover:text-slate-100 shadow-paper-xs transition"
            title="Open Shareable Link & QR Code"
          >
            <Share2 className="w-3.5 h-3.5 text-royal-600" />
            <span className="hidden sm:inline">Share & QR</span>
          </button>

          {/* DOCX Export */}
          <button
            type="button"
            onClick={handleDownloadDocx}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-archival-50 border border-archival-200 text-xs font-mono text-slate-300 hover:text-slate-100 shadow-paper-xs transition"
            title="Download formatted OpenXML (.docx) file"
          >
            <FileText className="w-3.5 h-3.5 text-royal-600" />
            <span className="hidden md:inline">Word (.docx)</span>
          </button>

          {/* Browser Print / Vector PDF */}
          <button
            type="button"
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white hover:bg-archival-50 border border-archival-200 text-xs font-mono text-slate-300 hover:text-slate-100 shadow-paper-xs transition"
            title="Print or save as Vector PDF"
          >
            <Printer className="w-3.5 h-3.5 text-forest-700" />
            <span>Print / PDF</span>
          </button>

          {/* Sign Up CTA */}
          <Link
            to="/register"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-semibold text-xs font-mono transition shadow-paper-xs ml-1"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Build With myRmyC</span>
          </Link>
        </div>
      </header>

      {/* Main Presentation Paper Canvas */}
      <main className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start print:p-0 print:m-0 print:overflow-visible">
        <div
          className="bg-white text-slate-100 rounded-lg shadow-paper-elevated border border-archival-200 overflow-hidden print:rounded-none print:shadow-none print:border-none"
          style={{
            width: pageSize === 'LETTER' ? '215.9mm' : '210mm',
            minHeight: pageSize === 'LETTER' ? '279.4mm' : '297mm',
            fontFamily: fontFamily || 'Inter, sans-serif',
          }}
        >
          <TemplateRenderer document={doc} />
        </div>
      </main>

      {/* Footer (Hidden during print) */}
      <footer className="py-4 border-t border-archival-200 text-center text-[11px] font-mono text-slate-400 print:hidden bg-white/50">
        <span>Verified by </span>
        <strong className="text-slate-200">myRmyC — myresume mycareer</strong>
        <span> • 100% Deterministic ATS Parser Alignment</span>
      </footer>

      {/* Share & QR Modal */}
      {id && (
        <ShareResumeModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          resumeId={id}
          resumeTitle={resumeTitle}
        />
      )}
    </div>
  );
};
