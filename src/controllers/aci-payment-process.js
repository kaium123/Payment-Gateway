const { createPayment, getAciPaymentStatus } = require('../services/aci-payment-process');

const createPaymentHandler = async (req, res) => {
  try {
    const response = await createPayment(req);
    res.send(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error.message);
  }
};

const getPaymentStatusHandler = async (req, res) => {
  try {
    // Fetch transactionID from URL parameters
    const transactionID = req.params.paymentID; 
    console.log("transactionID: ", transactionID);

    // Fetch entityID from query parameters
    const entityID = req.query.entityId;  // Note the change here
    console.log("entityID: ", entityID);

    if (!transactionID) {
      return res.status(400).send('Transaction ID is required');
    }



    const response = await getAciPaymentStatus(transactionID,entityID);
    res.send(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error.message);
  }
};

module.exports = { createPaymentHandler, getPaymentStatusHandler };
