'use strict';

module.exports = (sequelize, DataTypes) => {
  const UserPermissions = sequelize.define('UserPermissions', {
    id: DataTypes.UUID,
    userId: DataTypes.UUID,
    permissionId: DataTypes.UUID,
  }, {});

  return UserPermissions;
};
