import { useMemo } from 'react';
import { Brain, Target, TrendingUp, Activity, Award, Gauge } from 'lucide-react';
import {
  LineChart, Line, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid, Legend,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { DemoBadge, Disclaimer } from '@/components/Disclaimer';
import type { ModelVersion } from '@/types';

const MODEL_VERSIONS: ModelVersion[] = [
  { version: 'v1.0.0', date: '2024-06-15', accuracy: 58.2, precision: 59.1, recall: 57.3, f1Score: 58.2, rocAuc: 0.61, active: false },
  { version: 'v1.1.0', date: '2024-09-20', accuracy: 61.5, precision: 62.8, recall: 60.2, f1Score: 61.5, rocAuc: 0.65, active: false },
  { version: 'v1.2.0', date: '2025-01-10', accuracy: 64.3, precision: 65.1, recall: 63.5, f1Score: 64.3, rocAuc: 0.68, active: true },
];

export function ModelEval() {
  const { stocks } = useApp();

  // Confusion matrix data (simulated)
  const confusionMatrix = useMemo(() => {
    return { tp: 142, fp: 68, fn: 52, tn: 138 };
  }, []);

  // Accuracy over time
  const accuracyData = useMemo(() => {
    const data: { period: string; accuracy: number; benchmark: number }[] = [];
    let acc = 58;
    let bench = 52;
    const periods = ['Q1 2024', 'Q2 2024', 'Q3 2024', 'Q4 2024', 'Q1 2025', 'Q2 2025'];
    for (const period of periods) {
      acc += Math.random() * 3 - 1;
      bench += Math.random() * 2 - 0.5;
      data.push({ period, accuracy: Math.round(acc * 10) / 10, benchmark: Math.round(bench * 10) / 10 });
    }
    return data;
  }, []);

  // Feature importance
  const featureImportance = useMemo(() => {
    return [
      { feature: 'RSI (14)', importance: 18.5 },
      { feature: 'MACD', importance: 15.2 },
      { feature: 'SMA 20', importance: 12.8 },
      { feature: 'Volume Change', importance: 11.5 },
      { feature: 'Volatility', importance: 9.8 },
      { feature: '5-day Return', importance: 8.2 },
      { feature: 'Bollinger %B', importance: 7.5 },
      { feature: 'EMA 12', importance: 6.8 },
      { feature: '20-day Return', importance: 5.2 },
      { feature: 'Market Trend', importance: 4.5 },
    ];
  }, []);

  const currentModel = MODEL_VERSIONS.find((m) => m.active)!;

  const metrics = [
    { label: 'Accuracy', value: `${currentModel.accuracy}%`, icon: Target, tone: 'bull' },
    { label: 'Precision', value: `${currentModel.precision}%`, icon: Target, tone: 'bull' },
    { label: 'Recall', value: `${currentModel.recall}%`, icon: Activity, tone: 'neutral' },
    { label: 'F1 Score', value: `${currentModel.f1Score}%`, icon: Gauge, tone: 'neutral' },
    { label: 'ROC-AUC', value: currentModel.rocAuc.toFixed(2), icon: Award, tone: 'bull' },
    { label: 'Active Version', value: currentModel.version, icon: Brain, tone: 'neutral' },
  ];

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Model Evaluation</h1>
          <p className="mt-1 text-sm text-ink-500">ML model performance metrics and training history</p>
        </div>
        <DemoBadge />
      </div>

      <div className="flex items-center gap-2 rounded-lg bg-warn-500/5 p-3 text-sm">
        <Brain className="h-4 w-4 shrink-0 text-warn-500" />
        <span className="text-ink-600 dark:text-ink-400">
          Model metrics are simulated for demonstration. In production, these are measured on unseen historical data using chronological train/test splits.
        </span>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3">
        {metrics.map((m) => {
          const Icon = m.icon;
          const toneColor = m.tone === 'bull' ? 'text-bull-500' : m.tone === 'bear' ? 'text-bear-500' : 'text-brand-500';
          return (
            <div key={m.label} className="card p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{m.label}</p>
                <Icon className={`h-4 w-4 ${toneColor}`} />
              </div>
              <p className="mt-2 text-xl font-bold tabular-nums text-ink-900 dark:text-ink-100">{m.value}</p>
            </div>
          );
        })}
      </div>

      {/* Accuracy over time */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Prediction Accuracy Over Time</h2>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={accuracyData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
            <XAxis dataKey="period" tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" />
            <YAxis tick={{ fontSize: 10 }} domain={[40, 75]} tickFormatter={(v) => `${v}%`} stroke="currentColor" className="text-ink-400" />
            <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} formatter={(v) => `${v}%`} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Line type="monotone" dataKey="accuracy" stroke="#339eff" strokeWidth={2} name="Model Accuracy" />
            <Line type="monotone" dataKey="benchmark" stroke="#65748d" strokeWidth={1.5} strokeDasharray="5 5" name="Random Baseline" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Feature importance + Confusion matrix */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title mb-4">Feature Importance</h2>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={featureImportance} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 60 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
              <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}%`} stroke="currentColor" className="text-ink-400" />
              <YAxis type="category" dataKey="feature" tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" width={80} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} formatter={(v) => `${v}% importance`} />
              <Bar dataKey="importance" fill="#339eff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-4">Confusion Matrix</h2>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-lg bg-bull-500/10 p-4 text-center">
              <p className="text-xs font-medium text-bull-600 dark:text-bull-400">True Positive</p>
              <p className="mt-1 text-2xl font-bold text-bull-600 dark:text-bull-400">{confusionMatrix.tp}</p>
              <p className="text-[10px] text-ink-500">Correctly predicted UP</p>
            </div>
            <div className="rounded-lg bg-bear-500/10 p-4 text-center">
              <p className="text-xs font-medium text-bear-600 dark:text-bear-400">False Positive</p>
              <p className="mt-1 text-2xl font-bold text-bear-600 dark:text-bear-400">{confusionMatrix.fp}</p>
              <p className="text-[10px] text-ink-500">Predicted UP, went DOWN</p>
            </div>
            <div className="rounded-lg bg-warn-500/10 p-4 text-center">
              <p className="text-xs font-medium text-warn-600 dark:text-warn-400">False Negative</p>
              <p className="mt-1 text-2xl font-bold text-warn-600 dark:text-warn-400">{confusionMatrix.fn}</p>
              <p className="text-[10px] text-ink-500">Predicted DOWN, went UP</p>
            </div>
            <div className="rounded-lg bg-ink-100 p-4 text-center dark:bg-ink-800">
              <p className="text-xs font-medium text-ink-600 dark:text-ink-400">True Negative</p>
              <p className="mt-1 text-2xl font-bold text-ink-900 dark:text-ink-100">{confusionMatrix.tn}</p>
              <p className="text-[10px] text-ink-500">Correctly predicted DOWN</p>
            </div>
          </div>
          <div className="mt-4 rounded-lg bg-ink-50 p-3 dark:bg-ink-800/50">
            <p className="text-xs text-ink-500">
              Total predictions: {confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn} ·
              Correct: {((confusionMatrix.tp + confusionMatrix.tn) / (confusionMatrix.tp + confusionMatrix.fp + confusionMatrix.fn + confusionMatrix.tn) * 100).toFixed(1)}%
            </p>
          </div>
        </div>
      </div>

      {/* Model version history */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Model Version History</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-ink-200 text-left text-xs uppercase tracking-wider text-ink-500 dark:border-ink-800">
                <th className="px-4 py-3">Version</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3 text-right">Accuracy</th>
                <th className="px-4 py-3 text-right">Precision</th>
                <th className="px-4 py-3 text-right">Recall</th>
                <th className="px-4 py-3 text-right">F1 Score</th>
                <th className="px-4 py-3 text-right">ROC-AUC</th>
                <th className="px-4 py-3 text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {MODEL_VERSIONS.map((m) => (
                <tr key={m.version} className="border-b border-ink-100 dark:border-ink-800">
                  <td className="px-4 py-3 font-semibold text-ink-900 dark:text-ink-100">{m.version}</td>
                  <td className="px-4 py-3 text-ink-500">{m.date}</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.accuracy.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.precision.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.recall.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.f1Score.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-right tabular-nums">{m.rocAuc.toFixed(2)}</td>
                  <td className="px-4 py-3 text-center">
                    {m.active ? (
                      <span className="badge bg-bull-soft"><span className="h-1.5 w-1.5 rounded-full bg-bull-500" /> ACTIVE</span>
                    ) : (
                      <span className="badge bg-neutral-soft">Archived</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Training info */}
      <div className="card p-5">
        <h2 className="section-title mb-3">Training Methodology</h2>
        <ul className="space-y-2 text-sm text-ink-600 dark:text-ink-400">
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            Chronological data splitting: 2018-2022 for training, 2023 for validation, 2024-2025 for testing. No random shuffling to prevent data leakage.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            Walk-forward validation: The model is retrained periodically on expanding windows to simulate real-world deployment.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            18 features including OHLCV, daily/5-day/10-day/20-day returns, SMA, EMA, RSI, MACD, Bollinger Bands, volatility, and volume change.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            Prediction target: Next trading day's price direction (UP/DOWN). The model outputs a probability, not a price target.
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-brand-500" />
            New model versions are deployed only if they outperform the current version on the test set by a meaningful margin.
          </li>
        </ul>
      </div>

      <Disclaimer />
    </div>
  );
}
