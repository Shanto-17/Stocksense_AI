import { useState, useMemo } from 'react';
import {
  LayoutDashboard,
  BarChart3,
  Star,
  LineChart,
  Brain,
  Bell,
  Briefcase,
  Calculator,
  History,
  Settings,
  Search,
  Sun,
  Moon,
  Menu,
  X,
  Activity,
  GitCompare,
  BookOpen,
  Shield,
  Cpu,
  LogOut,
  ChevronDown,
} from 'lucide-react';
import { useApp } from '@/context/AppContext';
import type { PageId } from '@/types';
import { DemoBadge } from './Disclaimer';

const NAV_ITEMS: { id: PageId; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'markets', label: 'Markets', icon: BarChart3 },
  { id: 'watchlist', label: 'Watchlist', icon: Star },
  { id: 'analysis', label: 'Stock Analysis', icon: LineChart },
  { id: 'signals', label: 'AI Signals', icon: Brain },
  { id: 'alerts', label: 'Alerts', icon: Bell },
  { id: 'compare', label: 'Compare', icon: GitCompare },
  { id: 'portfolio', label: 'Portfolio', icon: Briefcase },
  { id: 'simulator', label: 'What-If Simulator', icon: Calculator },
  { id: 'backtesting', label: 'Backtesting', icon: History },
  { id: 'model', label: 'Model Evaluation', icon: Cpu },
  { id: 'learn', label: 'Learning Center', icon: BookOpen },
  { id: 'admin', label: 'Admin', icon: Shield },
  { id: 'settings', label: 'Profile & Settings', icon: Settings },
];

