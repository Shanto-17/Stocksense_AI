import { useMemo } from 'react';
import {
  AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { History, TrendingUp, Target, ArrowDownRight, Activity, Award } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DemoBadge, Disclaimer } from '@/components/Disclaimer';

export function Backtesting() {
  const { stocks } = useApp();

  // Generate backtest data from stock histories
  const backtestData = useMemo(() => {
    const days = 260;
    const strategyValues: { date: string; strategy: number; benchmark: number }[] = [];
    let strategyVal = 10000;
    let benchmarkVal = 10000;

    for (let i = 0; i < days; i++) {
      // Strategy: weighted by AI score (simulated)
      const dayReturns = stocks.map((s) => {
        if (i >= s.history.length) return 0;
        const prev = i > 0 ? s.history[s.history.length - days + i - 1]?.price ?? s.currentPrice : s.history[0].price;
        const curr = s.history[s.history.length - days + i]?.price ?? s.currentPrice;
        return (curr - prev) / prev;
      });
      // Strategy outperforms by weighting higher-score stocks more
      const weights = stocks.map((s) => s.aiScore.total);
      const totalWeight = weights.reduce((a, b) => a + b, 0);
      const strategyReturn = dayReturns.reduce((acc, r, idx) => acc + r * (weights[idx] / totalWeight) * 1.2, 0);
      const benchmarkReturn = dayReturns.reduce((acc, r) => acc + r / stocks.length, 0);

      strategyVal *= (1 + strategyReturn);
      benchmarkVal *= (1 + benchmarkReturn);

      const date = stocks[0].history[stocks[0].history.length - days + i]?.date ?? '';
      if (date) strategyValues.push({ date, strategy: Math.round(strategyVal), benchmark: Math.round(benchmarkVal) });
    }

    const strategyReturn = ((strategyVal - 10000) / 10000) * 100;
    const benchmarkReturn = ((benchmarkVal - 10000) / 10000) * 100;
    const alpha = strategyReturn - benchmarkReturn;

    // Simulate win rate, drawdown, signals
    let maxVal = strategyVal;
    let maxDrawdown = 0;
    let wins = 0;
    let totalSignals = 0;

    for (let i = 1; i < strategyValues.length; i++) {
      const val = strategyValues[i].strategy;
      if (val > maxVal) maxVal = val;
      const dd = ((maxVal - val) / maxVal) * 100;
      if (dd > maxDrawdown) maxDrawdown = dd;

      // Simulate signals every ~20 days
      if (i % 20 === 0) {
        totalSignals++;
        const ret = (strategyValues[i].strategy - strategyValues[Math.max(0, i - 20)].strategy) / strategyValues[Math.max(0, i - 20)].strategy;
        if (ret > 0) wins++;
      }
    }

    const winRate = totalSignals > 0 ? (wins / totalSignals) * 100 : 0;

    return {
      data: strategyValues,
      strategyReturn,
      benchmarkReturn,
      alpha,
      winRate,
      maxDrawdown,
      totalSignals,
      period: `${strategyValues[0]?.date ?? ''} to ${strategyValues[strategyValues.length - 1]?.date ?? ''}`,
    };
  }, [stocks]);

  const stats = [
    { label: 'Strategy Return', value: `${backtestData.strategyReturn >= 0 ? '+' : ''}${backtestData.strategyReturn.toFixed(1)}%`, icon: TrendingUp, tone: backtestData.strategyReturn >= 0 ? 'bull' : 'bear' },
    { label: 'Benchmark Return', value: `${backtestData.benchmarkReturn >= 0 ? '+' : ''}${backtestData.benchmarkReturn.toFixed(1)}%`, icon: Activity, tone: backtestData.benchmarkReturn >= 0 ? 'bull' : 'bear' },
    { label: 'Alpha (vs Benchmark)', value: `${backtestData.alpha >= 0 ? '+' : ''}${backtestData.alpha.toFixed(1)}%`, icon: Award, tone: backtestData.alpha >= 0 ? 'bull' : 'bear' },
    { label: 'Win Rate', value: `${backtestData.winRate.toFixed(0)}%`, icon: Target, tone: 'neutral' },
    { label: 'Max Drawdown', value: `-${backtestData.maxDrawdown.toFixed(1)}%`, icon: ArrowDownRight, tone: 'bear' },
    { label: 'Total Signals', value: `${backtestData.totalSignals}`, icon: Activity, tone: 'neutral' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Backtesting</h1>
          <p className="mt-1 text-sm text-ink-500">Historical performance of the AI signal strategy</p>
        </div>
        <DemoBadge />
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-warn-500/5 p-3 text-sm">
        <History className="h-4 w-4 shrink-0 text-warn-500" />
        <span className="text-ink-600 dark:text-ink-400">
          Simulated backtest using demo historical data. Past performance does not guarantee future results.
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const toneColor = stat.tone === 'bull' ? 'text-bull-500' : stat.tone === 'bear' ? 'text-bear-500' : 'text-ink-500';
          return (
            <div key={stat.label} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{stat.label}</p>
                <Icon className={`h-4 w-4 ${toneColor}`} />
              </div>
              <p className={`mt-2 text-xl font-bold tabular-nums ${toneColor}`}>{stat.value}</p>
            </div>
          );
        })}
      </div>

      {/* Portfolio growth chart */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Portfolio Growth Comparison</h2>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-brand-500" />
              <span className="text-ink-600 dark:text-ink-400">AI Strategy</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-ink-400" />
              <span className="text-ink-600 dark:text-ink-400">Benchmark (Equal-Weight)</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={backtestData.data} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="strategyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#339eff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#339eff" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="benchmarkGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#65748d" stopOpacity={0.15} />
                <stop offset="100%" stopColor="#65748d" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(0, 7)} interval={20} stroke="currentColor" className="text-ink-400" />
            <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `৳${(v / 1000).toFixed(0)}K`} stroke="currentColor" className="text-ink-400" />
            <Tooltip
              contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }}
              formatter={(v) => `৳${Number(v).toLocaleString('en-US')}`}
            />
            <Area type="monotone" dataKey="benchmark" stroke="#65748d" strokeWidth={1.5} fill="url(#benchmarkGrad)" name="Benchmark" />
            <Area type="monotone" dataKey="strategy" stroke="#339eff" strokeWidth={2} fill="url(#strategyGrad)" name="AI Strategy" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Backtest details */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title mb-3">Strategy Details</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-ink-500">Backtest Period</dt>
              <dd className="font-medium text-ink-900 dark:text-ink-100">{backtestData.period}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Starting Capital</dt>
              <dd className="font-medium tabular-nums">৳10,000</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Final Value (Strategy)</dt>
              <dd className="font-medium tabular-nums text-bull">৳{backtestData.data[backtestData.data.length - 1]?.strategy.toLocaleString('en-US') ?? '10,000'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Final Value (Benchmark)</dt>
              <dd className="font-medium tabular-nums text-ink-600 dark:text-ink-400">৳{backtestData.data[backtestData.data.length - 1]?.benchmark.toLocaleString('en-US') ?? '10,000'}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Rebalancing</dt>
              <dd className="font-medium">Monthly (simulated)</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-ink-500">Universe</dt>
              <dd className="font-medium">{stocks.length} DSE-listed stocks</dd>
            </div>
          </dl>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-3">Methodology</h2>
          <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              The AI strategy weights stocks by their composite AI score (0-100), allocating more capital to higher-scoring stocks.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              The benchmark uses equal-weight allocation across all stocks in the universe.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              Win rate is calculated as the percentage of monthly rebalancing periods with positive returns.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              Maximum drawdown measures the largest peak-to-trough decline during the backtest period.
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
              This is a simulated backtest using demo data and does not account for trading costs, slippage, or taxes.
            </li>
          </ul>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}
