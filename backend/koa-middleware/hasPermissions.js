const HttpError = require('./HttpError');

/**
 * @swagger
 * definition:
 *   PermissionError:
 *     description:
 *       HTTP status code 403.
 *       User has no permission to access the requested resource.
 *       Example cause might be when user wants to receive group data but he is not part of the group.
 *
 *     properties:
 *       errorId:
 *         type: string
 *         format: uuid
 *
 *       errorCode:
 *         type: string
 *         example: NO_PERMISSION
 *
 *       errorMessage:
 *         type: string
 *         example: You must have permission "canReadJoinedGroups" in order to access this API
 */

/**
 * This koa middleware determines if all sent `permissions` are met
 * in the already loaded `ctx.state.userPermissions`
 *
 * @category middleware
 *
 * @param {string[]} permissions List of permissions that needs be in `ctx.state.userPermissions`
 * @return {Function} koa wrapper middleware
 */
function hasPermissions(permissions = []) {
  return async (ctx, next) => {
    const unmetPermission = permissions.find((permission) => !ctx.state.userPermissions.includes(permission));
    if (unmetPermission) {
      const error = new HttpError(
          403,
          'NO_PERMISSION',
          `You must have permission "${unmetPermission}" in order to access this API`
      );
      ctx.app.emit('error', error, ctx);
      return;
    }

    return next();
  };
}

module.exports = hasPermissions;
