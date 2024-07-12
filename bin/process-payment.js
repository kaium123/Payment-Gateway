#!/usr/bin/env node

const { program } = require('commander');
const { createPayment, getPaymentStatus } = require('../src/services/aci-payment'); // Adjust the path if necessary
const config = require('../src/config/config');

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
        expiryYear: `20${expiryYear}`, // Adjusting the year format
        cvv: cvv
      }
    };

    const token = `Bearer ${config.apiKeys.oppwa}`;

    try {
      const result = await createPayment({ body: createPaymentRequest, headers: { authorization: token } });
      console.log('Payment created:', result);
    } catch (error) {
      console.error('Error creating payment:', error);
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
        expiryYear: `20${expiryYear}`, // Adjusting the year format
        cvv: cvv
      }
    };

    const token = `Bearer ${config.apiKeys.oppwa}`;

    try {
      const result = await createPayment({ body: createPaymentRequest, headers: { authorization: token } });
      console.log('Payment created:', result);
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  });

program.parse(process.argv);
