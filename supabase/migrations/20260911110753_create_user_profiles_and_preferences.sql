/*
# Create user profiles, preferences, watchlists, and related tables

This migration creates the core database schema for StockSense AI user data persistence.

## New Tables

1. `profiles` — Extended user profile information linked to auth.users
   - `id` (uuid, PK, references auth.users)
   - `full_name` (text)
   - `username` (text, unique)
   - `avatar_url` (text)
   - `preferred_market` (text, default 'DSE (Bangladesh)')
   - `preferred_currency` (text, default 'BDT')
   - `experience_level` (text: Beginner/Intermediate/Advanced)
   - `trading_style` (text: Long-term/Swing/Short-term/Day trading)
   - `risk_tolerance` (text: Conservative/Moderate/Aggressive)
   - `investment_horizon` (text: Short term/Medium term/Long term)
   - `email_notifications` (boolean, default true)
   - `browser_notifications` (boolean, default true)
   - `alert_frequency` (text: Instant/Hourly/Daily)
   - `is_admin` (boolean, default false)
   - `created_at`, `updated_at` (timestamps)

2. `watchlists` — User watchlists
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to auth.users, default auth.uid())
   - `name` (text, default 'My Watchlist')
   - `created_at` (timestamp)

3. `watchlist_stocks` — Stocks within a watchlist
   - `id` (uuid, PK)
   - `watchlist_id` (uuid, FK to watchlists, cascade delete)
   - `ticker` (text, not null)
   - `added_at` (timestamp)

4. `user_alerts` — User-created stock alerts
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to auth.users, default auth.uid())
   - `ticker` (text, not null)
   - `type` (text: price_above/price_below/daily_change/volume_spike/buy_signal/risk_high/news_major/forecast_change)
   - `label` (text)
   - `threshold` (numeric, nullable)
   - `active` (boolean, default true)
   - `triggered` (boolean, default false)
   - `triggered_at` (timestamp, nullable)
   - `message` (text)
   - `created_at` (timestamp)

5. `chat_history` — AI chat assistant conversation history
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to auth.users, default auth.uid())
   - `role` (text: user/assistant)
   - `content` (text)
   - `created_at` (timestamp)

6. `notifications` — In-app notifications
   - `id` (uuid, PK)
   - `user_id` (uuid, FK to auth.users, default auth.uid())
   - `title` (text)
   - `body` (text)
   - `read` (boolean, default false)
   - `created_at` (timestamp)

## Security
- RLS enabled on ALL tables
- Owner-scoped CRUD policies on all user tables (auth.uid() = user_id)
- profiles table: users can read/update only their own profile row
- watchlist_stocks: scoped through parent watchlist ownership
- All policies use auth.uid() for ownership checks
*/