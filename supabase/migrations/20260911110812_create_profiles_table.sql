/*
# Create profiles table

User profile data linked to Supabase auth.users.
Each user has exactly one profile row (1:1 with auth.users).
*/

CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text,
  username text UNIQUE,
  avatar_url text,
  preferred_market text DEFAULT 'DSE (Bangladesh)',
  preferred_currency text DEFAULT 'BDT (৳)',
  experience_level text DEFAULT 'Intermediate',
  trading_style text DEFAULT 'Swing',
  risk_tolerance text DEFAULT 'Moderate',
  investment_horizon text DEFAULT 'Medium term',
  email_notifications boolean DEFAULT true,
  browser_notifications boolean DEFAULT true,
  alert_frequency text DEFAULT 'Instant',
  is_admin boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_profile" ON profiles;
CREATE POLICY "select_own_profile" ON profiles FOR SELECT
  TO authenticated USING (auth.uid() = id);

DROP POLICY IF EXISTS "insert_own_profile" ON profiles;
CREATE POLICY "insert_own_profile" ON profiles FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "update_own_profile" ON profiles;
CREATE POLICY "update_own_profile" ON profiles FOR UPDATE
  TO authenticated USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

DROP POLICY IF EXISTS "delete_own_profile" ON profiles;
CREATE POLICY "delete_own_profile" ON profiles FOR DELETE
  TO authenticated USING (auth.uid() = id);