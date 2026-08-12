const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { createCheckoutSession, stripeWebhook, createPortalSession } = require('../controllers/stripeController');

router.post('/checkout', protect, createCheckoutSession);
router.post('/portal', protect, createPortalSession);

module.exports = router;
