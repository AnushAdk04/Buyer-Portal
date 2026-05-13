const express = require('express');
const { createInquiry, getMyInquiries, markAsRead, deleteInquiry } = require('../controllers/inquiryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createInquiry);
router.get('/', protect, getMyInquiries);
router.put('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteInquiry);

module.exports = router;
