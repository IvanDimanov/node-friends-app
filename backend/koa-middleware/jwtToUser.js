const {Sequelize} = require('../../database/config/sequelize-pool');

/**
 * 
 * @param {*} ctx 
 */
async function jwtToUser(ctx, next) {
  ctx.state.user = {};
  ctx.state.userPermissions = [];

  if (!ctx.state.jwtdata || !ctx.state.jwtdata.userId) {
    next();
    return;
  }

  ctx.state.user = await ctx.postgres.Users
      .findOne({
        where: {
          id: ctx.state.jwtdata.userId,
        },
      })
      .then((response) => response.toJSON());

  const permissionIds = await ctx.postgres.UserPermissions
      .findAll({
        attributes: ['permissionId'],
        where: {
          userId: ctx.state.jwtdata.userId,
        },
      })
      .then((responses) => responses.map(({permissionId}) => permissionId));

  ctx.state.userPermissions = await ctx.postgres.Permissions
      .findAll({
        attributes: ['key'],
        where: {
          id: {
            [Sequelize.Op.in]: permissionIds,
          },
        },
      })
      .then((responses) => responses.map(({key}) => key));

  next();
}

module.exports = jwtToUser;
