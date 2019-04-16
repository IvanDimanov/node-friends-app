'use strict';

module.exports = (sequelize, DataTypes) => {
  const Permissions = sequelize.define('Permissions', {
    id: DataTypes.UUID,
    key: DataTypes.STRING,
    label: DataTypes.STRING,
    description: DataTypes.STRING,
  }, {});

  return Permissions;
};
