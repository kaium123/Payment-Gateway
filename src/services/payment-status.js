const { getAciPaymentStatus } = require('./aci-payment');
const { getShift4PaymentStatus } = require('./shift4-payment');
const { getPaymentRecord } = require('../repository/payment-records');
const logger = require('../utils/logger');
const { NotFoundError, ValidationError, AppError } = require('../utils/error');

const getPaymentStatus = async (transactionID) => {
  try {
    if (!transactionID) {
      throw new ValidationError('Transaction ID is required');
    }

    const record = await getPaymentRecord(transactionID);

    if (!record) {
      throw new NotFoundError(`Payment record with ID ${transactionID} not found`);
    }

    if (record.transactionType === 'aci') {
      // Call ACI service to get the payment status
      logger.info("Fetching ACI status...");
      const aciStatus = await getAciPaymentStatus(transactionID, record.entityID);
      logger.info("ACI Status:", { aciStatus });
      return { ...record.toJSON(), aciStatus };

    } else if (record.transactionType === 'shift4') {
      // Call Shift4 service to get the payment status
      logger.info("Fetching Shift4 status...");
      const shift4Status = await getShift4PaymentStatus(transactionID);
      logger.info("Shift4 Status:", { shift4Status });
      return { ...record.toJSON(), shift4Status: JSON.parse(shift4Status) };

    }

    return record;
  } catch (error) {
    logger.error('Error retrieving payment status:', { error: error.message });
    
    if (error instanceof AppError) {
      throw error;
    } else {
      throw new AppError('An unexpected error occurred while retrieving payment status', 500);
    }
  }
};

module.exports = {
  getPaymentStatus,
};
