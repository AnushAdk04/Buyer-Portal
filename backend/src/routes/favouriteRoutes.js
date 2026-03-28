const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { listFavourites, add, remove, listAllProperties } = require('../controllers/favouritesController');

router.use(protect);

router.get('/properties', listAllProperties);
router.get('/', listFavourites);
router.post('/', add);
router.delete('/:propertyId', remove);

module.exports = router;