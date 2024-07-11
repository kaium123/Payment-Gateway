#!/usr/bin/env node

const { createPayment, getPaymentStatus } = require('../src/service/aci-service');
const config = require('../src/config/config');

const run = async () => {
  
      const paymentID = 'your_payment_id';
      const entityID = '8a8294174b7ecb28014b9699220015ca';

      try {
        const result = await getPaymentStatus({ params: { paymentID }, query: { entityId: entityID }, headers: { authorization: token } });
        console.log('Payment status:', result);
      } catch (error) {
        console.error('Error getting payment status:', error);
      }

};

run();
