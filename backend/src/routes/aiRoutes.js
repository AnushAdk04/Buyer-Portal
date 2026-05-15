const express = require('express');
const router = express.Router();
const { chatWithAI } = require('../controllers/aiController');
const { protect } = require('../middleware/authMiddleware');

// We protect the AI route so only logged-in users can use it (to prevent API abuse)
router.post('/chat', protect, chatWithAI);

module.exports = router;
