const express = require('express');
const router = express.Router();
const { createPaymentHandler, getPaymentStatusHandler } = require('../controllers/shift4-controllers');


router.post('/shift4', createPaymentHandler);
router.get('/shift4/:chargeID', getPaymentStatusHandler);

module.exports = router;
