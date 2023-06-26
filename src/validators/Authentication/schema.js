const Joi = require('joi');

const PostAuthenticationPaylodSchema = Joi.object({
  email: Joi.string().email({ tlds: true }).required(),
  password: Joi.string().required(),
});
const PutAuthenticationPaylodaSchema = Joi.object({
  refreshToken: Joi.string().required(),
});
const DeleteAuthenticationPaylodaSchema = Joi.object({
  refreshToken: Joi.string().required(),
});

module.exports = {
  PostAuthenticationPaylodSchema,
  PutAuthenticationPaylodaSchema,
  DeleteAuthenticationPaylodaSchema,
};
