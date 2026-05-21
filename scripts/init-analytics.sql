CREATE TABLE IF NOT EXISTS page_views (
  id         BIGSERIAL PRIMARY KEY,
  path       VARCHAR(512) NOT NULL,
  visitor_hash VARCHAR(64) NOT NULL,
  user_agent TEXT,
  referer    TEXT,
  viewed_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_page_views_viewed_at ON page_views (viewed_at);
CREATE INDEX IF NOT EXISTS idx_page_views_path ON page_views (path);
CREATE INDEX IF NOT EXISTS idx_page_views_visitor ON page_views (visitor_hash, viewed_at);
