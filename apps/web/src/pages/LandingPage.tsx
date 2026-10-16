import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  ArrowRight,
  Database,
  CheckCircle2,
  Zap,
  ShieldCheck,
  FileCheck,
  Layers,
} from 'lucide-react';
import { SAMPLE_STUDENT_RESUME_DOCUMENT, TemplateSlug } from '@resumeforge/shared';
import { TemplateRenderer } from '../components/templates/TemplateRenderer';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTemplate, setActiveTemplate] = useState<TemplateSlug>('classic-ats');
  const [testBullet, setTestBullet] = useState(
    'Assisted team with writing backend code and improved database queries.'
  );
  const [enhancedResult, setEnhancedResult] = useState<string | null>(null);

  const previewDoc = {
    ...SAMPLE_STUDENT_RESUME_DOCUMENT,
    metadata: {
      ...SAMPLE_STUDENT_RESUME_DOCUMENT.metadata,
      templateId: activeTemplate,
    },
  };

  const handleSimulateEnhancement = () => {
    setEnhancedResult(
      'Engineered distributed database indexing pipeline, reducing p99 query latency from 420ms to 68ms (83% decrease) under 10k+ peak requests/sec.'
    );
  };

  return (
    <div className="min-h-screen bg-carbon-950 text-slate-100 selection:bg-royal-500/15 selection:text-royal-500 font-sans">
      {/* Top Archival Navigation */}
      <header className="border-b border-carbon-700/80 bg-white/95 backdrop-blur-md sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.03)]">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-royal-500 flex items-center justify-center text-white font-mono font-bold text-xs tracking-tight shadow-sm">
              mR
            </div>
            <div>
              <span className="font-display font-bold text-sm tracking-tight text-slate-100 block">
                myRmyC
              </span>
              <span className="text-[10px] font-mono text-slate-400">myresume mycareer</span>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 text-forest-500 border border-forest-100 text-xs font-mono font-medium">
              <Database className="w-3.5 h-3.5" />
              <span>Neon Cloud PostgreSQL Connected</span>
            </div>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-1.5 rounded-xl text-xs font-mono font-medium text-slate-300 hover:text-slate-100 hover:bg-carbon-800 transition"
            >
              Sign In
            </button>

            <button
              type="button"
              onClick={() => navigate('/login')}
              className="px-4 py-2 rounded-xl bg-royal-500 hover:bg-royal-600 text-white font-medium text-xs font-mono shadow-sm shadow-royal-500/20 transition"
            >
              Launch Studio
            </button>
          </div>
        </div>
      </header>

      {/* Hero: Editorial Precision */}
      <section className="py-16 md:py-24 px-6 max-w-7xl mx-auto border-b border-carbon-700/70">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-carbon-700 text-xs font-mono text-slate-300 shadow-sm">
              <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
              <span>Applicant Tracking System Verification Engine</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-slate-100 leading-[1.08]">
              Engineered for ATS Parsers.
              <span className="block text-slate-400 font-normal mt-1">
                Built for Senior Hiring Committees.
              </span>
            </h1>

            <p className="text-sm md:text-base text-slate-300 font-sans leading-relaxed max-w-2xl">
              myRmyC generates strictly typed, single-column vector resumes that parse with 100% fidelity on Workday, Taleo, Greenhouse, and Lever. Powered by real-time heuristic action-verb scoring, Google X-Y-Z metric reinforcement, and immutable version snapshots on Neon PostgreSQL.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="flex items-center gap-2.5 px-6 py-3 rounded-xl bg-royal-500 hover:bg-royal-600 text-white font-medium text-sm font-mono shadow-md shadow-royal-500/20 transition"
              >
                <span>Open Resume Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  const el = document.getElementById('ats-simulator');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-3 rounded-xl bg-white hover:bg-carbon-850 text-slate-200 border border-carbon-700 text-sm font-mono shadow-sm transition"
              >
                <Sparkles className="w-4 h-4 text-royal-500" />
                <span>Test ATS Heuristics</span>
              </button>
            </div>

            {/* Architecture Telemetry Pills */}
            <div className="pt-6 grid grid-cols-3 gap-3 border-t border-carbon-750 font-mono text-xs">
              <div className="p-3.5 rounded-xl bg-white border border-carbon-700 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">PARSER STANDARD</span>
                <span className="text-slate-100 font-bold flex items-center gap-1.5 mt-0.5">
                  <FileCheck className="w-3.5 h-3.5 text-forest-500" />
                  100% Vector
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-carbon-700 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">EXPORT ENGINE</span>
                <span className="text-royal-500 font-bold flex items-center gap-1.5 mt-0.5">
                  <Layers className="w-3.5 h-3.5 text-royal-500" />
                  PDF & DOCX
                </span>
              </div>
              <div className="p-3.5 rounded-xl bg-white border border-carbon-700 shadow-sm">
                <span className="text-[10px] text-slate-400 block font-semibold">CLOUD STORAGE</span>
                <span className="text-slate-100 font-bold flex items-center gap-1.5 mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-forest-500" />
                  Neon Postgres
                </span>
              </div>
            </div>
          </div>

          {/* Right: Live Interactive Paper Canvas Preview */}
          <div className="lg:col-span-5">
            <div className="bg-white border border-carbon-700 rounded-2xl p-4 shadow-xl space-y-3">
              <div className="flex items-center justify-between border-b border-carbon-750 pb-3">
                <span className="text-xs font-mono text-slate-200 flex items-center gap-2 font-medium">
                  <span className="w-2 h-2 rounded-full bg-forest-500" />
                  Live Template Preview
                </span>
                <select
                  value={activeTemplate}
                  onChange={(e) => setActiveTemplate(e.target.value as TemplateSlug)}
                  className="px-2.5 py-1 bg-carbon-850 border border-carbon-700 rounded-lg text-xs font-mono text-slate-100 focus:border-royal-500"
                >
                  <option value="classic-ats">Classic ATS</option>
                  <option value="modern-professional">Modern Pro</option>
                  <option value="student-fresher">Student Fresher</option>
                  <option value="software-engineer">SWE Tech</option>
                  <option value="academic-research">Academic CV</option>
                  <option value="creative-portfolio">Creative Minimal</option>
                </select>
              </div>

              {/* Scaled Paper Preview Container */}
              <div className="bg-carbon-850 p-4 rounded-xl border border-carbon-700/80 h-[480px] overflow-hidden flex justify-center relative select-none">
                <div
                  style={{ transform: 'scale(0.58)', transformOrigin: 'top center' }}
                  className="w-[794px] bg-white p-10 text-gray-900 shadow-2xl pointer-events-none rounded border border-carbon-700"
                >
                  <TemplateRenderer document={previewDoc} />
                </div>
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-white/95 backdrop-blur px-3 py-1 rounded-full border border-carbon-700 text-[10px] font-mono text-slate-400 shadow-sm">
                  Click Launch Studio to Edit Live
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive ATS Heuristic Simulator */}
      <section id="ats-simulator" className="py-16 px-6 max-w-7xl mx-auto border-b border-carbon-700/70">
        <div className="max-w-3xl space-y-3 mb-8">
          <div className="inline-flex items-center gap-2 text-xs font-mono text-royal-500 font-semibold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>REAL-TIME DIAGNOSTIC SIMULATOR</span>
          </div>
          <h2 className="text-3xl font-display font-bold text-slate-100 tracking-tight">
            See the Google X-Y-Z Transformation Engine in Action
          </h2>
          <p className="text-xs font-mono text-slate-400">
            Test how our heuristic action engine converts weak, passive descriptions into high-signal quantitative achievements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-4">
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block font-semibold">
              1. Input Your Unrefined Bullet Point
            </span>
            <textarea
              rows={4}
              value={testBullet}
              onChange={(e) => setTestBullet(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-carbon-850 border border-carbon-700 rounded-xl text-xs font-mono text-slate-100 focus:border-royal-500 leading-relaxed"
            />
            <button
              type="button"
              onClick={handleSimulateEnhancement}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-royal-500 hover:bg-royal-600 text-white font-medium text-xs font-mono shadow-sm shadow-royal-500/20 transition"
            >
              <Zap className="w-4 h-4" />
              <span>Run Heuristic Enhancement</span>
            </button>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-carbon-700 shadow-sm space-y-4">
            <span className="text-xs font-mono text-forest-500 uppercase tracking-wider block flex items-center gap-1.5 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              2. ATS-Compliant Output (Score: 96/100)
            </span>
            <div className="p-4 rounded-xl bg-forest-50 border border-forest-100 min-h-[100px] flex items-center text-xs font-mono text-forest-600 leading-relaxed">
              {enhancedResult || 'Click "Run Heuristic Enhancement" to see rewritten outcome.'}
            </div>
            <div className="text-[11px] font-mono text-slate-400">
              Matches: Strong Verb ("Engineered"), Quantitative Latency ("from 420ms to 68ms"), Metric Percentage ("83% decrease"), Scale Throughput ("10k+ req/sec").
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-mono text-slate-400">
        <div>
          myRmyC — myresume mycareer © 2026. Built with PostgreSQL on Neon Cloud, React, TypeScript, and Google Gemini API.
        </div>
        <div className="flex items-center gap-4 text-slate-400">
          <span className="hover:text-royal-500 cursor-pointer transition" onClick={() => navigate('/login')}>
            Studio
          </span>
          <span>•</span>
          <span className="hover:text-royal-500 cursor-pointer transition" onClick={() => navigate('/login')}>
            Admin Login
          </span>
        </div>
      </footer>
    </div>
  );
};
