import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LogIn,
  Shield,
  User,
  Loader2,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Database,
  Zap,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide both email and password.');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await login(email, password);
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please verify credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = async (persona: 'sample' | 'admin') => {
    try {
      setIsLoading(true);
      setError(null);
      if (persona === 'admin') {
        setEmail('demo@myrmyc.app');
        setPassword('MyRmyC2026!');
        await login('demo@myrmyc.app', 'MyRmyC2026!');
      } else {
        setEmail('alex.rivera@myrmyc.app');
        setPassword('MyRmyC2026!');
        await login('alex.rivera@myrmyc.app', 'MyRmyC2026!');
      }
      navigate('/app/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to sign in with demo credentials');
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
                ATS STUDIO
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
            to="/register"
            className="text-xs font-mono font-medium text-slate-400 hover:text-slate-100 transition px-3 py-1.5 rounded-xl border border-transparent hover:border-archival-200"
          >
            Create Account
          </Link>
        </div>
      </header>

      {/* Main Split-Screen Workspace */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-12 py-10 lg:py-16 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Column: Brand Manifesto & Real-Time ATS Showcase */}
        <div className="lg:col-span-6 space-y-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white border border-archival-200 text-xs font-mono text-slate-400 shadow-paper-xs">
              <Sparkles className="w-3.5 h-3.5 text-royal-600" />
              <span>Deterministic 8-Pillar Evaluation Standard</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-display font-extrabold tracking-tight text-slate-100 leading-[1.12]">
              Engineered for ATS Parsers.
              <span className="block text-slate-400 font-normal mt-1">
                Built for Senior Hiring Committees.
              </span>
            </h1>

            <p className="text-sm text-slate-300 font-sans leading-relaxed max-w-lg">
              Sign in to manage your single-column vector resumes, test live ATS scoring heuristics, and track active applications with immutable Neon PostgreSQL checkpoints.
            </p>
          </div>

          {/* Interactive Telemetry Card */}
          <div className="bg-white border border-archival-200 rounded-2xl p-6 shadow-paper-md space-y-4">
            <div className="flex items-center justify-between border-b border-archival-200 pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-forest-50 border border-forest-200 flex items-center justify-center text-forest-700 font-bold font-mono text-xs">
                  98
                </div>
                <div>
                  <h2 className="text-xs font-semibold text-slate-100">Live Persona Telemetry</h2>
                  <p className="text-[10px] font-mono text-slate-400">Alex Rivera • Staff Systems Engineer</p>
                </div>
              </div>
              <span className="text-[10px] font-mono text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 font-bold">
                VERIFIED 100% PARSABLE
              </span>
            </div>

            {/* Google X-Y-Z Formula Demo */}
            <div className="p-3.5 rounded-xl bg-archival-50 border border-archival-200 space-y-2">
              <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                <span>Google X-Y-Z Bullet Metric Alignment</span>
                <span className="text-forest-700 font-bold">16 / 16 pts</span>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans">
                &ldquo;Architected distributed event queue with Redis & Kafka, reducing p99 latency by{' '}
                <span className="bg-ochre-50 text-ochre-700 px-1 py-0.2 rounded border border-ochre-200 font-mono font-bold">
                  74%
                </span>{' '}
                and sustaining{' '}
                <span className="bg-ochre-50 text-ochre-700 px-1 py-0.2 rounded border border-ochre-200 font-mono font-bold">
                  12M+ daily requests
                </span>
                .&rdquo;
              </p>
            </div>

            {/* Pillar Grid */}
            <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
              <div className="p-2 rounded-lg bg-archival-50 border border-archival-200 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                <span>100% Vector</span>
              </div>
              <div className="p-2 rounded-lg bg-archival-50 border border-archival-200 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                <span>Zundo History</span>
              </div>
              <div className="p-2 rounded-lg bg-archival-50 border border-archival-200 flex items-center gap-1.5 text-slate-300">
                <CheckCircle2 className="w-3.5 h-3.5 text-forest-600 flex-shrink-0" />
                <span>DOCX OpenXML</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Clean Light-Mode Authentication Terminal */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-full max-w-md bg-white border border-archival-200 rounded-3xl p-8 sm:p-10 shadow-paper-lg space-y-6">
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-2xl font-display font-extrabold tracking-tight text-slate-100">
                Sign In to Studio
              </h2>
              <p className="text-xs font-mono text-slate-400">
                Enter your workspace or choose 1-click sandbox access.
              </p>
            </div>

            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* 1-Click Sandbox Fast-Track */}
            <div className="p-4 rounded-2xl bg-archival-50 border border-archival-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 font-bold flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-ochre-500" />
                  Instant Sandbox Fast-Track
                </span>
                <span className="text-[9px] font-mono text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 font-bold">
                  No Password Needed
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {/* Alex Rivera Persona */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoLogin('sample')}
                  className="p-3 rounded-xl bg-white hover:bg-royal-50/60 border border-archival-200 hover:border-royal-400 text-left transition flex flex-col justify-between shadow-paper-xs group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-royal-600 transition">
                      Alex Rivera
                    </span>
                    <User className="w-3.5 h-3.5 text-royal-600" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block line-clamp-1">
                    Full-Stack & ML Profile
                  </span>
                  <span className="text-[9px] font-mono text-royal-600 font-semibold mt-1">
                    alex.rivera@myrmyc.app
                  </span>
                </button>

                {/* Demo Admin Persona */}
                <button
                  type="button"
                  disabled={isLoading}
                  onClick={() => handleDemoLogin('admin')}
                  className="p-3 rounded-xl bg-white hover:bg-ochre-50/60 border border-archival-200 hover:border-ochre-400 text-left transition flex flex-col justify-between shadow-paper-xs group disabled:opacity-50"
                >
                  <div className="flex items-center justify-between w-full mb-1">
                    <span className="text-xs font-bold text-slate-100 group-hover:text-ochre-700 transition">
                      Demo Admin
                    </span>
                    <Shield className="w-3.5 h-3.5 text-ochre-600" />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400 block line-clamp-1">
                    Enterprise ATS Console
                  </span>
                  <span className="text-[9px] font-mono text-ochre-700 font-semibold mt-1">
                    demo@myrmyc.app
                  </span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="border-t border-archival-200 w-full" />
              <span className="bg-white px-3 text-[10px] font-mono text-slate-400 uppercase tracking-widest">
                Or with credentials
              </span>
            </div>

            {/* Standard Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
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
                  placeholder="name@company.com"
                  className="w-full px-4 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-mono transition"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1.5 font-medium">
                  Password
                </label>
                <input
                  type="password"
                  autoComplete="current-password"
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
                  <LogIn className="w-4 h-4" />
                )}
                <span>Sign In to Studio</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </form>

            {/* Bottom Register CTA */}
            <div className="pt-2 text-center text-xs font-mono text-slate-400 border-t border-archival-200">
              Don&apos;t have an account?{' '}
              <Link
                to="/register"
                className="text-royal-600 hover:text-royal-700 font-bold hover:underline ml-1"
              >
                Create Account →
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
