CREATE DATABASE cars_club;

CREATE extension IF NOT EXISTS "uuid-ossp";

CREATE TABLE users(
  user_id uuid DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL UNIQUE,
  user_password VARCHAR(255) NOT NULL,
  refresh_tokens VARCHAR(1000)[],
  user_role VARCHAR(55) DEFAULT 'user',
  PRIMARY KEY (user_id)
);