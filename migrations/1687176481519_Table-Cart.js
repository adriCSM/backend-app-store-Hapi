exports.up = (pgm) => {
  pgm.createTable('carts', {
    user_id: {
      type: 'VARCHAR(100)',
    },
    product_id: {
      type: 'VARCHAR(100)',
    },
    count: {
      type: 'INTEGER',
      default: 0,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('carts');
};
