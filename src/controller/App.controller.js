// /controllers/App.controller.js
const { createPayment, getPaymentStatus } = require('../service/App.service');

const createPaymentHandler = async (req, res) => {
  try {
    const response = await createPayment(req);
    res.send(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

const getPaymentStatusHandler = async (req, res) => {
  try {
    const response = await getPaymentStatus(req);
    res.send(response);
  } catch (error) {
    console.error('Error:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

module.exports = { createPaymentHandler, getPaymentStatusHandler };
