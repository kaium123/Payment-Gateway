const { DataTypes } = require('sequelize');
const sequelize = require('../infra/database/sequelize'); // Ensure this path is correct
const Joi = require('joi');

// Define the PaymentRecord model
const PaymentRecord = sequelize.define('PaymentRecord', {
  transactionID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
    field: 'transactionid' // Maps model field to database column
  },
  transactionType: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'transactiontype' // Maps model field to database column
  },
  entityID: {
    type: DataTypes.STRING,
    allowNull: false,
    field: 'entityid' // Maps model field to database column
  },
}, {
  tableName: 'payment_records',
  timestamps: false,
});

// Validation schema using Joi
const validatePaymentRecord = (record) => {
  const schema = Joi.object({
    transactionID: Joi.string().required(),
    transactionType: Joi.string().required(),
    entityID: Joi.string(),
  });

  return schema.validate(record);
};

module.exports = {
  PaymentRecord,
  validatePaymentRecord,
};