export function Layout({ children }: { children: React.ReactNode }) {
  const { theme, toggleTheme, currentPage, setCurrentPage, stocks, setSelectedTicker, notifications, dismissNotification, user, logout } = useApp();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return [];
    const q = searchQuery.toLowerCase();
    return stocks
      .filter((s) => s.ticker.toLowerCase().includes(q) || s.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [searchQuery, stocks]);

  const handleSelectStock = (ticker: string) => {
    setSelectedTicker(ticker);
    setCurrentPage('analysis');
    setSearchQuery('');
    setSearchOpen(false);
    setSidebarOpen(false);
  };

  const handleNav = (page: PageId) => {
    setCurrentPage(page);
    setSidebarOpen(false);
  };

  const initials = user ? user.fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() : '?';

  return (
    <div className="flex min-h-screen bg-ink-50 dark:bg-ink-950">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-64 transform border-r border-ink-200 bg-white transition-transform duration-200 dark:border-ink-800 dark:bg-ink-900 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0`}
      >
        <div className="flex h-16 items-center gap-2 border-b border-ink-200 px-5 dark:border-ink-800">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-600 text-white">
            <Activity className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-sm font-bold tracking-tight text-ink-900 dark:text-ink-100">StockSense</h1>
            <p className="text-[10px] font-medium uppercase tracking-wider text-brand-500">AI Intelligence</p>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3" style={{ maxHeight: 'calc(100vh - 16rem)' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = currentPage === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNav(item.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? 'bg-brand-50 text-brand-700 dark:bg-brand-950/40 dark:text-brand-300'
                    : 'text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${active ? 'text-brand-600 dark:text-brand-400' : ''}`} style={{ width: 18, height: 18 }} />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="border-t border-ink-200 p-4 dark:border-ink-800">
          <div className="rounded-lg bg-gradient-to-br from-brand-600 to-brand-800 p-4 text-white">
            <p className="text-xs font-semibold leading-relaxed">
              Don't just predict the price — explain the risk.
            </p>
            <p className="mt-2 text-[10px] text-brand-200">StockSense AI USP</p>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content */}
      <div className="flex flex-1 flex-col lg:ml-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-ink-200 bg-white/80 px-4 backdrop-blur-md dark:border-ink-800 dark:bg-ink-900/80">
          <button
            onClick={() => setSidebarOpen(true)}
            className="btn-ghost p-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setSearchOpen(true);
                }}
                onFocus={() => setSearchOpen(true)}
                onBlur={() => setTimeout(() => setSearchOpen(false), 200)}
                placeholder="Search stocks by name or ticker..."
                className="input pl-9"
              />
            </div>
            {searchOpen && searchResults.length > 0 && (
              <div className="absolute mt-1 w-full overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card-lg dark:border-ink-700 dark:bg-ink-900">
                {searchResults.map((s) => (
                  <button
                    key={s.ticker}
                    onClick={() => handleSelectStock(s.ticker)}
                    className="flex w-full items-center justify-between px-3 py-2.5 text-left hover:bg-ink-50 dark:hover:bg-ink-800"
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{s.ticker}</p>
                      <p className="text-xs text-ink-500">{s.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium tabular-nums">৳{s.currentPrice.toFixed(2)}</p>
                      <p className={`text-xs ${s.dailyChange >= 0 ? 'text-bull' : 'text-bear'}`}>
                        {s.dailyChange >= 0 ? '+' : ''}{s.dailyChangePct.toFixed(2)}%
                      </p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto flex items-center gap-2">
            <DemoBadge />

            {/* Notifications */}
            <div className="relative">
              <button
                onClick={() => setNotifOpen((o) => !o)}
                className="btn-ghost relative p-2"
                aria-label="Notifications"
              >
                <Bell className="h-5 w-5" />
                {notifications.length > 0 && (
                  <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-bear-500" />
                )}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-80 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card-lg dark:border-ink-700 dark:bg-ink-900">
                    <div className="border-b border-ink-200 px-4 py-3 dark:border-ink-800">
                      <p className="text-sm font-semibold">Notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.length === 0 ? (
                        <p className="px-4 py-6 text-center text-sm text-ink-500">No notifications</p>
                      ) : (
                        notifications.map((n) => (
                          <div key={n.id} className="border-b border-ink-100 px-4 py-3 last:border-0 dark:border-ink-800">
                            <div className="flex items-start justify-between gap-2">
                              <div className="min-w-0">
                                <p className="text-sm font-medium text-ink-900 dark:text-ink-100">{n.title}</p>
                                <p className="mt-0.5 text-xs text-ink-500">{n.body}</p>
                                <p className="mt-1 text-[10px] text-ink-400">{n.time}</p>
                              </div>
                              <button
                                onClick={() => dismissNotification(n.id)}
                                className="text-ink-400 hover:text-ink-600"
                              >
                                <X className="h-3.5 w-3.5" />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Theme toggle */}
            <button onClick={toggleTheme} className="btn-ghost p-2" aria-label="Toggle theme">
              {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>

            {/* User profile */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen((o) => !o)}
                className="flex items-center gap-2 rounded-lg px-2 py-1.5 hover:bg-ink-100 dark:hover:bg-ink-800"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-xs font-bold text-white">
                  {initials}
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-ink-400" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 z-20 mt-2 w-56 overflow-hidden rounded-lg border border-ink-200 bg-white shadow-card-lg dark:border-ink-700 dark:bg-ink-900">
                    <div className="border-b border-ink-200 px-4 py-3 dark:border-ink-800">
                      <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{user?.fullName ?? 'Guest'}</p>
                      <p className="text-xs text-ink-500">{user?.email ?? ''}</p>
                    </div>
                    <div className="p-2">
                      <button
                        onClick={() => { handleNav('settings'); setProfileOpen(false); }}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-ink-600 hover:bg-ink-100 dark:text-ink-400 dark:hover:bg-ink-800"
                      >
                        <Settings className="h-4 w-4" /> Profile & Settings
                      </button>
                      <button
                        onClick={logout}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-bear-600 hover:bg-bear-500/10 dark:text-bear-400"
                      >
                        <LogOut className="h-4 w-4" /> Log Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
