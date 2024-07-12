const express = require('express');
const router = express.Router();
const { createPaymentHandler, getPaymentStatusHandler } = require('../../controllers/aci-payment');

router.post('/aci', createPaymentHandler);

module.exports = router;
