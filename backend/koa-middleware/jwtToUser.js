const {Sequelize} = require('../../database/config/sequelize-pool');

/**
 * if some of the previous Koa middlewares loaded the JWT into `ctx.state.jwtdata`
 * then this middleware loads user data and user permissions from the DB
 * into `ctx.state.user` and `ctx.state.userPermissions`.
 *
 * @category middleware
 *
 * @param {Object} ctx Koa context
 * @param {Function} next Koa next middleware
 *
 * @return {Function} In the end, calls `next`
 */
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
