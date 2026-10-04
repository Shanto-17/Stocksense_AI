import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ProfileRow {
  id: string;
  full_name: string | null;
  username: string | null;
  avatar_url: string | null;
  preferred_market: string | null;
  preferred_currency: string | null;
  experience_level: string | null;
  trading_style: string | null;
  risk_tolerance: string | null;
  investment_horizon: string | null;
  email_notifications: boolean;
  browser_notifications: boolean;
  alert_frequency: string | null;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

export async function fetchProfile(userId: string): Promise<ProfileRow | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (error) {
    console.error('Failed to fetch profile:', error.message);
    return null;
  }
  return data as ProfileRow | null;
}

export async function upsertProfile(userId: string, email: string, partial: Partial<ProfileRow>): Promise<ProfileRow | null> {
  const row = {
    id: userId,
    full_name: partial.full_name ?? email.split('@')[0],
    username: partial.username ?? email.split('@')[0],
    avatar_url: partial.avatar_url ?? null,
    preferred_market: partial.preferred_market ?? 'DSE (Bangladesh)',
    preferred_currency: partial.preferred_currency ?? 'BDT (৳)',
    experience_level: partial.experience_level ?? 'Intermediate',
    trading_style: partial.trading_style ?? 'Swing',
    risk_tolerance: partial.risk_tolerance ?? 'Moderate',
    investment_horizon: partial.investment_horizon ?? 'Medium term',
    email_notifications: partial.email_notifications ?? true,
    browser_notifications: partial.browser_notifications ?? true,
    alert_frequency: partial.alert_frequency ?? 'Instant',
    is_admin: partial.is_admin ?? false,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('profiles')
    .upsert(row, { onConflict: 'id' })
    .select('*')
    .maybeSingle();

  if (error) {
    console.error('Failed to upsert profile:', error.message);
    return null;
  }
  return data as ProfileRow | null;
}

export async function fetchWatchlistStocks(userId: string): Promise<string[]> {
  const { data, error } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !data) return [];

  const { data: stocks, error: stockErr } = await supabase
    .from('watchlist_stocks')
    .select('ticker')
    .eq('watchlist_id', data.id);

  if (stockErr || !stocks) return [];
  return stocks.map((s) => s.ticker);
}

export async function saveWatchlistStocks(userId: string, tickers: string[]): Promise<void> {
  let { data: wl, error } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', userId)
    .maybeSingle();

  if (error || !wl) {
    const { data: newWl, error: insertErr } = await supabase
      .from('watchlists')
      .insert({ user_id: userId, name: 'My Watchlist' })
      .select('id')
      .maybeSingle();
    if (insertErr || !newWl) return;
    wl = newWl;
  }

  await supabase.from('watchlist_stocks').delete().eq('watchlist_id', wl.id);
  if (tickers.length > 0) {
    await supabase.from('watchlist_stocks').insert(tickers.map((t) => ({ watchlist_id: wl!.id, ticker: t })));
  }
}
