const InvariantError = require('../../Error/InvariantError');
const { CartPostPayloadSchema } = require('./schema');

const CartValidator = {
  validateCartPostPayload: (payload) => {
    const validationResult = CartPostPayloadSchema.validate(payload);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};
module.exports = CartValidator;
