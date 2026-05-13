const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { uploadProperty } = require('../config/cloudinary');
const {
  uploadProperty: uploadPropertyHandler,
  getMyProperties,
  getSingleProperty,
  removeProperty,
  editProperty,
} = require('../controllers/propertyController');

router.use(protect);

router.post('/', uploadProperty.array('images', 10), uploadPropertyHandler);
router.get('/my', getMyProperties);
router.get('/:id', getSingleProperty);
router.put('/:id', uploadProperty.array('images', 10), editProperty);
router.delete('/:id', removeProperty);

module.exports = router;