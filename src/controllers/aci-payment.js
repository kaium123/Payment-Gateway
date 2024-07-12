const { createPayment, getAciPaymentStatus } = require('../services/aci-payment');
const { ValidationError, NotFoundError, AppError } = require('../utils/error/error');
const logger = require('../utils/logger/logger');

const createPaymentHandler = async (req, res) => {
  try {
    const response = await createPayment(req);
    res.status(200).json(response);
    
  } catch (error) {
    logger.error('Error in createPaymentHandler:', { message: error.message, stack: error.stack });

    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });

    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });

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
    const transactionID = req.params.paymentID;
    const entityID = req.query.entityId;

    if (!transactionID) {
      return res.status(400).json({ error: 'Transaction ID is required' });
    }

    const response = await getAciPaymentStatus(transactionID, entityID);
    res.status(200).json(response);

  } catch (error) {
    logger.error('Error in getPaymentStatusHandler:', { message: error.message, stack: error.stack });

    if (error instanceof ValidationError) {
      res.status(400).json({ error: error.message });

    } else if (error instanceof UnauthorizedError) {
      res.status(401).json({ error: error.message });

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
