const db = require('../config/db');

const createProperty = async ({ title, location, price, description, imageUrl, imagePublicId, uploadedBy }) => {
  const [result] = await db.query(
    `INSERT INTO properties (title, location, price, description, image_url, image_public_id, uploaded_by)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [title, location, price, description, imageUrl, imagePublicId, uploadedBy]
  );
  return result.insertId;
};

const getPropertiesByUser = async (userId) => {
  const [rows] = await db.query(
    `SELECT p.*, u.name AS uploaded_by_name
     FROM properties p
     LEFT JOIN users u ON p.uploaded_by = u.id
     WHERE p.uploaded_by = ?
     ORDER BY p.id DESC`,
    [userId]
  );
  return rows;
};

const getPropertyById = async (id) => {
  const [rows] = await db.query(
    `SELECT p.*, u.name AS uploaded_by_name
     FROM properties p
     LEFT JOIN users u ON p.uploaded_by = u.id
     WHERE p.id = ?`,
    [id]
  );
  return rows[0];
};

const deleteProperty = async (id, userId) => {
  const [result] = await db.query(
    'DELETE FROM properties WHERE id = ? AND uploaded_by = ?',
    [id, userId]
  );
  return result.affectedRows;
};

const updateProperty = async (id, userId, { title, location, price, description }) => {
  const [result] = await db.query(
    `UPDATE properties SET title = ?, location = ?, price = ?, description = ?
     WHERE id = ? AND uploaded_by = ?`,
    [title, location, price, description, id, userId]
  );
  return result.affectedRows;
};

module.exports = { createProperty, getPropertiesByUser, getPropertyById, deleteProperty, updateProperty };