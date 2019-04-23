const HttpError = require('./HttpError');

/**
 * @swagger
 * definition:
 *   AuthError:
 *     description:
 *       HTTP status code 401.
 *       User is not authenticated. Mainly returned on missing or expired JWT.
 *
 *     properties:
 *       errorId:
 *         type: string
 *         format: uuid
 *
 *       errorCode:
 *         type: string
 *         example: NO_AUTH
 *
 *       errorMessage:
 *         type: string
 *         example: You must login with a valid JWT
 */

/**
 * Checks over already loaded `ctx.state.user` to determine
 * if the API that uses this middleware have access to DB user info.
 *
 * @category middleware
 *
 * @return {Function} koa wrapper middleware
 */
function isLoggedIn() {
  return async (ctx, next) => {
    if (!((ctx.state || {}).user || {}).id) {
      const error = new HttpError(401, 'NO_AUTH', 'You must login with a valid JWT');
      ctx.app.emit('error', error, ctx);
      return;
    }

    return next();
  };
}

module.exports = isLoggedIn;
