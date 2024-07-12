const querystring = require('querystring');
const { createTokenSchema, shift4PaymentSchema } = require('../models/shift4-payment'); // Adjust path if necessary
const sendRequest = require('../utils/request');
const config = require('../config/config');
const { PaymentRecord } = require('../models/payment-records');
const { validatePaymentRecord } = require('../utils/validation');
const logger = require('../utils/logger'); // Assuming logger is properly set up
const { ValidationError, NotFoundError, UnauthorizedError, AppError } = require('../utils/error');

const createToken = async (tokenReq, authHeader) => {
  try {
    const { error, value } = createTokenSchema.validate(tokenReq);

    if (error) {
      throw ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
    }

    const postData = JSON.stringify(value);

    if (!authHeader) {
      throw UnauthorizedError('Authorization token is required');
    }

    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': authHeader,
        'Content-Length': postData.length,
      },
    };

    console.log(postData);

    const apiURL = `${config.api.shift4BaseURL}/tokens`;
    console.log(apiURL);
    return await sendRequest(apiURL, options, postData);
  } catch (error) {
    logger.error('Error creating token:', error.message);
    if (error.isAppError) throw error;
    throw AppError('Failed to create token', 500);
  }
};

const createPayment = async (req) => {
  try {
    // Validate the req.body against shift4PaymentSchema
    const { error, value: paymentData } = shift4PaymentSchema.validate(req.body);

    if (error) {
      throw ValidationError(`Validation error: ${error.details.map(x => x.message).join(', ')}`);
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
      throw AppError('Token creation failed: no token id returned', 500);
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

    console.log(postData);

    const options = {
      method: 'POST',
      headers: {
        'Authorization': req.headers['authorization'],
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const apiURL = `${config.api.shift4BaseURL}/charges`;
    console.log(apiURL);
    const responseString = await sendRequest(apiURL, options, postData);

    // Parse the response string into an object
    const response = JSON.parse(responseString);

    // Print the response
    console.log("API Response:", response);

    // Extract id from response and save it in payment_records table
    if (response && response.id) {
      const record = {
        transactionID: response.id,
        transactionType: "shift4",
        entityID: "",
      };

      const validation = validatePaymentRecord(record);

      if (validation.error) {
        throw ValidationError(`Validation error: ${validation.error.details.map(x => x.message).join(', ')}`);
      }

      // Log the record object
      console.log("Payment Record:", record);

      try {
        const savedRecord = await PaymentRecord.create(record);
        // Log the saved record to confirm it was saved
        console.log("Saved Payment Record:", savedRecord);
      } catch (err) {
        logger.error('Error saving payment record:', err.message);
        throw AppError('Failed to save payment record', 500);
      }
    } else {
      console.error("API response does not contain 'id' field:", response);
    }

    return response;
  } catch (error) {
    logger.error('Error creating payment:', error.message);
    if (error.isAppError) throw error;
    throw AppError('Failed to create payment', 500);
  }
};

const getShift4PaymentStatus = async (chargeID) => {
  try {
    if (!chargeID) {
      throw ValidationError('Charge ID is required');
    }

    const apiURL = `${config.api.shift4BaseURL}/charges/${chargeID}`;
    console.log(apiURL);
    const options = {
      method: 'GET',
      headers: {
        'Authorization': `Basic ${Buffer.from(config.apiKeys.shift4ApiKey + ':').toString('base64')}`
      }
    };

    const response = await sendRequest(apiURL, options);
    return JSON.parse(response);
  } catch (error) {
    logger.error('Error retrieving Shift4 payment status:', error.message);
    if (error.isAppError) throw error;
    throw AppError('Failed to retrieve payment status', 500);
  }
};

module.exports = { createPayment, getShift4PaymentStatus };
