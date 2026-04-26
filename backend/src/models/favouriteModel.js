const db = require('../config/db');

const getFavourites = async (userId) => {
  const { rows } = await db.query(
    `SELECT p.id, p.title, p.location, p.price, p.image_url, f.created_at
     FROM favourites f
     JOIN properties p ON f.property_id = p.id
     WHERE f.user_id = $1
     ORDER BY f.created_at DESC`,
    [userId]
  );
  return rows;
};

const addFavourite = async (userId, propertyId) => {
  const { rows } = await db.query(
    'INSERT INTO favourites (user_id, property_id) VALUES ($1, $2) RETURNING id',
    [userId, propertyId]
  );
  return rows[0].id;
};

const removeFavourite = async (userId, propertyId) => {
  const { rowCount } = await db.query(
    'DELETE FROM favourites WHERE user_id = $1 AND property_id = $2',
    [userId, propertyId]
  );
  return rowCount;
};

const isFavourite = async (userId, propertyId) => {
  const { rows } = await db.query(
    'SELECT id FROM favourites WHERE user_id = $1 AND property_id = $2',
    [userId, propertyId]
  );
  return rows.length > 0;
};

module.exports = { getFavourites, addFavourite, removeFavourite, isFavourite };