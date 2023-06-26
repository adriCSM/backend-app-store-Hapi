const mongoose = require('mongoose');

const Cart = mongoose.model(
  'Cart',
  new mongoose.Schema({
    user_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    product_id: {
      type: String,
      ref: 'Product',
      require: true,
    },
    count: {
      type: Number,
      require: true,
    },
  }),
);

module.exports = Cart;
