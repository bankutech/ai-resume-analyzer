import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { UserPlus, Loader2 } from 'lucide-react';

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
    <div className="min-h-screen bg-archival-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 selection:bg-royal-500/20">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-2">
        <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-royal-600 text-white font-mono font-bold text-sm shadow-paper-sm tracking-tight">
          mR
        </div>
        <h2 className="text-2xl font-display font-bold tracking-tight text-slate-100">
          Create myRmyC Account
        </h2>
        <p className="text-xs font-mono text-slate-400">
          myresume mycareer • Build ATS-optimized resumes with real-time scoring
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white border border-archival-200 py-8 px-6 sm:px-8 shadow-paper-md rounded-2xl space-y-6">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-mono">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Alex Rivera"
                className="w-full px-3.5 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-sans transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@example.com"
                className="w-full px-3.5 py-2.5 bg-archival-50/60 border border-archival-200 rounded-xl text-xs text-slate-100 placeholder-slate-400 focus:bg-white focus:border-royal-600 focus:outline-none font-mono transition"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1">
                Password (min 8 chars with uppercase, number, symbol)
              </label>
              <input
                type="password"
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
                <UserPlus className="w-4 h-4" />
              )}
              <span>Create Account</span>
            </button>
          </form>

          <div className="text-center text-xs font-mono text-slate-400">
            Already have an account?{' '}
            <Link to="/login" className="text-royal-600 hover:text-royal-700 font-semibold hover:underline">
              Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
