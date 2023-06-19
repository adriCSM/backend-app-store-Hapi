const Hapi = require('@hapi/hapi');
require('dotenv').config();
const Jwt = require('@hapi/jwt');
const Inert = require('@hapi/inert');

// USER
const users = require('./api/User');
const UsersService = require('./services/Postgres/UsersService');
const UserValidator = require('./validators/User');

// PRODUCT
const products = require('./api/Product');
const ProductsService = require('./services/Postgres/ProductsService');
const ProductValidator = require('./validators/Product');
const FirebaseService = require('./services/firebase/FirebaseService');

// CART
const carts = require('./api/cart');
const CartsService = require('./services/Postgres/CartsService');
const CartValidator = require('./validators/Cart');

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
  const firebaseService = new FirebaseService();
  const productsService = new ProductsService(firebaseService);
  const cartsService = new CartsService();

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
    {
      plugin: Inert,
    },
  ]);

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
    {
      plugin: products,
      options: {
        productsService,
        usersService,
        validator: ProductValidator,
      },
    },
    {
      plugin: carts,
      options: {
        cartsService,
        validator: CartValidator,
      },
    },
  ]);

  server.ext('onPreResponse', errorHandling);
  await server.start().then(() => {
    console.log(`server running at ${server.info.uri}`);
  });
};
init();
