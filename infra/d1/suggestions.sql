-- Suggestions sent from the site's /suggest form. Lives only in Cloudflare D1 (database wts-suggestions); never
-- committed to git. Review them with: python scripts/suggestions.py
-- Collects only what a suggestion needs: no names or contact details of the person sending it. ip_hash is a keyed
-- hash of the sender's IP and the day, used only to limit how many a sender can send in a day; it cannot be
-- reversed without the server key and changes every day.

CREATE TABLE IF NOT EXISTS suggestions (
  id          TEXT PRIMARY KEY,                  -- random UUID
  created_at  TEXT NOT NULL,                     -- ISO 8601, UTC
  name        TEXT NOT NULL,                     -- the public figure or organisation suggested
  country     TEXT NOT NULL,
  place       TEXT,                              -- town, region or constituency, if known
  links       TEXT NOT NULL,                     -- one https link per line: where they said it
  said        TEXT,                              -- what they said, or why they belong here
  page        TEXT,                              -- the site page the form was opened from
  ip_hash     TEXT NOT NULL,
  status      TEXT NOT NULL DEFAULT 'new'        -- new | added | duplicate | rejected
              CHECK (status IN ('new', 'added', 'duplicate', 'rejected')),
  review_note TEXT,
  reviewed_at TEXT
);

CREATE INDEX IF NOT EXISTS suggestions_status ON suggestions (status, created_at);
CREATE INDEX IF NOT EXISTS suggestions_ip_day ON suggestions (ip_hash);
