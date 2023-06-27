const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string().required(),
  phoneNumber: Joi.string().length(12).required(),
  email: Joi.string().email({ tlds: true }).required(),
  password: Joi.string()
    .min(8)
    .regex(/^(?=.*[A-Z])(?=.*[!@#$%^&*])/)
    .required(),
  confirmPassword: Joi.string().required,
});

module.exports = { UserPayloadSchema };
