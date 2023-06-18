const ClientError = require('./CLientError');

const errorHandling = (request, h) => {
  const { response } = request;
  if (response instanceof Error) {
    if (response instanceof ClientError) {
      const newResponse = h
        .response({
          status: 'fail',
          message: response.message,
        })
        .code(response.statusCode);
      return newResponse;
    }

    if (!response.isServer) {
      return h.continue;
    }

    const newResponse = h
      .response({
        status: 'error',
        message: response.output.payload.error,
      })
      .code(500);
    console.log(response.message);
    return newResponse;
  }
  return h.continue;
};

module.exports = errorHandling;
