const { getAciPaymentStatus } = require('./aci-payment');
const { getShift4PaymentStatus } = require('./shift4-payment');
const { getPaymentRecord } = require('../repository/payment-records');
const logger = require('../utils/logger/logger');
const { NotFoundError, ValidationError } = require('../utils/error/error');

const getPaymentStatus = async (transactionID) => {
  try {
    if (!transactionID) {
      throw new ValidationError('Transaction ID is required');
    }

    const record = await getPaymentRecord(transactionID);

    if (record.transactionType === 'aci') {
      logger.info("Fetching ACI status...");
      const aciStatus = await getAciPaymentStatus(transactionID, record.entityID);
      logger.info("ACI Status:", { aciStatus });
      return { ...record.toJSON(), aciStatus };

    } else if (record.transactionType === 'shift4') {
      logger.info("Fetching Shift4 status...");
      const shift4Status = await getShift4PaymentStatus(transactionID);
      logger.info("Shift4 Status:", { shift4Status });
      return { ...record.toJSON(), shift4Status };

    }
    return record;

  } catch (error) {
    logger.error('Error retrieving payment status:', { error: error.message });
    throw error;
  }
};

module.exports = {
  getPaymentStatus,
};
