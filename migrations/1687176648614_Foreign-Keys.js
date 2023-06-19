exports.up = (pgm) => {
  pgm.addConstraint(
    'authentications',
    'auhentications.user_id||users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );

  pgm.addConstraint(
    'carts',
    'carts.user_id||users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
  pgm.addConstraint(
    'carts',
    'carts.product_id||products.id',
    'FOREIGN KEY(product_id) REFERENCES products(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('authentications', 'auhentications.user_id||users.id');
  pgm.dropConstraint('carts', 'carts.user_id||users.id');
  pgm.dropConstraint('carts', 'carts.product_id||products.id');
};
