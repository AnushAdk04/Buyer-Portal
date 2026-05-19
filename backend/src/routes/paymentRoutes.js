const express = require('express');
const router = express.Router();
const { 
  initiateEsewaPayment, 
  verifyEsewaPayment,
  initiateKhaltiPayment,
  verifyKhaltiPayment
} = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.post('/initiate-esewa', initiateEsewaPayment);
router.post('/verify-esewa', verifyEsewaPayment);
router.post('/initiate-khalti', initiateKhaltiPayment);
router.post('/verify-khalti', verifyKhaltiPayment);

module.exports = router;
