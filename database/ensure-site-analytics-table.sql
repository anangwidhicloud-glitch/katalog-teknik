CREATE TABLE IF NOT EXISTS site_page_views (
  id BIGSERIAL PRIMARY KEY,
  path TEXT NOT NULL,
  session_id VARCHAR(80) NOT NULL,
  referrer VARCHAR(300),
  user_agent VARCHAR(500),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS site_page_views_created_at_idx
  ON site_page_views (created_at DESC);

CREATE INDEX IF NOT EXISTS site_page_views_session_id_idx
  ON site_page_views (session_id);

CREATE INDEX IF NOT EXISTS site_page_views_path_idx
  ON site_page_views (path);
