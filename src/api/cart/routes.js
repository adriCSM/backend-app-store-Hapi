const routes = (handler) => [
  {
    method: 'POST',
    path: '/carts',
    handler: (request, h) => handler.postCartHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },

  {
    method: 'DELETE',
    path: '/carts',
    handler: (request, h) => handler.deleteCartHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
];

module.exports = routes;
