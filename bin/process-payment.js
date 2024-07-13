#!/usr/bin/env node
const { program } = require('commander');
const { createPayment, getPaymentStatus } = require('../src/services/aci-payment');
const config = require('../src/infra/config/config');
const logger = require('../src/utils/logger/logger');


program
  .command('aci')
  .description('Create a payment with ACI')
  .option('--amount <amount>', 'Payment amount')
  .option('--currency <currency>', 'Payment currency')
  .option('--card_number <number>', 'Card number')
  .option('--card_holder <holder>', 'Card holder name')
  .option('--expiry_date <expiry>', 'Card expiry date (MM/YY)')
  .option('--cvv <cvv>', 'Card CVV')
  .action(async (options) => {
    const { amount, currency, card_number, card_holder, expiry_date, cvv } = options;
    const [expiryMonth, expiryYear] = expiry_date.split('/');

    const createPaymentRequest = {
      amount: amount,
      currency: currency,
      paymentBrand: "VISA",
      paymentType: "DB",
      card: {
        number: card_number,
        holder: card_holder,
        expiryMonth: expiryMonth,
        expiryYear: `20${expiryYear}`,
        cvv: cvv
      }
    };

    try {
      const result = await createPayment({ body: createPaymentRequest, });
      console.log('Payment created:', result);

    } catch (error) {
      logger.error('Error creating payment:', error.message);

    }
  });

  program
  .command('shift4')
  .description('Create a payment with ACI')
  .option('--amount <amount>', 'Payment amount')
  .option('--currency <currency>', 'Payment currency')
  .option('--card_number <number>', 'Card number')
  .option('--card_holder <holder>', 'Card holder name')
  .option('--expiry_date <expiry>', 'Card expiry date (MM/YY)')
  .option('--cvv <cvv>', 'Card CVV')
  .action(async (options) => {
    const { amount, currency, card_number, card_holder, expiry_date, cvv } = options;
    const [expiryMonth, expiryYear] = expiry_date.split('/');

    const createPaymentRequest = {
      amount: amount,
      currency: currency,
      paymentBrand: "VISA",
      paymentType: "DB",
      card: {
        number: card_number,
        holder: card_holder,
        expiryMonth: expiryMonth,
        expiryYear: `20${expiryYear}`,
        cvv: cvv
      }
    };

    const token = `Bearer ${config.apiKeys.oppwa}`;

    try {
      const result = await createPayment({ body: createPaymentRequest });
      console.log('Payment created:', result);
    } catch (error) {
      logger.error('Error creating payment:', error.message);
    }
  });

program.parse(process.argv);
