const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');
const cors = require('@koa/cors');

const catchError = require('./koa-middleware/catchError');
const logger = require('./koa-middleware/logger');
const jwtToUser = require('./koa-middleware/jwtToUser');
const notFound = require('./koa-middleware/notFound');
const onError = require('./koa-middleware/onError');
const {applyAllRoutes} = require('./koa-middleware/applyAllRoutes');

const postgres = require('../database/models');

const port = process.env.PORT || 8000;

/**
 * Creates the main Koa app with all middlewares, APIs, logging, and error handling.
 *
 * @category BackEnd
 *
 * @return {Object} Instance of Koa
 */
function createApp() {
  const app = new Koa();

  app.context.postgres = postgres;

  setInterval(() => {
    console.log(' ')
    console.log( process.env )
    console.log(' ')
  }, 10 * 1000)

  app
      .use(helmet())
      .use(catchError())
      .use(logger)
      .use(bodyParser())
      .use(jwt({secret: process.env.JWT_SECRET || 'Pass@123', key: 'jwtdata', passthrough: true}))
      .use(jwtToUser);

  if (process.env.ALLOW_CORS) {
    app.use(cors());
  }

  applyAllRoutes(app);

  app
      .use(notFound)
      .on('error', onError);

  return app;
}

/* Check if this file is called for starting the app or called as additional module to already started app */
/* istanbul ignore next: because this involves loading file via `require` or executing the file directly from the terminal */
if (process.env.NODE_ENV === 'test') {
  module.exports = createApp;
} else {
  const server = createApp().listen(port, () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
  });
}
