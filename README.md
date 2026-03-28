1. Install Node.js (v18+) and Yarn (npm install -g yarn)

2. Install and open XAMPP — start Apache and MySQL

3. Open phpMyAdmin (localhost/phpmyadmin) → create database 'buyer_portal' → run the SQL from db_setup.sql

4. Create backend/.env with:
 PORT=3001
 DB_HOST=localhost
 DB_USER=root
 DB_PASSWORD=
 DB_NAME=buyer_portal
 JWT_SECRET=anysecretkey

5. Create frontend/.env with: VITE_API_URL=http://localhost:3001/api

6. Run: yarn install:all
7. Run: yarn install
8. Run: yarn dev:all