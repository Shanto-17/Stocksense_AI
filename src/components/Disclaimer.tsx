import { AlertTriangle } from 'lucide-react';

export function Disclaimer({ compact = false }: { compact?: boolean }) {
  if (compact) {
    return (
      <div className="flex items-center gap-2 rounded-lg bg-warn-500/5 px-3 py-2 text-xs text-ink-500 dark:text-ink-400">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-warn-500" />
        <span>
          StockSense AI provides probabilistic analysis and educational decision support. Forecasts are uncertain and do not
          guarantee returns.
        </span>
      </div>
    );
  }
  return (
    <div className="flex items-start gap-3 rounded-xl border border-warn-500/20 bg-warn-500/5 p-4">
      <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-warn-500" />
      <div>
        <p className="text-sm font-semibold text-warn-600 dark:text-warn-400">Investment Disclaimer</p>
        <p className="mt-1 text-sm text-ink-600 dark:text-ink-400">
          StockSense AI provides probabilistic analysis and educational decision support. Forecasts are uncertain and do not
          guarantee returns. Users should conduct their own research and consider professional financial advice.
        </p>
      </div>
    </div>
  );
}

export function DemoBadge() {
  return (
    <span className="badge bg-brand-500/10 text-brand-600 dark:text-brand-400">
      <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
      DEMO DATA
    </span>
  );
}
