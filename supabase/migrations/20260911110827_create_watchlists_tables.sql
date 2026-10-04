/*
# Create watchlists and watchlist_stocks tables

User watchlists for tracking stocks. Each user can have multiple watchlists,
each watchlist can contain multiple stocks.
*/

CREATE TABLE IF NOT EXISTS watchlists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL DEFAULT auth.uid() REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL DEFAULT 'My Watchlist',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE watchlists ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_watchlists" ON watchlists;
CREATE POLICY "select_own_watchlists" ON watchlists FOR SELECT
  TO authenticated USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "insert_own_watchlists" ON watchlists;
CREATE POLICY "insert_own_watchlists" ON watchlists FOR INSERT
  TO authenticated WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "update_own_watchlists" ON watchlists;
CREATE POLICY "update_own_watchlists" ON watchlists FOR UPDATE
  TO authenticated USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "delete_own_watchlists" ON watchlists;
CREATE POLICY "delete_own_watchlists" ON watchlists FOR DELETE
  TO authenticated USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS watchlist_stocks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  watchlist_id uuid NOT NULL REFERENCES watchlists(id) ON DELETE CASCADE,
  ticker text NOT NULL,
  added_at timestamptz DEFAULT now()
);

ALTER TABLE watchlist_stocks ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "select_own_watchlist_stocks" ON watchlist_stocks;
CREATE POLICY "select_own_watchlist_stocks" ON watchlist_stocks FOR SELECT
  TO authenticated USING (
    EXISTS (SELECT 1 FROM watchlists WHERE watchlists.id = watchlist_stocks.watchlist_id AND watchlists.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "insert_own_watchlist_stocks" ON watchlist_stocks;
CREATE POLICY "insert_own_watchlist_stocks" ON watchlist_stocks FOR INSERT
  TO authenticated WITH CHECK (
    EXISTS (SELECT 1 FROM watchlists WHERE watchlists.id = watchlist_stocks.watchlist_id AND watchlists.user_id = auth.uid())
  );

DROP POLICY IF EXISTS "delete_own_watchlist_stocks" ON watchlist_stocks;
CREATE POLICY "delete_own_watchlist_stocks" ON watchlist_stocks FOR DELETE
  TO authenticated USING (
    EXISTS (SELECT 1 FROM watchlists WHERE watchlists.id = watchlist_stocks.watchlist_id AND watchlists.user_id = auth.uid())
  );

CREATE INDEX IF NOT EXISTS idx_watchlist_stocks_watchlist_id ON watchlist_stocks(watchlist_id);
CREATE INDEX IF NOT EXISTS idx_watchlists_user_id ON watchlists(user_id);