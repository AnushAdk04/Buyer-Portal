-- Run this in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(10) DEFAULT 'buyer' CHECK (role IN ('buyer', 'admin')),
  phone VARCHAR(20),
  bio TEXT,
  avatar_url VARCHAR(500),
  avatar_public_id VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS properties (
  id SERIAL PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  price DECIMAL(12,2),
  description TEXT,
  image_url VARCHAR(500),
  image_public_id VARCHAR(255),
  uploaded_by INT REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  property_type VARCHAR(30) DEFAULT 'house' CHECK (property_type IN ('house', 'apartment', 'land', 'commercial', 'villa', 'condo')),
  status VARCHAR(20) DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'for_rent', 'sold', 'under_contract')),
  bedrooms INT DEFAULT 0,
  bathrooms INT DEFAULT 0,
  area_sqft DECIMAL(10,2),
  amenities TEXT[],
  year_built INT,
  parking_spaces INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT false
);

CREATE TABLE IF NOT EXISTS property_images (
  id SERIAL PRIMARY KEY,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  image_url VARCHAR(500) NOT NULL,
  image_public_id VARCHAR(500),
  display_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS favourites (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, property_id)
);