const { getPaymentRecord } = require('../service/payment-status'); // Ensure this path is correct

const getPaymentRecordHandler = async (req, res) => {
  const { id } = req.params;

  try {
    const record = await getPaymentRecord(id);
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getPaymentRecordHandler,
};
