interface ScoreGaugeProps {
  score: number;
  size?: number;
  label?: string;
}

export function ScoreGauge({ score, size = 120, label = 'AI Score' }: ScoreGaugeProps) {
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 65 ? '#22c55e' : score >= 45 ? '#f59e0b' : '#ef4444';
  const glowColor = score >= 65 ? 'rgba(34, 197, 94, 0.5)' : score >= 45 ? 'rgba(245, 158, 11, 0.5)' : 'rgba(239, 68, 68, 0.5)';

  return (
    <div className="relative inline-flex flex-col items-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="currentColor"
          strokeWidth={6}
          className="text-ink-200 dark:text-ink-800"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={6}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-700 ease-out"
          style={{ filter: `drop-shadow(0 0 6px ${glowColor})` }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold tabular-nums" style={{ color, textShadow: `0 0 15px ${glowColor}` }}>
          {score}
        </span>
        <span className="text-[10px] uppercase tracking-wider text-ink-400">/ 100</span>
      </div>
      <span className="mt-1 text-xs font-medium text-ink-500">{label}</span>
    </div>
  );
}
