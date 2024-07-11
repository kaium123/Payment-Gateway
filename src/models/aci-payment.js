const Joi = require('joi');

const aciPaymentSchema = Joi.object({
  entityId: Joi.string().required(),
  amount: Joi.number().required(),
  currency: Joi.string().required(),
  paymentBrand: Joi.string().required(),
  paymentType: Joi.string().required(),
  card: Joi.object({
    number: Joi.string().required(),
    holder: Joi.string().required(),
    expiryMonth: Joi.string().required(),
    expiryYear: Joi.string().required(),
    cvv: Joi.string().required()
  }).required()
});

module.exports = { aciPaymentSchema };
