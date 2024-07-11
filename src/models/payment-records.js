// src/models/payment-records.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database/sequelize'); // Ensure this path is correct
const Joi = require('joi');

// Define the PaymentRecord model
const PaymentRecord = sequelize.define('PaymentRecord', {
  transactionID: {
    type: DataTypes.STRING,
    allowNull: false,
    primaryKey: true,
  },
  transactionType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  entityID: {
    type: DataTypes.STRING,
    allowNull: false,
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
    entityID: Joi.string().required(),
  });

  return schema.validate(record);
};

module.exports = {
  PaymentRecord,
  validatePaymentRecord,
};
