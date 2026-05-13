const db = require('../config/db');

const Inquiry = {
  create: async (propertyId, senderId, receiverId, message) => {
    const result = await db.query(
      `INSERT INTO inquiries (property_id, sender_id, receiver_id, message) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [propertyId, senderId, receiverId, message]
    );
    return result.rows[0];
  },

  findByReceiverId: async (receiverId) => {
    const result = await db.query(
      `SELECT i.*, 
              p.title as property_title, p.image_url as property_image, p.price as property_price,
              u.name as sender_name, u.email as sender_email, u.phone as sender_phone
       FROM inquiries i
       JOIN properties p ON i.property_id = p.id
       JOIN users u ON i.sender_id = u.id
       WHERE i.receiver_id = $1
       ORDER BY i.created_at DESC`,
      [receiverId]
    );
    return result.rows;
  },

  findBySenderId: async (senderId) => {
    const result = await db.query(
      `SELECT i.*, 
              p.title as property_title, p.image_url as property_image, p.price as property_price,
              u.name as receiver_name, u.email as receiver_email, u.phone as receiver_phone
       FROM inquiries i
       JOIN properties p ON i.property_id = p.id
       JOIN users u ON i.receiver_id = u.id
       WHERE i.sender_id = $1
       ORDER BY i.created_at DESC`,
      [senderId]
    );
    return result.rows;
  },

  markAsRead: async (inquiryId, receiverId) => {
    const result = await db.query(
      `UPDATE inquiries SET is_read = true WHERE id = $1 AND receiver_id = $2 RETURNING *`,
      [inquiryId, receiverId]
    );
    return result.rows[0];
  },

  delete: async (inquiryId, userId) => {
    // Both sender and receiver can delete their view of the inquiry, 
    // but here we simply delete it from DB if either requests it, for simplicity.
    const result = await db.query(
      `DELETE FROM inquiries WHERE id = $1 AND (sender_id = $2 OR receiver_id = $2) RETURNING *`,
      [inquiryId, userId]
    );
    return result.rows[0];
  }
};

module.exports = Inquiry;
