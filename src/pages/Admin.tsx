import { useMemo, useState, useEffect } from 'react';
import { Users, Activity, Search, Bell, Brain, Database, AlertCircle, TrendingUp, Cpu, RefreshCw, Server, ShieldCheck, Zap } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ResponsiveContainer, Tooltip, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import { useApp } from '@/context/AppContext';
import { DemoBadge } from '@/components/Disclaimer';
import { supabase } from '@/lib/supabase';

export function Admin() {
  const { stocks, alerts, user, watchlist } = useApp();
  const [dbUserCount, setDbUserCount] = useState<number | null>(null);
  const [dbAlertCount, setDbAlertCount] = useState<number | null>(null);

  useEffect(() => {
    (async () => {
      const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
      setDbUserCount(userCount ?? 0);
      const { count: alertCount } = await supabase.from('user_alerts').select('*', { count: 'exact', head: true });
      setDbAlertCount(alertCount ?? 0);
    })();
  }, []);

  const adminStats = useMemo(() => {
    const totalAlerts = alerts.length;
    const triggeredAlerts = alerts.filter((a) => a.triggered).length;
    const buySignals = stocks.filter((s) => s.aiScore.signal === 'BUY').length;
    const holdSignals = stocks.filter((s) => s.aiScore.signal === 'HOLD').length;
    const avoidSignals = stocks.filter((s) => s.aiScore.signal === 'AVOID').length;
    const avgScore = Math.round(stocks.reduce((a, s) => a + s.aiScore.total, 0) / stocks.length);
    const gainers = stocks.filter((s) => s.dailyChange > 0).length;
    const losers = stocks.filter((s) => s.dailyChange < 0).length;

    return {
      totalUsers: dbUserCount ?? 12847,
      activeUsers: dbUserCount ? Math.max(1, Math.floor(dbUserCount * 0.25)) : 3291,
      totalStocks: stocks.length,
      totalAlerts: dbAlertCount ?? totalAlerts,
      triggeredAlerts,
      buySignals,
      holdSignals,
      avoidSignals,
      avgScore,
      gainers,
      losers,
      apiStatus: 'Operational',
      dataFreshness: '2 min ago',
      modelVersion: 'v1.2.0',
    };
  }, [stocks, alerts, dbUserCount, dbAlertCount]);

  // Simulated user growth
  const userGrowthData = useMemo(() => {
    const data: { month: string; users: number }[] = [];
    let count = 5000;
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
    for (const month of months) {
      count += Math.floor(Math.random() * 1500 + 500);
      data.push({ month, users: count });
    }
    return data;
  }, []);

  // Popular stocks
  const popularStocks = useMemo(() => {
    return [...stocks].sort((a, b) => b.volume - a.volume).slice(0, 8);
  }, [stocks]);

  // Search data
  const searchTrends = useMemo(() => {
    return stocks.slice(0, 6).map((s) => ({
      name: s.ticker,
      searches: Math.floor(s.volume / 5000 + 100),
    }));
  }, [stocks]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Admin Dashboard</h1>
          <p className="mt-1 text-sm text-ink-500">System overview and platform management</p>
        </div>
        <div className="flex items-center gap-2">
          <DemoBadge />
          <span className="badge bg-bull-soft">
            <span className="h-1.5 w-1.5 rounded-full bg-bull-500" />
            {adminStats.apiStatus}
          </span>
        </div>
      </div>

      {/* Admin access warning */}
      {!user?.isAdmin && (
        <div className="flex items-center gap-2 rounded-lg bg-warn-500/10 px-4 py-3 text-sm text-warn-600 dark:text-warn-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          You are viewing the admin dashboard in demo mode. In production, this page requires admin-level access control.
        </div>
      )}

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <AdminKpi icon={Users} label="Total Users" value={adminStats.totalUsers.toLocaleString()} sub="+12% this month" />
        <AdminKpi icon={Activity} label="Active Users" value={adminStats.activeUsers.toLocaleString()} sub="Last 24 hours" />
        <AdminKpi icon={Search} label="Stock Searches" value="8,421" sub="Today" />
        <AdminKpi icon={Bell} label="Active Alerts" value={`${adminStats.totalAlerts}`} sub={`${adminStats.triggeredAlerts} triggered`} />
      </div>

      {/* System status */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-5 lg:col-span-2">
          <h2 className="section-title mb-4">User Growth</h2>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={userGrowthData} margin={{ top: 5, right: 5, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#339eff" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#339eff" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
              <XAxis dataKey="month" tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" />
              <YAxis tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} />
              <Area type="monotone" dataKey="users" stroke="#339eff" strokeWidth={2} fill="url(#userGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-4">System Status</h2>
          <div className="space-y-3">
            <StatusRow icon={Database} label="Database" status="Operational" detail={`Data fresh: ${adminStats.dataFreshness}`} />
            <StatusRow icon={Brain} label="ML Model" status="Active" detail={`Version ${adminStats.modelVersion}`} />
            <StatusRow icon={Cpu} label="API Service" status={adminStats.apiStatus} detail="99.9% uptime" />
            <StatusRow icon={TrendingUp} label="Data Feed" status="Demo Mode" detail="Simulated data" />
          </div>
          <button className="btn-outline mt-4 w-full justify-center">
            <RefreshCw className="h-4 w-4" /> Trigger Model Retrain
          </button>
        </div>
      </div>

      {/* Popular stocks + Search trends */}
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="card p-5">
          <h2 className="section-title mb-4">Popular Stocks (by Volume)</h2>
          <div className="space-y-1">
            {popularStocks.map((s, i) => (
              <div key={s.ticker} className="flex items-center justify-between rounded-lg px-2 py-2 hover:bg-ink-50 dark:hover:bg-ink-800">
                <div className="flex items-center gap-3">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-ink-100 text-xs font-bold text-ink-600 dark:bg-ink-800 dark:text-ink-400">{i + 1}</span>
                  <div>
                    <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{s.ticker}</p>
                    <p className="text-xs text-ink-500">{s.sector}</p>
                  </div>
                </div>
                <p className="text-sm tabular-nums text-ink-600 dark:text-ink-400">{(s.volume / 1000).toFixed(0)}K</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <h2 className="section-title mb-4">Search Trends</h2>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={searchTrends} layout="vertical" margin={{ top: 0, right: 5, bottom: 0, left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-ink-200 dark:text-ink-800" />
              <XAxis type="number" tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} stroke="currentColor" className="text-ink-400" width={60} />
              <Tooltip contentStyle={{ borderRadius: 8, border: '1px solid', fontSize: 12 }} />
              <Bar dataKey="searches" fill="#339eff" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Model info */}
      <div className="card p-5">
        <h2 className="section-title mb-4">Model Information</h2>
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
          <div>
            <p className="text-xs text-ink-500">Current Version</p>
            <p className="mt-1 text-lg font-bold text-ink-900 dark:text-ink-100">{adminStats.modelVersion}</p>
          </div>
          <div>
            <p className="text-xs text-ink-500">Algorithm</p>
            <p className="mt-1 text-lg font-bold text-ink-900 dark:text-ink-100">XGBoost</p>
          </div>
          <div>
            <p className="text-xs text-ink-500">Features</p>
            <p className="mt-1 text-lg font-bold text-ink-900 dark:text-ink-100">18</p>
          </div>
          <div>
            <p className="text-xs text-ink-500">Last Trained</p>
            <p className="mt-1 text-lg font-bold text-ink-900 dark:text-ink-100">2 days ago</p>
          </div>
        </div>
        <div className="mt-4 rounded-lg bg-ink-50 p-3 dark:bg-ink-800/50">
          <p className="text-xs text-ink-500">
            The model uses chronological train/test splitting (2018-2022 train, 2023 validation, 2024-2025 test) with walk-forward validation to prevent data leakage.
            Model performance metrics are available on the Model Evaluation page.
          </p>
        </div>
      </div>
    </div>
  );
}

function AdminKpi({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string; sub: string }) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-wider text-ink-500">{label}</p>
        <Icon className="h-4 w-4 text-brand-500" />
      </div>
      <p className="mt-2 text-xl font-bold tabular-nums text-ink-900 dark:text-ink-100">{value}</p>
      <p className="mt-1 text-xs text-ink-500">{sub}</p>
    </div>
  );
}

function StatusRow({ icon: Icon, label, status, detail }: { icon: typeof Database; label: string; status: string; detail: string }) {
  const isOk = status === 'Operational' || status === 'Active' || status === 'Operational';
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4 text-ink-400" />
        <div>
          <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{label}</p>
          <p className="text-xs text-ink-500">{detail}</p>
        </div>
      </div>
      <span className={`badge ${status === 'Demo Mode' ? 'bg-warn-soft' : 'bg-bull-soft'}`}>
        <span className={`h-1.5 w-1.5 rounded-full ${status === 'Demo Mode' ? 'bg-warn-500' : 'bg-bull-500'}`} />
        {status}
      </span>
    </div>
  );
}
