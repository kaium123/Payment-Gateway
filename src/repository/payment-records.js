const { PaymentRecord } = require('../models/payment-records');
const { validatePaymentRecord } = require('../utils/validation/validation');
const logger = require('../utils/logger/logger');
const { ValidationError, NotFoundError } = require('../utils/error/error');

const SavePaymentRecord = async (record) => {
  const validation = validatePaymentRecord(record);

  if (validation.error) {
    throw new ValidationError(`Validation error: ${validation.error.details.map(x => x.message).join(', ')}`);
  }

  // Log the record object
  logger.info("Payment Record:", { record });
  let savedRecord;

  try {
    savedRecord = await PaymentRecord.create(record);
    logger.info("Saved Payment Record:", { savedRecord });

  } catch (error) {
    logger.error('Error saving payment record:', error.message);
    throw error;

  }

  return savedRecord;
};

const getPaymentRecord = async (transactionID) => {

  try {
    const record = await PaymentRecord.findOne({ where: { transactionID } });
    if (!record) {
      throw new NotFoundError(`Payment record with ID ${transactionID} not found`);
      
    }
    return record;

  } catch (error) {
    logger.error('Error retrieving payment record:', error.message);
    throw error;
    
  }
};

module.exports = { SavePaymentRecord, getPaymentRecord };
