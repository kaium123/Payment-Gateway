const { aciPaymentSchema } = require('../models/aci-payment');
const { PaymentRecord } = require('../models/payment-records');
const { validatePaymentRecord } = require('../utils/validation');
const { SavePaymentRecord } = require('../repository/payment-records')

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
  console.log(entityId)

  const apiURL = `${config.api.aciBaseURL}/payments`;
  const responseString = await sendRequest(apiURL, options, postData);

  // Parse the response string into an object
  const response = JSON.parse(responseString);

  // Extract id from response and save it in payment_records table
  if (response && response.id) {
    const record = {
      transactionID: response.id,
      transactionType: "aci",
      entityID: entityId,
    };
    console.log(entityId)


    const savedRecord = await SavePaymentRecord(record)
  } else {
    console.error("API response does not contain 'id' field:", response);
  }

  return response;
};

const getAciPaymentStatus = async (transactionID,entityID) => {
  const apiURL = `${config.api.aciBaseURL}/payments/${transactionID}?entityId=${entityID}`;
  const authToken = 'OGE4Mjk0MTc0YjdlY2IyODAxNGI5Njk5MjIwMDE1Y2N8c3k2S0pzVDg='; 
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${authToken}`,
      'Content-Type': 'application/json'
    }
  };

  try {
    const response = await sendRequest(apiURL, options);
    return JSON.parse(response);
  } catch (error) {
    console.error('Error retrieving ACI payment status:', error);
    throw error;
  }
};

module.exports = { createPayment, getAciPaymentStatus };
