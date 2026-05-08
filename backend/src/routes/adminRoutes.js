const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { adminOnly } = require('../middleware/adminMiddleware');
const {
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
} = require('../controllers/adminController');

// all admin routes require login AND admin role
router.use(protect);
router.use(adminOnly);

router.get('/stats', getStats);
router.get('/users/growth', getUserGrowth);
router.get('/properties/growth', getPropertyGrowth);
router.get('/properties/top-favourited', getTopFavourited);
router.get('/properties/price-distribution', getPriceDistribution);
router.get('/users', getAllUsers);
router.get('/properties', getAllProperties);
router.get('/activity', getRecentActivity);
router.delete('/properties/:id', deleteProperty);
router.delete('/users/:id', deleteUser);
router.patch('/users/:id/role', updateUserRole);

module.exports = router;