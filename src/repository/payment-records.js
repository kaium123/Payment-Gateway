
const { PaymentRecord } = require('../models/payment-records');
const { validatePaymentRecord } = require('../utils/validation');

const SavePaymentRecord = async (record) => {

      const validation = validatePaymentRecord(record);
  
      if (validation.error) {
        throw new Error(`Validation error: ${validation.error.details.map(x => x.message).join(', ')}`);
      }
  
      // Log the record object
      console.log("Payment Record:", record);
      let savedRecord;
      try {
        savedRecord = await PaymentRecord.create(record);
        // Log the saved record to confirm it was saved
        console.log("Saved Payment Record:", savedRecord);
      } catch (err) {
        console.error('Error saving payment record:', err);
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
      console.error('Error retrieving payment record:', error);
      throw error;
    }
  };

  module.exports = { SavePaymentRecord, getPaymentRecord };
