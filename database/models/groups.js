'use strict';

module.exports = (sequelize, DataTypes) => {
  const Groups = sequelize.define('Groups', {
    id: DataTypes.UUID,
    name: DataTypes.STRING,
    type: DataTypes.STRING,
    createdByUserId: DataTypes.UUID,
  }, {});

  return Groups;
};
