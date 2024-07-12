const { createPayment, getPaymentStatus } = require('../services/shift4-payment');
const { ValidationError, NotFoundError, AppError } = require('../utils/error');
const logger = require('../utils/logger');

const createPaymentHandler = async (req, res) => {
  try {
    const response = await createPayment(req);
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in createPaymentHandler:', { message: error.message, stack: error.stack });

    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof AppError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

const getPaymentStatusHandler = async (req, res) => {
  try {
    const response = await getPaymentStatus(req);
    console.log("res. ",response)
    res.status(200).json(response);
  } catch (error) {
    logger.error('Error in getPaymentStatusHandler:', { message: error.message, stack: error.stack });

    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });
    } else if (error instanceof NotFoundError) {
      res.status(404).json({ error: error.message });
    } else if (error instanceof AppError) {
      res.status(500).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
};

module.exports = { createPaymentHandler, getPaymentStatusHandler };
