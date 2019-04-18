/**
 * Returns a koa middleware that will execute `next()` in a safe wrapper.
 * If `next()` throws during execution, we'll catch the error and emit it.
 *
 * @category middleware
 *
 * @return {Function} koa wrapper middleware
 */
function catchError() {
  return async (ctx, next) => {
    try {
      await next();
    } catch (error) {
      ctx.app.emit('error', error, ctx);
    }
  };
}

module.exports = catchError;
