const { aciPaymentSchema } = require('../models/aci-payment');
const { PaymentRecord } = require('../models/payment-records');
const { validatePaymentRecord } = require('../utils/validation/validation');
const { SavePaymentRecord } = require('../repository/payment-records');
const sendRequest = require('../utils/https/request');
const config = require('../infra/config/config');
const querystring = require('querystring');
const logger = require('../utils/logger/logger');
const { ValidationError, UnauthorizedError, AppError } = require('../utils/error/error');

const createPayment = async (req) => {
  const entityId = config.apiKeys.aciEntityID
  const paymentType = "DB"
  const paymentBrand = "VISA"
  const { error, value } = aciPaymentSchema.validate(req.body);

  if (error) {
    throw new ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
  }

  const {
    amount,
    currency,
    card: {
      number: cardNumber,
      expiryMonth,
      expiryYear,
      cvv
    }
  } = value;

  const postData = querystring.stringify({
    entityId,
    amount,
    currency,
    paymentBrand,
    paymentType,
    'card.number': cardNumber,
    'card.expiryMonth': expiryMonth,
    'card.expiryYear': expiryYear,
    'card.cvv': cvv
  });

  const options = {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${config.apiKeys.aciBrearerToken}`,
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(postData)
    }
  };

  try {
    const apiURL = `${config.api.aciBaseURL}/payments`;
    console.log(apiURL)

    const responseString = await sendRequest(apiURL, options, postData);
    const response = JSON.parse(responseString);

    if (response && response.id) {
      const record = {
        transactionID: response.id,
        transactionType: 'aci',
        entityID: entityId,
      };

      const savedRecord = await SavePaymentRecord(record);

    } else {
      logger.error("API response does not contain 'id' field:", response);
      throw new AppError("API response does not contain 'id' field");

    }

    return {
      transactionID: response.id,
      amount: amount,
      currency: currency,
      card: {
        bin:response.card.bin
      },
      created: response.timestamp
    };

  } catch (error) {
    logger.error('Error creating payment:', error.message);
    throw error;

  }
};

const getAciPaymentStatus = async (transactionID, entityID) => {
  const apiURL = `${config.api.aciBaseURL}/payments/${transactionID}?entityId=${entityID}`;
  const authToken = config.apiKeys.aciBrearerToken; 
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
    logger.error('Error retrieving ACI payment status:', error.message);
    throw error;

  }
};

module.exports = { createPayment, getAciPaymentStatus };
