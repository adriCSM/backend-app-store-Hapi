const routes = (handler) => [
  {
    method: 'POST',
    path: '/auth',
    handler: (request, h) => handler.postAuthenticationHandler(request, h),
    options: {
      state: { parse: true, failAction: 'error' },
    },
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
