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
];

module.exports = routes;
