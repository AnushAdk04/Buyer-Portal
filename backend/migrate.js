const db = require('./src/config/db');

async function migrate() {
  try {
    console.log('Running DB migration...');

    await db.query(`
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS property_type VARCHAR(30) DEFAULT 'house' CHECK (property_type IN ('house', 'apartment', 'land', 'commercial', 'villa', 'condo'));
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'for_sale' CHECK (status IN ('for_sale', 'for_rent', 'sold', 'under_contract'));
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS bedrooms INT DEFAULT 0;
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS bathrooms INT DEFAULT 0;
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS area_sqft DECIMAL(10,2);
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS amenities TEXT[];
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS year_built INT;
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS parking_spaces INT DEFAULT 0;
      ALTER TABLE properties ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
    `);

    await db.query(`
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_token VARCHAR(255);
      ALTER TABLE users ADD COLUMN IF NOT EXISTS reset_password_expires BIGINT;
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS property_images (
        id SERIAL PRIMARY KEY,
        property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        image_url VARCHAR(500) NOT NULL,
        image_public_id VARCHAR(500),
        display_order INT DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        property_id INT NOT NULL REFERENCES properties(id) ON DELETE CASCADE,
        sender_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        title VARCHAR(200),
        message TEXT,
        link VARCHAR(500),
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    console.log('Migration completed successfully.');
    process.exit(0);
  } catch (err) {
    console.error('Migration failed:', err);
    process.exit(1);
  }
}

migrate();
