const express = require('express');
const router = express.Router();
const { getPaymentRecordHandler } = require('../../controllers/payment-status');

router.get('/:id', getPaymentRecordHandler);

module.exports = router;
