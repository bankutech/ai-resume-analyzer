import React from 'react';
import { useResumeEditorStore } from '../../../store/resumeEditorStore';
import { Plus, Trash2, ShieldCheck } from 'lucide-react';

const inputCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-sm text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none transition';

const inputSmCls =
  'w-full px-3 py-1.5 bg-white border border-archival-200 rounded-lg text-xs text-slate-100 placeholder-slate-400 focus:border-royal-600 focus:outline-none font-mono transition';

export const CertificationsSection: React.FC = () => {
  const certifications = useResumeEditorStore((state) => state.document.certifications);
  const updateCertification = useResumeEditorStore((state) => state.updateCertification);
  const addCertification = useResumeEditorStore((state) => state.addCertification);
  const removeCertification = useResumeEditorStore((state) => state.removeCertification);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <span className="text-xs font-mono uppercase tracking-wider text-slate-400 font-semibold">
          Certifications & Accreditations ({certifications.length})
        </span>
        <button
          type="button"
          onClick={() => addCertification()}
          className="flex items-center gap-1.5 text-xs font-mono text-royal-600 hover:text-royal-700 px-2.5 py-1 rounded-lg bg-royal-50 border border-royal-200 hover:bg-royal-100 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          Add Certification
        </button>
      </div>

      {certifications.map((cert, idx) => (
        <div
          key={cert.id}
          className="p-4 bg-archival-50 rounded-xl border border-archival-200 space-y-3 shadow-paper-xs"
        >
          <div className="flex items-center justify-between border-b border-archival-200 pb-2">
            <span className="text-xs font-mono font-semibold text-slate-100 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-royal-600" />
              Certification #{idx + 1}
            </span>
            <button
              type="button"
              onClick={() => removeCertification(cert.id)}
              className="text-slate-400 hover:text-rose-500 transition"
              title="Delete certification"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Certification Name</label>
              <input
                type="text"
                value={cert.name || ''}
                onChange={(e) => updateCertification(cert.id, { name: e.target.value })}
                placeholder="e.g. AWS Certified Solutions Architect"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Issuing Authority</label>
              <input
                type="text"
                value={cert.issuer || ''}
                onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })}
                placeholder="e.g. Amazon Web Services"
                className={inputCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Date</label>
              <input
                type="text"
                value={cert.date || ''}
                onChange={(e) => updateCertification(cert.id, { date: e.target.value })}
                placeholder="e.g. Oct 2024"
                className={inputSmCls}
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Verification URL</label>
              <input
                type="url"
                value={cert.credentialUrl || ''}
                onChange={(e) => updateCertification(cert.id, { credentialUrl: e.target.value })}
                placeholder="https://..."
                className={inputSmCls}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
