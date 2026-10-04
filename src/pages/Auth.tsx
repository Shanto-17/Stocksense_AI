import { useState } from 'react';
import { Activity, Mail, Lock, User, ArrowLeft, Chrome, Facebook, Linkedin, AlertCircle, Eye, EyeOff, Sparkles, TrendingUp, Shield } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Auth({ mode }: { mode: 'login' | 'signup' }) {
  const { setAuthView, login, signup } = useApp();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (mode === 'signup' && !fullName) {
      setError('Please enter your full name.');
      return;
    }

    setLoading(true);
    try {
      if (mode === 'signup') {
        await signup(email, fullName);
      } else {
        await login(email);
      }
    } catch {
      setError('Authentication failed. Please try again.');
    }
    setLoading(false);
  };

  const handleOAuth = (provider: 'google' | 'facebook' | 'linkedin') => {
    login(`user@${provider}.com`, provider);
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-ink-50 px-4 dark:bg-ink-950">
      {/* Background effects */}
      <div className="absolute inset-0 bg-grid-pattern" />
      <div className="absolute left-1/4 top-1/4 h-[300px] w-[300px] rounded-full bg-brand-500/10 blur-[80px]" />
      <div className="absolute right-1/4 bottom-1/4 h-[300px] w-[300px] rounded-full bg-accent-500/10 blur-[80px]" />

      <div className="relative w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="mb-8 text-center">
          <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow-lg animate-glow-pulse">
            <Activity className="h-7 w-7" />
            <span className="absolute inset-0 rounded-2xl bg-brand-500 opacity-30 blur-lg" />
          </div>
          <h1 className="text-xl font-bold text-ink-900 dark:text-ink-100">StockSense AI</h1>
          <p className="mt-1 text-xs text-brand-500 font-medium">Explainable Stock Intelligence</p>
        </div>

        <div className="card-glow p-6">
          <button onClick={() => setAuthView('landing')} className="mb-4 flex items-center gap-1.5 text-xs text-ink-500 hover:text-brand-500 dark:hover:text-brand-400">
            <ArrowLeft className="h-3.5 w-3.5" /> Back to home
          </button>

          <h2 className="text-lg font-bold text-ink-900 dark:text-ink-100">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h2>
          <p className="mt-1 text-sm text-ink-500">
            {mode === 'login' ? 'Log in to access your dashboard' : 'Start your AI-powered investment journey'}
          </p>

          {error && (
            <div className="mt-4 flex items-center gap-2 rounded-lg bg-bear-500/10 px-3 py-2 text-sm text-bear-600 dark:text-bear-400 animate-fade-in">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {/* OAuth buttons */}
          <div className="mt-5 space-y-2">
            <button onClick={() => handleOAuth('google')} className="btn-outline w-full justify-center group">
              <Chrome className="h-4 w-4 transition-transform group-hover:scale-110" /> Continue with Google
            </button>
            <button onClick={() => handleOAuth('facebook')} className="btn-outline w-full justify-center group">
              <Facebook className="h-4 w-4 transition-transform group-hover:scale-110" /> Continue with Facebook
            </button>
            <button onClick={() => handleOAuth('linkedin')} className="btn-outline w-full justify-center group">
              <Linkedin className="h-4 w-4 transition-transform group-hover:scale-110" /> Continue with LinkedIn
            </button>
          </div>

          {/* Divider */}
          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-200 to-transparent dark:via-ink-700" />
            <span className="text-xs text-ink-400">or continue with email</span>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-ink-200 to-transparent dark:via-ink-700" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3">
            {mode === 'signup' && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Full Name</label>
                <div className="relative group">
                  <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-brand-500" />
                  <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="John Doe" className="input pl-9" />
                </div>
              </div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Email</label>
              <div className="relative group">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-brand-500" />
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="input pl-9" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Password</label>
              <div className="relative group">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400 transition-colors group-focus-within:text-brand-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="input pl-9 pr-9"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-brand-500"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {mode === 'login' && (
              <div className="flex justify-end">
                <button type="button" className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
                  Forgot password?
                </button>
              </div>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-base py-2.5">
              {loading ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Please wait...
                </span>
              ) : (
                <>
                  {mode === 'login' ? 'Log In' : 'Create Account'}
                  <ArrowLeft className="h-4 w-4 rotate-180" />
                </>
              )}
            </button>
          </form>

          <p className="mt-4 text-center text-xs text-ink-500">
            {mode === 'login' ? (
              <>Don't have an account? <button onClick={() => setAuthView('signup')} className="font-medium text-brand-600 hover:underline dark:text-brand-400">Sign up</button></>
            ) : (
              <>Already have an account? <button onClick={() => setAuthView('login')} className="font-medium text-brand-600 hover:underline dark:text-brand-400">Log in</button></>
            )}
          </p>
        </div>

        {/* Feature highlights */}
        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="card-glass p-3 text-center">
            <TrendingUp className="mx-auto h-5 w-5 text-brand-400" />
            <p className="mt-1.5 text-[10px] text-ink-500">AI Signals</p>
          </div>
          <div className="card-glass p-3 text-center">
            <Shield className="mx-auto h-5 w-5 text-accent-400" />
            <p className="mt-1.5 text-[10px] text-ink-500">Risk Analysis</p>
          </div>
          <div className="card-glass p-3 text-center">
            <Sparkles className="mx-auto h-5 w-5 text-brand-400" />
            <p className="mt-1.5 text-[10px] text-ink-500">Explainable</p>
          </div>
        </div>

        <p className="mt-4 text-center text-[10px] text-ink-400">
          By continuing, you agree to our Terms of Service and Privacy Policy.
          OAuth providers require server-side configuration for production use.
        </p>
      </div>
    </div>
  );
}
