const uuid = require('uuid/v4');

/**
 * 
 * @param {*} ctx 
 */
function onError(error, ctx) {
  ctx.logger.error(error.stack);

  ctx.status = error.status || 500;
  ctx.body = {
    errorId: error.id || uuid(),
    errorCode: error.code || 'INTERNAL_ERROR',
    errorMessage: error.message || `Page ${ctx.request.method} ${ctx.request.url} failed`,
  };
}

module.exports = onError;
