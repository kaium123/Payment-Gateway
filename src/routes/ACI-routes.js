const express = require('express');
const router = express.Router();
const { createPaymentHandler, getPaymentStatusHandler } = require('../controllers/aci-controller');

router.post('/aci', createPaymentHandler);
router.get('/aci/:paymentID', getPaymentStatusHandler);

module.exports = router;
