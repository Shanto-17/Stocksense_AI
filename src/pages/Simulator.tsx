import { useState, useMemo } from 'react';
import { Calculator, TrendingUp, TrendingDown, Minus, Info } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DemoBadge, Disclaimer } from '@/components/Disclaimer';

export function Simulator() {
  const { stocks, selectedTicker, setSelectedTicker } = useApp();
  const [amount, setAmount] = useState('50000');
  const [ticker, setTicker] = useState(selectedTicker ?? stocks[0]?.ticker ?? '');

  const stock = stocks.find((s) => s.ticker === ticker) ?? stocks[0];

  const scenarios = useMemo(() => {
    if (!stock || !amount) return null;
    const investment = parseFloat(amount);
    if (isNaN(investment) || investment <= 0) return null;

    const currentPrice = stock.currentPrice;
    const shares = investment / currentPrice;

    // Use forecast ranges for 30-day
    const f = stock.forecast.thirtyDay;
    const bullLow = shares * f.bull[0];
    const bullHigh = shares * f.bull[1];
    const baseLow = shares * f.base[0];
    const baseHigh = shares * f.base[1];
    const bearLow = shares * f.bear[0];
    const bearHigh = shares * f.bear[1];

    return {
      investment,
      shares,
      currentPrice,
      bull: { low: bullLow, high: bullHigh, returnPct: ((bullLow + bullHigh) / 2 - investment) / investment * 100 },
      base: { low: baseLow, high: baseHigh, returnPct: ((baseLow + baseHigh) / 2 - investment) / investment * 100 },
      bear: { low: bearLow, high: bearHigh, returnPct: ((bearLow + bearHigh) / 2 - investment) / investment * 100 },
    };
  }, [stock, amount]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">What-If Simulator</h1>
          <p className="mt-1 text-sm text-ink-500">Hypothetical investment scenarios based on AI forecasts</p>
        </div>
        <DemoBadge />
      </div>

      {/* Input */}
      <div className="card p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Select Stock</label>
            <select value={ticker} onChange={(e) => { setTicker(e.target.value); setSelectedTicker(e.target.value); }} className="input">
              {stocks.map((s) => (
                <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Investment Amount (৳)</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="50000"
              className="input"
            />
          </div>
        </div>
        {stock && (
          <div className="mt-3 flex items-center gap-4 text-sm">
            <span className="text-ink-500">Current Price: <span className="font-semibold text-ink-900 dark:text-ink-100">৳{stock.currentPrice.toFixed(2)}</span></span>
            <span className="text-ink-500">AI Signal: <span className="font-semibold">{stock.aiScore.signal}</span></span>
            <span className="text-ink-500">Prob. Positive: <span className="font-semibold text-bull">{stock.forecast.probPositiveReturn}%</span></span>
          </div>
        )}
      </div>

      {/* Results */}
      {scenarios ? (
        <div className="space-y-4">
          <div className="flex items-center gap-2 rounded-lg bg-brand-50 p-3 text-sm dark:bg-brand-950/20">
            <Info className="h-4 w-4 shrink-0 text-brand-500" />
            <span className="text-ink-600 dark:text-ink-400">
              Investing ৳{scenarios.investment.toLocaleString('en-US')} would buy ~{scenarios.shares.toFixed(1)} shares of {stock.ticker} at ৳{scenarios.currentPrice.toFixed(2)}.
              Scenarios are based on 30-day AI forecast ranges.
            </span>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {/* Bull */}
            <div className="card border-l-4 border-l-bull-500 p-5">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-bull-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-bull-600 dark:text-bull-400">Bull Case</h3>
              </div>
              <p className="mt-3 text-xs text-ink-500">Estimated Value (30 days)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-bull-600 dark:text-bull-400">
                ৳{scenarios.bull.low.toLocaleString('en-US', { maximumFractionDigits: 0 })}–{scenarios.bull.high.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm font-medium text-bull">
                <TrendingUp className="h-3.5 w-3.5" />
                {scenarios.bull.returnPct >= 0 ? '+' : ''}{scenarios.bull.returnPct.toFixed(1)}% potential return
              </div>
            </div>

            {/* Base */}
            <div className="card border-l-4 border-l-ink-400 p-5">
              <div className="flex items-center gap-2">
                <Minus className="h-5 w-5 text-ink-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-ink-600 dark:text-ink-400">Base Case</h3>
              </div>
              <p className="mt-3 text-xs text-ink-500">Estimated Value (30 days)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-ink-900 dark:text-ink-100">
                ৳{scenarios.base.low.toLocaleString('en-US', { maximumFractionDigits: 0 })}–{scenarios.base.high.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm font-medium text-ink-500">
                {scenarios.base.returnPct >= 0 ? <TrendingUp className="h-3.5 w-3.5 text-bull" /> : <TrendingDown className="h-3.5 w-3.5 text-bear" />}
                {scenarios.base.returnPct >= 0 ? '+' : ''}{scenarios.base.returnPct.toFixed(1)}% potential return
              </div>
            </div>

            {/* Bear */}
            <div className="card border-l-4 border-l-bear-500 p-5">
              <div className="flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-bear-500" />
                <h3 className="text-sm font-bold uppercase tracking-wider text-bear-600 dark:text-bear-400">Bear Case</h3>
              </div>
              <p className="mt-3 text-xs text-ink-500">Estimated Value (30 days)</p>
              <p className="mt-1 text-2xl font-bold tabular-nums text-bear-600 dark:text-bear-400">
                ৳{scenarios.bear.low.toLocaleString('en-US', { maximumFractionDigits: 0 })}–{scenarios.bear.high.toLocaleString('en-US', { maximumFractionDigits: 0 })}
              </p>
              <div className="mt-2 flex items-center gap-1 text-sm font-medium text-bear">
                <TrendingDown className="h-3.5 w-3.5" />
                {scenarios.bear.returnPct >= 0 ? '+' : ''}{scenarios.bear.returnPct.toFixed(1)}% potential return
              </div>
            </div>
          </div>

          {/* Visual bar */}
          <div className="card p-5">
            <h3 className="section-title mb-4">Scenario Comparison</h3>
            <div className="space-y-3">
              <ScenarioBar label="Bull" low={scenarios.bull.low} high={scenarios.bull.high} investment={scenarios.investment} color="bg-bull-500" />
              <ScenarioBar label="Base" low={scenarios.base.low} high={scenarios.base.high} investment={scenarios.investment} color="bg-ink-400" />
              <ScenarioBar label="Bear" low={scenarios.bear.low} high={scenarios.bear.high} investment={scenarios.investment} color="bg-bear-500" />
            </div>
            <div className="mt-4 flex items-center justify-center border-t border-ink-100 pt-4 dark:border-ink-800">
              <div className="flex items-center gap-2 text-xs text-ink-500">
                <span className="h-2 w-6 rounded-full bg-brand-500" />
                Your investment: ৳{scenarios.investment.toLocaleString('en-US')}
              </div>
            </div>
          </div>

          <Disclaimer compact />
          <p className="text-center text-xs font-medium text-warn-600 dark:text-warn-400">
            These are hypothetical scenarios for educational purposes. Actual results may differ significantly.
          </p>
        </div>
      ) : (
        <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <Calculator className="h-10 w-10 text-ink-300" />
          <p className="text-sm text-ink-500">Enter a valid investment amount to see scenarios.</p>
        </div>
      )}
    </div>
  );
}

function ScenarioBar({ label, low, high, investment, color }: { label: string; low: number; high: number; investment: number; color: string }) {
  const allValues = [low, high, investment];
  const min = Math.min(...allValues);
  const max = Math.max(...allValues);
  const range = max - min || 1;
  const leftPct = ((low - min) / range) * 100;
  const widthPct = ((high - low) / range) * 100;
  const investPct = ((investment - min) / range) * 100;

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="font-medium text-ink-600 dark:text-ink-400">{label} Case</span>
        <span className="tabular-nums text-ink-500">৳{low.toFixed(0)} – ৳{high.toFixed(0)}</span>
      </div>
      <div className="relative h-6 rounded-lg bg-ink-100 dark:bg-ink-800">
        <div
          className={`absolute top-0 h-full rounded-lg ${color} opacity-80`}
          style={{ left: `${leftPct}%`, width: `${widthPct}%` }}
        />
        <div
          className="absolute top-0 h-full w-0.5 bg-brand-500"
          style={{ left: `${investPct}%` }}
        />
      </div>
    </div>
  );
}
