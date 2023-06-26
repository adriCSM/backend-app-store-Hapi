const mongoose = require('mongoose');

const Authentication = mongoose.model(
  'Authentication',
  new mongoose.Schema({
    user_id: {
      type: String,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      require: true,
    },
  }),
);

module.exports = Authentication;
