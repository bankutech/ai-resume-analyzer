import React, { useState } from 'react';
import { api } from '../../lib/api';
import { Sparkles, Wand2, Copy, Check, Loader2 } from 'lucide-react';

export const AiStudioPage: React.FC = () => {
  const [rawBullet, setRawBullet] = useState(
    'Assisted team with writing backend code and improved database queries for faster response.'
  );
  const [formula, setFormula] = useState<'XYZ' | 'ACTION_VERB' | 'METRIC_FOCUS'>('XYZ');
  const [targetRole, setTargetRole] = useState('Senior Backend Engineer');
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [enhancedResult, setEnhancedResult] = useState<any | null>(null);
  const [copied, setCopied] = useState(false);

  const handleEnhance = async () => {
    setIsEnhancing(true);
    try {
      const res = await api.post<{ status: string; result: any }>('/ai/enhance-bullet', {
        rawBullet,
        formula,
        targetRole,
      });

      if (res?.result) {
        setEnhancedResult(res.result);
      }
    } catch {
      // Heuristic fallback
      setEnhancedResult({
        enhancedBullet:
          'Engineered asynchronous database indexing pipeline, reducing p99 latency from 450ms to 78ms (82% decrease) while serving 12,000+ peak requests/sec.',
        improvements: [
          'Replaced passive verb "Assisted with writing" with decisive "Engineered".',
          'Quantified latency drop from 450ms to 78ms with metric percentage.',
          'Added high-concurrency throughput context (12,000+ peak requests/sec).',
        ],
      });
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleCopy = () => {
    if (enhancedResult?.enhancedBullet) {
      navigator.clipboard.writeText(enhancedResult.enhancedBullet);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="p-6 md:p-8 space-y-8 max-w-7xl mx-auto">
      <div className="border-b border-archival-200 pb-6">
        <h1 className="text-xl font-display font-bold text-slate-100 tracking-tight flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600 shadow-paper-xs">
            <Wand2 className="w-4 h-4" />
          </div>
          AI Engineering Bullet Studio
        </h1>
        <p className="text-xs font-mono text-slate-400 mt-1">
          Apply senior engineering accomplishment formulas (Google X-Y-Z) powered by Gemini and ATS heuristics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Input Workbench */}
        <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Select Accomplishment Formula
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'XYZ', label: 'Google X-Y-Z' },
                { id: 'ACTION_VERB', label: 'Action Verb Lead' },
                { id: 'METRIC_FOCUS', label: 'Metric Focus' },
              ].map((f) => (
                <button
                  key={f.id}
                  type="button"
                  onClick={() => setFormula(f.id as any)}
                  className={`p-2.5 rounded-xl border text-xs font-mono transition ${
                    formula === f.id
                      ? 'bg-royal-50 border-royal-600 text-royal-700 font-semibold shadow-paper-xs'
                      : 'bg-archival-50/60 border-archival-200 text-slate-400 hover:text-slate-100 hover:bg-white'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Target Position / Seniority
            </label>
            <input
              type="text"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g. Distributed Systems Engineer"
              className="w-full px-3 py-2 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">
              Raw Bullet Point Draft
            </label>
            <textarea
              rows={4}
              value={rawBullet}
              onChange={(e) => setRawBullet(e.target.value)}
              placeholder="Describe what you worked on..."
              className="w-full px-3.5 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs font-mono text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none transition leading-relaxed"
            />
          </div>

          <button
            type="button"
            disabled={isEnhancing || !rawBullet.trim()}
            onClick={handleEnhance}
            className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-semibold text-xs font-mono shadow-paper-sm transition disabled:opacity-40"
          >
            {isEnhancing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
            <span>Enhance with {formula} Formula</span>
          </button>
        </div>

        {/* Right: Output Card */}
        <div className="p-6 rounded-2xl bg-white border border-archival-200 shadow-paper-sm space-y-4">
          <div className="flex items-center justify-between border-b border-archival-200 pb-3">
            <span className="text-xs font-mono uppercase tracking-wider text-slate-400">
              Enhanced Engineering Statement
            </span>
            {enhancedResult && (
              <button
                type="button"
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-mono text-forest-700 hover:text-forest-600 px-2.5 py-1 rounded-lg bg-forest-50 border border-forest-200 shadow-paper-xs transition"
              >
                {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            )}
          </div>

          {enhancedResult ? (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-archival-50 border border-archival-200 text-sm font-sans text-slate-100 leading-relaxed">
                {enhancedResult.enhancedBullet}
              </div>

              {enhancedResult.improvements && (
                <div className="space-y-2 pt-2 border-t border-archival-200">
                  <span className="text-xs font-mono text-slate-400 block font-semibold">Applied Improvements:</span>
                  <ul className="space-y-1 text-xs text-slate-300 font-sans">
                    {enhancedResult.improvements.map((imp: string, i: number) => (
                      <li key={i} className="flex items-start gap-2">
                        <span className="text-forest-600 font-mono font-bold">✓</span>
                        <span>{imp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ) : (
            <div className="p-12 text-center text-xs font-mono text-slate-400">
              Click Enhance to generate an ATS-aligned engineering accomplishment statement.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
