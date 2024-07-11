const express = require('express');
const router = express.Router();
const { createPaymentHandler, getPaymentStatusHandler } = require('../controllers/aci-payment');

router.post('/aci', createPaymentHandler);
router.get('/aci/:paymentID', getPaymentStatusHandler);

module.exports = router;
