const uuid = require('uuid/v4');

/**
 * 
 * @param {*} ctx 
 */
function onError(error, ctx) {
  const errorId = error.id || uuid();
  ctx.logger.error(error.stack, {errorId});

  ctx.status = error.status || 500;
  ctx.body = {
    errorId,
    errorCode: error.code || 'INTERNAL_ERROR',
    errorMessage: error.message || `Page ${ctx.request.method} ${ctx.request.url} failed`,
  };
}

module.exports = onError;
