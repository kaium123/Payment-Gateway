const express = require('express');
const router = express.Router();
const { createPaymentHandler, getPaymentStatusHandler } = require('../controllers/ACI-controller');

router.post('/payments', createPaymentHandler);
router.get('/payments/:paymentID', getPaymentStatusHandler);

module.exports = router;
