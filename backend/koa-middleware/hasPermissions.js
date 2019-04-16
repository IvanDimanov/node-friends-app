const HttpError = require('./HttpError');

/**
 * 
 * @param {*} ctx 
 */
function hasPermissions(permissions = []) {
  return async (ctx, next) => {
    const unmetPermission = permissions.find((permission) => !ctx.state.userPermissions.includes(permission))
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
