const UserHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { usersService, validator }) => {
    const userHandler = new UserHandler(usersService, validator);
    await server.route(routes(userHandler));
  },
};
