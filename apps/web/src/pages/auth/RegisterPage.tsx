import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  UserPlus,
  Loader2,
  Sparkles,
  ArrowRight,
  Database,
  FileText,
  ShieldCheck,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) {
      setError('Please fill in all required fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await register(email, password, name);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FAF9F5] text-slate-100 selection:bg-royal-500/20 flex flex-col justify-between">
      {/* Top Architectural Header */}
      <header className="w-full border-b border-archival-200 bg-white/90 backdrop-blur-md px-6 lg:px-12 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-9 h-9 rounded-xl bg-royal-600 flex items-center justify-center text-white font-mono font-bold text-sm shadow-paper-xs group-hover:scale-105 transition">
            mR
          </div>
          <div>
            <div className="font-display font-extrabold text-base tracking-tight text-slate-100 flex items-center gap-2">
              myRmyC
              <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-forest-50 text-forest-700 border border-forest-200">
                REGISTRATION
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">myresume mycareer</p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-50 text-forest-700 border border-forest-200 text-xs font-mono">
            <span className="w-2 h-2 rounded-full bg-forest-500 animate-pulse" />
            <Database className="w-3.5 h-3.5" />
            <span>Neon Cloud PostgreSQL Connected</span>
          </div>
          <Link
            to="/login"
            className="text-xs font-mono font-medium text-slate-400 hover:text-slate-100 transition px-3 py-1.5 rounded-xl border border-transparent hover:border-archival-200"
          >
            Sign In
          </Link>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Benefits & Architecture */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-archival-200 text-xs font-mono text-slate-400 shadow-paper-xs">
              <Sparkles className="w-3.5 h-3.5 text-royal-600" />
              <span>Full-Stack Career Telemetry Studio</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-100 leading-[1.12]">
              Elevate Your Documents to
              <span className="block text-royal-600 font-extrabold mt-1">
                Executive Parsing Standards.
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-lg">
              Create your dedicated workspace to generate single-column ATS vector resumes, audit bullet strength with Google X-Y-Z metrics, and maintain immutable version snapshots.
            </p>
          </div>

          {/* Feature Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-royal-50 border border-royal-200 flex items-center justify-center text-royal-600">
                <FileText className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-100">6 Pure ATS Templates</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Strict single-column layouts engineered to achieve 100% parse rates across Workday, Taleo, and Greenhouse.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-100">Deterministic 8-Pillar ATS</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Mathematical rubric evaluating contact fields, standard headings, power verbs, and metric density.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-ochre-50 border border-ochre-200 flex items-center justify-center text-ochre-700">
                <Sparkles className="w-4 h-4" />
              </div>
              <h2 className="text-xs font-bold text-slate-100">Google X-Y-Z Optimizer</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                Gemini 2.5 Flash + heuristic fallback to transform passive participation bullets into verified accomplishments.
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-white border border-archival-200 shadow-paper-xs space-y-1.5">
              <div className="w-8 h-8 rounded-lg bg-archival-100 border border-archival-200 flex items-center justify-center text-slate-300">
                <Database className="w-4 h-4 text-royal-600" />
              </div>
              <h2 className="text-xs font-bold text-slate-100">Neon Cloud Versioning</h2>
              <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                PostgreSQL persistence with temporal Zundo undo/redo and point-in-time JSONB rollback capabilities.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Registration Terminal */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white border border-archival-200 rounded-3xl p-8 sm:p-10 shadow-paper-lg space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-100">
                Create Workspace
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Initialize your engineering ATS career command center.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Alex Rivera"
                  className="w-full px-4 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-sans transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                  Email Address
                </label>
                <input
                  type="email"
                  autoComplete="username"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex.rivera@example.com"
                  className="w-full px-4 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                  Password (min 8 characters)
                </label>
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  className="w-full px-4 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-mono transition"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-paper-sm transition hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <UserPlus className="w-4 h-4" />
                )}
                <span>Initialize Account</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Bottom Sign In Link */}
            <div className="pt-2 text-center text-xs font-mono text-slate-400 border-t border-archival-200">
              Already have a workspace?{' '}
              <Link
                to="/login"
                className="text-royal-600 hover:text-royal-700 font-bold hover:underline ml-1"
              >
                Sign In →
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* Archival Footnote */}
      <footer className="border-t border-archival-200 py-4 px-6 text-center text-[11px] font-mono text-slate-400 bg-white/50">
        <span>myRmyC — myresume mycareer • Deterministic 8-Pillar ATS Diagnostics & Single-Column Vector Studio</span>
      </footer>
    </div>
  );
};
