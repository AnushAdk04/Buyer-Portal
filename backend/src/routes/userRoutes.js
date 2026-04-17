const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadAvatar } = require('../config/cloudinary');
const {
  getProfile,
  editProfile,
  changeAvatar,
  removeAvatar,
  changePassword,
} = require('../controllers/userController');

router.use(protect);

router.get('/profile', getProfile);
router.put('/profile', editProfile);
router.put('/profile/avatar', uploadAvatar.single('avatar'), changeAvatar);
router.delete('/profile/avatar', removeAvatar);
router.put('/profile/password', changePassword);

module.exports = router;