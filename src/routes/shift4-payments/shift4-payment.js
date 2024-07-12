const express = require('express');
const router = express.Router();
const { createPaymentHandler, getPaymentStatusHandler } = require('../../controllers/shift4-payment');

router.post('/shift4', createPaymentHandler);

module.exports = router;
