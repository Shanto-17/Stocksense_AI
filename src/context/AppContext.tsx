import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import type { Stock, AlertRule, InvestorProfile, PortfolioHolding, Theme, PageId, User, ChatMessage, AuthView } from '@/types';
import { generateStocks } from '@/lib/mockData';
import { supabase, fetchProfile, upsertProfile, fetchWatchlistStocks, saveWatchlistStocks, type ProfileRow } from '@/lib/supabase';

interface AppState {
  stocks: Stock[];
  theme: Theme;
  toggleTheme: () => void;
  currentPage: PageId;
  setCurrentPage: (p: PageId) => void;
  selectedTicker: string | null;
  setSelectedTicker: (t: string) => void;
  watchlist: string[];
  toggleWatchlist: (ticker: string) => void;
  alerts: AlertRule[];
  addAlert: (a: Omit<AlertRule, 'id' | 'createdAt' | 'triggered' | 'active'>) => void;
  removeAlert: (id: string) => void;
  toggleAlert: (id: string) => void;
  portfolio: PortfolioHolding[];
  addHolding: (h: PortfolioHolding) => void;
  removeHolding: (ticker: string) => void;
  profile: InvestorProfile;
  setProfile: (p: InvestorProfile) => void;
  notifications: { id: string; title: string; body: string; time: string }[];
  pushNotification: (n: { title: string; body: string }) => void;
  dismissNotification: (id: string) => void;
  // Auth
  authView: AuthView;
  setAuthView: (v: AuthView) => void;
  user: User | null;
  login: (email: string, provider?: 'email' | 'google' | 'facebook' | 'linkedin') => void;
  signup: (email: string, fullName: string) => void;
  logout: () => void;
  // Onboarding
  onboardingStep: number;
  setOnboardingStep: (s: number) => void;
  completeOnboarding: (p: Partial<InvestorProfile>) => void;
  // Chat
  chatMessages: ChatMessage[];
  sendChatMessage: (content: string) => void;
  clearChat: () => void;
  // Compare
  compareTickers: string[];
  setCompareTickers: (t: string[]) => void;
}

const AppContext = createContext<AppState | null>(null);

const DEFAULT_PORTFOLIO: PortfolioHolding[] = [
  { ticker: 'BEXIMCO', shares: 200, avgCost: 128.5 },
  { ticker: 'WALTONHIL', shares: 50, avgCost: 510.0 },
  { ticker: 'GP', shares: 100, avgCost: 275.0 },
  { ticker: 'SQURPHARMA', shares: 150, avgCost: 195.0 },
  { ticker: 'BRACBANK', shares: 500, avgCost: 32.0 },
];

const DEFAULT_PROFILE: InvestorProfile = {
  riskTolerance: 'Moderate',
  horizon: 'Medium term',
  preferredSectors: ['Pharmaceuticals', 'Telecom', 'Bank'],
  experienceLevel: 'Intermediate',
  tradingStyle: 'Swing',
  preferredMarket: 'DSE (Bangladesh)',
  preferredCurrency: 'BDT (৳)',
  emailNotifications: true,
  browserNotifications: true,
  alertFrequency: 'Instant',
};

