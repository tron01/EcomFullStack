const express = require('express');
const router = express.Router();
const { getAllActivePaymentMethods } = require('../controllers/paymentMethodController');

router.get('/', getAllActivePaymentMethods);

module.exports = router;