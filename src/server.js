const Hapi = require('@hapi/hapi');
require('dotenv').config();
const Jwt = require('@hapi/jwt');

// USER
const users = require('./api/User');
const UsersService = require('./services/Postgres/UsersService');
const UserValidator = require('./validators/User');

// AUTHENTICATION
const authentication = require('./api/Authentication');
const AuthenticationService = require('./services/Postgres/AuthenticationsService');
const AuthenticationValidator = require('./validators/Authentication');
const TokenManager = require('./token/TokenManager');

// ERROR HANDLING
const errorHandling = require('./Error/errorHandling');

const init = async () => {
  const usersService = new UsersService();
  const authenticationsService = new AuthenticationService();

  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.register([
    {
      plugin: Jwt,
    },
  ]);

  server.auth.strategy('refresh_acces_token', 'jwt', {
    keys: process.env.REFRESH_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.REFRESH_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  server.auth.strategy('store_jwt', 'jwt', {
    keys: process.env.ACCESS_TOKEN_KEY,
    verify: {
      aud: false,
      iss: false,
      sub: false,
      maxAgeSec: process.env.ACCESS_TOKEN_AGE,
    },
    validate: (artifacts) => ({
      isValid: true,
      credentials: {
        id: artifacts.decoded.payload.id,
      },
    }),
  });

  await server.register([
    {
      plugin: users,
      options: {
        usersService,
        validator: UserValidator,
      },
    },
    {
      plugin: authentication,
      options: {
        authenticationsService,
        usersService,
        TokenManager,
        validator: AuthenticationValidator,
      },
    },
  ]);

  server.ext('onPreResponse', errorHandling);
  await server.start().then(() => {
    console.log(`server running at ${server.info.uri}`);
  });
};
init();
