#!/usr/bin/env node
const { program } = require('commander');
const { getPaymentStatus } = require('../src/services/payment-status');
const logger = require('../src/utils/logger/logger');


program
  .description('Get payment status with ACI')
  .option('--payment_id <paymentID>', 'Payment ID')
  .action(async (options) => {
    const { payment_id } = options;

    try {
      const result = await getPaymentStatus(payment_id );
      console.log("Payment status: ",result)
      
    } catch (error) {
      logger.error('Error retrieving payment record:', error.message);

    }
  });

program.parse(process.argv);
