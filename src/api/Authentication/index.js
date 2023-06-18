const AuthenticationHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'authnetication',
  version: '1.0.0',
  register: async (server, { authenticationsService, usersService, TokenManager, validator }) => {
    const authenticationHandler = new AuthenticationHandler(
      authenticationsService,
      usersService,
      TokenManager,
      validator,
    );
    await server.route(routes(authenticationHandler));
  },
};
