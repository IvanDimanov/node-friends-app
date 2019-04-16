/**
 * 
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
