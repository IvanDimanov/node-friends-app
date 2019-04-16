const {Sequelize} = require('../../database/config/sequelize-pool');

/**
 * 
 * @param {*} ctx 
 */
async function jwtToUser(ctx, next) {
  ctx.state.user = {};
  ctx.state.userPermissions = [];

  if (!ctx.state.jwtdata || !ctx.state.jwtdata.userId) {
    return next();
  }

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
