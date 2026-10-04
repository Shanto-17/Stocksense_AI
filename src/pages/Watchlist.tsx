import { useApp } from '@/context/AppContext';
import { StockCard } from '@/components/StockCard';
import { Star } from 'lucide-react';

export function Watchlist() {
  const { stocks, watchlist } = useApp();
  const watched = stocks.filter((s) => watchlist.includes(s.ticker));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Watchlist</h1>
        <p className="mt-1 text-sm text-ink-500">{watched.length} stocks you are tracking</p>
      </div>

      {watched.length === 0 ? (
        <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
          <Star className="h-10 w-10 text-ink-300" />
          <div>
            <p className="text-sm font-medium text-ink-700 dark:text-ink-300">Your watchlist is empty</p>
            <p className="mt-1 text-xs text-ink-500">Browse the Markets page and tap the star icon on any stock to add it here.</p>
          </div>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {watched.map((stock) => (
            <StockCard key={stock.ticker} stock={stock} />
          ))}
        </div>
      )}
    </div>
  );
}
