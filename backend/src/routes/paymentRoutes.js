const express = require('express');
const router = express.Router();
const { initiateEsewaPayment, verifyEsewaPayment } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/initiate-esewa', initiateEsewaPayment);
router.post('/verify-esewa', verifyEsewaPayment);

module.exports = router;
