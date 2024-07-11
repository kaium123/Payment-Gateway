const querystring = require('querystring');
const { shift4PaymentSchema, createTokenSchema } = require('../models/shift4-models');
const sendRequest = require('../utils/request');
const config = require('../config/config');

const createToken = async (tokenReq, authHeader) => {
  const { error, value } = reateTokenSchema.validate(tokenReq);

  if (error) {
    throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }

  const postData = JSON.stringify(value);

  if (!authHeader) {
    throw new Error('Authorization token is required');
  }

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': authHeader,
      'Content-Length': postData.length,
    },
  };

  console.log(postData)

  const apiURL = `${config.api.shift4BaseURL}/tokens`;
  console.log(apiURL)
  return await sendRequest(apiURL, options, postData);
};

const createPayment = async (req) => {
  // Validate the req.body against shift4PaymentSchema
  const { error, value: paymentData } = shift4PaymentSchema.validate(req.body);

  if (error) {
    throw new Error(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }

  // Now paymentData is of type shift4PaymentSchema and contains the validated data
  const { number, holder, expiryMonth, expiryYear, cvv } = paymentData.card;
  const tokenReq = {
    number,
    expMonth: expiryMonth,
    expYear: expiryYear,
    cvc: cvv,
    cardholderName: holder
  };

  const tokenResponse = await createToken(tokenReq, req.headers['authorization']);
  const tokenResponseBody = JSON.parse(tokenResponse);

  console.log(tokenResponseBody);

  if (!tokenResponseBody.id) {
    throw new Error('Token creation failed: no token id returned');
  }

  const {
    amount,
    currency,
    description
  } = paymentData;

  const postData = JSON.stringify({
    amount: amount,
    currency: currency,
    card: tokenResponseBody.id,
    description: description
  });

  console.log(postData)

  const options = {
    method: 'POST',
    headers: {
      'Authorization': req.headers['authorization'],
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  const apiURL = `${config.api.shift4BaseURL}/charges`;
  console.log(apiURL)
  return await sendRequest(apiURL, options, postData);
};
const getPaymentStatus = async (req) => {
    const chargeID = req.params.chargeID;
  
    if (!chargeID) {
      throw new Error('Charge ID is required');
    }
  
    const token = req.headers['authorization'];
  
    if (!token) {
      throw new Error('Authorization token is required');
    }
  
    console.log(chargeID);
  
    const apiURL = `${config.api.shift4BaseURL}/charges/${chargeID}`;
    console.log(apiURL);
    const options = {
      method: 'GET',
      headers: {
        'Authorization': token
      }
    };
  
    return await sendRequest(apiURL, options);
  };
  
  module.exports = { createPayment, getPaymentStatus };
  
