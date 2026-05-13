const db = require('../config/db');

/**
 * GET /api/search
 * Public search & filter endpoint with pagination.
 *
 * Query params:
 *   q           – full-text search on title, location, description
 *   type        – comma-separated property types  (house,apartment,…)
 *   status      – comma-separated statuses         (for_sale,for_rent,…)
 *   minPrice    – minimum price
 *   maxPrice    – maximum price
 *   bedrooms    – minimum bedrooms
 *   bathrooms   – minimum bathrooms
 *   minArea     – minimum area in sqft
 *   sort        – price_asc | price_desc | newest | oldest
 *   page        – page number (1-based, default 1)
 *   limit       – items per page (default 12, max 50)
 */
const searchProperties = async (req, res) => {
  try {
    const {
      q,
      type,
      status,
      minPrice,
      maxPrice,
      bedrooms,
      bathrooms,
      minArea,
      sort = 'newest',
      page = 1,
      limit = 12,
    } = req.query;

    const conditions = [];
    const values = [];
    let paramIndex = 1;

    // Full-text search
    if (q && q.trim()) {
      const searchTerm = `%${q.trim().toLowerCase()}%`;
      conditions.push(
        `(LOWER(p.title) LIKE $${paramIndex} OR LOWER(p.location) LIKE $${paramIndex} OR LOWER(p.description) LIKE $${paramIndex})`
      );
      values.push(searchTerm);
      paramIndex++;
    }

    // Property type filter
    if (type) {
      const types = type.split(',').map((t) => t.trim()).filter(Boolean);
      if (types.length > 0) {
        const placeholders = types.map((_, i) => `$${paramIndex + i}`).join(', ');
        conditions.push(`p.property_type IN (${placeholders})`);
        values.push(...types);
        paramIndex += types.length;
      }
    }

    // Status filter
    if (status) {
      const statuses = status.split(',').map((s) => s.trim()).filter(Boolean);
      if (statuses.length > 0) {
        const placeholders = statuses.map((_, i) => `$${paramIndex + i}`).join(', ');
        conditions.push(`p.status IN (${placeholders})`);
        values.push(...statuses);
        paramIndex += statuses.length;
      }
    }

    // Price range
    if (minPrice) {
      conditions.push(`p.price >= $${paramIndex}`);
      values.push(Number(minPrice));
      paramIndex++;
    }
    if (maxPrice) {
      conditions.push(`p.price <= $${paramIndex}`);
      values.push(Number(maxPrice));
      paramIndex++;
    }

    // Bedrooms minimum
    if (bedrooms) {
      conditions.push(`p.bedrooms >= $${paramIndex}`);
      values.push(Number(bedrooms));
      paramIndex++;
    }

    // Bathrooms minimum
    if (bathrooms) {
      conditions.push(`p.bathrooms >= $${paramIndex}`);
      values.push(Number(bathrooms));
      paramIndex++;
    }

    // Minimum area
    if (minArea) {
      conditions.push(`p.area_sqft >= $${paramIndex}`);
      values.push(Number(minArea));
      paramIndex++;
    }

    // Build WHERE clause
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    // Sort
    const sortMap = {
      price_asc: 'p.price ASC NULLS LAST',
      price_desc: 'p.price DESC NULLS LAST',
      newest: 'p.created_at DESC',
      oldest: 'p.created_at ASC',
    };
    const orderBy = sortMap[sort] || sortMap.newest;

    // Pagination
    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 12));
    const offset = (pageNum - 1) * limitNum;

    // Count total matching
    const countQuery = `SELECT COUNT(*) AS total FROM properties p ${whereClause}`;
    const { rows: countRows } = await db.query(countQuery, values);
    const total = parseInt(countRows[0].total, 10);

    // Fetch page
    const dataQuery = `
      SELECT p.*, u.name AS uploaded_by_name
      FROM properties p
      LEFT JOIN users u ON p.uploaded_by = u.id
      ${whereClause}
      ORDER BY ${orderBy}
      LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
    `;
    const { rows: properties } = await db.query(dataQuery, [...values, limitNum, offset]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      properties,
      pagination: {
        total,
        page: pageNum,
        limit: limitNum,
        totalPages,
        hasMore: pageNum < totalPages,
      },
    });
  } catch (err) {
    console.error('Search properties error:', err);
    res.status(500).json({ message: 'Could not search properties' });
  }
};

module.exports = { searchProperties };
