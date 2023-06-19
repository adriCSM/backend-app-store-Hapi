const ProductHandler = require('./handler');
const routes = require('./routes');

module.exports = {
  name: 'products',
  version: '1.0.0',
  register: async (server, { productsService, usersService, validator }) => {
    const productHandler = new ProductHandler(productsService, usersService, validator);
    await server.route(routes(productHandler));
  },
};
