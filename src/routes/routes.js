const express = require('express');
const router = express.Router();
const aciRoutes = require('./aci-payments/aci-payment');
const shift4routes = require('./shift4-payments/shift4-payment');

router.post('/aci', aciRoutes);
router.post('/shift4', shift4routes);


module.exports = router;
