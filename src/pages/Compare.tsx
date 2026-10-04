import { useState, useMemo } from 'react';
import { GitCompare, X, Plus, TrendingUp, TrendingDown } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  ResponsiveContainer, Tooltip, XAxis, YAxis, Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { DemoBadge } from '@/components/Disclaimer';

const COMPARE_COLORS = ['#339eff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

export function Compare() {
  const { stocks, compareTickers, setCompareTickers } = useApp();
  const [showPicker, setShowPicker] = useState(false);
  const [search, setSearch] = useState('');

  const compareStocks = useMemo(() => {
    return compareTickers.map((t) => stocks.find((s) => s.ticker === t)).filter(Boolean) as typeof stocks;
  }, [compareTickers, stocks]);

  const filteredStocks = stocks.filter((s) =>
    !compareTickers.includes(s.ticker) &&
    (s.ticker.toLowerCase().includes(search.toLowerCase()) || s.name.toLowerCase().includes(search.toLowerCase()))
  );

  const addStock = (ticker: string) => {
    if (compareTickers.length < 5) {
      setCompareTickers([...compareTickers, ticker]);
      setShowPicker(false);
      setSearch('');
    }
  };

  const removeStock = (ticker: string) => {
    setCompareTickers(compareTickers.filter((t) => t !== ticker));
  };

  // Performance chart data (normalized)
  const perfData = useMemo(() => {
    if (compareStocks.length === 0) return [];
    const days = 90;
    const data: { date: string; [key: string]: string | number }[] = [];
    for (let i = 0; i < days; i++) {
      const point: { date: string; [key: string]: string | number } = { date: '' };
      compareStocks.forEach((s) => {
        const hist = s.history.slice(-days);
        if (hist[i]) {
          const firstPrice = hist[0]?.price ?? 1;
          point[s.ticker] = ((hist[i].price - firstPrice) / firstPrice) * 100;
          point.date = hist[i].date;
        }
      });
      if (point.date) data.push(point);
    }
    return data;
  }, [compareStocks]);

  // Radar chart data
  const radarData = useMemo(() => {
    const labels = ['Technical', 'Fundamental', 'Trend', 'Sentiment', 'Volume', 'Risk'];
    return labels.map((label) => {
      const point: { label: string; [key: string]: string | number } = { label };
      compareStocks.forEach((s) => {
        const comp = s.aiScore.components.find((c) => c.label.toLowerCase().includes(label.toLowerCase().slice(0, 4)));
        point[s.ticker] = comp?.score ?? 0;
      });
      return point;
    });
  }, [compareStocks]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Stock Comparison</h1>
          <p className="mt-1 text-sm text-ink-500">Compare up to 5 stocks side by side</p>
        </div>
        <DemoBadge />
      </div>

      {/* Selected stocks */}
      <div className="card p-4">
        <div className="flex flex-wrap items-center gap-2">
          {compareStocks.map((s, i) => (
            <div key={s.ticker} className="flex items-center gap-2 rounded-lg px-3 py-2" style={{ backgroundColor: `${COMPARE_COLORS[i]}15` }}>
              <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COMPARE_COLORS[i] }} />
              <span className="text-sm font-semibold text-ink-900 dark:text-ink-100">{s.ticker}</span>
              <button onClick={() => removeStock(s.ticker)} className="text-ink-400 hover:text-bear-500">
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {compareTickers.length < 5 && (
            <button onClick={() => setShowPicker(true)} className="btn-outline text-sm">
              <Plus className="h-4 w-4" /> Add Stock
            </button>
          )}
        </div>
      </div>

      {/* Stock picker */}
      {showPicker && (
        <div className="card p-4 animate-fade-in">
          <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search stocks to add..." className="input mb-3" autoFocus />
          <div className="max-h-48 overflow-y-auto space-y-1">
            {filteredStocks.slice(0, 20).map((s) => (
              <button key={s.ticker} onClick={() => addStock(s.ticker)} className="flex w-full items-center justify-between rounded-lg px-3 py-2 text-left hover:bg-ink-50 dark:hover:bg-ink-800">
                <div>
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{s.ticker}</p>
                  <p className="text-xs text-ink-500">{s.name}</p>
                </div>
                <p className="text-sm tabular-nums">৳{s.currentPrice.toFixed(2)}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {compareStocks.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <GitCompare className="h-10 w-10 text-ink-300" />
          <p className="text-sm text-ink-500">Add stocks above to start comparing.</p>
        </div>
      ) : (
        <>
          {/* Comparison table */}
          <div className="card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-500 dark:border-ink-800">
                    <th className="px-4 py-3">Metric</th>
                    {compareStocks.map((s, i) => (
                      <th key={s.ticker} className="px-4 py-3 text-right">
                        <span className="flex items-center justify-end gap-1.5">
                          <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: COMPARE_COLORS[i] }} />
                          {s.ticker}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { label: 'Price', get: (s: typeof stocks[0]) => `৳${s.currentPrice.toFixed(2)}` },
                    { label: 'Daily Change', get: (s: typeof stocks[0]) => `${s.dailyChange >= 0 ? '+' : ''}${s.dailyChangePct.toFixed(2)}%`, tone: (s: typeof stocks[0]) => s.dailyChange >= 0 ? 'bull' : 'bear' },
                    { label: 'AI Score', get: (s: typeof stocks[0]) => `${s.aiScore.total}/100` },
                    { label: 'Signal', get: (s: typeof stocks[0]) => s.aiScore.signal },
                    { label: 'Confidence', get: (s: typeof stocks[0]) => `${s.aiScore.confidence}%` },
                    { label: 'RSI', get: (s: typeof stocks[0]) => s.technicals.rsi.toFixed(1) },
                    { label: 'MACD', get: (s: typeof stocks[0]) => s.technicals.macd.toFixed(2) },
                    { label: 'Volatility', get: (s: typeof stocks[0]) => `${s.technicals.volatility.toFixed(1)}%` },
                    { label: 'P/E Ratio', get: (s: typeof stocks[0]) => s.fundamentals.peRatio.toFixed(1) },
                    { label: 'EPS', get: (s: typeof stocks[0]) => `৳${s.fundamentals.eps.toFixed(2)}` },
                    { label: 'Revenue Growth', get: (s: typeof stocks[0]) => `${s.fundamentals.revenueGrowth.toFixed(1)}%` },
                    { label: 'Dividend Yield', get: (s: typeof stocks[0]) => `${s.fundamentals.dividendYield.toFixed(1)}%` },
                    { label: 'Debt/Equity', get: (s: typeof stocks[0]) => s.fundamentals.debtToEquity.toFixed(2) },
                    { label: 'Volume', get: (s: typeof stocks[0]) => `${(s.volume / 1000).toFixed(0)}K` },
                  ].map((row) => (
                    <tr key={row.label} className="border-b border-ink-100 dark:border-ink-800">
                      <td className="px-4 py-2.5 text-ink-500">{row.label}</td>
                      {compareStocks.map((s) => {
                        const val = row.get(s);
                        const tone = 'tone' in row ? (row as { tone: (s: typeof stocks[0]) => string }).tone(s) : '';
                        return (
                          <td key={s.ticker} className={`px-4 py-2.5 text-right font-medium tabular-nums ${tone === 'bull' ? 'text-bull' : tone === 'bear' ? 'text-bear' : 'text-ink-900 dark:text-ink-100'}`}>
                            {val}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Performance chart */}
          <div className="card p-5">
            <h2 className="section-title mb-4">Price Performance (3M, normalized to 0%)</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={perfData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
                <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} interval={15} stroke="currentColor" className="text-ink-400" />
                <YAxis tick={{ fontSize: 10 }} tickFormatter={(v) => `${v.toFixed(0)}%`} stroke="currentColor" className="text-ink-400" />
                <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {compareStocks.map((s, i) => (
                  <Line key={s.ticker} type="monotone" dataKey={s.ticker} stroke={COMPARE_COLORS[i]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* AI Score Radar */}
          <div className="card p-5">
            <h2 className="section-title mb-4">AI Score Comparison</h2>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="currentColor" className="text-ink-200 dark:text-ink-700" />
                <PolarAngleAxis dataKey="label" tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-500" />
                {compareStocks.map((s, i) => (
                  <Radar key={s.ticker} name={s.ticker} dataKey={s.ticker} stroke={COMPARE_COLORS[i]} fill={COMPARE_COLORS[i]} fillOpacity={0.15} strokeWidth={2} />
                ))}
                <Legend wrapperStyle={{ fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </div>
  );
}
