const { aciPaymentSchema } = require('../models/aci-models');
const { PaymentRecord, validatePaymentRecord } = require('../models/payment-records');
const sendRequest = require('../utils/request');
const config = require('../config/config');
const querystring = require('querystring');

const createPayment = async (req) => {
  const { error, value } = aciPaymentSchema.validate(req.body);

  if (error) {
    throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }

  const {
    entityId,
    amount,
    currency,
    paymentBrand,
    paymentType,
    card: {
      number: cardNumber,
      holder: cardHolder,
      expiryMonth,
      expiryYear,
      cvv
    }
  } = value;

  const token = req.headers['authorization'];

  if (!token) {
    throw new Error('Authorization token is required');
  }

  const postData = querystring.stringify({
    entityId,
    amount,
    currency,
    paymentBrand,
    paymentType,
    'card.number': cardNumber,
    'card.holder': cardHolder,
    'card.expiryMonth': expiryMonth,
    'card.expiryYear': expiryYear,
    'card.cvv': cvv
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': token,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const apiURL = `${config.api.aciBaseURL}/payments`;
  const response = await sendRequest(apiURL, options, postData);

  // Extract id from response and save it in payment_records table
  if (response && response.id) {
    const record = {
      transactionID: response.id,
      transactionType: paymentType,
      entityID: entityId,
    };

    const { error } = validatePaymentRecord(record);

    if (error) {
      throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }

    try {
      await PaymentRecord.create(record);
    } catch (err) {
      console.error('Error saving payment record:', err);
      throw err;
    }
  }

  return response;
};

const getPaymentStatus = async (req) => {
  const paymentID = req.params.paymentID;
  const entityID = req.query.entityId;

  if (!entityID) {
    throw new Error('Entity ID is required');
  }

  const token = req.headers['authorization'];

  if (!token) {
    throw new Error('Authorization token is required');
  }

  const apiURL = `${config.api.aciBaseURL}/payments/${paymentID}?entityId=${entityID}`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  };

  return await sendRequest(apiURL, options);
};

module.exports = { createPayment, getPaymentStatus };
