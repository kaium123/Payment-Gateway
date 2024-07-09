#!/usr/bin/env node

const { createPayment, getPaymentStatus } = require('../src/service/App.service');
const config = require('../config/ACI-config');

const run = async () => {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error('No command provided.');
    process.exit(1);
  }

  const command = args[0];
  const token = `Bearer ${config.apiKeys.oppwa}`;

  switch (command) {
    case 'createPayment':
      const createPaymentRequest = {
        entityId: "8a8294174b7ecb28014b9699220015ca",
        amount: "92.00",
        currency: "EUR",
        paymentBrand: "VISA",
        paymentType: "DB",
        card: {
          number: "4200000000000000",
          holder: "Jane Jones",
          expiryMonth: "05",
          expiryYear: "2034",
          cvv: "123"
        }
      };

      try {
        const result = await createPayment({ body: createPaymentRequest, headers: { authorization: token } });
        console.log('Payment created:', result);
      } catch (error) {
        console.error('Error creating payment:', error);
      }
      break;

    case 'get_payment_status':
      const paymentID = 'your_payment_id';
      const entityID = '8a8294174b7ecb28014b9699220015ca';

      try {
        const result = await getPaymentStatus({ params: { paymentID }, query: { entityId: entityID }, headers: { authorization: token } });
        console.log('Payment status:', result);
      } catch (error) {
        console.error('Error getting payment status:', error);
      }
      break;

    default:
      console.error('Unknown command:', command);
      process.exit(1);
  }
};

run();
