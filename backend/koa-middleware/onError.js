const uuid = require('uuid/v4');

/**
 * @swagger
 * definition:
 *   InternalServerError:
 *     description:
 *       HTTP status code 500.
 *       Something got wrong in the flow and we have little idea what or why :)
 *
 *     properties:
 *       errorId:
 *         type: string
 *         format: uuid
 *
 *       errorCode:
 *         type: string
 *         example: INTERNAL_ERROR
 *
 *       errorMessage:
 *         type: string
 *         example: Page GET /api/v1/users failed
 */

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
