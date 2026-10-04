import { Star, TrendingUp, TrendingDown } from 'lucide-react';
import type { Stock } from '@/types';
import { useApp } from '@/context/AppContext';
import { SignalBadge } from './Badges';
import { Sparkline } from './Sparkline';

interface StockCardProps {
  stock: Stock;
  onClick?: () => void;
}

export function StockCard({ stock, onClick }: StockCardProps) {
  const { watchlist, toggleWatchlist, setSelectedTicker, setCurrentPage } = useApp();
  const isWatched = watchlist.includes(stock.ticker);
  const isUp = stock.dailyChange >= 0;

  const handleClick = () => {
    if (onClick) onClick();
    else {
      setSelectedTicker(stock.ticker);
      setCurrentPage('analysis');
    }
  };

  return (
    <div
      onClick={handleClick}
      className="card card-hover group cursor-pointer p-4 animate-fade-in"
    >
      <div className="flex items-start justify-between">
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="truncate text-sm font-bold text-ink-900 dark:text-ink-100">{stock.ticker}</h3>
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleWatchlist(stock.ticker);
              }}
              className="text-ink-300 transition-colors hover:text-warn-500"
              aria-label="Toggle watchlist"
            >
              <Star className={`h-4 w-4 ${isWatched ? 'fill-warn-500 text-warn-500' : ''}`} />
            </button>
          </div>
          <p className="mt-0.5 truncate text-xs text-ink-500">{stock.name}</p>
        </div>
        <SignalBadge signal={stock.aiScore.signal} />
      </div>

      <div className="mt-3 flex items-end justify-between">
        <div>
          <p className="text-lg font-bold tabular-nums text-ink-900 dark:text-ink-100">
            ৳{stock.currentPrice.toFixed(2)}
          </p>
          <div className={`flex items-center gap-1 text-xs font-medium ${isUp ? 'text-bull' : 'text-bear'}`}>
            {isUp ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            <span>
              {isUp ? '+' : ''}{stock.dailyChange.toFixed(2)} ({isUp ? '+' : ''}{stock.dailyChangePct.toFixed(2)}%)
            </span>
          </div>
        </div>
        <div className="h-10 w-20">
          <Sparkline data={stock.history} color={isUp ? '#10b981' : '#ef4444'} height={40} />
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-ink-100 pt-3 dark:border-ink-800">
        <div className="flex items-center gap-3 text-xs text-ink-500">
          <span>Vol: {(stock.volume / 1000).toFixed(0)}K</span>
          <span className="text-ink-300">|</span>
          <span>AI: <span className="font-semibold text-ink-700 dark:text-ink-300">{stock.aiScore.total}</span></span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-ink-200 dark:bg-ink-800">
            <div
              className={`h-full rounded-full ${stock.aiScore.total >= 65 ? 'bg-bull-500' : stock.aiScore.total >= 45 ? 'bg-warn-500' : 'bg-bear-500'}`}
              style={{ width: `${stock.aiScore.total}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
