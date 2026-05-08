const db = require('../config/db');

// Overview stats for the top cards
const getStats = async (req, res) => {
  try {
    const { rows: userStats } = await db.query(`
      SELECT
        COUNT(*) AS total_users,
        COUNT(CASE WHEN role = 'buyer' THEN 1 END) AS total_buyers,
        COUNT(CASE WHEN role = 'admin' THEN 1 END) AS total_admins,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS new_users_this_week
      FROM users
    `);

    const { rows: propertyStats } = await db.query(`
      SELECT
        COUNT(*) AS total_properties,
        COUNT(CASE WHEN created_at >= NOW() - INTERVAL '7 days' THEN 1 END) AS new_properties_this_week,
        COUNT(CASE WHEN uploaded_by IS NOT NULL THEN 1 END) AS user_uploaded,
        ROUND(AVG(price), 2) AS avg_price,
        MAX(price) AS max_price,
        MIN(price) AS min_price
      FROM properties
    `);

    const { rows: favouriteStats } = await db.query(`
      SELECT COUNT(*) AS total_favourites
      FROM favourites
    `);

    res.json({
      users: userStats[0],
      properties: propertyStats[0],
      favourites: favouriteStats[0],
    });
  } catch (err) {
    console.error('Admin stats error:', err);
    res.status(500).json({ message: 'Could not fetch stats' });
  }
};

// Users registered per day for the last 30 days — for line/bar chart
const getUserGrowth = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('User growth error:', err);
    res.status(500).json({ message: 'Could not fetch user growth' });
  }
};

// Properties uploaded per day for the last 30 days — for bar chart
const getPropertyGrowth = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        DATE(created_at) AS date,
        COUNT(*) AS count
      FROM properties
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date ASC
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Property growth error:', err);
    res.status(500).json({ message: 'Could not fetch property growth' });
  }
};

// Top 5 most favourited properties — for horizontal bar chart
const getTopFavourited = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.id,
        p.title,
        p.location,
        p.price,
        p.image_url,
        COUNT(f.id) AS favourite_count
      FROM properties p
      LEFT JOIN favourites f ON p.id = f.property_id
      GROUP BY p.id, p.title, p.location, p.price, p.image_url
      ORDER BY favourite_count DESC
      LIMIT 5
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Top favourited error:', err);
    res.status(500).json({ message: 'Could not fetch top favourited' });
  }
};

// Price distribution — group properties into price ranges for histogram
const getPriceDistribution = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        CASE
          WHEN price < 5000000 THEN 'Under 5M'
          WHEN price BETWEEN 5000000 AND 10000000 THEN '5M - 10M'
          WHEN price BETWEEN 10000001 AND 20000000 THEN '10M - 20M'
          WHEN price BETWEEN 20000001 AND 35000000 THEN '20M - 35M'
          ELSE 'Above 35M'
        END AS range,
        COUNT(*) AS count
      FROM properties
      GROUP BY range
      ORDER BY MIN(price)
    `);
    res.json({ data: rows });
  } catch (err) {
    console.error('Price distribution error:', err);
    res.status(500).json({ message: 'Could not fetch price distribution' });
  }
};

// All users list with their property and favourite counts
const getAllUsers = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        u.id,
        u.name,
        u.email,
        u.role,
        u.phone,
        u.avatar_url,
        u.created_at,
        COUNT(DISTINCT p.id) AS property_count,
        COUNT(DISTINCT f.id) AS favourite_count
      FROM users u
      LEFT JOIN properties p ON u.id = p.uploaded_by
      LEFT JOIN favourites f ON u.id = f.user_id
      GROUP BY u.id, u.name, u.email, u.role, u.phone, u.avatar_url, u.created_at
      ORDER BY u.created_at DESC
    `);
    res.json({ users: rows });
  } catch (err) {
    console.error('Get all users error:', err);
    res.status(500).json({ message: 'Could not fetch users' });
  }
};

// All properties list with uploader name and favourite count
const getAllProperties = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT
        p.*,
        u.name AS uploaded_by_name,
        COUNT(f.id) AS favourite_count
      FROM properties p
      LEFT JOIN users u ON p.uploaded_by = u.id
      LEFT JOIN favourites f ON p.id = f.property_id
      GROUP BY p.id, u.name
      ORDER BY p.created_at DESC
    `);
    res.json({ properties: rows });
  } catch (err) {
    console.error('Get all properties error:', err);
    res.status(500).json({ message: 'Could not fetch properties' });
  }
};

// Delete any property as admin
const deleteProperty = async (req, res) => {
  try {
    const { rows } = await db.query(
      'SELECT * FROM properties WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'Property not found' });

    // delete image from cloudinary if exists
    if (rows[0].image_public_id) {
      const { cloudinary } = require('../config/cloudinary');
      await cloudinary.uploader.destroy(rows[0].image_public_id);
    }

    await db.query('DELETE FROM properties WHERE id = $1', [req.params.id]);
    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Admin delete property error:', err);
    res.status(500).json({ message: 'Could not delete property' });
  }
};

// Delete any user as admin — cascades to their properties and favourites
const deleteUser = async (req, res) => {
  try {
    if (Number(req.params.id) === req.user.id)
      return res.status(400).json({ message: 'You cannot delete your own account' });

    const { rows } = await db.query(
      'SELECT * FROM users WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Admin delete user error:', err);
    res.status(500).json({ message: 'Could not delete user' });
  }
};

// Change a user's role
const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    if (!['buyer', 'admin'].includes(role))
      return res.status(400).json({ message: 'Role must be buyer or admin' });

    if (Number(req.params.id) === req.user.id)
      return res.status(400).json({ message: 'You cannot change your own role' });

    const { rows } = await db.query(
      'SELECT id FROM users WHERE id = $1',
      [req.params.id]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: 'User not found' });

    await db.query(
      'UPDATE users SET role = $1 WHERE id = $2',
      [role, req.params.id]
    );

    res.json({ message: `User role updated to ${role}` });
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ message: 'Could not update user role' });
  }
};

// Recent activity feed — latest 10 users and properties combined
const getRecentActivity = async (req, res) => {
  try {
    const { rows } = await db.query(`
      SELECT 'user_joined' AS type, name AS title, email AS subtitle, created_at
      FROM users
      UNION ALL
      SELECT 'property_added' AS type, title, location AS subtitle, created_at
      FROM properties
      ORDER BY created_at DESC
      LIMIT 10
    `);
    res.json({ activity: rows });
  } catch (err) {
    console.error('Recent activity error:', err);
    res.status(500).json({ message: 'Could not fetch activity' });
  }
};

module.exports = {
  getStats,
  getUserGrowth,
  getPropertyGrowth,
  getTopFavourited,
  getPriceDistribution,
  getAllUsers,
  getAllProperties,
  deleteProperty,
  deleteUser,
  updateUserRole,
  getRecentActivity,
};