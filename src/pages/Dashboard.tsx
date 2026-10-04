import { useMemo } from 'react';
import { TrendingUp, TrendingDown, Activity, Brain, AlertCircle, Gauge, Flame, ArrowUpRight, ArrowDownRight, Bell } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { StockCard } from '@/components/StockCard';
import { SignalBadge, RiskBadge } from '@/components/Badges';
import { Sparkline } from '@/components/Sparkline';
import { Disclaimer, DemoBadge } from '@/components/Disclaimer';
import { AreaChart, Area, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function Dashboard() {
  const { stocks, watchlist, alerts, profile, setCurrentPage, setSelectedTicker } = useApp();

  const gainers = useMemo(() => [...stocks].sort((a, b) => b.dailyChangePct - a.dailyChangePct).slice(0, 5), [stocks]);
  const losers = useMemo(() => [...stocks].sort((a, b) => a.dailyChangePct - b.dailyChangePct).slice(0, 5), [stocks]);
  const mostActive = useMemo(() => [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 5), [stocks]);
  const opportunities = useMemo(() => [...stocks].filter((s) => s.aiScore.signal === 'BUY').sort((a, b) => b.aiScore.total - a.aiScore.total).slice(0, 4), [stocks]);

  const advancers = stocks.filter((s) => s.dailyChange >= 0).length;
  const decliners = stocks.filter((s) => s.dailyChange < 0).length;
  const avgChange = stocks.reduce((acc, s) => acc + s.dailyChangePct, 0) / stocks.length;
  const totalVolume = stocks.reduce((acc, s) => acc + s.volume, 0);
  const buyCount = stocks.filter((s) => s.aiScore.signal === 'BUY').length;
  const avoidCount = stocks.filter((s) => s.aiScore.signal === 'AVOID').length;
  const avgSentiment = stocks.reduce((acc, s) => {
    const pos = s.news.filter((n) => n.sentiment === 'POSITIVE').length;
    const neg = s.news.filter((n) => n.sentiment === 'NEGATIVE').length;
    return acc + (pos - neg);
  }, 0);
  const sentimentLabel = avgSentiment > 5 ? 'Bullish' : avgSentiment > 0 ? 'Mildly Bullish' : avgSentiment > -5 ? 'Mildly Bearish' : 'Bearish';
  const sentimentColor = avgSentiment > 0 ? 'text-bull' : 'text-bear';

  // DSE index proxy
  const indexData = useMemo(() => {
    const last30 = stocks[0].history.slice(-30);
    return last30.map((point, i) => ({
      date: point.date,
      index: stocks.reduce((acc, s) => acc + (s.history[s.history.length - 30 + i]?.price ?? 0), 0) / stocks.length,
    }));
  }, [stocks]);
  const indexChange = indexData.length > 1 ? indexData[indexData.length - 1].index - indexData[0].index : 0;
  const indexChangePct = indexData.length > 1 ? (indexChange / indexData[0].index) * 100 : 0;

  // Portfolio summary
  const portfolioStocks = stocks.filter((s) => watchlist.includes(s.ticker));
  const portfolioValue = portfolioStocks.reduce((acc, s) => acc + s.currentPrice * 100, 0);
  const portfolioChange = portfolioStocks.reduce((acc, s) => acc + s.dailyChange * 100, 0);

  const triggeredAlerts = alerts.filter((a) => a.triggered);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Market Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">Dhaka Stock Exchange overview — {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
        <DemoBadge />
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <KpiCard
          label="DSE Index (Proxy)"
          value={indexData[indexData.length - 1]?.index.toFixed(2) ?? '0.00'}
          change={indexChange}
          changePct={indexChangePct}
          icon={Activity}
        />
        <KpiCard
          label="Advancers / Decliners"
          value={`${advancers} / ${decliners}`}
          subValue={`${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}% avg`}
          icon={avgChange >= 0 ? TrendingUp : TrendingDown}
          positive={avgChange >= 0}
        />
        <KpiCard
          label="Total Volume"
          value={`${(totalVolume / 1_000_000).toFixed(1)}M`}
          subValue="across all stocks"
          icon={Flame}
          neutral
        />
        <KpiCard
          label="AI Signals"
          value={`${buyCount} BUY / ${avoidCount} AVOID`}
          subValue={`${stocks.length - buyCount - avoidCount} HOLD`}
          icon={Brain}
          neutral
        />
      </div>

      {/* DSE Trend Chart + Market Sentiment */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="section-title">Overall DSE Trend</h2>
              <p className="mt-1 text-lg font-bold text-ink-900 dark:text-ink-100">
                {indexData[indexData.length - 1]?.index.toFixed(2) ?? '0.00'}
                <span className={`ml-2 text-sm font-medium ${indexChange >= 0 ? 'text-bull' : 'text-bear'}`}>
                  {indexChange >= 0 ? '+' : ''}{indexChange.toFixed(2)} ({indexChangePct >= 0 ? '+' : ''}{indexChangePct.toFixed(2)}%)
                </span>
              </p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={indexData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="indexGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#339eff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#339eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} interval={5} stroke="currentColor" className="text-ink-400" />
              <YAxis tick={{ fontSize: 10 }} domain={['auto', 'auto']} stroke="currentColor" className="text-ink-400" />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }}
                labelStyle={{ fontSize: 10 }}
              />
              <Area type="monotone" dataKey="index" stroke="#339eff" strokeWidth={2} fill="url(#indexGrad)" isAnimationActive={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="section-title">Market Sentiment</h2>
          <div className="mt-4 flex flex-col items-center justify-center gap-3">
            <div className="relative flex h-28 w-28 items-center justify-center">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeWidth="8" className="text-ink-200 dark:text-ink-800" />
                <circle
                  cx="50" cy="50" r="42" fill="none"
                  stroke={avgSentiment > 0 ? '#10b981' : '#ef4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${Math.min(264, Math.abs(avgSentiment) / 30 * 264)} 264`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xl font-bold ${sentimentColor}`}>{sentimentLabel}</span>
              </div>
            </div>
            <div className="w-full space-y-2">
              <SentimentBar label="Positive News" count={stocks.reduce((a, s) => a + s.news.filter((n) => n.sentiment === 'POSITIVE').length, 0)} color="bg-bull-500" total={stocks.reduce((a, s) => a + s.news.length, 0)} />
              <SentimentBar label="Neutral News" count={stocks.reduce((a, s) => a + s.news.filter((n) => n.sentiment === 'NEUTRAL').length, 0)} color="bg-ink-400" total={stocks.reduce((a, s) => a + s.news.length, 0)} />
              <SentimentBar label="Negative News" count={stocks.reduce((a, s) => a + s.news.filter((n) => n.sentiment === 'NEGATIVE').length, 0)} color="bg-bear-500" total={stocks.reduce((a, s) => a + s.news.length, 0)} />
            </div>
          </div>
        </div>
      </div>

      {/* Top Gainers / Losers / Most Active */}
      <div className="grid gap-4 lg:grid-cols-3">
        <MoversList title="Top Gainers" stocks={gainers} positive />
        <MoversList title="Top Losers" stocks={losers} />
        <MoversList title="Most Active" stocks={mostActive} volumeMode />
      </div>

      {/* AI Opportunity Watchlist + Recent Alerts */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">AI Opportunity Watchlist</h2>
            <button onClick={() => setCurrentPage('signals')} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              View all signals →
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {opportunities.map((stock) => (
              <StockCard key={stock.ticker} stock={stock} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="section-title">Recent AI Alerts</h2>
            <button onClick={() => setCurrentPage('alerts')} className="text-xs font-medium text-brand-600 hover:underline dark:text-brand-400">
              Manage →
            </button>
          </div>
          <div className="card divide-y divide-ink-100 dark:divide-ink-800">
            {triggeredAlerts.length === 0 ? (
              <p className="p-4 text-sm text-ink-500">No triggered alerts</p>
            ) : (
              triggeredAlerts.slice(0, 5).map((alert) => (
                <div key={alert.id} className="flex items-start gap-3 p-3">
                  <div className={`mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg ${alert.type === 'risk_high' ? 'bg-bear-soft' : 'bg-bull-soft'}`}>
                    <AlertCircle className={`h-4 w-4 ${alert.type === 'risk_high' ? 'text-bear-500' : 'text-bull-500'}`} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{alert.ticker}</p>
                    <p className="text-xs text-ink-500">{alert.message}</p>
                    <p className="mt-0.5 text-[10px] text-ink-400">
                      {alert.triggeredAt ? new Date(alert.triggeredAt).toLocaleDateString() : ''}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

function KpiCard({ label, value, change, changePct, subValue, icon: Icon, positive, neutral }: {
  label: string;
  value: string;
  change?: number;
  changePct?: number;
  subValue?: string;
  icon: typeof Activity;
  positive?: boolean;
  neutral?: boolean;
}) {
  const isPositive = positive ?? (change !== undefined && change >= 0);
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</p>
        <Icon className={`h-4 w-4 ${neutral ? 'text-ink-400' : isPositive ? 'text-bull-500' : 'text-bear-500'}`} />
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums text-ink-900 dark:text-ink-100">{value}</p>
      {change !== undefined && changePct !== undefined && (
        <p className={`mt-1 text-xs font-medium ${isPositive ? 'text-bull' : 'text-bear'}`}>
          {isPositive ? '+' : ''}{change.toFixed(2)} ({isPositive ? '+' : ''}{changePct.toFixed(2)}%)
        </p>
      )}
      {subValue && <p className="mt-1 text-xs text-ink-500">{subValue}</p>}
    </div>
  );
}

function SentimentBar({ label, count, color, total }: { label: string; count: number; color: string; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div>
      <div className="flex items-center justify-between text-xs">
        <span className="text-ink-500">{label}</span>
        <span className="font-medium tabular-nums text-ink-700 dark:text-ink-300">{count}</span>
      </div>
      <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

function MoversList({ title, stocks, positive, volumeMode }: { title: string; stocks: typeof import('@/lib/mockData').generateStocks extends () => infer R ? R : never; positive?: boolean; volumeMode?: boolean }) {
  const { setSelectedTicker, setCurrentPage } = useApp();
  return (
    <div className="card p-4">
      <h2 className="section-title">{title}</h2>
      <div className="mt-3 space-y-1">
        {stocks.map((stock) => (
          <button
            key={stock.ticker}
            onClick={() => {
              setSelectedTicker(stock.ticker);
              setCurrentPage('analysis');
            }}
            className="flex w-full items-center justify-between rounded-lg px-2 py-2 text-left transition-colors hover:bg-ink-50 dark:hover:bg-ink-800"
          >
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{stock.ticker}</p>
              <p className="truncate text-xs text-ink-500">{stock.name}</p>
            </div>
            <div className="flex items-center gap-3">
              {!volumeMode ? (
                <>
                  <div className="h-8 w-16">
                    <Sparkline data={stock.history} color={positive ? '#10b981' : '#ef4444'} height={32} />
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium tabular-nums">৳{stock.currentPrice.toFixed(2)}</p>
                    <p className={`text-xs font-medium ${stock.dailyChange >= 0 ? 'text-bull' : 'text-bear'}`}>
                      {stock.dailyChange >= 0 ? '+' : ''}{stock.dailyChangePct.toFixed(2)}%
                    </p>
                  </div>
                </>
              ) : (
                <div className="text-right">
                  <p className="text-sm font-medium tabular-nums">{(stock.volume / 1000).toFixed(0)}K</p>
                  <p className="text-xs text-ink-500">shares</p>
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
