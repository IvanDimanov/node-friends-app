const Koa = require('koa');
const Router = require('koa-router');
const bodyParser = require('koa-bodyparser');
const helmet = require('koa-helmet');
const jwt = require('koa-jwt');

const catchError = require('./koa-middleware/catchError');
const logger = require('./koa-middleware/logger');
const jwtToUser = require('./koa-middleware/jwtToUser');
const notFound = require('./koa-middleware/notFound');
const onError = require('./koa-middleware/onError');

const postgres = require('../database/models');

const app = new Koa();
const router = new Router();

const port = process.env.PORT || 8000;




const HttpError = require('./koa-middleware/HttpError');

router.get('/', (ctx, next) => {
  ctx.body = ctx.state.userPermissions;
});

router.get('/users/:id', (ctx, next) => {
  ctx.body = `Returns user ${ctx.params.id}`;
});

router.get('/throw', (ctx, next) => {
  throw new Error('Test err');
});

router.get('/throw-http-error', (ctx, next) => {
  throw new HttpError(401, 'NOT_AUTH', 'Not auth');
});







app.context.postgres = postgres;

app
    .use(helmet())
    .use(bodyParser())
    .use(catchError)
    .use(logger)
    .use(jwt({secret: process.env.JWT_SECRET || 'Pass@123', key: 'jwtdata', passthrough: true}))
    .use(jwtToUser)
    .use(router.routes())
    .use(router.allowedMethods())
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
