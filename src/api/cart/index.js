const CartHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'carts',
  version: '1.0.0',
  register: async (server, { cartsService, validator }) => {
    const cartHandler = new CartHandler(cartsService, validator);

    await server.route(routes(cartHandler));
  },
};
