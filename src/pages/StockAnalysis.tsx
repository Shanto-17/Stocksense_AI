import { useState, useMemo } from 'react';
import {
  AreaChart, Area, LineChart, Line, BarChart, Bar, ComposedChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, ReferenceLine, Cell,
} from 'recharts';
import {
  TrendingUp, TrendingDown, Star, Brain, ShieldAlert, CheckCircle2, AlertTriangle,
  Newspaper, DollarSign, BarChart3, Activity, Zap,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SignalBadge, RiskBadge, ConfidenceBadge, SentimentBadge, ImpactBadge } from '@/components/Badges';
import { ScoreGauge } from '@/components/ScoreGauge';
import { Disclaimer, DemoBadge } from '@/components/Disclaimer';
import { sma, bollingerBands } from '@/lib/indicators';
import type { RiskLevel } from '@/types';

type ChartRange = '1M' | '3M' | '6M' | '1Y';

export function StockAnalysis() {
  const { stocks, selectedTicker, setSelectedTicker, watchlist, toggleWatchlist, profile } = useApp();
  const [range, setRange] = useState<ChartRange>('3M');

  const stock = stocks.find((s) => s.ticker === selectedTicker) ?? stocks[0];

  if (!stock) {
    return (
      <div className="flex h-full items-center justify-center p-12">
        <p className="text-sm text-ink-500">Select a stock from the Markets page to view analysis.</p>
      </div>
    );
  }

  const isUp = stock.dailyChange >= 0;
  const isWatched = watchlist.includes(stock.ticker);

  const rangeDays = range === '1M' ? 22 : range === '3M' ? 66 : range === '6M' ? 130 : 260;
  const chartData = useMemo(() => {
    const history = stock.history.slice(-rangeDays);
    const prices = stock.history.map((h) => h.price);
    const bb = bollingerBands(prices.slice(-rangeDays));
    return history.map((h, i) => {
      const slice = prices.slice(Math.max(0, prices.length - rangeDays), prices.length - rangeDays + i + 1);
      return {
        date: h.date,
        price: h.price,
        volume: h.volume,
        sma20: sma(slice, Math.min(20, slice.length)),
        sma50: sma(slice, Math.min(50, slice.length)),
      };
    });
  }, [stock, range]);

  const bb = bollingerBands(stock.history.map((h) => h.price));

  // Personalized signal
  const personalizedSignal = useMemo(() => {
    const riskComponent = stock.aiScore.components.find((c) => c.label === 'Risk / Volatility');
    if (profile.riskTolerance === 'Conservative' && riskComponent && riskComponent.score < 50) {
      return { signal: 'HOLD' as const, note: 'Adjusted to HOLD for conservative investors due to elevated risk' };
    }
    if (profile.riskTolerance === 'Aggressive' && stock.aiScore.signal === 'HOLD' && stock.aiScore.total > 55) {
      return { signal: 'BUY' as const, note: 'Adjusted to BUY for aggressive investors with higher risk tolerance' };
    }
    return { signal: stock.aiScore.signal, note: `Matches your ${profile.riskTolerance.toLowerCase()} risk profile` };
  }, [profile, stock]);

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <select
            value={stock.ticker}
            onChange={(e) => setSelectedTicker(e.target.value)}
            className="input max-w-[200px]"
          >
            {stocks.map((s) => (
              <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
            ))}
          </select>
          <button
            onClick={() => toggleWatchlist(stock.ticker)}
            className="btn-ghost p-2"
            aria-label="Toggle watchlist"
          >
            <Star className={`h-5 w-5 ${isWatched ? 'fill-warn-500 text-warn-500' : ''}`} />
          </button>
        </div>
        <DemoBadge />
      </div>

      {/* Price summary */}
      <div className="card p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">{stock.name}</h1>
            <p className="text-sm text-ink-500">{stock.ticker} · {stock.sector}</p>
          </div>
          <div className="text-right">
            <p className="text-3xl font-bold tabular-nums text-ink-900 dark:text-ink-100">
              ৳{stock.currentPrice.toFixed(2)}
            </p>
            <div className={`flex items-center justify-end gap-1 text-sm font-medium ${isUp ? 'text-bull' : 'text-bear'}`}>
              {isUp ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              {isUp ? '+' : ''}{stock.dailyChange.toFixed(2)} ({isUp ? '+' : ''}{stock.dailyChangePct.toFixed(2)}%)
            </div>
          </div>
        </div>
      </div>

      {/* Price chart + Volume */}
      <div className="card p-5">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="section-title">Price & Volume</h2>
          <div className="flex gap-1">
            {(['1M', '3M', '6M', '1Y'] as ChartRange[]).map((r) => (
              <button
                key={r}
                onClick={() => setRange(r)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium transition-colors ${
                  range === r
                    ? 'bg-brand-600 text-white'
                    : 'text-ink-500 hover:bg-ink-100 dark:hover:bg-ink-800'
                }`}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <ComposedChart data={chartData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="priceGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#339eff" stopOpacity={0.2} />
                <stop offset="100%" stopColor="#339eff" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
            <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} interval={Math.floor(chartData.length / 6)} stroke="currentColor" className="text-ink-400" />
            <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} />
            <Area type="monotone" dataKey="price" stroke="#339eff" strokeWidth={2} fill="url(#priceGrad)" name="Price" />
            <Line type="monotone" dataKey="sma20" stroke="#f59e0b" strokeWidth={1} dot={false} name="SMA 20" />
            <Line type="monotone" dataKey="sma50" stroke="#8b5cf6" strokeWidth={1} dot={false} name="SMA 50" />
          </ComposedChart>
        </ResponsiveContainer>

        <div className="mt-4">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">Volume</h3>
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData} margin={{ top: 0, right: 5, bottom: 0, left: 0 }}>
              <XAxis dataKey="date" tick={{ fontSize: 10 }} tickFormatter={(v) => v.slice(5)} interval={Math.floor(chartData.length / 6)} stroke="currentColor" className="text-ink-400" />
              <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} />
              <Bar dataKey="volume" fill="#65748d" opacity={0.5} name="Volume" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Technical Indicators */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Technical Indicators</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <IndicatorCard label="RSI (14)" value={stock.technicals.rsi.toFixed(1)} icon={Activity} tone={stock.technicals.rsi > 70 ? 'bear' : stock.technicals.rsi < 30 ? 'bull' : 'neutral'} sub={stock.technicals.rsi > 70 ? 'Overbought' : stock.technicals.rsi < 30 ? 'Oversold' : 'Neutral'} />
          <IndicatorCard label="MACD" value={stock.technicals.macd.toFixed(2)} icon={BarChart3} tone={stock.technicals.macdHistogram > 0 ? 'bull' : 'bear'} sub={`Signal: ${stock.technicals.macdSignal.toFixed(2)}`} />
          <IndicatorCard label="Volatility" value={`${stock.technicals.volatility.toFixed(1)}%`} icon={Zap} tone={stock.technicals.volatility > 40 ? 'bear' : stock.technicals.volatility > 25 ? 'warn' : 'bull'} sub="Annualized" />
          <IndicatorCard label="SMA 20" value={`৳${stock.technicals.sma20.toFixed(2)}`} icon={TrendingUp} tone={stock.currentPrice > stock.technicals.sma20 ? 'bull' : 'bear'} sub={stock.currentPrice > stock.technicals.sma20 ? 'Above SMA' : 'Below SMA'} />
          <IndicatorCard label="SMA 50" value={`৳${stock.technicals.sma50.toFixed(2)}`} icon={TrendingUp} tone={stock.currentPrice > stock.technicals.sma50 ? 'bull' : 'bear'} sub={stock.currentPrice > stock.technicals.sma50 ? 'Above SMA' : 'Below SMA'} />
          <IndicatorCard label="SMA 200" value={`৳${stock.technicals.sma200.toFixed(2)}`} icon={TrendingUp} tone={stock.currentPrice > stock.technicals.sma200 ? 'bull' : 'bear'} sub={stock.currentPrice > stock.technicals.sma200 ? 'Above SMA' : 'Below SMA'} />
        </div>

        {/* Bollinger Bands */}
        <div className="mt-4 rounded-lg bg-ink-50 p-4 dark:bg-ink-800/50">
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-500">Bollinger Bands (20, 2)</p>
          <div className="mt-2 grid grid-cols-3 gap-3 text-sm">
            <div>
              <span className="text-ink-500">Upper:</span> <span className="font-medium tabular-nums">৳{bb.upper.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-ink-500">Middle:</span> <span className="font-medium tabular-nums">৳{bb.middle.toFixed(2)}</span>
            </div>
            <div>
              <span className="text-ink-500">Lower:</span> <span className="font-medium tabular-nums">৳{bb.lower.toFixed(2)}</span>
            </div>
          </div>
          <div className="mt-2">
            <div className="flex h-2 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-700">
              <div className="bg-bear-500/40" style={{ width: '33%' }} />
              <div className="bg-warn-500/40" style={{ width: '34%' }} />
              <div className="bg-bull-500/40" style={{ width: '33%' }} />
            </div>
            <div className="relative mt-1" style={{}}>
              <div
                className="absolute -translate-x-1/2"
                style={{ left: `${Math.min(100, Math.max(0, ((stock.currentPrice - bb.lower) / (bb.upper - bb.lower)) * 100))}%` }}
              >
                <div className="h-3 w-0.5 bg-ink-900 dark:bg-ink-100" />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fundamentals */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Fundamental Indicators</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
          <FundamentalCard label="EPS" value={`৳${stock.fundamentals.eps.toFixed(2)}`} icon={DollarSign} />
          <FundamentalCard label="P/E Ratio" value={stock.fundamentals.peRatio.toFixed(1)} icon={BarChart3} sub={stock.fundamentals.peRatio < 15 ? 'Reasonable' : stock.fundamentals.peRatio < 25 ? 'Fair' : 'High'} />
          <FundamentalCard label="Revenue Growth" value={`${stock.fundamentals.revenueGrowth.toFixed(1)}%`} icon={TrendingUp} tone={stock.fundamentals.revenueGrowth > 10 ? 'bull' : stock.fundamentals.revenueGrowth > 0 ? 'neutral' : 'bear'} />
          <FundamentalCard label="Profit Growth" value={`${stock.fundamentals.profitGrowth.toFixed(1)}%`} icon={TrendingUp} tone={stock.fundamentals.profitGrowth > 10 ? 'bull' : stock.fundamentals.profitGrowth > 0 ? 'neutral' : 'bear'} />
          <FundamentalCard label="Dividend Yield" value={`${stock.fundamentals.dividendYield.toFixed(1)}%`} icon={DollarSign} />
          <FundamentalCard label="Debt / Equity" value={stock.fundamentals.debtToEquity.toFixed(2)} icon={Activity} tone={stock.fundamentals.debtToEquity < 0.4 ? 'bull' : stock.fundamentals.debtToEquity < 0.7 ? 'neutral' : 'bear'} />
          <FundamentalCard label="Market Cap" value={`৳${(stock.fundamentals.marketCap / 1000).toFixed(1)}B`} icon={BarChart3} />
          <FundamentalCard label="Book Value" value={`৳${stock.fundamentals.bookValue.toFixed(2)}`} icon={DollarSign} />
        </div>
      </div>

      {/* AI Score + Forecast */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* AI Score */}
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Brain className="h-5 w-5 text-brand-500" />
            <h2 className="section-title">AI Stock Score</h2>
          </div>
          <div className="flex items-center gap-6">
            <ScoreGauge score={stock.aiScore.total} />
            <div className="flex-1 space-y-2">
              {stock.aiScore.components.map((c) => (
                <div key={c.label}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-ink-600 dark:text-ink-400">{c.label}</span>
                    <span className="font-semibold tabular-nums">{c.score}</span>
                  </div>
                  <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
                    <div
                      className={`h-full rounded-full ${c.score >= 65 ? 'bg-bull-500' : c.score >= 45 ? 'bg-warn-500' : 'bg-bear-500'}`}
                      style={{ width: `${c.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-4 flex items-center justify-between border-t border-ink-100 pt-4 dark:border-ink-800">
            <div>
              <p className="text-xs text-ink-500">Signal</p>
              <div className="mt-1"><SignalBadge signal={stock.aiScore.signal} size="md" /></div>
            </div>
            <div className="text-right">
              <p className="text-xs text-ink-500">Confidence</p>
              <p className="mt-1 text-lg font-bold text-brand-600 dark:text-brand-400">{stock.aiScore.confidence}%</p>
            </div>
          </div>
        </div>

        {/* AI Forecast */}
        <div className="card p-5">
          <div className="mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-brand-500" />
            <h2 className="section-title">AI Price Forecast</h2>
          </div>
          <div className="space-y-4">
            <ForecastRow label="7-Day Forecast" forecast={stock.forecast.sevenDay} />
            <ForecastRow label="30-Day Forecast" forecast={stock.forecast.thirtyDay} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-ink-100 pt-4 dark:border-ink-800">
            <div className="text-center">
              <p className="text-xs text-ink-500">Prob. Positive Return</p>
              <p className={`mt-1 text-lg font-bold ${stock.forecast.probPositiveReturn >= 50 ? 'text-bull' : 'text-bear'}`}>{stock.forecast.probPositiveReturn}%</p>
            </div>
            <div className="text-center">
              <p className="text-xs text-ink-500">Confidence</p>
              <div className="mt-1 flex justify-center"><ConfidenceBadge confidence={stock.forecast.confidence} /></div>
            </div>
            <div className="text-center">
              <p className="text-xs text-ink-500">Expected Volatility</p>
              <div className="mt-1 flex justify-center"><RiskBadge level={stock.forecast.expectedVolatility} /></div>
            </div>
          </div>
          <p className="mt-3 text-center text-[10px] text-ink-400">
            Forecasts are probabilistic estimates, not guarantees. Actual results may differ significantly.
          </p>
        </div>
      </div>

      {/* Explainable AI: WHY? */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-bull-500" />
            <h2 className="section-title">Why {stock.aiScore.signal}?</h2>
          </div>
          <ul className="space-y-2">
            {stock.aiScore.reasons.map((reason, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-300">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-bull-500" />
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-5">
          <div className="mb-3 flex items-center gap-2">
            <ShieldAlert className="h-5 w-5 text-bear-500" />
            <h2 className="section-title">Risks</h2>
          </div>
          <ul className="space-y-2">
            {stock.aiScore.risks.map((risk, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-ink-700 dark:text-ink-300">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warn-500" />
                <span>{risk}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Personalized view */}
      <div className="card border-brand-500/20 bg-brand-50/30 p-5 dark:bg-brand-950/10">
        <div className="flex items-center gap-2">
          <Brain className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Personalized for Your Profile</h2>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-4">
          <div>
            <p className="text-xs text-ink-500">Your Risk Tolerance</p>
            <p className="text-sm font-semibold">{profile.riskTolerance}</p>
          </div>
          <div>
            <p className="text-xs text-ink-500">Investment Horizon</p>
            <p className="text-sm font-semibold">{profile.horizon}</p>
          </div>
          <div className="ml-auto flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-ink-500">Personalized Signal</p>
              <div className="mt-1"><SignalBadge signal={personalizedSignal.signal} size="md" /></div>
            </div>
          </div>
        </div>
        <p className="mt-3 text-sm text-ink-600 dark:text-ink-400">{personalizedSignal.note}</p>
      </div>

      {/* News + Sentiment */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Newspaper className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Recent News & Sentiment</h2>
        </div>
        <div className="space-y-3">
          {stock.news.map((item) => (
            <div key={item.id} className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{item.headline}</p>
                  <p className="mt-1 text-xs text-ink-500">{item.source} · {item.date}</p>
                  <p className="mt-1.5 text-xs text-ink-600 dark:text-ink-400">{item.summary}</p>
                </div>
                <div className="flex shrink-0 flex-col items-end gap-1.5">
                  <SentimentBadge sentiment={item.sentiment} />
                  <ImpactBadge impact={item.impact} />
                  <span className="text-[10px] text-ink-400">{item.confidence}% conf.</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Disclaimer />
    </div>
  );
}

function IndicatorCard({ label, value, icon: Icon, tone, sub }: {
  label: string;
  value: string;
  icon: typeof Activity;
  tone: 'bull' | 'bear' | 'warn' | 'neutral';
  sub?: string;
}) {
  const toneColor = tone === 'bull' ? 'text-bull-500' : tone === 'bear' ? 'text-bear-500' : tone === 'warn' ? 'text-warn-500' : 'text-ink-500';
  return (
    <div className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-500">{label}</span>
        <Icon className={`h-4 w-4 ${toneColor}`} />
      </div>
      <p className="mt-1 text-lg font-bold tabular-nums text-ink-900 dark:text-ink-100">{value}</p>
      {sub && <p className={`text-xs ${toneColor}`}>{sub}</p>}
    </div>
  );
}

function FundamentalCard({ label, value, icon: Icon, tone, sub }: {
  label: string;
  value: string;
  icon: typeof DollarSign;
  tone?: 'bull' | 'bear' | 'neutral';
  sub?: string;
}) {
  const toneColor = tone === 'bull' ? 'text-bull-500' : tone === 'bear' ? 'text-bear-500' : 'text-ink-500';
  return (
    <div className="rounded-lg border border-ink-100 p-3 dark:border-ink-800">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-ink-500">{label}</span>
        <Icon className={`h-4 w-4 ${toneColor}`} />
      </div>
      <p className="mt-1 text-lg font-bold tabular-nums text-ink-900 dark:text-ink-100">{value}</p>
      {sub && <p className={`text-xs ${toneColor}`}>{sub}</p>}
    </div>
  );
}

function ForecastRow({ label, forecast }: { label: string; forecast: { bear: [number, number]; base: [number, number]; bull: [number, number] } }) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-500">{label}</p>
      <div className="grid grid-cols-3 gap-2">
        <div className="rounded-lg bg-bear-500/5 p-2 text-center">
          <p className="text-[10px] font-medium uppercase text-bear-500">Bear</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-bear-600 dark:text-bear-400">
            ৳{forecast.bear[0].toFixed(0)}–{forecast.bear[1].toFixed(0)}
          </p>
        </div>
        <div className="rounded-lg bg-ink-100 p-2 text-center dark:bg-ink-800">
          <p className="text-[10px] font-medium uppercase text-ink-500">Base</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-ink-900 dark:text-ink-100">
            ৳{forecast.base[0].toFixed(0)}–{forecast.base[1].toFixed(0)}
          </p>
        </div>
        <div className="rounded-lg bg-bull-500/5 p-2 text-center">
          <p className="text-[10px] font-medium uppercase text-bull-500">Bull</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-bull-600 dark:text-bull-400">
            ৳{forecast.bull[0].toFixed(0)}–{forecast.bull[1].toFixed(0)}
          </p>
        </div>
      </div>
    </div>
  );
}
