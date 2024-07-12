// src/validators/validatePaymentRecord.js
const { ValidationError } = require('../utils/error');

function validatePaymentRecord(record) {
  if (!record || typeof record !== 'object') {
    throw ValidationError('Invalid record');
  }

  // Perform more detailed validation as needed
  if (!record.transactionID) {
    throw ValidationError('transactionID is required');
  }

  if (!record.transactionType) {
    throw ValidationError('transactionType is required');
  }

  if (!record.entityID && record.transactionType === 'aci') {
    throw ValidationError('entityID is required for aci transactions');
  }

  return true;
}

module.exports = { validatePaymentRecord };
