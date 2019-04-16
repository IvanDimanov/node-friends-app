const HttpError = require('./HttpError');

/**
 * 
 * @param {*} ctx 
 */
function isLoggedIn() {
  return async (ctx, next) => {
    if (!ctx.state.user.id) {
      const error = new HttpError(401, 'NO_AUTH', 'You must login with a valid JWT');
      ctx.app.emit('error', error, ctx);
      return;
    }

    return next();
  };
}

module.exports = isLoggedIn;
