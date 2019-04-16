const HttpError = require('./HttpError');

/**
 * 
 * @param {*} ctx 
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
