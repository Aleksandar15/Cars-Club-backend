CREATE DATABASE cars_club;

CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(30) NOT NULL,
  user_email VARCHAR(50) NOT NULL UNIQUE,
  user_password VARCHAR(100) NOT NULL,
  user_role VARCHAR(55) DEFAULT 'user',
  user_created_at timestamptz DEFAULT current_timestamp,
  PRIMARY KEY (user_id)
);

CREATE TABLE refresh_tokens (
  refresh_token_id uuid DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL,
  refresh_token VARCHAR(1000) NOT NULL,
  PRIMARY KEY (refresh_token_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

-- CREATE TABLE posts (
--   post_id uuid DEFAULT uuid_generate_v4(),
--   post_title VARCHAR(100) NOT NULL,
--   post_content VARCHAR(2000) NOT NULL,
-- )

-- CREATE TABLE comments ()

-- TESTS
-- Create test user:
INSERT INTO users (user_name, user_email, user_password) VALUES ('test', 'test@test.com', 'password');
-- Create test refresh_token:
INSERT INTO refresh_tokens (user_id, refresh_token) VALUES ('change-this-into-real-uuid', 'abc123');