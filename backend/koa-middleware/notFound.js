const HttpError = require('./HttpError');

/**
 * This middleware should be use as last in the koa app.
 * If no other middlewares and APIs responded with any content then
 * this middleware will triggers a 404/Not found error.
 *
 * @category middleware
 *
 * @param {Object} ctx Koa context
 */
function notFound(ctx) {
  if (ctx.status === 404) {
    const error = new HttpError(
        404,
        'ROUTE_NOT_FOUND',
        `Route ${ctx.request.method} ${ctx.request.url} was not found`
    );
    ctx.app.emit('error', error, ctx);
  }
}

module.exports = notFound;
