const { PaymentRecord } = require('../models/payment-records');
const { validatePaymentRecord } = require('../utils/validation');
const logger = require('../utils/logger');


// Log a message
logger.info("hi");
logger.error("er")

const SavePaymentRecord = async (record) => {
  const validation = validatePaymentRecord(record);

  if (validation.error) {
    throw new Error(`Validation error: ${validation.error.details.map(x => x.message).join(', ')}`);
  }

  // Log the record object
  logger.info("Payment Record:", { record });
  let savedRecord;
  try {
    savedRecord = await PaymentRecord.create(record);
    // Log the saved record to confirm it was saved
    logger.info("Saved Payment Record:", { savedRecord });
  } catch (err) {
    logger.error('Error saving payment record:', { error: err.message });
    throw err;
  }

  return savedRecord;
};

const getPaymentRecord = async (transactionID) => {
  if (!transactionID) {
    throw new Error('Transaction ID is required');
  }

  try {
    const record = await PaymentRecord.findOne({ where: { transactionID } });

    if (!record) {
      throw new Error(`Payment record with ID ${transactionID} not found`);
    }

    return record;
  } catch (error) {
    logger.error('Error retrieving payment record:', { error: error.message });
    throw error;
  }
};

module.exports = { SavePaymentRecord, getPaymentRecord };
