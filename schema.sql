-- Execute este script no editor SQL do Neon (Console > SQL Editor)

CREATE TABLE IF NOT EXISTS clients (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS themes (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS quotes (
  id BIGINT PRIMARY KEY,
  data JSONB NOT NULL
);
