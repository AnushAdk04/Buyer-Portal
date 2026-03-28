const db = require('../config/db');

const getFavourites = async (userId) => {
  const [rows] = await db.query(
    `SELECT p.id, p.title, p.location, p.price, p.image_url, f.created_at
     FROM favourites f
     JOIN properties p ON f.property_id = p.id
     WHERE f.user_id = ?
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
};

const addFavourite = async (userId, propertyId) => {
  const [result] = await db.query(
    'INSERT INTO favourites (user_id, property_id) VALUES (?, ?)',
    [userId, propertyId]
  );
  return result.insertId;
};

const removeFavourite = async (userId, propertyId) => {
  const [result] = await db.query(
    'DELETE FROM favourites WHERE user_id = ? AND property_id = ?',
    [userId, propertyId]
  );
  return result.affectedRows;
};

const isFavourite = async (userId, propertyId) => {
  const [rows] = await db.query(
    'SELECT id FROM favourites WHERE user_id = ? AND property_id = ?',
    [userId, propertyId]
  );
  return rows.length > 0;
};

module.exports = { getFavourites, addFavourite, removeFavourite, isFavourite };