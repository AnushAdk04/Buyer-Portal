const express = require('express');
const router = express.Router();
const { searchProperties } = require('../controllers/searchController');

// Public — no auth required
router.get('/', searchProperties);

module.exports = router;
