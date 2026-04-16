CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('buyer', 'admin') DEFAULT 'buyer',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL,
  location VARCHAR(200),
  price DECIMAL(12,2),
  description TEXT,
  image_url VARCHAR(500),
  image_public_id VARCHAR(255),
  uploaded_by INT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (uploaded_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE favourites (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  UNIQUE KEY unique_fav (user_id, property_id)
);

INSERT INTO properties (title, location, price, description, image_url) VALUES
('Modern Downtown Apartment', 'Bharatpur, Chitwan', 15000000.00, 'Modern apartment in central location with easy transport access.', 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'),
('Cozy Suburban House', 'Pokhara, Kaski', 8500000.00, 'Family-friendly home in a quiet neighborhood.', 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400'),
('Luxury Villa with Garden', 'Patan, Lalitpur', 32000000.00, 'Spacious villa with landscaped garden and premium finishes.', 'https://images.unsplash.com/photo-1580587771525-78b9dba3b914?w=400'),
('Studio Flat Near College', 'Kirtipur, Kathmandu', 4200000.00, 'Compact studio suitable for students and young professionals.', 'https://images.unsplash.com/photo-1554995207-c18c203602cb?w=400'),
('Commercial Space Ground Floor', 'Thamel, Kathmandu', 25000000.00, 'High-visibility commercial space in a busy area.', 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=400');