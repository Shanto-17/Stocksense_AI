import { useState, useMemo } from 'react';
import { Brain, CheckCircle2, AlertTriangle, ShieldAlert } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SignalBadge } from '@/components/Badges';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Disclaimer, DemoBadge } from '@/components/Disclaimer';
import type { Signal } from '@/types';

export function AISignals() {
  const { stocks, setSelectedTicker, setCurrentPage, profile } = useApp();
  const [filter, setFilter] = useState<Signal | 'ALL'>('ALL');

  const filtered = useMemo(() => {
    const sorted = [...stocks].sort((a, b) => b.aiScore.total - a.aiScore.total);
    if (filter === 'ALL') return sorted;
    return sorted.filter((s) => s.aiScore.signal === filter);
  }, [stocks, filter]);

  const buyCount = stocks.filter((s) => s.aiScore.signal === 'BUY').length;
  const holdCount = stocks.filter((s) => s.aiScore.signal === 'HOLD').length;
  const avoidCount = stocks.filter((s) => s.aiScore.signal === 'AVOID').length;

  const selectStock = (ticker: string) => {
    setSelectedTicker(ticker);
    setCurrentPage('analysis');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">AI Signals</h1>
          <p className="mt-1 text-sm text-ink-500">Explainable BUY / HOLD / AVOID recommendations</p>
        </div>
        <DemoBadge />
      </div>

      {/* Signal summary */}
      <div className="grid grid-cols-3 gap-4">
        <div className="card p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-bull-500">Buy Signals</p>
          <p className="mt-1 text-2xl font-bold text-bull-600 dark:text-bull-400">{buyCount}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-warn-500">Hold Signals</p>
          <p className="mt-1 text-2xl font-bold text-warn-600 dark:text-warn-400">{holdCount}</p>
        </div>
        <div className="card p-4 text-center">
          <p className="text-xs font-medium uppercase tracking-wider text-bear-500">Avoid Signals</p>
          <p className="mt-1 text-2xl font-bold text-bear-600 dark:text-bear-400">{avoidCount}</p>
        </div>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {(['ALL', 'BUY', 'HOLD', 'AVOID'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === f
                ? 'bg-brand-600 text-white'
                : 'text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800'
            }`}
          >
            {f === 'ALL' ? 'All Signals' : f}
          </button>
        ))}
      </div>

      {/* Signal cards */}
      <div className="space-y-4">
        {filtered.map((stock) => (
          <div key={stock.ticker} className="card p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <button onClick={() => selectStock(stock.ticker)} className="flex items-center gap-4 text-left">
                <ScoreGauge score={stock.aiScore.total} size={80} label="" />
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-ink-900 dark:text-ink-100">{stock.ticker}</h3>
                    <SignalBadge signal={stock.aiScore.signal} />
                  </div>
                  <p className="text-sm text-ink-500">{stock.name}</p>
                  <p className="mt-1 text-sm font-medium tabular-nums">৳{stock.currentPrice.toFixed(2)}</p>
                </div>
              </button>
              <div className="text-right">
                <p className="text-xs text-ink-500">Confidence</p>
                <p className="text-lg font-bold text-brand-600 dark:text-brand-400">{stock.aiScore.confidence}%</p>
                <p className="mt-1 text-xs text-ink-500">Sector: {stock.sector}</p>
              </div>
            </div>

            {/* Score breakdown */}
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
              {stock.aiScore.components.map((c) => (
                <div key={c.label} className="rounded-lg bg-ink-50 p-2 dark:bg-ink-800/50">
                  <p className="text-[10px] font-medium uppercase tracking-wider text-ink-500">{c.label}</p>
                  <p className="mt-0.5 text-lg font-bold tabular-nums">{c.score}</p>
                  <div className="mt-1 h-1 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
                    <div
                      className={`h-full rounded-full ${c.score >= 65 ? 'bg-bull-500' : c.score >= 45 ? 'bg-warn-500' : 'bg-bear-500'}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* Reasons + Risks */}
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bull-500">
                  <CheckCircle2 className="h-4 w-4" /> Why {stock.aiScore.signal}?
                </p>
                <ul className="space-y-1.5">
                  {stock.aiScore.reasons.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-400">
                      <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-bull-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <p className="mb-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-bear-500">
                  <ShieldAlert className="h-4 w-4" /> Risks
                </p>
                <ul className="space-y-1.5">
                  {stock.aiScore.risks.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-600 dark:text-ink-400">
                      <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0 text-warn-500" />
                      {r}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Disclaimer />
    </div>
  );
}
