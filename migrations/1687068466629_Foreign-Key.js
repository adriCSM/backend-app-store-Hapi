exports.up = (pgm) => {
  pgm.addConstraint(
    'authentications',
    'auhentications.user_id||users.id',
    'FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE',
  );
};

exports.down = (pgm) => {
  pgm.dropConstraint('authentications', 'auhentications.user_id||users.id');
};
