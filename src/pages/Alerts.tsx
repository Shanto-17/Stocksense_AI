import { useState } from 'react';
import { Bell, BellPlus, Trash2, CheckCircle2, AlertCircle, X } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { DemoBadge } from '@/components/Disclaimer';
import type { AlertRule } from '@/types';

const ALERT_TYPES: { value: AlertRule['type']; label: string; needsThreshold: boolean; placeholder: string }[] = [
  { value: 'price_above', label: 'Price rises above', needsThreshold: true, placeholder: 'e.g. 150' },
  { value: 'price_below', label: 'Price falls below', needsThreshold: true, placeholder: 'e.g. 130' },
  { value: 'daily_change', label: 'Daily change exceeds ±5%', needsThreshold: false, placeholder: '' },
  { value: 'volume_spike', label: 'Unusual volume detected', needsThreshold: false, placeholder: '' },
  { value: 'buy_signal', label: 'Strong BUY signal appears', needsThreshold: false, placeholder: '' },
  { value: 'risk_high', label: 'AI risk score becomes HIGH', needsThreshold: false, placeholder: '' },
  { value: 'news_major', label: 'Major positive/negative news detected', needsThreshold: false, placeholder: '' },
  { value: 'forecast_change', label: 'Forecast changes significantly', needsThreshold: false, placeholder: '' },
];

export function Alerts() {
  const { stocks, alerts, addAlert, removeAlert, toggleAlert, pushNotification } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [ticker, setTicker] = useState(stocks[0]?.ticker ?? '');
  const [type, setType] = useState<AlertRule['type']>('price_above');
  const [threshold, setThreshold] = useState('');

  const selectedType = ALERT_TYPES.find((t) => t.value === type)!;

  const handleCreate = () => {
    const label = selectedType.needsThreshold && threshold
      ? `${selectedType.label} ৳${parseFloat(threshold).toFixed(2)}`
      : selectedType.label;

    addAlert({
      ticker,
      type,
      label,
      threshold: selectedType.needsThreshold ? parseFloat(threshold) : undefined,
      message: `${ticker}: ${label}`,
    });

    pushNotification({
      title: `Alert Created: ${ticker}`,
      body: label,
    });

    setShowForm(false);
    setThreshold('');
  };

  const handleEnableNotifications = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Smart Alerts</h1>
          <p className="mt-1 text-sm text-ink-500">Monitor stocks and get notified on market events</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <button onClick={() => setShowForm((s) => !s)} className="btn-primary">
            <BellPlus className="h-4 w-4" /> New Alert
          </button>
        </div>
      </div>

      {/* Browser notification permission */}
      <div className="card flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <Bell className="h-5 w-5 text-brand-500" />
          <div>
            <p className="text-sm font-medium text-ink-900 dark:text-ink-100">Browser Notifications</p>
            <p className="text-xs text-ink-500">Get notified in your browser when alerts trigger</p>
          </div>
        </div>
        <button onClick={handleEnableNotifications} className="btn-outline">Enable</button>
      </div>

      {/* Create alert form */}
      {showForm && (
        <div className="card animate-fade-in p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="section-title">Create New Alert</h2>
            <button onClick={() => setShowForm(false)} className="btn-ghost p-1">
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Stock</label>
              <select value={ticker} onChange={(e) => setTicker(e.target.value)} className="input">
                {stocks.map((s) => (
                  <option key={s.ticker} value={s.ticker}>{s.ticker} — {s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Condition</label>
              <select value={type} onChange={(e) => setType(e.target.value as AlertRule['type'])} className="input">
                {ALERT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
            {selectedType.needsThreshold && (
              <div>
                <label className="mb-1.5 block text-xs font-medium text-ink-500">Threshold (৳)</label>
                <input
                  type="number"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  placeholder={selectedType.placeholder}
                  className="input"
                />
              </div>
            )}
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <button onClick={() => setShowForm(false)} className="btn-ghost">Cancel</button>
            <button onClick={handleCreate} className="btn-primary" disabled={selectedType.needsThreshold && !threshold}>
              Create Alert
            </button>
          </div>
        </div>
      )}

      {/* Alert list */}
      <div className="space-y-3">
        {alerts.length === 0 ? (
          <div className="card flex flex-col items-center justify-center gap-3 p-12 text-center">
            <Bell className="h-10 w-10 text-ink-300" />
            <p className="text-sm text-ink-500">No alerts configured. Create one to get started.</p>
          </div>
        ) : (
          alerts.map((alert) => (
            <div key={alert.id} className={`card p-4 ${alert.triggered ? 'border-l-4 border-l-bear-500' : ''}`}>
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`flex h-10 w-10 items-center justify-center rounded-lg ${alert.triggered ? 'bg-bear-soft' : alert.active ? 'bg-brand-500/10' : 'bg-ink-100 dark:bg-ink-800'}`}>
                    {alert.triggered ? (
                      <AlertCircle className="h-5 w-5 text-bear-500" />
                    ) : alert.active ? (
                      <Bell className="h-5 w-5 text-brand-500" />
                    ) : (
                      <Bell className="h-5 w-5 text-ink-400" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{alert.ticker}</p>
                      {alert.triggered && <span className="badge bg-bear-soft">TRIGGERED</span>}
                      {!alert.active && <span className="badge bg-neutral-soft">PAUSED</span>}
                    </div>
                    <p className="text-sm text-ink-500">{alert.label}</p>
                    {alert.triggeredAt && (
                      <p className="text-xs text-ink-400">Triggered: {new Date(alert.triggeredAt).toLocaleString()}</p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleAlert(alert.id)}
                    className={`relative h-6 w-11 rounded-full transition-colors ${alert.active ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'}`}
                  >
                    <span
                      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${alert.active ? 'translate-x-5' : 'translate-x-0.5'}`}
                    />
                  </button>
                  <button onClick={() => removeAlert(alert.id)} className="btn-ghost p-1.5 text-ink-400 hover:text-bear-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
