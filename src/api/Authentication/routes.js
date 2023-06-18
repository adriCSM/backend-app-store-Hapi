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
    options: {
      auth: 'refresh_acces_token',
    },
  },
  {
    method: 'DELETE',
    path: '/auth',
    handler: (request, h) => handler.deleteAuthenticationHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
];

module.exports = routes;
