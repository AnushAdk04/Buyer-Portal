const db = require('../config/db');

const createProperty = async ({ 
  title, location, price, description, imageUrl, imagePublicId, uploadedBy,
  propertyType, status, bedrooms, bathrooms, areaSqft, amenities, yearBuilt, parkingSpaces, latitude, longitude
}) => {
  const { rows } = await db.query(
    `INSERT INTO properties (
      title, location, price, description, image_url, image_public_id, uploaded_by,
      property_type, status, bedrooms, bathrooms, area_sqft, amenities, year_built, parking_spaces, latitude, longitude
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17) RETURNING id`,
    [
      title, location, price, description, imageUrl, imagePublicId, uploadedBy,
      propertyType || 'house', status || 'for_sale', bedrooms || 0, bathrooms || 0, 
      areaSqft || null, amenities || [], yearBuilt || null, parkingSpaces || 0,
      latitude || null, longitude || null
    ]
  );
  return rows[0].id;
};

const getPropertiesByUser = async (userId) => {
  const { rows } = await db.query(
    `SELECT p.*, u.name AS uploaded_by_name,
      (SELECT COUNT(*) FROM property_views pv WHERE pv.property_id = p.id) as views_count,
      (SELECT COUNT(*) FROM favourites f WHERE f.property_id = p.id) as favourites_count,
      (SELECT COUNT(*) FROM inquiries i WHERE i.property_id = p.id) as inquiries_count
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

const updateProperty = async (id, userId, { 
  title, location, price, description,
  propertyType, status, bedrooms, bathrooms, areaSqft, amenities, yearBuilt, parkingSpaces, latitude, longitude
}) => {
  const { rowCount } = await db.query(
    `UPDATE properties SET 
      title = $1, location = $2, price = $3, description = $4,
      property_type = $5, status = $6, bedrooms = $7, bathrooms = $8,
      area_sqft = $9, amenities = $10, year_built = $11, parking_spaces = $12,
      latitude = $13, longitude = $14
     WHERE id = $15 AND uploaded_by = $16`,
    [
      title, location, price, description,
      propertyType, status, bedrooms, bathrooms, areaSqft, amenities, yearBuilt, parkingSpaces,
      latitude || null, longitude || null, id, userId
    ]
  );
  return rowCount;
};

const updatePropertyWithImage = async (id, userId, { 
  title, location, price, description, imageUrl, imagePublicId,
  propertyType, status, bedrooms, bathrooms, areaSqft, amenities, yearBuilt, parkingSpaces, latitude, longitude
}) => {
  const { rowCount } = await db.query(
    `UPDATE properties
     SET title = $1, location = $2, price = $3, description = $4, image_url = $5, image_public_id = $6,
         property_type = $7, status = $8, bedrooms = $9, bathrooms = $10,
         area_sqft = $11, amenities = $12, year_built = $13, parking_spaces = $14,
         latitude = $15, longitude = $16
     WHERE id = $17 AND uploaded_by = $18`,
    [
      title, location, price, description, imageUrl, imagePublicId,
      propertyType, status, bedrooms, bathrooms, areaSqft, amenities, yearBuilt, parkingSpaces,
      latitude || null, longitude || null, id, userId
    ]
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