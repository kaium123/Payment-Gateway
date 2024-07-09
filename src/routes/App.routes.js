// /routes/App.routes.js
const express = require('express');
const { createPaymentHandler, getPaymentStatusHandler } = require('../controller/App.controller');

const router = express.Router();

router.post('/payments', createPaymentHandler); // Use the correct handler
router.get('/payments/:paymentID', getPaymentStatusHandler); // Use the correct handler

module.exports = router;
