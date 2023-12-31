const routes = (handler) => [
  {
    method: 'GET',
    path: '/carts/products',
    handler: (request, h) => handler.getProductsInCartHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
  {
    method: 'POST',
    path: '/carts',
    handler: (request, h) => handler.postCartHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
  {
    method: 'PUT',
    path: '/carts',
    handler: (request, h) => handler.putCountProductOnCartHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },

  {
    method: 'DELETE',
    path: '/carts/{id}',
    handler: (request, h) => handler.deleteProductInCartHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
];

module.exports = routes;
