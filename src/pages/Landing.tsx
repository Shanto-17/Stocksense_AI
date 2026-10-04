import { Activity, Brain, Bell, BarChart3, Shield, Eye, ArrowRight, TrendingUp, Zap, CheckCircle2, Sparkles, LineChart, Cpu } from 'lucide-react';
import { useApp } from '@/context/AppContext';

export function Landing() {
  const { setAuthView } = useApp();

  const features = [
    { icon: Brain, title: 'AI-Powered Analysis', desc: 'Machine learning models analyze technical indicators, fundamentals, and market sentiment to generate probabilistic signals.', color: 'text-brand-400' },
    { icon: Bell, title: 'Smart Alerts', desc: 'Set custom alerts for price movements, AI signal changes, volume spikes, and risk threshold crossings.', color: 'text-accent-400' },
    { icon: BarChart3, title: 'Personalized Dashboard', desc: 'Your dashboard adapts to your experience level, risk tolerance, and investment preferences.', color: 'text-brand-400' },
    { icon: TrendingUp, title: 'Technical Indicators', desc: 'RSI, MACD, Bollinger Bands, moving averages, volatility, and more — all calculated and explained.', color: 'text-accent-400' },
    { icon: Eye, title: 'Explainable Predictions', desc: 'Every BUY/HOLD/AVOID signal comes with clear reasons and risk warnings. Never a black box.', color: 'text-brand-400' },
    { icon: Shield, title: 'Risk-First Approach', desc: "Don't just predict the price — explain the risk. Every signal includes risk assessment.", color: 'text-accent-400' },
  ];

  const pipeline = [
    { step: '1', title: 'Data Collection', desc: 'Market data, company fundamentals, and news are collected and processed.', icon: LineChart },
    { step: '2', title: 'AI Analysis', desc: 'Technical, fundamental, and sentiment analysis combine into a composite score.', icon: Cpu },
    { step: '3', title: 'Risk Assessment', desc: 'Risk engine evaluates volatility, debt, and market exposure for every signal.', icon: Shield },
    { step: '4', title: 'Explainable Output', desc: 'Clear BUY/HOLD/AVOID signals with reasons, risks, and probabilistic forecasts.', icon: Eye },
  ];

  return (
    <div className="min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Nav */}
      <nav className="sticky top-0 z-30 border-b border-ink-200 bg-white/80 backdrop-blur-xl dark:border-ink-800 dark:bg-ink-950/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow">
              <Activity className="h-5 w-5" />
              <span className="absolute inset-0 rounded-xl bg-brand-500 opacity-30 blur-md" />
            </div>
            <div>
              <h1 className="text-base font-bold tracking-tight text-ink-900 dark:text-ink-100">StockSense AI</h1>
              <p className="text-[10px] font-medium uppercase tracking-wider text-brand-500">Explainable Intelligence</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setAuthView('login')} className="btn-ghost text-sm">Log In</button>
            <button onClick={() => setAuthView('signup')} className="btn-primary text-sm">Get Started</button>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden bg-grid-pattern">
        <div className="absolute inset-0 bg-gradient-to-b from-brand-50 via-transparent to-transparent dark:from-brand-950/30" />
        <div className="absolute left-1/2 top-0 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-brand-500/10 blur-[100px]" />

        <div className="relative mx-auto max-w-6xl px-4 py-20 lg:py-28">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-brand-500/30 bg-brand-500/10 px-4 py-1.5 text-xs font-semibold text-brand-600 shadow-glow dark:text-brand-300 animate-fade-in">
              <Sparkles className="h-3.5 w-3.5 text-glow" />
              AI-Powered Stock Intelligence for DSE
            </div>
            <h1 className="text-4xl font-bold tracking-tight text-ink-900 dark:text-ink-100 lg:text-6xl animate-slide-up">
              Understand the Market.{' '}
              <span className="bg-gradient-to-r from-brand-400 via-accent-400 to-brand-500 bg-clip-text text-transparent text-glow">
                Smarter.
              </span>
            </h1>
            <p className="mt-6 text-lg text-ink-600 dark:text-ink-400 animate-fade-in">
              StockSense AI analyzes market data, technical indicators, and historical patterns to help you understand potential market movements — with explainable, risk-aware signals.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row animate-fade-in">
              <button onClick={() => setAuthView('signup')} className="btn-primary w-full sm:w-auto text-base px-6 py-3">
                Get Started <ArrowRight className="h-4 w-4" />
              </button>
              <button onClick={() => setAuthView('login')} className="btn-outline w-full sm:w-auto text-base px-6 py-3">
                Explore Demo
              </button>
            </div>
          </div>

          {/* USP banner */}
          <div className="mx-auto mt-14 max-w-2xl">
            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 via-brand-700 to-accent-700 p-6 text-center text-white shadow-glow-lg animate-glow-pulse">
              <div className="absolute inset-0 bg-gradient-animated opacity-20" />
              <div className="relative">
                <p className="text-xl font-bold text-glow">Don't just predict the price — explain the risk.</p>
                <p className="mt-1.5 text-sm text-brand-200">The StockSense AI differentiator</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Everything you need to understand stocks</h2>
          <p className="mt-2 text-sm text-ink-500">From technical analysis to AI-generated explanations</p>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className="card card-hover p-6 group">
                <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-600 transition-all group-hover:shadow-glow group-hover:scale-110 dark:bg-brand-950/30 dark:text-brand-400">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-sm font-bold text-ink-900 dark:text-ink-100">{f.title}</h3>
                <p className="mt-1.5 text-sm text-ink-500">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-white py-16 dark:bg-ink-900/50">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold text-ink-900 dark:text-ink-100">How StockSense AI Works</h2>
          <div className="grid gap-8 md:grid-cols-4">
            {pipeline.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.step} className="text-center group">
                  <div className="relative mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-brand-700 text-white shadow-glow transition-all group-hover:scale-110 group-hover:shadow-glow-lg animate-float" style={{ animationDelay: `${i * 0.2}s` }}>
                    <Icon className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent-500 text-[10px] font-bold text-white">{s.step}</span>
                  </div>
                  <h3 className="text-sm font-bold text-ink-900 dark:text-ink-100">{s.title}</h3>
                  <p className="mt-1.5 text-sm text-ink-500">{s.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Stats bar */}
      <section className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          {[
            { value: '125+', label: 'DSE Stocks Tracked' },
            { value: '18', label: 'ML Features' },
            { value: '3', label: 'AI Signal Types' },
            { value: '100%', label: 'Explainable' },
          ].map((stat) => (
            <div key={stat.label} className="card p-5 text-center">
              <p className="text-2xl font-bold text-glow text-brand-500 dark:text-brand-400">{stat.value}</p>
              <p className="mt-1 text-xs text-ink-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Disclaimer */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div className="rounded-xl border border-warn-500/20 bg-warn-500/5 p-6">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-warn-500" />
            <h3 className="text-sm font-bold text-warn-600 dark:text-warn-400">Important Disclaimer</h3>
          </div>
          <p className="mt-2 text-sm text-ink-600 dark:text-ink-400">
            StockSense AI provides market analysis and model-based predictions for informational and educational purposes only.
            It is not financial advice and does not guarantee future results. Users should conduct their own research and consider
            professional financial advice before making investment decisions.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 pb-20">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-accent-800 p-10 text-center text-white shadow-glow-lg">
          <div className="absolute inset-0 bg-gradient-animated opacity-20" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-glow">Start understanding the market today</h2>
            <p className="mt-2 text-brand-200">Join StockSense AI and get AI-powered, explainable stock intelligence.</p>
            <button onClick={() => setAuthView('signup')} className="mt-6 inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3 text-sm font-semibold text-brand-700 transition-transform hover:scale-105 shadow-card-lg">
              Get Started Free <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-ink-200 py-8 dark:border-ink-800">
        <div className="mx-auto max-w-6xl px-4 text-center text-xs text-ink-500">
          <p>StockSense AI — Explainable AI Stock Market Intelligence for DSE</p>
          <p className="mt-1">DEMO MODE: All market data is simulated for demonstration purposes.</p>
        </div>
      </footer>
    </div>
  );
}
