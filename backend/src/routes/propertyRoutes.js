const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { upload } = require('../config/cloudinary');
const {
  uploadProperty,
  getMyProperties,
  getSingleProperty,
  removeProperty,
  editProperty,
} = require('../controllers/propertyController');

router.use(protect);

router.post('/', upload.single('image'), uploadProperty);
router.get('/my', getMyProperties);
router.get('/:id', getSingleProperty);
router.put('/:id', upload.single('image'), editProperty);
router.delete('/:id', removeProperty);

module.exports = router;