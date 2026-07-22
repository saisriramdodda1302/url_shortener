CREATE TABLE urls (
    id BIGINT PRIMARY KEY,
    short_url_key VARCHAR(7) UNIQUE NOT NULL,
    long_url TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_urls_short_key ON urls(short_url_key);
