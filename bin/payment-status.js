#!/usr/bin/env node

const { program } = require('commander');
const { getPaymentRecord } = require('../src/service/payment-status');
const config = require('../src/config/config');

program
  .description('Get payment status with ACI')
  .option('--payment_id <paymentID>', 'Payment ID')
  .action(async (options) => {
    const { payment_id } = options;

    try {
      const result = await getPaymentRecord(payment_id );
      console.log('Payment status:', result);
    } catch (error) {
      console.error('Error getting payment status:', error);
    }
  });

program.parse(process.argv);
