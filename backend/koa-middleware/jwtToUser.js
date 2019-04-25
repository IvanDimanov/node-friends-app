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




  ctx.state.user = await ctx.postgres.Users
      .findOne({
        where: {
          id: ctx.state.jwtdata.userId,
        },
      })
      .then((response) => response && typeof response.toJSON === 'function' ? response.toJSON() : {});

  const permissionIds = await ctx.postgres.UserPermissions
      .findAll({
        attributes: ['permissionId'],
        where: {
          userId: ctx.state.jwtdata.userId,
        },
      })
      .then((responses) => Array.isArray(responses) ? responses.map(({permissionId}) => permissionId) : []);

  ctx.state.userPermissions = await ctx.postgres.Permissions
      .findAll({
        attributes: ['key'],
        where: {
          id: {
            [Sequelize.Op.in]: permissionIds,
          },
        },
      })
      .then((responses) => Array.isArray(responses) ? responses.map(({key}) => key) : []);

  return next();
}

module.exports = jwtToUser;