function generateChatResponse(content: string, stocks: Stock[]): string {
  const lower = content.toLowerCase();

  if (lower.includes('rsi')) {
    return 'RSI (Relative Strength Index) measures the speed and change of price movements on a scale of 0-100. Values above 70 suggest a stock may be overbought (potential pullback), while values below 30 suggest it may be oversold (potential bounce). RSI is one of several indicators StockSense AI uses — it should not be used alone for investment decisions.';
  }
  if (lower.includes('macd')) {
    return 'MACD (Moving Average Convergence Divergence) shows the relationship between two moving averages of a stock price. When the MACD line crosses above the signal line, it can indicate bullish momentum. When it crosses below, it may signal bearish momentum. StockSense AI uses MACD alongside other indicators for its composite signal.';
  }
  if (lower.includes('watchlist')) {
    return 'Your watchlist contains the stocks you are actively tracking. You can add or remove stocks from the Watchlist page or by tapping the star icon on any stock card. Your watchlist stocks are prioritized in dashboard alerts and AI signal monitoring.';
  }
  if (lower.includes('momentum') || lower.includes('strong')) {
    const buyStocks = stocks.filter((s) => s.aiScore.signal === 'BUY').sort((a, b) => b.aiScore.total - a.aiScore.total).slice(0, 3);
    if (buyStocks.length > 0) {
      return `Stocks with strong momentum right now:\n\n${buyStocks.map((s, i) => `${i + 1}. ${s.ticker} — AI Score ${s.aiScore.total}/100, Signal: ${s.aiScore.signal}`).join('\n')}\n\nThese are based on the AI composite score combining technical, fundamental, and sentiment factors. Remember, these are estimates, not guarantees.`;
    }
    return 'No stocks currently show strong positive momentum signals.';
  }
  if (lower.includes('market') && (lower.includes('today') || lower.includes('movement') || lower.includes('move'))) {
    const gainers = stocks.filter((s) => s.dailyChange > 0).length;
    const losers = stocks.filter((s) => s.dailyChange < 0).length;
    const avgChange = stocks.reduce((a, s) => a + s.dailyChangePct, 0) / stocks.length;
    return `Today's market overview (DEMO DATA):\n\n• Advancers: ${gainers} stocks\n• Decliners: ${losers} stocks\n• Average change: ${avgChange >= 0 ? '+' : ''}${avgChange.toFixed(2)}%\n\nThe market is currently ${avgChange >= 0 ? 'trending positive' : 'trending negative'} based on the broad sample of DSE-listed stocks. This is simulated data for demonstration purposes.`;
  }
  if (lower.includes('risk')) {
    return 'Risk in StockSense AI is assessed using volatility, debt-to-equity ratios, and market exposure. Each stock receives a risk level (LOW, MEDIUM, or HIGH). The AI score weights risk at 10% of the total score. Remember: "Don\'t just predict the price — explain the risk."';
  }
  if (lower.includes('hello') || lower.includes('hi') || lower.includes('hey')) {
    return 'Hello! I\'m the StockSense AI assistant. I can help you understand market movements, explain technical indicators, analyze stocks, and interpret AI signals. What would you like to know?';
  }

  // Try to find a stock mentioned
  const mentionedStock = stocks.find((s) =>
    lower.includes(s.ticker.toLowerCase()) || lower.includes(s.name.toLowerCase().split(' ')[0])
  );
  if (mentionedStock) {
    return `${mentionedStock.ticker} (${mentionedStock.name}) analysis:\n\n• Current Price: ৳${mentionedStock.currentPrice.toFixed(2)}\n• Daily Change: ${mentionedStock.dailyChange >= 0 ? '+' : ''}${mentionedStock.dailyChangePct.toFixed(2)}%\n• AI Score: ${mentionedStock.aiScore.total}/100\n• Signal: ${mentionedStock.aiScore.signal}\n• Confidence: ${mentionedStock.aiScore.confidence}%\n• RSI: ${mentionedStock.technicals.rsi.toFixed(1)}\n\nKey reasons: ${mentionedStock.aiScore.reasons.slice(0, 2).join('; ')}.\n\nRemember, this is DEMO DATA and predictions are estimates, not guarantees.`;
  }

  return 'I can help you understand stock movements, explain technical indicators like RSI or MACD, analyze specific stocks, or discuss market trends. Try asking "Which stocks have strong momentum?" or "What does RSI mean?"';
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [stocks] = useState<Stock[]>(() => generateStocks());
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('ss-theme');
      if (stored === 'dark' || stored === 'light') return stored;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'dark';
  });
  const [currentPage, setCurrentPage] = useState<PageId>('dashboard');
  const [selectedTicker, setSelectedTicker] = useState<string | null>(null);
  const [watchlist, setWatchlist] = useState<string[]>(['BEXIMCO', 'ROBI', 'WALTONHIL', 'BRACBANK']);
  const [alerts, setAlerts] = useState<AlertRule[]>([
    {
      id: 'alert-1',
      ticker: 'BEXIMCO',
      type: 'price_above',
      label: 'Price rises above ৳150',
      threshold: 150,
      active: true,
      triggered: false,
      createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
      message: 'BEXIMCO price has crossed above ৳150',
    },
    {
      id: 'alert-2',
      ticker: 'OLYMPIC',
      type: 'risk_high',
      label: 'AI risk score becomes HIGH',
      active: true,
      triggered: true,
      createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
      triggeredAt: new Date(Date.now() - 3600000 * 6).toISOString(),
      message: 'OLYMPIC AI risk score elevated to HIGH',
    },
    {
      id: 'alert-3',
      ticker: 'ROBI',
      type: 'buy_signal',
      label: 'Strong BUY signal appears',
      active: true,
      triggered: true,
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      triggeredAt: new Date(Date.now() - 3600000 * 12).toISOString(),
      message: 'ROBI generated a strong BUY signal',
    },
  ]);
  const [portfolio, setPortfolio] = useState<PortfolioHolding[]>(DEFAULT_PORTFOLIO);
  const [profile, setProfile] = useState<InvestorProfile>(DEFAULT_PROFILE);
  const [notifications, setNotifications] = useState<{ id: string; title: string; body: string; time: string }[]>([
    { id: 'n1', title: 'BUY Signal: ROBI', body: 'Robi Axiata generated a strong BUY signal with 78% confidence', time: '12h ago' },
    { id: 'n2', title: 'Risk Alert: OLYMPIC', body: 'Olympic Industries AI risk score elevated to HIGH', time: '6h ago' },
  ]);

  // Auth state
  const [authView, setAuthView] = useState<AuthView>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage.getItem('ss-auth') === 'true' ? 'app' : 'landing';
    }
    return 'landing';
  });
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const stored = window.localStorage.getItem('ss-user');
      if (stored) return JSON.parse(stored);
    }
    return null;
  });
  const [onboardingStep, setOnboardingStep] = useState(0);

  // Chat state
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: 'chat-0', role: 'assistant', content: 'Hi! I\'m the StockSense AI assistant. Ask me about stocks, technical indicators, or market trends.', time: 'now' },
  ]);

  // Compare state
  const [compareTickers, setCompareTickers] = useState<string[]>([]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    if (window.localStorage) window.localStorage.setItem('ss-theme', theme);
  }, [theme]);

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);

  const toggleWatchlist = useCallback((ticker: string) => {
    setWatchlist((wl) => (wl.includes(ticker) ? wl.filter((t) => t !== ticker) : [...wl, ticker]));
  }, []);

  const addAlert = useCallback((a: Omit<AlertRule, 'id' | 'createdAt' | 'triggered' | 'active'>) => {
    setAlerts((prev) => [
      { ...a, id: `alert-${Date.now()}`, createdAt: new Date().toISOString(), triggered: false, active: true },
      ...prev,
    ]);
  }, []);

  const removeAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.filter((a) => a.id !== id));
  }, []);

  const toggleAlert = useCallback((id: string) => {
    setAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, active: !a.active } : a)));
  }, []);

  const addHolding = useCallback((h: PortfolioHolding) => {
    setPortfolio((prev) => {
      const existing = prev.find((p) => p.ticker === h.ticker);
      if (existing) {
        const totalShares = existing.shares + h.shares;
        const totalCost = existing.shares * existing.avgCost + h.shares * h.avgCost;
        return prev.map((p) => (p.ticker === h.ticker ? { ...p, shares: totalShares, avgCost: totalCost / totalShares } : p));
      }
      return [...prev, h];
    });
  }, []);

  const removeHolding = useCallback((ticker: string) => {
    setPortfolio((prev) => prev.filter((p) => p.ticker !== ticker));
  }, []);

  const pushNotification = useCallback((n: { title: string; body: string }) => {
    const id = `n-${Date.now()}`;
    setNotifications((prev) => [{ id, title: n.title, body: n.body, time: 'just now' }, ...prev].slice(0, 20));
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification(n.title, { body: n.body });
    }
  }, []);

  const dismissNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Sync profile from Supabase to local state
  const syncProfileFromDb = useCallback((dbProfile: ProfileRow) => {
    const mapped: InvestorProfile = {
      riskTolerance: (dbProfile.risk_tolerance as InvestorProfile['riskTolerance']) ?? 'Moderate',
      horizon: (dbProfile.investment_horizon as InvestorProfile['horizon']) ?? 'Medium term',
      preferredSectors: profile.preferredSectors,
      experienceLevel: (dbProfile.experience_level as InvestorProfile['experienceLevel']) ?? 'Intermediate',
      tradingStyle: (dbProfile.trading_style as InvestorProfile['tradingStyle']) ?? 'Swing',
      preferredMarket: dbProfile.preferred_market ?? 'DSE (Bangladesh)',
      preferredCurrency: dbProfile.preferred_currency ?? 'BDT (৳)',
      emailNotifications: dbProfile.email_notifications,
      browserNotifications: dbProfile.browser_notifications,
      alertFrequency: (dbProfile.alert_frequency as InvestorProfile['alertFrequency']) ?? 'Instant',
    };
    setProfile(mapped);
  }, [profile.preferredSectors]);

  // Load profile and watchlist from Supabase on mount / session restore
  useEffect(() => {
    (async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      const dbProfile = await fetchProfile(session.user.id);
      if (dbProfile) {
        syncProfileFromDb(dbProfile);
        const wl = await fetchWatchlistStocks(session.user.id);
        if (wl.length > 0) setWatchlist(wl);
      } else {
        await upsertProfile(session.user.id, session.user.email ?? '', {});
      }
      const appUser: User = {
        id: session.user.id,
        email: session.user.email ?? '',
        fullName: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
        username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? 'user',
        avatar: session.user.user_metadata?.avatar_url ?? '',
        provider: (session.user.app_metadata?.provider as User['provider']) ?? 'email',
        isAdmin: dbProfile?.is_admin ?? false,
      };
      setUser(appUser);
      if (window.localStorage) {
        window.localStorage.setItem('ss-user', JSON.stringify(appUser));
        window.localStorage.setItem('ss-auth', 'true');
      }
      setAuthView('app');
    }
    })();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for auth state changes
  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
      if (event === 'SIGNED_OUT' || !session) {
        setUser(null);
        setAuthView('landing');
        if (window.localStorage) {
          window.localStorage.removeItem('ss-user');
          window.localStorage.removeItem('ss-auth');
        }
        return;
      }
      if (event === 'SIGNED_IN' && session.user) {
        const dbProfile = await fetchProfile(session.user.id);
        if (dbProfile) {
          syncProfileFromDb(dbProfile);
          const wl = await fetchWatchlistStocks(session.user.id);
          if (wl.length > 0) setWatchlist(wl);
        } else {
          await upsertProfile(session.user.id, session.user.email ?? '', {});
        }
        const appUser: User = {
          id: session.user.id,
          email: session.user.email ?? '',
          fullName: session.user.user_metadata?.full_name ?? session.user.email?.split('@')[0] ?? 'User',
          username: session.user.user_metadata?.username ?? session.user.email?.split('@')[0] ?? 'user',
          avatar: session.user.user_metadata?.avatar_url ?? '',
          provider: (session.user.app_metadata?.provider as User['provider']) ?? 'email',
          isAdmin: dbProfile?.is_admin ?? false,
        };
        setUser(appUser);
        if (window.localStorage) {
          window.localStorage.setItem('ss-user', JSON.stringify(appUser));
          window.localStorage.setItem('ss-auth', 'true');
        }
        setAuthView('app');
      }
      })();
    });
    return () => subscription.unsubscribe();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Auth methods
  const login = useCallback(async (email: string, provider: 'email' | 'google' | 'facebook' | 'linkedin' = 'email') => {
    if (provider === 'email') {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password: 'demo-password-123',
      });
      if (error) {
        const { error: signUpError, data } = await supabase.auth.signUp({
          email,
          password: 'demo-password-123',
        });
        if (signUpError) {
          const newUser: User = {
            id: `user-${Date.now()}`,
            email,
            fullName: email.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
            username: email.split('@')[0],
            avatar: '',
            provider,
            isAdmin: email.includes('admin'),
          };
          setUser(newUser);
          if (window.localStorage) {
            window.localStorage.setItem('ss-user', JSON.stringify(newUser));
            window.localStorage.setItem('ss-auth', 'true');
          }
          setAuthView('app');
          return;
        }
        if (data.user) {
          await upsertProfile(data.user.id, email, {});
        }
      }
      return;
    }
    const { error } = await supabase.auth.signInWithOAuth({
      provider: provider as 'google' | 'facebook' | 'linkedin',
      options: { redirectTo: window.location.origin },
    });
    if (error) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: `user@${provider}.com`,
        fullName: `${provider} User`,
        username: `${provider}_user`,
        avatar: '',
        provider,
        isAdmin: false,
      };
      setUser(newUser);
      if (window.localStorage) {
        window.localStorage.setItem('ss-user', JSON.stringify(newUser));
        window.localStorage.setItem('ss-auth', 'true');
      }
      setAuthView('app');
    }
  }, []);

  const signup = useCallback(async (email: string, fullName: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password: 'demo-password-123',
      options: { data: { full_name: fullName } },
    });
    if (error || !data.user) {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email,
        fullName,
        username: fullName.toLowerCase().replace(/\s+/g, '_'),
        avatar: '',
        provider: 'email',
        isAdmin: false,
      };
      setUser(newUser);
      if (window.localStorage) {
        window.localStorage.setItem('ss-user', JSON.stringify(newUser));
        window.localStorage.setItem('ss-auth', 'true');
      }
      setAuthView('onboarding');
      return;
    }
    await upsertProfile(data.user.id, email, { full_name: fullName, username: fullName.toLowerCase().replace(/\s+/g, '_') });
    const newUser: User = {
      id: data.user.id,
      email,
      fullName,
      username: fullName.toLowerCase().replace(/\s+/g, '_'),
      avatar: '',
      provider: 'email',
      isAdmin: false,
    };
    setUser(newUser);
    if (window.localStorage) {
      window.localStorage.setItem('ss-user', JSON.stringify(newUser));
      window.localStorage.setItem('ss-auth', 'true');
    }
    setAuthView('onboarding');
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setUser(null);
    setAuthView('landing');
    if (window.localStorage) {
      window.localStorage.removeItem('ss-user');
      window.localStorage.removeItem('ss-auth');
    }
  }, []);

  const completeOnboarding = useCallback(async (p: Partial<InvestorProfile>) => {
    setProfile((prev) => ({ ...prev, ...p }));
    if (user) {
      await upsertProfile(user.id, user.email, {
        risk_tolerance: p.riskTolerance,
        investment_horizon: p.horizon,
        experience_level: p.experienceLevel,
        trading_style: p.tradingStyle,
        preferred_market: p.preferredMarket,
        preferred_currency: p.preferredCurrency,
        email_notifications: p.emailNotifications,
        browser_notifications: p.browserNotifications,
        alert_frequency: p.alertFrequency,
      });
    }
    setAuthView('app');
  }, [user]);

  const sendChatMessage = useCallback((content: string) => {
    const userMsg: ChatMessage = {
      id: `chat-${Date.now()}`,
      role: 'user',
      content,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setChatMessages((prev) => [...prev, userMsg]);

    setTimeout(() => {
      const response = generateChatResponse(content, stocks);
      const assistantMsg: ChatMessage = {
        id: `chat-${Date.now() + 1}`,
        role: 'assistant',
        content: response,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setChatMessages((prev) => [...prev, assistantMsg]);
    }, 500);
  }, [stocks]);

  const clearChat = useCallback(() => {
    setChatMessages([{ id: 'chat-0', role: 'assistant', content: 'Hi! I\'m the StockSense AI assistant. Ask me about stocks, technical indicators, or market trends.', time: 'now' }]);
  }, []);

  return (
    <AppContext.Provider
      value={{
        stocks,
        theme,
        toggleTheme,
        currentPage,
        setCurrentPage,
        selectedTicker,
        setSelectedTicker,
        watchlist,
        toggleWatchlist,
        alerts,
        addAlert,
        removeAlert,
        toggleAlert,
        portfolio,
        addHolding,
        removeHolding,
        profile,
        setProfile,
        notifications,
        pushNotification,
        dismissNotification,
        authView,
        setAuthView,
        user,
        login,
        signup,
        logout,
        onboardingStep,
        setOnboardingStep,
        completeOnboarding,
        chatMessages,
        sendChatMessage,
        clearChat,
        compareTickers,
        setCompareTickers,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
