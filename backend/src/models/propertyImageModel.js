const db = require('../config/db');

const addPropertyImage = async (propertyId, imageUrl, imagePublicId, displayOrder = 0) => {
  const { rows } = await db.query(
    `INSERT INTO property_images (property_id, image_url, image_public_id, display_order)
     VALUES ($1, $2, $3, $4) RETURNING id`,
    [propertyId, imageUrl, imagePublicId, displayOrder]
  );
  return rows[0].id;
};

const getPropertyImages = async (propertyId) => {
  const { rows } = await db.query(
    `SELECT id, image_url, display_order FROM property_images WHERE property_id = $1 ORDER BY display_order ASC, id ASC`,
    [propertyId]
  );
  return rows;
};

const deletePropertyImage = async (imageId) => {
  const { rowCount } = await db.query(
    'DELETE FROM property_images WHERE id = $1',
    [imageId]
  );
  return rowCount;
};

const deleteImagesByProperty = async (propertyId) => {
  const { rowCount } = await db.query(
    'DELETE FROM property_images WHERE property_id = $1',
    [propertyId]
  );
  return rowCount;
};

module.exports = {
  addPropertyImage,
  getPropertyImages,
  deletePropertyImage,
  deleteImagesByProperty
};
