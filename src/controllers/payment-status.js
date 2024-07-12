const { getPaymentStatus } = require('../services/payment-status');

const getPaymentRecordHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await getPaymentStatus(id);
    res.status(200).json(record);

  } catch (error) {
    res.status(500).json({ error: error.message });

  }
};

module.exports = {
  getPaymentRecordHandler,
};
