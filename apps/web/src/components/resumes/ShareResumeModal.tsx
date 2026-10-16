import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';
import {
  X,
  Copy,
  Check,
  QrCode,
  ExternalLink,
  Download,
  FileText,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface ShareResumeModalProps {
  isOpen: boolean;
  onClose: () => void;
  resumeId: string;
  resumeTitle?: string;
}

export const ShareResumeModal: React.FC<ShareResumeModalProps> = ({
  isOpen,
  onClose,
  resumeId,
  resumeTitle = 'Resume',
}) => {
  const toast = useToast();
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/r/${resumeId}`;

  useEffect(() => {
    if (!isOpen || !resumeId) return;

    QRCode.toDataURL(publicUrl, {
      width: 280,
      margin: 2,
      color: {
        dark: '#0e1117',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('QR code generation failed:', err));
  }, [isOpen, publicUrl, resumeId]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      toast.success('Link Copied to Clipboard', publicUrl);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error('Copy Failed', 'Please copy the link manually.');
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${resumeTitle.replace(/[^a-z0-9]/gi, '-').toLowerCase()}-qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    toast.success('QR Code Downloaded', 'Saved high-resolution PNG for meetups & badges.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-150">
      <div
        className="relative w-full max-w-lg bg-white border border-carbon-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-carbon-700 bg-carbon-850/60">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
              <QrCode className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-display font-bold text-slate-100 tracking-tight">
                Share Live ATS Resume & QR Code
              </h3>
              <p className="text-[11px] font-mono text-slate-400">
                Publicly verifiable vector portfolio link
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

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {/* QR Code Presentation Box */}
          <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-carbon-850 border border-carbon-700">
            <div className="p-2.5 bg-white rounded-xl shadow-sm shrink-0 border border-carbon-700">
              {qrDataUrl ? (
                <img
                  src={qrDataUrl}
                  alt={`QR code for ${resumeTitle}`}
                  className="w-36 h-36 rounded"
                />
              ) : (
                <div className="w-36 h-36 bg-slate-100 flex items-center justify-center text-xs font-mono text-slate-400">
                  Generating...
                </div>
              )}
            </div>

            <div className="space-y-2.5 text-center sm:text-left">
              <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-forest-50 text-forest-700 border border-forest-200 text-[10px] font-mono font-medium">
                <Sparkles className="w-3 h-3" />
                <span>Instant Mobile Camera Scan</span>
              </div>
              <h4 className="text-xs font-bold text-slate-100">
                Career Fairs, Badges & Meetups
              </h4>
              <p className="text-[11px] font-mono text-slate-400 leading-relaxed">
                Recruiters scan this code on iOS/Android camera to immediately view your live ATS resume without any login wall.
              </p>
              <button
                type="button"
                onClick={handleDownloadQr}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-carbon-850 border border-carbon-700 text-xs font-mono text-slate-200 hover:text-slate-100 shadow-sm transition"
              >
                <Download className="w-3.5 h-3.5 text-royal-600" />
                <span>Download QR PNG</span>
              </button>
            </div>
          </div>

          {/* Copyable Share URL */}
          <div className="space-y-1.5">
            <label className="block text-xs font-mono text-slate-400">
              Direct Public Share URL
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={publicUrl}
                className="flex-1 px-3 py-2 bg-white border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 focus:outline-none select-all shadow-sm"
              />
              <button
                type="button"
                onClick={handleCopy}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-medium transition shrink-0 shadow-sm ${
                  copied
                    ? 'bg-forest-600 text-white'
                    : 'bg-royal-600 hover:bg-royal-700 text-white'
                }`}
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
            </div>
          </div>

          {/* Direct Export Links */}
          <div className="pt-2 border-t border-carbon-700">
            <span className="text-xs font-mono text-slate-400 block mb-2">
              Quick Document Access
            </span>
            <div className="grid grid-cols-2 gap-2.5">
              <a
                href={publicUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-carbon-850 border border-carbon-700 text-xs font-mono text-slate-200 shadow-sm transition"
              >
                <ExternalLink className="w-3.5 h-3.5 text-royal-600" />
                <span>Preview Page</span>
              </a>
              <a
                href={`/api/export/docx/${resumeId}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white hover:bg-carbon-850 border border-carbon-700 text-xs font-mono text-slate-200 shadow-sm transition"
              >
                <FileText className="w-3.5 h-3.5 text-royal-600" />
                <span>Word (.docx)</span>
              </a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 border-t border-carbon-700 bg-carbon-850/40 flex items-center justify-between">
          <span className="text-[11px] font-mono text-slate-400">
            myRmyC Open Access Portfolio
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white hover:bg-carbon-850 border border-carbon-700 text-xs font-mono text-slate-200 hover:text-slate-100 shadow-sm transition"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
