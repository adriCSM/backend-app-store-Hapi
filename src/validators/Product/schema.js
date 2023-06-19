const Joi = require('joi');

const PostProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.string().required(),
  image: Joi.required(),
});
const PutProductPayloadSchema = Joi.object({
  productName: Joi.string().required(),
  price: Joi.string().required(),
  image: Joi.required(),
});

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string()
    .valid(
      'image/apng',
      'image/avif',
      'image/gif',
      'image/jpeg',
      'image/png',
      'image/svg+xml',
      'image/webp',
    )
    .required(),
}).unknown();

module.exports = { PostProductPayloadSchema, ImageHeadersSchema, PutProductPayloadSchema };
