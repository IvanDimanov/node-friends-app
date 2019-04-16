const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');

const catchError = require('./koa-middleware/catchError');
const logger = require('./koa-middleware/logger');
const jwtToUser = require('./koa-middleware/jwtToUser');
const notFound = require('./koa-middleware/notFound');
const onError = require('./koa-middleware/onError');
const {applyAllRoutes} = require('./koa-middleware/applyAllRoutes');

const postgres = require('../database/models');

const app = new Koa();

const port = process.env.PORT || 8000;

app.context.postgres = postgres;

app
    .use(helmet())
    .use(catchError())
    .use(logger)
    .use(bodyParser())
    .use(jwt({secret: process.env.JWT_SECRET || 'Pass@123', key: 'jwtdata', passthrough: true}))
    .use(jwtToUser);

applyAllRoutes(app);

app
    .use(notFound)
    .on('error', onError);

/* Check if this file is called for starting the app or called as additional module to already started app */
/* istanbul ignore next: because this involves loading file via `require` or executing the file directly from the terminal */
if (process.env.NODE_ENV === 'test') {
  module.exports = app;
} else {
  const server = app.listen(port, () => {
    process.stdout.write(`Server listening on ${JSON.stringify(server.address())}\n`);
  });
}
