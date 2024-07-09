const querystring = require('querystring');
const { ACIPaymentSchema } = require('../models/ACI-models');
const sendRequest = require('../utils/request.utils');
const config = require('../config/ACI-config');

const createPayment = async (req) => {
  const { error, value } = ACIPaymentSchema.validate(req.body);

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

  const apiURL = `${config.api.baseURL}/payments`;
  return await sendRequest(apiURL, options, postData);
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

  const apiURL = `${config.api.baseURL}/payments/${paymentID}?entityId=${entityID}`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  };

  return await sendRequest(apiURL, options);
};

module.exports = { createPayment, getPaymentStatus };
