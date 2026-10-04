import { useState, useEffect } from 'react';
import { User, Shield, Clock, Layers, Check, Bell, Moon, Sun, Mail, Globe, DollarSign, Brain, Lock, Link2 } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { SECTORS } from '@/lib/mockData';
import { Disclaimer } from '@/components/Disclaimer';
import { supabase, upsertProfile } from '@/lib/supabase';
import type { RiskTolerance, InvestmentHorizon, ExperienceLevel, TradingStyle } from '@/types';

export function Settings() {
  const { profile, setProfile, theme, toggleTheme, user } = useApp();
  const [fullName, setFullName] = useState(user?.fullName ?? '');
  const [username, setUsername] = useState(user?.username ?? '');
  const [email] = useState(user?.email ?? '');
  const [riskTolerance, setRiskTolerance] = useState<RiskTolerance>(profile.riskTolerance);
  const [horizon, setHorizon] = useState<InvestmentHorizon>(profile.horizon);
  const [sectors, setSectors] = useState<string[]>(profile.preferredSectors);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel>(profile.experienceLevel);
  const [tradingStyle, setTradingStyle] = useState<TradingStyle>(profile.tradingStyle);
  const [preferredMarket, setPreferredMarket] = useState(profile.preferredMarket);
  const [preferredCurrency, setPreferredCurrency] = useState(profile.preferredCurrency);
  const [emailNotif, setEmailNotif] = useState(profile.emailNotifications);
  const [browserNotif, setBrowserNotif] = useState(profile.browserNotifications);
  const [alertFrequency, setAlertFrequency] = useState(profile.alertFrequency);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setFullName(user?.fullName ?? '');
    setUsername(user?.username ?? '');
  }, [user]);

  const toggleSector = (sector: string) => {
    setSectors((prev) => (prev.includes(sector) ? prev.filter((s) => s !== sector) : [...prev, sector]));
  };

  const handleSave = async () => {
    setSaving(true);
    const updatedProfile = {
      ...profile,
      riskTolerance,
      horizon,
      preferredSectors: sectors,
      experienceLevel,
      tradingStyle,
      preferredMarket,
      preferredCurrency,
      emailNotifications: emailNotif,
      browserNotifications: browserNotif,
      alertFrequency,
    };
    setProfile(updatedProfile);

    if (user) {
      await upsertProfile(user.id, user.email, {
        full_name: fullName,
        username,
        risk_tolerance: riskTolerance,
        investment_horizon: horizon,
        experience_level: experienceLevel,
        trading_style: tradingStyle,
        preferred_market: preferredMarket,
        preferred_currency: preferredCurrency,
        email_notifications: emailNotif,
        browser_notifications: browserNotif,
        alert_frequency: alertFrequency,
      });
    }

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const riskOptions: { value: RiskTolerance; desc: string }[] = [
    { value: 'Conservative', desc: 'Prioritize capital preservation. Lower risk tolerance, prefers stable stocks.' },
    { value: 'Moderate', desc: 'Balanced approach. Accepts moderate volatility for reasonable growth potential.' },
    { value: 'Aggressive', desc: 'Maximize returns. Comfortable with high volatility and higher risk stocks.' },
  ];

  const horizonOptions: { value: InvestmentHorizon; desc: string }[] = [
    { value: 'Short term', desc: 'Less than 1 year. Focused on near-term price movements.' },
    { value: 'Medium term', desc: '1 to 3 years. Balanced between growth and stability.' },
    { value: 'Long term', desc: 'More than 3 years. Focused on fundamental value and compounding.' },
  ];

  const experienceOptions: { value: ExperienceLevel; desc: string }[] = [
    { value: 'Beginner', desc: 'New to investing — show simpler explanations and educational content.' },
    { value: 'Intermediate', desc: 'Some experience with stock analysis and market concepts.' },
    { value: 'Advanced', desc: 'Experienced — show detailed technical indicators and model statistics.' },
  ];

  const styleOptions: { value: TradingStyle; desc: string }[] = [
    { value: 'Long-term', desc: 'Buy and hold for years. Focus on fundamentals.' },
    { value: 'Swing', desc: 'Hold for days to weeks. Capture medium-term trends.' },
    { value: 'Short-term', desc: 'Hold for hours to days. Quick trades.' },
    { value: 'Day trading', desc: 'Buy and sell within the same day.' },
  ];

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-ink-900 dark:text-ink-100">Profile & Settings</h1>
        <p className="mt-1 text-sm text-ink-500">Manage your account, preferences, and notification settings</p>
      </div>

      {/* Personal Information */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <User className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Personal Information</h2>
        </div>
        <div className="flex items-start gap-4">
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-brand-600 text-xl font-bold text-white">
            {fullName.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase() || '?'}
          </div>
          <div className="grid flex-1 gap-3 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Full Name</label>
              <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} className="input" placeholder="Your name" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Username</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="input" placeholder="username" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Email</label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
                <input type="email" value={email} disabled className="input pl-9 opacity-60" />
              </div>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-500">Auth Provider</label>
              <div className="input flex items-center gap-2 capitalize">
                <Link2 className="h-4 w-4 text-ink-400" />
                {user?.provider ?? 'email'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Experience & Trading Style */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Brain className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Experience & Trading Style</h2>
        </div>
        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-xs font-medium text-ink-500">Experience Level</label>
            <div className="grid gap-2 sm:grid-cols-3">
              {experienceOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setExperienceLevel(opt.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${experienceLevel === opt.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20' : 'border-ink-200 hover:border-ink-300 dark:border-ink-700'}`}
                >
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{opt.value}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="mb-2 block text-xs font-medium text-ink-500">Trading Style</label>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
              {styleOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setTradingStyle(opt.value)}
                  className={`rounded-lg border p-3 text-left transition-colors ${tradingStyle === opt.value ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20' : 'border-ink-200 hover:border-ink-300 dark:border-ink-700'}`}
                >
                  <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{opt.value}</p>
                  <p className="mt-0.5 text-xs text-ink-500">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market & Currency Preferences */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Globe className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Market & Currency</h2>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Preferred Market</label>
            <select value={preferredMarket} onChange={(e) => setPreferredMarket(e.target.value)} className="input">
              <option value="DSE (Bangladesh)">DSE (Bangladesh)</option>
              <option value="NSE (India)">NSE (India)</option>
              <option value="NYSE (USA)">NYSE (USA)</option>
              <option value="NASDAQ (USA)">NASDAQ (USA)</option>
              <option value="LSE (UK)">LSE (UK)</option>
            </select>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Preferred Currency</label>
            <select value={preferredCurrency} onChange={(e) => setPreferredCurrency(e.target.value)} className="input">
              <option value="BDT (৳)">BDT — Bangladeshi Taka (৳)</option>
              <option value="USD ($)">USD — US Dollar ($)</option>
              <option value="EUR (€)">EUR — Euro (€)</option>
              <option value="GBP (£)">GBP — British Pound (£)</option>
              <option value="INR (₹)">INR — Indian Rupee (₹)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Risk Tolerance */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Shield className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Risk Tolerance</h2>
        </div>
        <div className="space-y-2">
          {riskOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setRiskTolerance(opt.value)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                riskTolerance === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                  : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600'
              }`}
            >
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                riskTolerance === opt.value ? 'border-brand-500 bg-brand-500' : 'border-ink-300 dark:border-ink-600'
              }`}>
                {riskTolerance === opt.value && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{opt.value}</p>
                <p className="text-xs text-ink-500">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Investment Horizon */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Clock className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Investment Horizon</h2>
        </div>
        <div className="space-y-2">
          {horizonOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setHorizon(opt.value)}
              className={`flex w-full items-start gap-3 rounded-lg border p-3 text-left transition-colors ${
                horizon === opt.value
                  ? 'border-brand-500 bg-brand-50 dark:bg-brand-950/20'
                  : 'border-ink-200 hover:border-ink-300 dark:border-ink-700 dark:hover:border-ink-600'
              }`}
            >
              <div className={`mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                horizon === opt.value ? 'border-brand-500 bg-brand-500' : 'border-ink-300 dark:border-ink-600'
              }`}>
                {horizon === opt.value && <Check className="h-3 w-3 text-white" />}
              </div>
              <div>
                <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">{opt.value}</p>
                <p className="text-xs text-ink-500">{opt.desc}</p>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Preferred Sectors */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Layers className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Preferred Sectors</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {SECTORS.map((sector) => (
            <button
              key={sector}
              onClick={() => toggleSector(sector)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                sectors.includes(sector)
                  ? 'bg-brand-600 text-white'
                  : 'bg-ink-100 text-ink-600 hover:bg-ink-200 dark:bg-ink-800 dark:text-ink-400 dark:hover:bg-ink-700'
              }`}
            >
              {sector}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-ink-500">
          Selected sectors will be prioritized when showing AI opportunities and recommendations.
        </p>
      </div>

      {/* Notification Settings */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Bell className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Notification Settings</h2>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3 dark:border-ink-700">
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">Email Notifications</p>
              <p className="text-xs text-ink-500">Receive alerts via email</p>
            </div>
            <button onClick={() => setEmailNotif(!emailNotif)} className={`relative h-6 w-11 rounded-full transition-colors ${emailNotif ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${emailNotif ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3 dark:border-ink-700">
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">Browser Notifications</p>
              <p className="text-xs text-ink-500">Get push notifications in your browser</p>
            </div>
            <button onClick={() => setBrowserNotif(!browserNotif)} className={`relative h-6 w-11 rounded-full transition-colors ${browserNotif ? 'bg-brand-500' : 'bg-ink-300 dark:bg-ink-700'}`}>
              <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${browserNotif ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </button>
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-ink-500">Alert Frequency</label>
            <select value={alertFrequency} onChange={(e) => setAlertFrequency(e.target.value as 'Instant' | 'Hourly' | 'Daily')} className="input">
              <option value="Instant">Instant (as they happen)</option>
              <option value="Hourly">Hourly digest</option>
              <option value="Daily">Daily summary</option>
            </select>
          </div>
        </div>
      </div>

      {/* Appearance */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Moon className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Appearance</h2>
        </div>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-ink-900 dark:text-ink-100">Theme</p>
            <p className="text-xs text-ink-500">Switch between dark and light mode</p>
          </div>
          <button onClick={toggleTheme} className="btn-outline">
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>
        </div>
      </div>

      {/* Security */}
      <div className="card p-5">
        <div className="mb-4 flex items-center gap-2">
          <Lock className="h-5 w-5 text-brand-500" />
          <h2 className="section-title">Security</h2>
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3 dark:border-ink-700">
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">Change Password</p>
              <p className="text-xs text-ink-500">Update your account password</p>
            </div>
            <button className="btn-outline text-sm" onClick={() => supabase.auth.resetPasswordForEmail(email)}>Reset Link</button>
          </div>
          <div className="flex items-center justify-between rounded-lg border border-ink-200 p-3 dark:border-ink-700">
            <div>
              <p className="text-sm font-semibold text-ink-900 dark:text-ink-100">Connected Accounts</p>
              <p className="text-xs text-ink-500">OAuth providers linked to your account</p>
            </div>
            <span className="badge bg-neutral-soft capitalize">{user?.provider ?? 'email'}</span>
          </div>
        </div>
      </div>

      {/* Save button */}
      <div className="flex items-center gap-3">
        <button onClick={handleSave} disabled={saving} className="btn-primary">
          <Check className="h-4 w-4" /> {saving ? 'Saving...' : 'Save Profile'}
        </button>
        {saved && (
          <span className="flex items-center gap-1.5 text-sm font-medium text-bull-500 animate-fade-in">
            <Check className="h-4 w-4" /> Profile saved successfully
          </span>
        )}
      </div>

      <Disclaimer />
    </div>
  );
}
