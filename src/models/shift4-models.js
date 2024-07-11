const Joi = require('joi');

const shift4PaymentSchema = Joi.object({
    amount: Joi.number().required(),
    currency: Joi.string().required(),
    description: Joi.string().required(),
    card: Joi.object({
      number: Joi.string().required(),
      holder: Joi.string().required(),
      expiryMonth: Joi.number().required(),
      expiryYear: Joi.number().required(),
      cvv: Joi.string().required()
    }).required()
});

const CreateTokenSchema = Joi.object({
    number: Joi.string().required(),
    expMonth: Joi.number().required(),
    expYear: Joi.number().required(),
    cvc: Joi.string().required(),
    cardholderName: Joi.string().required()
});

module.exports = { shift4PaymentSchema, CreateTokenSchema };
