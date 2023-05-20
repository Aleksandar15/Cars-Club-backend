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
  refresh_token VARCHAR(1000) NOT NULL,
  PRIMARY KEY (refresh_token_id),
  user_id uuid NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
);

CREATE TABLE posts (
  post_id uuid DEFAULT uuid_generate_v4(),
  PRIMARY KEY (post_id),
  post_title VARCHAR(50) NOT NULL,
  post_image_buffer BYTEA NOT NULL,
  post_description VARCHAR(1000) NOT NULL,
  post_contact_number VARCHAR(20) CHECK (post_contact_number ~ '^\d{1,20}$') NOT NULL,
  post_asking_price VARCHAR(20) CHECK (post_asking_price ~ '^\d{1,20}$') NOT NULL,
  post_asking_price_currency VARCHAR(5) NOT NULL,
  post_created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
  user_id UUID,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  post_created_by_user_name VARCHAR(30) NOT NULL,
  post_created_by_user_email VARCHAR(50) NOT NULL,
);

-- CREATE TABLE comments ()

-- TESTS
-- Create test user:
INSERT INTO users (user_name, user_email, user_password) VALUES ('test', 'test@test.com', 'password');
-- Create test refresh_token:
INSERT INTO refresh_tokens (user_id, refresh_token) VALUES ('change-this-into-real-uuid', 'abc123');


-- REMINDERS to-be/can-be used
-- DELETE FROM posts WHERE id >= 3 AND id <= 5; -- Deleting ROWS by selecting ranges.
DELETE FROM posts WHERE id IN (1, 3, 5) -- Deleting a specific ROWS by id's; 
-- -- IN opprator to specify multiple values in a WHERE clause; without having to use multi-OR's.


-- CREATE VIEW for easy-access
CREATE VIEW posts_view_except_post_image AS
SELECT post_id, post_title, post_description, post_contact_number, post_asking_price, user_id,
post_asking_price_currency, post_created_at FROM posts; -- Creates VIEW my_view

SELECT viewname
FROM pg_catalog.pg_views
WHERE schemaname = 'public'; -- Selects ALL VIEWS (prints their names)

-- See which columns a VIEW selects:
SELECT definition
FROM pg_catalog.pg_views
WHERE schemaname = 'public' AND viewname = 'posts_view_except_post_image'; 

DROP VIEW my_view; -- Deletes VIEW


-- RENAME column post_image to post_image_buffer
ALTER TABLE posts RENAME COLUMN post_image TO post_image_buffer;


-- Add columns user_name & user_email. 
-- 1. BUT I decided not to use 
-- FOREIGN KEY on them because I may also need ON DELETE CASCADE
-- and multiple ON DELETE CASCADE`s may get complicated to delete a user(?)
-- 2. "user_email" must be UNIQUE in "users" table but it will crash 
-- my "posts" table that has MANY TO ONE relationship & "user_email"`s must repeat.
ALTER TABLE posts
ADD COLUMN post_created_by_user_name VARCHAR(30) REFERENCES users(user_name), -- without REFERENCES
ADD COLUMN post_created_by_user_email VARCHAR(50) REFERENCES users(user_email); -- withotu REFERENCES




-- NOTES
-- post_contacT_nubmer NUMERIC(10,0) NOT NULL, -- was my intention 
-- -- but React's FormData workaround:
-- post_contact_number VARCHAR(20) CHECK (post_contact_number ~ '^\d{1,20}$') NOT NULL,
-- -- ^ I must use it this way because "Create Post" button from Frontend sends FormData
-- -- and FormData's value can ONLY be: string | Blob; hence why such a checking is needed
-- -- the "~" operator is pattern matching against the RegEx: 1 to 20 max digits.