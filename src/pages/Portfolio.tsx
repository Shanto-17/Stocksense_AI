import { useState, useMemo } from 'react';
import { Plus, Trash2, Briefcase, TrendingUp, TrendingDown, PieChart as PieIcon } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';
import { useApp } from '@/context/AppContext';
import { SignalBadge } from '@/components/Badges';
import { DemoBadge } from '@/components/Disclaimer';

const PIE_COLORS = ['#339eff', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4', '#ec4899', '#84cc16'];

export function Portfolio() {
  const { stocks, portfolio, addHolding, removeHolding, setSelectedTicker, setCurrentPage } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState(stocks[0]?.ticker ?? '');
  const [shares, setShares] = useState('');
  const [avgCost, setAvgCost] = useState('');

  const holdings = useMemo(() => {
    return portfolio.map((h) => {
      const stock = stocks.find((s) => s.ticker === h.ticker);
      if (!stock) return null;
      const value = h.shares * stock.currentPrice;
      const cost = h.shares * h.avgCost;
      const pnl = value - cost;
      const pnlPct = (pnl / cost) * 100;
      return { ...h, stock, value, cost, pnl, pnlPct };
    }).filter(Boolean) as { ticker: string; shares: number; avgCost: number; stock: typeof stocks[0]; value: number; cost: number; pnl: number; pnlPct: number }[];
  }, [portfolio, stocks]);

  const totalValue = holdings.reduce((acc, h) => acc + h.value, 0);
  const totalCost = holdings.reduce((acc, h) => acc + h.cost, 0);
  const totalPnl = totalValue - totalCost;
  const totalPnlPct = totalCost > 0 ? (totalPnl / totalCost) * 100 : 0;

  const sectorAllocation = useMemo(() => {
    const map = new Map<string, number>();
    holdings.forEach((h) => {
      map.set(h.stock.sector, (map.get(h.stock.sector) ?? 0) + h.value);
    });
    return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
  }, [holdings]);

  const handleAdd = () => {
    const s = parseInt(shares);
    const c = parseFloat(avgCost);
    if (!s || !c) return;
    addHolding({ ticker, shares: s, avgCost: c });
    setShowForm(false);
    setShares('');
    setAvgCost('');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Portfolio</h1>
          <p className="mt-1 text-sm text-ink-500">Track your holdings and performance</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <Plus className="h-4 w-4" /> Add Holding
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Total Value</p>
            <Briefcase className="h-4 w-4 text-brand-500" />
          </div>
          <p className="mt-2 text-xl font-bold tabular-nums text-ink-900 dark:text-ink-100">৳{totalValue.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Total Cost</p>
            <Briefcase className="h-4 w-4 text-ink-400" />
          </div>
          <p className="mt-2 text-xl font-bold tabular-nums text-ink-900 dark:text-ink-100">৳{totalCost.toLocaleString('en-US', { maximumFractionDigits: 0 })}</p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Total P&L</p>
            {totalPnl >= 0 ? <TrendingUp className="h-4 w-4 text-bull-500" /> : <TrendingDown className="h-4 w-4 text-bear-500" />}
          </div>
          <p className={`mt-2 text-xl font-bold tabular-nums ${totalPnl >= 0 ? 'text-bull' : 'text-bear'}`}>
            {totalPnl >= 0 ? '+' : ''}৳{totalPnl.toLocaleString('en-US', { maximumFractionDigits: 0 })}
          </p>
        </div>
        <div className="card p-4">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wider text-ink-500">Return %</p>
            {totalPnlPct >= 0 ? <TrendingUp className="h-4 w-4 text-bull-500" /> : <TrendingDown className="h-4 w-4 text-bear-500" />}
          </div>
          <p className={`mt-2 text-xl font-bold tabular-nums ${totalPnlPct >= 0 ? 'text-bull' : 'text-bear'}`}>
            {totalPnlPct >= 0 ? '+' : ''}{totalPnlPct.toFixed(2)}%
          </p>
        </div>
      </div>

      {/* Add form */}
      {showForm && (
        <div className="card animate-fade-in p-5">
          <h2 className="section-title mb-4">Add Holding</h2>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Stock</label>
              <select value={ticker} onChange={(e) => setTicker(e.target.value)} className="input">
                {stocks.map((s) => (
                  <option key={s.ticker} value={s.ticker}>{s.ticker}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Shares</label>
              <input type="number" value={shares} onChange={(e) => setShares(e.target.value)} placeholder="100" className="input" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Avg Cost (৳)</label>
              <input type="number" value={avgCost} onChange={(e) => setAvgCost(e.target.value)} placeholder="120.00" className="input" />
            </div>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleAdd} className="btn-primary" disabled={!shares || !avgCost}>Add</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-3">
        {/* Holdings table */}
        <div className="card overflow-hidden lg:col-span-2">
          <div className="border-b border-ink-100 p-4 dark:border-ink-800">
            <h2 className="section-title">Holdings</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-500 dark:border-ink-800">
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3 text-right">Shares</th>
                  <th className="hidden px-4 py-3 text-right sm:table-cell">Avg Cost</th>
                  <th className="px-4 py-3 text-right">Value</th>
                  <th className="px-4 py-3 text-right">P&L</th>
                  <th className="hidden px-4 py-3 text-center lg:table-cell">AI Signal</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {holdings.map((h) => (
                  <tr key={h.ticker} className="border-b border-ink-100 transition-colors hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800/50">
                    <td className="px-4 py-3">
                      <button onClick={() => { setSelectedTicker(h.ticker); setCurrentPage('analysis'); }} className="text-left">
                        <p className="font-semibold text-ink-900 dark:text-ink-100">{h.ticker}</p>
                        <p className="truncate text-xs text-ink-500">{h.stock.name}</p>
                      </button>
                    </td>
                    <td className="px-4 py-3 text-right tabular-nums">{h.shares}</td>
                    <td className="hidden px-4 py-3 text-right tabular-nums sm:table-cell">৳{h.avgCost.toFixed(2)}</td>
                    <td className="px-4 py-3 text-right font-medium tabular-nums">৳{h.value.toLocaleString('en-US', { maximumFractionDigits: 0 })}</td>
                    <td className={`px-4 py-3 text-right font-medium tabular-nums ${h.pnl >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {h.pnl >= 0 ? '+' : ''}৳{h.pnl.toFixed(0)}
                      <p className="text-xs">{h.pnlPct >= 0 ? '+' : ''}{h.pnlPct.toFixed(1)}%</p>
                    </td>
                    <td className="hidden px-4 py-3 text-center lg:table-cell">
                      <SignalBadge signal={h.stock.aiScore.signal} />
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => removeHolding(h.ticker)} className="btn-ghost p-1 text-ink-400 hover:text-bear-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {holdings.length === 0 && (
              <p className="p-8 text-center text-sm text-ink-500">No holdings. Add one to get started.</p>
            )}
          </div>
        </div>

        {/* Sector allocation pie */}
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <PieIcon className="h-5 w-5 text-brand-500" />
            <h2 className="section-title">Sector Allocation</h2>
          </div>
          {sectorAllocation.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={sectorAllocation} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2}>
                    {sectorAllocation.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }}
                    formatter={(v) => `৳${Number(v).toLocaleString('en-US', { maximumFractionDigits: 0 })}`}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-3 space-y-1.5">
                {sectorAllocation.map((s, i) => (
                  <div key={s.name} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                      <span className="text-ink-600 dark:text-ink-400">{s.name}</span>
                    </div>
                    <span className="font-medium tabular-nums">{((s.value / totalValue) * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="py-12 text-center text-sm text-ink-500">Add holdings to see allocation</p>
          )}
        </div>
      </div>
    </div>
  );
}
