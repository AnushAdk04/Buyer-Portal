const db = require('../config/db');

const Notification = {
  create: async (userId, type, title, message, link) => {
    const result = await db.query(
      `INSERT INTO notifications (user_id, type, title, message, link) 
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [userId, type, title, message, link]
    );
    return result.rows[0];
  },

  findByUserId: async (userId) => {
    const result = await db.query(
      `SELECT * FROM notifications WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );
    return result.rows;
  },

  markAsRead: async (notificationId, userId) => {
    const result = await db.query(
      `UPDATE notifications SET is_read = true WHERE id = $1 AND user_id = $2 RETURNING *`,
      [notificationId, userId]
    );
    return result.rows[0];
  },

  markAllAsRead: async (userId) => {
    const result = await db.query(
      `UPDATE notifications SET is_read = true WHERE user_id = $1 RETURNING *`,
      [userId]
    );
    return result.rows;
  },

  getUnreadCount: async (userId) => {
    const result = await db.query(
      `SELECT COUNT(*) as count FROM notifications WHERE user_id = $1 AND is_read = false`,
      [userId]
    );
    return parseInt(result.rows[0].count, 10);
  }
};

module.exports = Notification;
