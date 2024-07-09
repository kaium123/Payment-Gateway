// /service/App.service.js
const https = require('https');
const querystring = require('querystring');

const sendRequest = (apiURL, options, postData) => {
  return new Promise((resolve, reject) => {
    const request = https.request(apiURL, options, (apiRes) => {
      let data = '';

      apiRes.on('data', (chunk) => {
        data += chunk;
      });

      apiRes.on('end', () => {
        resolve(data);
      });
    });

    request.on('error', (error) => {
      reject(error);
    });

    if (postData) {
      request.write(postData);
    }
    request.end();
  });
};

const createPayment = async (req) => {
  const {
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
  } = req.body;

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

  const apiURL = 'https://eu-test.oppwa.com/v1/payments';
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

  const apiURL = `https://eu-test.oppwa.com/v1/payments/${paymentID}?entityId=${entityID}`;
  const options = {
    method: 'GET',
    headers: {
      'Authorization': token
    }
  };

  return await sendRequest(apiURL, options);
};

module.exports = { createPayment, getPaymentStatus };
