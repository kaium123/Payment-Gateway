const { PaymentRecord } = require('../models/payment-records');
const { getAciPaymentStatus } = require('./aci-service');
const { getShift4PaymentStatus } = require('./shift4-service');

const getPaymentRecord = async (transactionID) => {
  if (!transactionID) {
    throw new Error('Transaction ID is required');
  }

  try {
    const record = await PaymentRecord.findOne({ where: { transactionID } });

    if (!record) {
      throw new Error(`Payment record with ID ${transactionID} not found`);
    }

    if (record.transactionType === 'aci') {
      // Call ACI service to get the payment status
      const aciStatus = await getAciPaymentStatus(transactionID);
      return { ...record.toJSON(), aciStatus };
    } else if (record.transactionType === 'shift4') {
      // Call Shift4 service to get the payment status
      const shift4Status = await getShift4PaymentStatus(transactionID);
      return { ...record.toJSON(), shift4Status };
    }

    return record;
  } catch (error) {
    console.error('Error retrieving payment record:', error);
    throw error;
  }
};

module.exports = {
  getPaymentRecord,
};
