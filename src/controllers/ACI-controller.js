const { createPayment, getPaymentStatus } = require('../service/ACI-service');

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
    const response = await getPaymentStatus(req);
    res.send(response);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send(error.message);
  }
};

module.exports = { createPaymentHandler, getPaymentStatusHandler };
