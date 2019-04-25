async function jwtToUser(ctx, next) {
  if (!ctx.state) {
    ctx.state = {};
  }

  ctx.state.user = {};
  ctx.state.userPermissions = [];

  if (!ctx.state.jwtdata || !ctx.state.jwtdata.userId) {
    return next();
  }

  ctx.state.user = {};
  ctx.state.userPermissions = [];

  return next();
}

module.exports = jwtToUser;
