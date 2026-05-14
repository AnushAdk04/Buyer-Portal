const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../config/cloudinary');
const {
  getProfile,
  getPublicProfile,
  editProfile,
  changeAvatar,
  removeAvatar,
  changePassword,
  getDashboardStats,
  getAnalytics,
} = require('../controllers/userController');

router.use(protect);

router.get('/profile', getProfile);
router.get('/public/:id', getPublicProfile);
router.put('/profile', editProfile);
router.put('/profile/avatar', uploadAvatar.single('avatar'), changeAvatar);
router.delete('/profile/avatar', removeAvatar);
router.put('/profile/password', changePassword);
router.get('/dashboard-stats', getDashboardStats);
router.get('/analytics', getAnalytics);

module.exports = router;