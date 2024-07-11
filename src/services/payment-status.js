const { getAciPaymentStatus } = require('./aci-payment');
const { getShift4PaymentStatus } = require('./shift4-payment');
const { getPaymentRecord } = require('../repository/payment-records')


const getPaymentStatus = async (transactionID) => {
    const record = await getPaymentRecord(transactionID)

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
};

module.exports = {
  getPaymentStatus,
};
