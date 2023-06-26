const routes = (handler) => [
  {
    method: 'POST',
    path: '/products',
    handler: (request, h) => handler.postProductHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
      auth: 'store_jwt',
    },
  },
  {
    method: 'GET',
    path: '/products',
    handler: (request, h) => handler.getAllProductHandler(request, h),
  },
  {
    method: 'GET',
    path: '/products/{id}',
    handler: (request, h) => handler.getProductHandler(request, h),
  },
  {
    method: 'GET',
    path: '/products/',
    handler: (request, h) => handler.serchProductsHandler(request, h),
  },
  {
    method: 'PUT',
    path: '/products/{id}',
    handler: (request, h) => handler.putProductHandler(request, h),
    options: {
      payload: {
        allow: 'multipart/form-data',
        multipart: true,
        output: 'stream',
        maxBytes: 512000,
      },
      auth: 'store_jwt',
    },
  },
  {
    method: 'DELETE',
    path: '/products/{id}',
    handler: (request, h) => handler.deleteProductHandler(request, h),
    options: {
      auth: 'store_jwt',
    },
  },
];
module.exports = routes;
