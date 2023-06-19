const InvariantError = require('../../Error/InvariantError');
const {
  PostProductPayloadSchema,
  ImageHeadersSchema,
  PutProductPayloadSchema,
} = require('./schema');

const ProductValidator = {
  validatePostProductPayload: (payload) => {
    const validationResult = PostProductPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validateImageHeaders: (payload) => {
    const validationResult = ImageHeadersSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
  validatePuttProductPayload: (payload) => {
    const validationResult = PutProductPayloadSchema.validate(payload);
    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = ProductValidator;
