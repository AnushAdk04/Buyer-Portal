const db = require('../config/db');

const findByEmail = async (email) => {
  const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
};

const createUser = async (name, email, passwordHash, role = 'buyer') => {
  const [result] = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)',
    [name, email, passwordHash, role]
  );
  return result.insertId;
};

const findById = async (id) => {
  const [rows] = await db.query(
    'SELECT id, name, email, role, phone, bio, avatar_url, created_at FROM users WHERE id = ?',
    [id]
  );
  return rows[0];
};

const updateProfile = async (id, { name, phone, bio }) => {
  const [result] = await db.query(
    `UPDATE users SET name = ?, phone = ?, bio = ? WHERE id = ?`,
    [name, phone || null, bio || null, id]
  );
  return result.affectedRows;
};

const updateAvatar = async (id, avatarUrl, avatarPublicId) => {
  const [result] = await db.query(
    `UPDATE users SET avatar_url = ?, avatar_public_id = ? WHERE id = ?`,
    [avatarUrl, avatarPublicId, id]
  );
  return result.affectedRows;
};

const getAvatarPublicId = async (id) => {
  const [rows] = await db.query(
    'SELECT avatar_public_id FROM users WHERE id = ?',
    [id]
  );
  return rows[0]?.avatar_public_id;
};

const updatePassword = async (id, passwordHash) => {
  const [result] = await db.query(
    'UPDATE users SET password_hash = ? WHERE id = ?',
    [passwordHash, id]
  );
  return result.affectedRows;
};

module.exports = {
  findByEmail,
  createUser,
  findById,
  updateProfile,
  updateAvatar,
  getAvatarPublicId,
  updatePassword,
};