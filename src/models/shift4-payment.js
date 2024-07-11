const Joi = require('joi');

const createTokenSchema = Joi.object({
  number: Joi.string().creditCard().required(),
  expMonth: Joi.number().positive().required(),
  expYear: Joi.number().positive().required(),
  cvc: Joi.string().length(3).required(),
  cardholderName: Joi.string().required()
});

const shift4PaymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  currency: Joi.string().length(3).required(),
  description: Joi.string().optional(),
  card: Joi.object({
    number: Joi.string().creditCard().required(),
    holder: Joi.string().required(),
    expiryMonth: Joi.number().positive().required(),
    expiryYear: Joi.number().positive().required(),
    cvv: Joi.string().length(3).required()
  }).required()
});

module.exports = {
  createTokenSchema,
  shift4PaymentSchema
};
