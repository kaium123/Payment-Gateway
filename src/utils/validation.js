// src/utils/validation.js
function validatePaymentRecord(record) {
    if (!record || typeof record !== 'object') {
      throw new Error('Invalid record');
    }
  
    // Perform more detailed validation as needed
    if (!record.transactionID) {
      throw new Error('transactionID is required');
    }
  
    if (!record.transactionType) {
      throw new Error('transactionType is required');
    }
  
    if((!record.entityID) && (record.transactionType=="aci")) {
      throw new Error('entityID is required');
    }
  
    return true;
  }
  
  module.exports = { validatePaymentRecord };
  