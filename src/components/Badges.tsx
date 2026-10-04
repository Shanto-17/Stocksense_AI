import type { Signal, RiskLevel } from '@/types';

export function SignalBadge({ signal, size = 'sm' }: { signal: Signal; size?: 'sm' | 'md' }) {
  const styles: Record<Signal, string> = {
    BUY: 'bg-bull-500/10 text-bull-600 dark:text-bull-400 shadow-glow-bull',
    HOLD: 'bg-warn-500/10 text-warn-600 dark:text-warn-400',
    AVOID: 'bg-bear-500/10 text-bear-600 dark:text-bear-400 shadow-glow-bear',
  };
  const labels: Record<Signal, string> = {
    BUY: 'BUY',
    HOLD: 'HOLD',
    AVOID: 'AVOID',
  };
  const dots: Record<Signal, string> = {
    BUY: 'bg-bull-500',
    HOLD: 'bg-warn-500',
    AVOID: 'bg-bear-500',
  };
  const sizeCls = size === 'md' ? 'px-3 py-1 text-sm' : 'px-2 py-0.5 text-xs';
  return (
    <span className={`badge ${styles[signal]} ${sizeCls}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${dots[signal]}`} />
      {labels[signal]}
    </span>
  );
}

export function RiskBadge({ level }: { level: RiskLevel }) {
  const styles: Record<RiskLevel, string> = {
    LOW: 'bg-bull-500/10 text-bull-600 dark:text-bull-400',
    MEDIUM: 'bg-warn-500/10 text-warn-600 dark:text-warn-400',
    HIGH: 'bg-bear-500/10 text-bear-600 dark:text-bear-400 shadow-glow-bear',
  };
  return <span className={`badge ${styles[level]}`}>{level} RISK</span>;
}

export function ConfidenceBadge({ confidence }: { confidence: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const styles: Record<string, string> = {
    LOW: 'bg-bear-500/10 text-bear-600 dark:text-bear-400',
    MEDIUM: 'bg-warn-500/10 text-warn-600 dark:text-warn-400',
    HIGH: 'bg-bull-500/10 text-bull-600 dark:text-bull-400 shadow-glow-bull',
  };
  return <span className={`badge ${styles[confidence]}`}>{confidence} CONFIDENCE</span>;
}

export function SentimentBadge({ sentiment }: { sentiment: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' }) {
  const styles: Record<string, string> = {
    POSITIVE: 'bg-bull-500/10 text-bull-600 dark:text-bull-400',
    NEUTRAL: 'bg-neutral-soft',
    NEGATIVE: 'bg-bear-500/10 text-bear-600 dark:text-bear-400',
  };
  return <span className={`badge ${styles[sentiment]}`}>{sentiment}</span>;
}

export function ImpactBadge({ impact }: { impact: 'LOW' | 'MEDIUM' | 'HIGH' }) {
  const styles: Record<string, string> = {
    LOW: 'bg-neutral-soft',
    MEDIUM: 'bg-warn-500/10 text-warn-600 dark:text-warn-400',
    HIGH: 'bg-bear-500/10 text-bear-600 dark:text-bear-400 shadow-glow-bear',
  };
  return <span className={`badge ${styles[impact]}`}>{impact} IMPACT</span>;
}
