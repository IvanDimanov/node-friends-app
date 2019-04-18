const HttpError = require('./HttpError');

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
