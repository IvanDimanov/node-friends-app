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

process.stdout.write('\n');
process.stdout.write(`port = ${port}\n`);
process.stdout.write(`process.env.PORT = ${process.env.PORT}\n`);

/**
 * Creates the main Koa app with all middlewares, APIs, logging, and error handling.
 *
 * @category BackEnd
 *
 * @return {Object} Instance of Koa
 */
function createApp() {
  const app = new Koa();

  process.stdout.write(`postgres = ${postgres}\n`);

  app.context.postgres = postgres;

  app
      .use(helmet())
      .use(catchError())
      .use(logger)
      .use(bodyParser())
      .use(jwt({secret: process.env.JWT_SECRET || 'Pass@123', key: 'jwtdata', passthrough: true}))
      .use(jwtToUser);

  process.stdout.write(`process.env.ALLOW_CORS = ${process.env.ALLOW_CORS}\n`);

  if (process.env.ALLOW_CORS) {
    app.use(cors());
  }

  applyAllRoutes(app);

  app
      .use(notFound)
      .on('error', onError);

  return app;
}

process.stdout.write(`process.env.NODE_ENV = ${process.env.NODE_ENV}\n`);

/* Check if this file is called for starting the app or called as additional module to already started app */
/* istanbul ignore next: because this involves loading file via `require` or executing the file directly from the terminal */
if (process.env.NODE_ENV === 'test') {
  module.exports = createApp;
} else {
  const server = createApp().listen(port, () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
  });
}
