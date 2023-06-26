const routes = (handler) => [
  {
    method: 'GET',
    path: '/',
    handler: (request, h) => handler.postAdminHandler(request, h),
  },
  {
    method: 'POST',
    path: '/users',
    handler: (request, h) => handler.postUserHandler(request, h),
  },
  {
    method: 'GET',
    path: '/users',
    handler: (request, h) => handler.getUsersHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
];

module.exports = routes;
