const uuid = require('uuid/v4');

/**
 * 
 * @param {*} ctx 
 */
function notFound(ctx) {
  if (ctx.status === 404) {
    const errorId = uuid();
    ctx.logger.debug('Not found', errorId);

    ctx.status = 404;
    ctx.body = {
      errorId,
      errorCode: 'NOT_FOUND',
      errorMessage: `Page ${ctx.request.method} ${ctx.request.url} was not found`,
    };
  }
}

module.exports = notFound;
