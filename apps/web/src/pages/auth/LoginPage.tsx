import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { LogIn, Shield, User, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-archival-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-royal-500/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-royal-600 text-white font-mono font-bold text-sm shadow-paper-sm tracking-tight">
          mR
        </div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-slate-100">
          Sign In to myRmyC
        </h2>
        <p className="text-xs font-mono text-slate-400">
          myresume mycareer • Enterprise ATS Diagnostics & Document Studio
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-archival-200 py-8 px-6 sm:px-8 shadow-paper-md rounded-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
              {error}
            </div>
          )}

          {/* 1-Click Demo Logins */}
          <div className="p-4 rounded-xl bg-archival-50 border border-archival-200 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 block font-semibold">
                ⚡ Instant 1-Click Sandbox Access
              </span>
              <span className="text-[9px] font-mono text-forest-700 bg-forest-50 px-2 py-0.5 rounded border border-forest-200 font-bold">
                Sandbox Mode
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-mono">
              Pre-loaded with sample SWE resumes & Kanban pipeline
            </p>
            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoLogin('admin')}
                className="p-2.5 rounded-xl bg-white hover:bg-archival-100 border border-archival-200 hover:border-ochre-400 text-left transition flex items-center justify-between shadow-paper-xs"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-100 block">Demo Admin</span>
                  <span className="text-[10px] font-mono text-ochre-600">demo@myrmyc.app</span>
                </div>
                <Shield className="w-3.5 h-3.5 text-ochre-600" />
              </button>

              <button
                type="button"
                disabled={isLoading}
                onClick={() => handleDemoLogin('sample')}
                className="p-2.5 rounded-xl bg-white hover:bg-archival-100 border border-archival-200 hover:border-royal-400 text-left transition flex items-center justify-between shadow-paper-xs"
              >
                <div>
                  <span className="text-xs font-semibold text-slate-100 block">Alex Rivera</span>
                  <span className="text-[10px] font-mono text-royal-600">alex.rivera@myrmyc.app</span>
                </div>
                <User className="w-3.5 h-3.5 text-royal-600" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-archival-200 w-full" />
            <span className="bg-white px-3 text-[10px] font-mono text-slate-400 uppercase tracking-wider">
              Or with credentials
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="demo@myrmyc.app"
                className="w-full px-3.5 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Password</label>
              <input
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full px-3.5 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-mono transition"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-royal-600 hover:bg-royal-700 text-white font-medium text-xs font-mono shadow-paper-sm transition disabled:opacity-50"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <LogIn className="w-4 h-4" />
              )}
              <span>Sign In to Studio</span>
            </button>
          </form>

          <div className="text-center text-xs font-mono text-slate-400">
            Don't have an account?{' '}
            <Link to="/register" className="text-royal-600 hover:text-royal-700 font-semibold hover:underline">
              Create an account
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
