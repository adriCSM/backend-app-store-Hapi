const Hapi = require('@hapi/hapi');
require('dotenv').config();

const init = async () => {
  const server = await Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
    routes: {
      cors: {
        origin: ['*'],
      },
    },
  });

  await server.start().then(() => {
    console.log(`server running at ${server.info.uri}`);
  });
};
init();
