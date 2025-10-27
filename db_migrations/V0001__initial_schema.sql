CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS catalog_items (
  id SERIAL PRIMARY KEY,
  title VARCHAR(500) NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  image_url_1 TEXT NOT NULL,
  image_url_2 TEXT NOT NULL,
  image_url_3 TEXT NOT NULL,
  external_link TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  position INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_catalog_items_position ON catalog_items(position DESC);
CREATE INDEX IF NOT EXISTS idx_catalog_items_tags ON catalog_items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_users_username ON users(username);