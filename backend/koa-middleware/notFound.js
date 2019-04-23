const HttpError = require('./HttpError');

/**
 * @swagger
 * definition:
 *   NoFoundError:
 *     description:
 *       HTTP status code 404.
 *       A requested resource is not found. Might be cause by missing API or missing DB record.
 *
 *     properties:
 *       errorId:
 *         type: string
 *         format: uuid
 *
 *       errorCode:
 *         type: string
 *         example: ROUTE_NOT_FOUND
 *
 *       errorMessage:
 *         type: string
 *         example: Route GET /api/v1/users was not found
 */

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
