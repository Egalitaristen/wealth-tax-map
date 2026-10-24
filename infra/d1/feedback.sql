-- Feedback and bug reports sent from the site's /feedback form. Lives only in Cloudflare D1 (database
-- wts-suggestions, next to the suggestions table); never committed to git. Review with: python scripts/suggestions.py feedback
-- No names or contact details are required. contact is an optional address the sender chooses to give if they want a
-- reply. user_agent is kept for bug reports only, to reproduce them. ip_hash is a keyed hash of the sender's IP and the
-- day, used only to limit how many a sender can send in a day.

CREATE TABLE IF NOT EXISTS feedback (
  id          TEXT PRIMARY KEY,                  -- random UUID
  created_at  TEXT NOT NULL,                     -- ISO 8601, UTC
  kind        TEXT NOT NULL CHECK (kind IN ('feedback', 'bug')),
  message     TEXT NOT NULL,
  page        TEXT,                              -- the site page it is about
  contact     TEXT,                              -- optional: how to reply
  user_agent  TEXT,                              -- bug reports only
  ip_hash     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new'        -- new | done | wontfix
              CHECK (status IN ('new', 'done', 'wontfix')),
  review_note TEXT,
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS feedback_status ON feedback (status, created_at);
CREATE INDEX IF NOT EXISTS feedback_ip_day ON feedback (ip_hash);
