const HttpError = require('./HttpError');

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
