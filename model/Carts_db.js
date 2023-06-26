const mongoose = require('mongoose');

const Cart = mongoose.model(
  'Cart',
  new mongoose.Schema({
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    product_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      require: true,
    },
    count: {
      type: Number,
      require: true,
      default: 1,
    },
  }),
);

module.exports = Cart;
