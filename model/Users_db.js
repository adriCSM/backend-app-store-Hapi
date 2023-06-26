const mongoose = require('mongoose');

const Product = mongoose.model(
  'Product',
  new mongoose.Schema({
    username: {
      type: String,
      required: true,
    },
    phone_number: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
      unique: true,
    },
    password: {
      type: String,
      require: true,
    },
    role: {
      type: String,
      require: true,
      default: 'user',
    },
    created_at: {
      type: Date,
      require: true,
      default: Date.now,
    },
    updated_at: {
      type: Date,
      require: true,
      default: Date.now,
    },
  }),
);

module.exports = Product;
