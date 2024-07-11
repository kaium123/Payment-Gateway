const express = require('express');
const router = express.Router();
const { getPaymentRecordHandler } = require('../controllers/payment-status'); // Ensure this path is correct

router.get('/:id', getPaymentRecordHandler);

module.exports = router;
