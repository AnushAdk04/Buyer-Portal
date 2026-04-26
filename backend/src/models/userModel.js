const db = require('../config/db');

const findByEmail = async (email) => {
  const { rows } = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return rows[0];
};

const createUser = async (name, email, passwordHash, role = 'buyer') => {
  const { rows } = await db.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id',
    [name, email, passwordHash, role]
  );
  return rows[0].id;
};

const findById = async (id) => {
  const { rows } = await db.query(
    'SELECT id, name, email, role, phone, bio, avatar_url, created_at FROM users WHERE id = $1',
    [id]
  );
  return rows[0];
};

const updateProfile = async (id, { name, phone, bio }) => {
  const { rowCount } = await db.query(
    'UPDATE users SET name = $1, phone = $2, bio = $3 WHERE id = $4',
    [name, phone || null, bio || null, id]
  );
  return rowCount;
};

const updateAvatar = async (id, avatarUrl, avatarPublicId) => {
  const { rowCount } = await db.query(
    'UPDATE users SET avatar_url = $1, avatar_public_id = $2 WHERE id = $3',
    [avatarUrl, avatarPublicId, id]
  );
  return rowCount;
};

const getAvatarPublicId = async (id) => {
  const { rows } = await db.query(
    'SELECT avatar_public_id FROM users WHERE id = $1',
    [id]
  );
  return rows[0]?.avatar_public_id;
};

const updatePassword = async (id, passwordHash) => {
  const { rowCount } = await db.query(
    'UPDATE users SET password_hash = $1 WHERE id = $2',
    [passwordHash, id]
  );
  return rowCount;
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