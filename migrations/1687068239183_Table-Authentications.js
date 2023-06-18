exports.up = (pgm) => {
  pgm.createTable('authentications', {
    user_id: {
      type: 'VARCHAR(50)',
      notNull: true,
    },
    token: {
      type: 'TEXT',
      notNull: true,
    },
  });
};

exports.down = (pgm) => {
  pgm.dropTable('authentications');
};
