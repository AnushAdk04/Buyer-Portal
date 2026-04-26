const db = require('../config/db');

const createProperty = async ({ title, location, price, description, imageUrl, imagePublicId, uploadedBy }) => {
  const { rows } = await db.query(
    `INSERT INTO properties (title, location, price, description, image_url, image_public_id, uploaded_by)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id`,
    [title, location, price, description, imageUrl, imagePublicId, uploadedBy]
  );
  return rows[0].id;
};

const getPropertiesByUser = async (userId) => {
  const { rows } = await db.query(
    `SELECT p.*, u.name AS uploaded_by_name
     FROM properties p
     LEFT JOIN users u ON p.uploaded_by = u.id
     WHERE p.uploaded_by = $1
     ORDER BY p.id DESC`,
    [userId]
  );
  return rows;
};

const getPropertyById = async (id) => {
  const { rows } = await db.query(
    `SELECT p.*, u.name AS uploaded_by_name
     FROM properties p
     LEFT JOIN users u ON p.uploaded_by = u.id
     WHERE p.id = $1`,
    [id]
  );
  return rows[0];
};

const deleteProperty = async (id, userId) => {
  const { rowCount } = await db.query(
    'DELETE FROM properties WHERE id = $1 AND uploaded_by = $2',
    [id, userId]
  );
  return rowCount;
};

const updateProperty = async (id, userId, { title, location, price, description }) => {
  const { rowCount } = await db.query(
    `UPDATE properties SET title = $1, location = $2, price = $3, description = $4
     WHERE id = $5 AND uploaded_by = $6`,
    [title, location, price, description, id, userId]
  );
  return rowCount;
};

const updatePropertyWithImage = async (id, userId, { title, location, price, description, imageUrl, imagePublicId }) => {
  const { rowCount } = await db.query(
    `UPDATE properties
     SET title = $1, location = $2, price = $3, description = $4, image_url = $5, image_public_id = $6
     WHERE id = $7 AND uploaded_by = $8`,
    [title, location, price, description, imageUrl, imagePublicId, id, userId]
  );
  return rowCount;
};

module.exports = {
  createProperty,
  getPropertiesByUser,
  getPropertyById,
  deleteProperty,
  updateProperty,
  updatePropertyWithImage,
};