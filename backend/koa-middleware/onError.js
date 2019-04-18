const uuid = require('uuid/v4');

/**
 * This middleware catches all thrown code error and
 * tries to return a proper error JSON response to the API call.
 *
 * @category middleware
 *
 * @param {Error} error The execution error that broke the script flow.
 * @param {Object} ctx Koa context
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
