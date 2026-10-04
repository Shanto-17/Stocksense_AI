import { useState, useMemo } from 'react';
import { Search, ArrowUpDown } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SignalBadge } from '@/components/Badges';
import { Sparkline } from '@/components/Sparkline';
import { DemoBadge } from '@/components/Disclaimer';
import { SECTORS } from '@/lib/mockData';
import type { Stock } from '@/types';

type SortKey = 'ticker' | 'price' | 'changePct' | 'volume' | 'aiScore' | 'pe';

export function Markets() {
  const { stocks, setSelectedTicker, setCurrentPage } = useApp();
  const [search, setSearch] = useState('');
  const [sector, setSector] = useState<string>('All');
  const [sortKey, setSortKey] = useState<SortKey>('aiScore');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  const filtered = useMemo(() => {
    let result = stocks;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q));
    }
    if (sector !== 'All') {
      result = result.filter((s) => s.sector === sector);
    }
    const sorted = [...result].sort((a, b) => {
      let cmp = 0;
      switch (sortKey) {
        case 'ticker': cmp = a.ticker.localeCompare(b.ticker); break;
        case 'price': cmp = a.currentPrice - b.currentPrice; break;
        case 'changePct': cmp = a.dailyChangePct - b.dailyChangePct; break;
        case 'volume': cmp = a.volume - b.volume; break;
        case 'aiScore': cmp = a.aiScore.total - b.aiScore.total; break;
        case 'pe': cmp = a.fundamentals.peRatio - b.fundamentals.peRatio; break;
      }
      return sortDir === 'asc' ? cmp : -cmp;
    });
    return sorted;
  }, [stocks, search, sector, sortKey, sortDir]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else { setSortKey(key); setSortDir('desc'); }
  };

  const selectStock = (ticker: string) => {
    setSelectedTicker(ticker);
    setCurrentPage('analysis');
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Markets</h1>
          <p className="mt-1 text-sm text-ink-500">All DSE-listed stocks with AI analysis</p>
        </div>
        <DemoBadge />
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search stocks..."
            className="input pl-9"
          />
        </div>
        <select value={sector} onChange={(e) => setSector(e.target.value)} className="input max-w-[180px]">
          <option value="All">All Sectors</option>
          {SECTORS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-500 dark:border-ink-800">
                <th className="px-4 py-3">
                  <SortButton label="Ticker" active={sortKey === 'ticker'} dir={sortDir} onClick={() => handleSort('ticker')} />
                </th>
                <th className="hidden px-4 py-3 sm:table-cell">Trend</th>
                <th className="px-4 py-3 text-right">
                  <SortButton label="Price" active={sortKey === 'price'} dir={sortDir} onClick={() => handleSort('price')} />
                </th>
                <th className="px-4 py-3 text-right">
                  <SortButton label="Change %" active={sortKey === 'changePct'} dir={sortDir} onClick={() => handleSort('changePct')} />
                </th>
                <th className="hidden px-4 py-3 text-right md:table-cell">
                  <SortButton label="Volume" active={sortKey === 'volume'} dir={sortDir} onClick={() => handleSort('volume')} />
                </th>
                <th className="hidden px-4 py-3 text-right lg:table-cell">
                  <SortButton label="P/E" active={sortKey === 'pe'} dir={sortDir} onClick={() => handleSort('pe')} />
                </th>
                <th className="px-4 py-3 text-center">
                  <SortButton label="AI Score" active={sortKey === 'aiScore'} dir={sortDir} onClick={() => handleSort('aiScore')} />
                </th>
                <th className="px-4 py-3 text-center">Signal</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((stock) => (
                <StockRow key={stock.ticker} stock={stock} onClick={() => selectStock(stock.ticker)} />
              ))}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <p className="p-8 text-center text-sm text-ink-500">No stocks found matching your filters.</p>
        )}
      </div>
    </div>
  );
}

function SortButton({ label, active, dir, onClick }: { label: string; active: boolean; dir: 'asc' | 'desc'; onClick: () => void }) {
  return (
    <button onClick={onClick} className={`inline-flex items-center gap-1 hover:text-ink-900 dark:hover:text-ink-100 ${active ? 'text-brand-600 dark:text-brand-400' : ''}`}>
      {label}
      <ArrowUpDown className={`h-3 w-3 ${active ? 'opacity-100' : 'opacity-40'}`} />
    </button>
  );
}

function StockRow({ stock, onClick }: { stock: Stock; onClick: () => void }) {
  const isUp = stock.dailyChange >= 0;
  return (
    <tr onClick={onClick} className="cursor-pointer border-b border-ink-100 transition-colors hover:bg-ink-50 dark:border-ink-800 dark:hover:bg-ink-800/50">
      <td className="px-4 py-3">
        <p className="font-semibold text-ink-900 dark:text-ink-100">{stock.ticker}</p>
        <p className="truncate text-xs text-ink-500">{stock.sector}</p>
      </td>
      <td className="hidden px-4 py-3 sm:table-cell">
        <div className="h-8 w-20">
          <Sparkline data={stock.history} color={isUp ? '#10b981' : '#ef4444'} height={32} />
        </div>
      </td>
      <td className="px-4 py-3 text-right font-medium tabular-nums">৳{stock.currentPrice.toFixed(2)}</td>
      <td className={`px-4 py-3 text-right font-medium tabular-nums ${isUp ? 'text-bull' : 'text-bear'}`}>
        {isUp ? '+' : ''}{stock.dailyChangePct.toFixed(2)}%
      </td>
      <td className="hidden px-4 py-3 text-right tabular-nums text-ink-500 md:table-cell">{(stock.volume / 1000).toFixed(0)}K</td>
      <td className="hidden px-4 py-3 text-right tabular-nums text-ink-500 lg:table-cell">{stock.fundamentals.peRatio.toFixed(1)}</td>
      <td className="px-4 py-3">
        <div className="flex items-center justify-center gap-2">
          <div className="h-1.5 w-12 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
            <div
              className={`h-full rounded-full ${stock.aiScore.total >= 65 ? 'bg-bull-500' : stock.aiScore.total >= 45 ? 'bg-warn-500' : 'bg-bear-500'}`}
              style={{ width: `${stock.aiScore.total}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums">{stock.aiScore.total}</span>
        </div>
      </td>
      <td className="px-4 py-3 text-center">
        <SignalBadge signal={stock.aiScore.signal} />
      </td>
    </tr>
  );
}
