exports.up = (pgm) => {
  pgm.createTable('carts', {
    user_id: {
      type: 'VARCHAR(100)',
    },
    product_id: {
      type: 'VARCHAR(100)',
    },
    look: {
      type: 'BOOLEAN',
      default: false,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('carts');
};
