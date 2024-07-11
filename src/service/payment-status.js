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

    console.log("entity id ",record.entityID)

    let status;
    if (record.transactionType === 'aci') {
      // Call ACI service to get the payment status
      console.log("Fetching ACI status...");
      const aciStatus = await getAciPaymentStatus(transactionID, record.entityID);
      console.log("ACI Status:", aciStatus);
      return { ...record.toJSON(), aciStatus }; // No JSON.parse needed
    } else if (record.transactionType === 'shift4') {
      // Call Shift4 service to get the payment status
      console.log("Fetching Shift4 status...");
      const shift4Status = await getShift4PaymentStatus(transactionID);
      console.log("Shift4 Status:", shift4Status);
      return { ...record.toJSON(), shift4Status: JSON.parse(shift4Status) };
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
