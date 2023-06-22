const routes = (handler) => [
  {
    method: 'POST',
    path: '/auth',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/auth',
    handler: (request, h) => handler.putAuthenticationHandler(request, h),
  },
  {
    method: 'DELETE',
    path: '/auth',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
  },
];

module.exports = routes;
