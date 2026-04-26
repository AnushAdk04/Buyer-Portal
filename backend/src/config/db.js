const { Pool } = require('pg');
const dotenv = require('dotenv');
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.connect()
  .then(client => {
    console.log('PostgreSQL connected successfully');
    client.release();
  })
  .catch(err => {
    console.error('PostgreSQL connection failed:', err.message);
  });

module.exports = pool;